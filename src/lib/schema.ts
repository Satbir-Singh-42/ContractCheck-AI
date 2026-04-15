// ─── Database Schema Types ────────────────────────────────────────────────────
// These types mirror the expected PostgreSQL/Supabase schema for ContractCheck AI.
// When connecting to a real backend (FastAPI), these serve as the shared contract.

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  plan: 'free' | 'pro' | 'enterprise';
  uploads_used: number;
  uploads_limit: number;
  created_at: string;
  updated_at: string;
}

export interface DBReport {
  id: string;
  user_id: string;
  file_name: string;
  file_type: 'pdf' | 'docx' | 'doc' | 'txt';
  file_size_bytes: number;
  contract_type: string;
  parties: string;
  overall_risk: 'High' | 'Medium' | 'Low';
  compliance_score: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
  parent_report_id?: string | null;
  version_number?: number;
}

export interface DBClause {
  id: string;
  report_id: string;
  title: string;
  original_text: string;
  risk_level: 'Safe' | 'Risky' | 'Non-compliant';
  relevant_law: string;
  order_index: number;
  created_at: string;
}

export interface DBClauseIssue {
  id: string;
  clause_id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  order_index: number;
}

export interface DBClauseSuggestion {
  id: string;
  clause_id: string;
  description: string;
  suggested_text: string | null;
  order_index: number;
}

export interface DBPayment {
  id: string;
  user_id: string;
  amount_inr: number;
  currency: 'INR';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  plan: 'pro' | 'enterprise';
  created_at: string;
}

export interface DBSharedReport {
  id: string;
  report_id: string;
  shared_by_user_id: string;
  share_token: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

// ─── API Request/Response Types ───────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: Omit<DBUser, 'password_hash'>;
}

export interface UploadRequest {
  file: File;
}

export interface UploadResponse {
  report_id: string;
  status: 'processing';
  estimated_seconds: number;
}

export interface ReportResponse {
  report: DBReport;
  clauses: Array<DBClause & {
    issues: DBClauseIssue[];
    suggestions: DBClauseSuggestion[];
  }>;
}

export interface ReportListResponse {
  reports: DBReport[];
  total: number;
  page: number;
  per_page: number;
}

export interface ShareReportRequest {
  report_id: string;
  expires_in_days?: number;
}

export interface ShareReportResponse {
  share_url: string;
  share_token: string;
  expires_at: string | null;
}

export interface PaymentCreateRequest {
  plan: 'pro' | 'enterprise';
}

export interface PaymentCreateResponse {
  razorpay_order_id: string;
  amount_inr: number;
  currency: 'INR';
  key_id: string; // Razorpay public key
}

export interface AnalysisStatusResponse {
  report_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percent: number;
  current_step: string;
  error_message: string | null;
}

// ─── Regulation Reference Types ───────────────────────────────────────────────

export interface RegulationSection {
  id: string;
  law_name: string;
  section_number: string;
  section_title: string;
  summary: string;
  full_text: string;
  keywords: string[];
}

export type SupportedRegulation =
  | 'DPDP Act 2023'
  | 'CGST Act 2017'
  | 'Indian Contract Act 1872'
  | 'Factories Act 1948'
  | 'Arbitration Act 1996'
  | 'IT Act 2000'
  | 'Labour Codes 2020';
