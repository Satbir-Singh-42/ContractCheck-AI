// ─── Mock API Service Layer ───────────────────────────────────────────────────
// Simulates the FastAPI backend endpoints for ContractCheck AI.
// Replace BASE_URL with your actual FastAPI server URL in production.
//
// FastAPI endpoints this maps to:
//   POST   /api/v1/auth/login
//   POST   /api/v1/auth/signup
//   POST   /api/v1/reports/upload
//   GET    /api/v1/reports
//   GET    /api/v1/reports/:id
//   GET    /api/v1/reports/:id/status
//   POST   /api/v1/reports/:id/share
//   GET    /api/v1/shared/:token
//   POST   /api/v1/payments/create-order
//   POST   /api/v1/payments/verify
//   GET    /api/v1/user/profile
//   PUT    /api/v1/user/profile

import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UploadResponse,
  ReportResponse,
  ReportListResponse,
  AnalysisStatusResponse,
  ShareReportResponse,
  PaymentCreateResponse,
} from './schema';
import { mockReports } from './mockData';

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL = 'https://your-api-domain.com/api/v1'; // Replace with your FastAPI URL
const MOCK_DELAY = 800; // ms

function delay(ms: number = MOCK_DELAY) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getToken(): string | null {
  return localStorage.getItem('cc_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export async function apiLogin(data: LoginRequest): Promise<AuthResponse> {
  await delay();
  // Mock response - replace with: fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  const response: AuthResponse = {
    access_token: 'mock_jwt_token_' + Date.now(),
    token_type: 'bearer',
    user: {
      id: 'user_001',
      name: 'Arjun Sharma',
      email: data.email,
      plan: 'free',
      uploads_used: 2,
      uploads_limit: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
  localStorage.setItem('cc_token', response.access_token);
  return response;
}

export async function apiSignup(data: SignupRequest): Promise<AuthResponse> {
  await delay();
  const response: AuthResponse = {
    access_token: 'mock_jwt_token_' + Date.now(),
    token_type: 'bearer',
    user: {
      id: 'user_' + Date.now(),
      name: data.name,
      email: data.email,
      plan: 'free',
      uploads_used: 0,
      uploads_limit: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
  localStorage.setItem('cc_token', response.access_token);
  return response;
}

export async function apiLogout(): Promise<void> {
  localStorage.removeItem('cc_token');
}

// ─── Reports Endpoints ────────────────────────────────────────────────────────

export async function apiUploadContract(file: File): Promise<UploadResponse> {
  await delay(1200);
  // In production: use FormData with fetch(`${BASE_URL}/reports/upload`, { method: 'POST', body: formData })
  return {
    report_id: 'rep_' + Date.now(),
    status: 'processing',
    estimated_seconds: 25,
  };
}

export async function apiGetReports(page = 1, perPage = 10): Promise<ReportListResponse> {
  await delay();
  return {
    reports: mockReports.map(r => ({
      id: r.id,
      user_id: 'user_001',
      file_name: r.name,
      file_type: r.name.endsWith('.pdf') ? 'pdf' as const : 'docx' as const,
      file_size_bytes: 245000,
      contract_type: r.type,
      parties: r.parties,
      overall_risk: r.overallRisk,
      compliance_score: Math.max(0, Math.round(100 - (r.clauses.filter(c => c.riskLevel === 'Non-compliant').length * 25) - (r.clauses.filter(c => c.riskLevel === 'Risky').length * 10))),
      status: 'completed' as const,
      error_message: null,
      created_at: r.date,
      completed_at: r.date,
    })),
    total: mockReports.length,
    page,
    per_page: perPage,
  };
}

export async function apiGetReport(reportId: string): Promise<ReportResponse | null> {
  await delay();
  const report = mockReports.find(r => r.id === reportId);
  if (!report) return null;

  return {
    report: {
      id: report.id,
      user_id: 'user_001',
      file_name: report.name,
      file_type: report.name.endsWith('.pdf') ? 'pdf' : 'docx',
      file_size_bytes: 245000,
      contract_type: report.type,
      parties: report.parties,
      overall_risk: report.overallRisk,
      compliance_score: Math.max(0, Math.round(100 - (report.clauses.filter(c => c.riskLevel === 'Non-compliant').length * 25) - (report.clauses.filter(c => c.riskLevel === 'Risky').length * 10))),
      status: 'completed',
      error_message: null,
      created_at: report.date,
      completed_at: report.date,
    },
    clauses: report.clauses.map((c, i) => ({
      id: c.id,
      report_id: report.id,
      title: c.title,
      original_text: c.originalText,
      risk_level: c.riskLevel,
      relevant_law: c.relevantLaw,
      order_index: i,
      created_at: report.date,
      issues: c.issues.map((issue, j) => ({
        id: `issue_${c.id}_${j}`,
        clause_id: c.id,
        description: issue,
        severity: c.riskLevel === 'Non-compliant' ? 'critical' as const : 'medium' as const,
        order_index: j,
      })),
      suggestions: c.suggestions.map((s, j) => ({
        id: `sug_${c.id}_${j}`,
        clause_id: c.id,
        description: s,
        suggested_text: null,
        order_index: j,
      })),
    })),
  };
}

export async function apiGetAnalysisStatus(reportId: string): Promise<AnalysisStatusResponse> {
  await delay(400);
  return {
    report_id: reportId,
    status: 'completed',
    progress_percent: 100,
    current_step: 'Done',
    error_message: null,
  };
}

// ─── Share Endpoints ──────────────────────────────────────────────────────────

export async function apiShareReport(reportId: string, expiresInDays?: number): Promise<ShareReportResponse> {
  await delay();
  const token = 'share_' + reportId + '_' + Date.now();
  return {
    share_url: `${window.location.origin}/share/${reportId}`,
    share_token: token,
    expires_at: expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null,
  };
}

// ─── Payment Endpoints ────────────────────────────────────────────────────────

export async function apiCreatePaymentOrder(plan: 'pro' | 'enterprise'): Promise<PaymentCreateResponse> {
  await delay();
  // In production: fetch(`${BASE_URL}/payments/create-order`, { method: 'POST', ... })
  return {
    razorpay_order_id: 'order_' + Date.now(),
    amount_inr: plan === 'pro' ? 99900 : 499900, // in paise
    currency: 'INR',
    key_id: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
  };
}

export async function apiVerifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean }> {
  await delay();
  return { success: true };
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  await delay();
  return {
    id: 'user_001',
    name: 'Arjun Sharma',
    email: 'arjun@techcorp.in',
    plan: 'free' as const,
    uploads_used: 2,
    uploads_limit: 3,
    created_at: '2026-04-01T00:00:00Z',
  };
}

export async function apiUpdateProfile(data: { name?: string; email?: string }) {
  await delay();
  return { ...data, updated: true };
}
