// ─── API Service Layer ────────────────────────────────────────────────────────
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │  USE_MOCK = true   →  All calls return mock data (no backend needed)       │
// │  USE_MOCK = false  →  All calls hit the real FastAPI backend at BASE_URL   │
// └─────────────────────────────────────────────────────────────────────────────┘
//
// To switch to a real backend:
//   1. Set USE_MOCK = false
//   2. Set BASE_URL to your FastAPI server (e.g. https://api.yourapp.com/api/v1)
//   3. That's it — all function signatures stay the same.
//
// FastAPI endpoints expected:
//   POST   /api/v1/auth/login
//   POST   /api/v1/auth/signup
//   POST   /api/v1/reports/upload
//   GET    /api/v1/reports
//   GET    /api/v1/reports/:id
//   GET    /api/v1/reports/:id/status
//   POST   /api/v1/reports/:id/share
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
import { mockReports, MOCK_USER } from './mockData';

// ─── Configuration ────────────────────────────────────────────────────────────

export const USE_MOCK = true; // ← Flip to false when backend is ready
const BASE_URL = 'http://localhost:8000/api/v1';
const MOCK_DELAY = 800;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API Error ${res.status}`);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(data: LoginRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay();
    const response: AuthResponse = {
      access_token: 'mock_jwt_token_' + Date.now(),
      token_type: 'bearer',
      user: {
        id: MOCK_USER.id,
        name: MOCK_USER.name,
        email: data.email,
        plan: MOCK_USER.plan,
        uploads_used: MOCK_USER.uploadsUsed,
        uploads_limit: MOCK_USER.uploadsLimit,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    localStorage.setItem('cc_token', response.access_token);
    return response;
  }

  const response = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  localStorage.setItem('cc_token', response.access_token);
  return response;
}

export async function apiSignup(data: SignupRequest): Promise<AuthResponse> {
  if (USE_MOCK) {
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

  const response = await apiFetch<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  localStorage.setItem('cc_token', response.access_token);
  return response;
}

export async function apiLogout(): Promise<void> {
  localStorage.removeItem('cc_token');
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function apiUploadContract(file: File): Promise<UploadResponse> {
  if (USE_MOCK) {
    await delay(1200);
    // Return an existing mock report ID so the process→result chain works
    return {
      report_id: 'rep_12345',
      status: 'processing',
      estimated_seconds: 25,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/reports/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function apiGetReports(page = 1, perPage = 10): Promise<ReportListResponse> {
  if (USE_MOCK) {
    await delay();
    return {
      reports: mockReports.map(r => ({
        id: r.id,
        user_id: MOCK_USER.id,
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

  return apiFetch<ReportListResponse>(`/reports?page=${page}&per_page=${perPage}`);
}

export async function apiGetReport(reportId: string): Promise<ReportResponse | null> {
  if (USE_MOCK) {
    await delay();
    const report = mockReports.find(r => r.id === reportId);
    if (!report) return null;

    return {
      report: {
        id: report.id,
        user_id: MOCK_USER.id,
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

  return apiFetch<ReportResponse>(`/reports/${reportId}`);
}

export async function apiGetAnalysisStatus(reportId: string): Promise<AnalysisStatusResponse> {
  if (USE_MOCK) {
    await delay(400);
    return {
      report_id: reportId,
      status: 'completed',
      progress_percent: 100,
      current_step: 'Done',
      error_message: null,
    };
  }

  return apiFetch<AnalysisStatusResponse>(`/reports/${reportId}/status`);
}

// ─── Share ────────────────────────────────────────────────────────────────────

export async function apiShareReport(reportId: string, expiresInDays?: number): Promise<ShareReportResponse> {
  if (USE_MOCK) {
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

  return apiFetch<ShareReportResponse>(`/reports/${reportId}/share`, {
    method: 'POST',
    body: JSON.stringify({ expires_in_days: expiresInDays }),
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function apiCreatePaymentOrder(plan: 'pro' | 'enterprise'): Promise<PaymentCreateResponse> {
  if (USE_MOCK) {
    await delay();
    return {
      razorpay_order_id: 'order_' + Date.now(),
      amount_inr: plan === 'pro' ? 99900 : 499900,
      currency: 'INR',
      key_id: 'rzp_test_YOUR_KEY_HERE',
    };
  }

  return apiFetch<PaymentCreateResponse>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export async function apiVerifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await delay();
    return { success: true };
  }

  return apiFetch<{ success: boolean }>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  if (USE_MOCK) {
    await delay();
    return {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      plan: MOCK_USER.plan,
      uploads_used: MOCK_USER.uploadsUsed,
      uploads_limit: MOCK_USER.uploadsLimit,
      created_at: '2026-04-01T00:00:00Z',
    };
  }

  return apiFetch('/user/profile');
}

export async function apiUpdateProfile(data: { name?: string; email?: string }) {
  if (USE_MOCK) {
    await delay();
    return { ...data, updated: true };
  }

  return apiFetch('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
