import { supabase } from './supabase';
import type {
  UploadResponse,
  ReportResponse,
  ReportListResponse,
  AnalysisStatusResponse,
  ShareReportResponse,
  PaymentCreateResponse,
} from './schema';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  const userId = await getUserId();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw new Error('Profile fetch failed');
  return data;
}

export async function apiUpdateProfile(data: { name?: string; email?: string }) {
  const userId = await getUserId();
  const { error } = await supabase.from('profiles').update(data).eq('id', userId);
  if (error) throw new Error('Profile update failed');
  return { ...data, updated: true };
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function apiUploadContract(file: File, parentReportId?: string, versionNumber: number = 1): Promise<UploadResponse> {
  const userId = await getUserId();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'txt';
  const filePath = `${userId}/${Date.now()}_original.${fileExt}`;

  // 1. Upload file securely to Supabase Storage Bucket ('contracts')
  const { error: uploadError } = await supabase.storage.from('contracts').upload(filePath, file);
  if (uploadError) throw new Error(`Storage error: ${uploadError.message}`);

  // 2. Create pending report row in database
  const { data: report, error: dbError } = await supabase.from('reports').insert({
    user_id: userId,
    file_name: file.name,
    file_type: fileExt,
    file_size_bytes: file.size,
    status: 'processing',
    parent_report_id: parentReportId || null,
    version_number: versionNumber
  }).select('id').single();

  if (dbError) throw new Error(`DB error: ${dbError.message}`);

  // Note: Your AI RAG via n8n should trigger on this INSERT event from Supabase 
  // or you can fire a webhook to n8n here directly.

  return {
    report_id: report.id,
    status: 'processing',
    estimated_seconds: 45, // Time for AI to finish
  };
}

export interface ReportVersion {
  id: string;
  version_number: number;
  created_at: string;
}

export async function apiGetReportVersions(rootId: string): Promise<ReportVersion[]> {
  const { data, error } = await supabase
    .from('reports')
    .select('id, version_number, created_at')
    .or(`id.eq.${rootId},parent_report_id.eq.${rootId}`)
    .order('version_number', { ascending: true });

  if (error) {
    console.warn('Failed to fetch report versions', error);
    return [];
  }
  return data || [];
}

export async function apiGetReports(page = 1, perPage = 10): Promise<ReportListResponse> {
  const userId = await getUserId();
  
  // Calculate range for pagination
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    reports: data || [],
    total: count || 0,
    page,
    per_page: perPage,
  };
}

export async function apiGetReport(reportId: string): Promise<ReportResponse | null> {
  const userId = await getUserId();

  // Fetch the core report
  const { data: report, error: repError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', userId) // Enforce ownership
    .single();

  if (repError || !report) return null;

  // Supabase automatically joins sub-tables natively if configured, 
  // but to match the precise UI structure safely we can query them explicitely:
  const { data: clauses } = await supabase
    .from('clauses')
    .select('*, issues:clause_issues(*), suggestions:clause_suggestions(*)')
    .eq('report_id', reportId)
    .order('order_index', { ascending: true });

  const mappedClauses = (clauses || []).map((c: any) => ({
    id: c.id,
    report_id: c.report_id,
    title: c.title,
    original_text: c.original_text,
    risk_level: c.risk_level,
    relevant_law: c.relevant_law,
    order_index: c.order_index,
    created_at: c.created_at,
    issues: c.issues || [],
    suggestions: c.suggestions || []
  }));

  return {
    report,
    clauses: mappedClauses,
  };
}

export async function apiGetAnalysisStatus(reportId: string): Promise<AnalysisStatusResponse> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('reports')
    .select('status, error_message')
    .eq('id', reportId)
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error('Report not found');

  return {
    report_id: reportId,
    status: data.status as "pending" | "processing" | "completed" | "failed",
    progress_percent: data.status === 'completed' ? 100 : data.status === 'processing' ? 50 : 0,
    current_step: data.status,
    error_message: data.error_message, // Fallback correctly
  };
}

// ─── Share ────────────────────────────────────────────────────────────────────

export async function apiShareReport(reportId: string): Promise<ShareReportResponse> {
  const userId = await getUserId();
  
  // Make the report public
  const { error } = await supabase
    .from('reports')
    .update({ is_shared: true })
    .eq('id', reportId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Could not share report: ' + error.message);
  }

  return {
    share_url: `${window.location.origin}/share/${reportId}`, // Use the report ID for linking
    share_token: reportId, 
    expires_at: null,
  };
}

export async function apiGetSharedReport(reportId: string): Promise<ReportResponse | null> {
  // Purposefully DO NOT call getUserId() here. 
  // RLS (Row Level Security) prevents unauthorized reading internally.
  // We rely fully on the fact that `is_shared = true` controls the access.

  // Fetch the core report
  const { data: report, error: repError } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (repError || !report) return null;

  const { data: clauses } = await supabase
    .from('clauses')
    .select('*, issues:clause_issues(*), suggestions:clause_suggestions(*)')
    .eq('report_id', reportId)
    .order('order_index', { ascending: true });

  const mappedClauses = (clauses || []).map((c: any) => ({
    id: c.id,
    report_id: c.report_id,
    title: c.title,
    original_text: c.original_text,
    risk_level: c.risk_level,
    relevant_law: c.relevant_law,
    order_index: c.order_index,
    created_at: c.created_at,
    issues: c.issues || [],
    suggestions: c.suggestions || []
  }));

  return {
    report,
    clauses: mappedClauses,
  };
}

// ─── Payments ─────────────────────────────────────────────────────────────────
// Payments should ideally map to an Edge Function because the frontend cannot safely
// initialize a Razorpay order natively without leaking secret keys.
// For now, this is wired mock-style until Edge Functions are deployed.

export async function apiCreatePaymentOrder(plan: 'pro' | 'enterprise'): Promise<PaymentCreateResponse> {
  // To complete 100%, this must fetch from Supabase edge function:
  // await supabase.functions.invoke('create-razorpay-order', { body: { plan } })
  return {
    razorpay_order_id: 'order_' + Date.now(),
    amount_inr: plan === 'pro' ? 99900 : 499900,
    currency: 'INR',
    key_id: 'rzp_test_YOUR_KEY_HERE',
  };
}

export async function apiVerifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean }> {
  // Edge Function: await supabase.functions.invoke('verify-razorpay-payment', ... )
  return { success: true };
}
