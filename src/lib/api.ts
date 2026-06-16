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

export async function apiDeleteAccount(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error('Not authenticated');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete account (HTTP ${res.status}): ${text.slice(0, 500)}`);
  }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function apiUploadContract(
  file: File,
  parentReportId?: string,
  versionNumber: number = 1,
  extractedText: string = ''
): Promise<UploadResponse> {
  const userId = await getUserId();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'txt';
  const filePath = `${userId}/${Date.now()}_original.${fileExt}`;

  // 1. Upload file securely to Supabase Storage Bucket ('contracts')
  // Do this in the background so it doesn't block the user from advancing to the checking phase!
  void supabase.storage.from('contracts').upload(filePath, file).then(({ error: uploadError }) => {
    if (uploadError) console.error(`Storage error: ${uploadError.message}`);
  });

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

  // 3. We no longer increment uploads_used here.
  //    It will only be incremented by the Edge Function AFTER a successful AI analysis.

  // Optionally start analysis immediately if extracted text is available.
  // (In the UI we usually upload first and extract in parallel, then call apiStartContractAnalysis.)
  if (extractedText && extractedText.trim().length > 0) {
    void apiStartContractAnalysis(report.id, extractedText).catch(async (err) => {
      const message = err instanceof Error ? err.message : 'Could not start analysis pipeline.';
      await supabase
        .from('reports')
        .update({ status: 'failed', error_message: message.slice(0, 500) })
        .eq('id', report.id)
        .eq('user_id', userId);
    });
  }

  return {
    report_id: report.id,
    status: 'processing',
    estimated_seconds: 45,
  };
}

export async function apiStartContractAnalysis(reportId: string, extractedText: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error('Not authenticated (missing access token). Please log in again.');
  }

  // Use direct fetch to avoid any header rewriting by the client library.
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in frontend environment.');
  }

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/analyze-contract`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      report_id: reportId,
      extracted_text: extractedText,
    }),
  });

  if (!res.ok) {
    let text = await res.text().catch(() => '');
    try {
      const parsed = JSON.parse(text);
      if (parsed.error) {
        text = parsed.error;
        // If the error message from the edge function contains nested JSON (like Gemini errors), extract the message
        if (typeof text === 'string' && text.includes('\"message\"')) {
          const match = text.match(/"message":\s*"([^"]+)"/);
          if (match && match[1]) text = match[1];
        }
      }
    } catch (_) {
      // Not JSON, just use raw text
    }
    
    // Fallback cleanup
    text = text.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error(`Analysis failed: ${text.slice(0, 200) || res.statusText}`);
  }
}

export async function apiMarkReportFailed(reportId: string, message: string): Promise<void> {
  const safe = (message || 'Analysis failed.').slice(0, 500);
  const { error } = await supabase
    .from('reports')
    .update({ status: 'failed', error_message: safe })
    .eq('id', reportId);

  if (error) {
    console.warn('Failed to mark report failed:', error.message);
  }
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

export async function apiDeleteReport(reportId: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', reportId)
    .eq('user_id', userId); // enforce ownership
  if (error) throw new Error(error.message);
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

  let parsedProgress = data.status === 'completed' ? 100 : 0;
  let currentStep = data.status;
  let actualError = data.error_message;

  if (data.status === 'processing' && data.error_message) {
    try {
      const parsed = JSON.parse(data.error_message);
      if (typeof parsed.percent === 'number') parsedProgress = parsed.percent;
      if (typeof parsed.step === 'number') currentStep = parsed.step.toString(); // we will map this in UI
      actualError = null; // it's not an error, it's progress
    } catch {
      // Not JSON, it's a real error string that happened to be set before failing?
      // Normally if status is processing, error_message shouldn't be a real error unless it crashed.
      // But we leave actualError as is.
    }
  }

  return {
    report_id: reportId,
    status: data.status as "pending" | "processing" | "completed" | "failed",
    progress_percent: parsedProgress,
    current_step: currentStep,
    error_message: actualError,
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

export async function apiCreatePaymentOrder(plan: 'pro_monthly' | 'pro_annual'): Promise<PaymentCreateResponse> {
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: { plan }
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function apiVerifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  plan: 'pro_monthly' | 'pro_annual'
): Promise<{ success: boolean }> {
  const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
    body: { 
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      plan
    }
  });
  if (error) throw new Error(error.message);
  return data;
}
