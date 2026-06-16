// @ts-nocheck

import { createClient } from 'npm:@supabase/supabase-js@2.103.1';
import { retrieveRelevantSections } from './retriever.ts';

type RiskLevel = 'Safe' | 'Risky' | 'Non-compliant';

type GeminiClause = {
  title: string;
  original_text: string;
  risk_level: RiskLevel;
  issues: string[];
  recommendations: string[];
  regulations_referenced: string[];
};

type GeminiPayload = {
  contract_type?: string;
  parties?: string;
  clauses: GeminiClause[];
};

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function normalizeModelId(input: string | undefined | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  const key = raw.toLowerCase();

  // Allow AI Studio display names as secrets to reduce user error.
  if (key === 'gemini 2.5 flash') return 'gemini-2.5-flash';
  if (key === 'gemini 2.5 flash lite') return 'gemini-2.5-flash-lite';
  if (key === 'gemini 2.5 flash-lite') return 'gemini-2.5-flash-lite';
  if (key === 'gemma 3 4b') return 'gemma-3-4b-it';
  if (key === 'gemma 3 27b') return 'gemma-3-27b-it';

  return raw;
}

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

function clampScore(score: number) {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function scoreFromClauses(clauses: { risk_level: RiskLevel }[]) {
  if (clauses.length === 0) return 100;
  const total = clauses.length;
  const safe = clauses.filter((c) => normalizeRiskLevel(c.risk_level) === 'Safe').length;
  const risky = clauses.filter((c) => normalizeRiskLevel(c.risk_level) === 'Risky').length;
  const bad = clauses.filter((c) => normalizeRiskLevel(c.risk_level) === 'Non-compliant').length;
  // Weighted score: Safe=100pts, Risky=40pts, Non-compliant=0pts
  const raw = (safe * 100 + risky * 40 + bad * 0) / total;
  return clampScore(raw);
}

function overallRiskFromScore(score: number): 'High' | 'Medium' | 'Low' {
  if (score < 50) return 'High';
  if (score < 80) return 'Medium';
  return 'Low';
}

function severityForRisk(risk: RiskLevel): 'low' | 'medium' | 'high' | 'critical' {
  if (risk === 'Safe') return 'low';
  if (risk === 'Risky') return 'medium';
  return 'high';
}

function normalizeRiskLevel(input: unknown): RiskLevel {
  if (input === 'Safe' || input === 'Risky' || input === 'Non-compliant') return input;
  const s = String(input ?? '').trim().toLowerCase();
  if (s === 'safe') return 'Safe';
  if (s === 'risky') return 'Risky';
  if (s === 'non-compliant' || s === 'noncompliant' || s === 'non compliant') return 'Non-compliant';
  return 'Risky';
}

function pickTextFromGeminiResponse(data: any): string {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
}

function tryParseJson(text: string, data?: any): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Remove markdown code blocks if present
    const cleaned = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      // Try extracting the outer-most JSON object if Gemini added stray text.
      const first = cleaned.indexOf('{');
      const last = cleaned.lastIndexOf('}');
      if (first >= 0 && last > first) {
        const slice = cleaned.slice(first, last + 1);
        try {
          return JSON.parse(slice);
        } catch {}
      }
      
      const snippet = trimmed.slice(0, 200).replace(/\n/g, ' ');
      const finishReason = data?.candidates?.[0]?.finishReason || 'UNKNOWN';
      throw new Error(`Failed to parse JSON. FinishReason: ${finishReason}. Snippet: ${snippet}...`);
    }
  }
}

async function callGeminiStructured(args: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${encodeURIComponent(args.apiKey)}`;

  // JSON Schema aligned to your DB + UI expectations.
  const responseSchema = {
    type: 'object',
    properties: {
      contract_type: { type: 'string' },
      parties: { type: 'string' },
      clauses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            original_text: { type: 'string' },
            risk_level: { type: 'string', enum: ['Safe', 'Risky', 'Non-compliant'] },
            issues: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            regulations_referenced: { type: 'array', items: { type: 'string' } },
          },
          required: ['title', 'original_text', 'risk_level', 'issues', 'recommendations', 'regulations_referenced'],
        },
      },
    },
    required: ['clauses'],
  } as const;

  const body = {
    systemInstruction: { role: 'system', parts: [{ text: args.systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: args.userPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema,
      maxOutputTokens: 32768,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    const err = new Error(`Gemini API failed (${res.status}): ${msg.slice(0, 500)}`);
    (err as any).status = res.status;
    (err as any).body = msg;
    throw err;
  }

  const data = await res.json();
  const text = pickTextFromGeminiResponse(data);

  // Gemini returns JSON as a string when responseMimeType is application/json
  // (still placed in the normal "text" field).
  return tryParseJson(text, data);
}

async function callGeminiFallback(args: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${encodeURIComponent(args.apiKey)}`;

  // Widest-compat: embed system prompt into the user prompt and request JSON-only.
  const prompt = [
    args.systemPrompt,
    '',
    args.userPrompt,
    '',
    'Return ONLY valid JSON. No Markdown.',
  ].join('\n');

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 32768,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    const err = new Error(`Gemini API failed (${res.status}): ${msg.slice(0, 500)}`);
    (err as any).status = res.status;
    (err as any).body = msg;
    throw err;
  }

  const data = await res.json();
  const text = pickTextFromGeminiResponse(data);
  return tryParseJson(text, data);
}

function shouldFallbackToPlainJson(err: unknown): boolean {
  const status = typeof (err as any)?.status === 'number' ? (err as any).status : null;
  const body = String((err as any)?.body ?? (err as any)?.message ?? '');

  // Don't make a second request on auth/rate-limit problems.
  if (status === 401 || status === 403 || status === 429) return false;

  // Fallback only when the API rejects the structured-output fields.
  if (status === 400) {
    return /responseSchema|responseMimeType|Unknown name|Invalid JSON payload/i.test(body);
  }

  return false;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  // Supabase Secrets UI disallows secret names starting with SUPABASE_.
  // Use SERVICE_ROLE_KEY as the recommended secret name.
  const supabaseServiceRoleKey =
    Deno.env.get('SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const geminiModel = normalizeModelId(Deno.env.get('GEMINI_MODEL')) ?? 'gemini-2.5-flash';
  const foundationDocs = Deno.env.get('FOUNDATION_DOCS') ?? '';

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return json({ error: 'Missing Supabase environment variables.' }, { status: 500 });
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

  let reportIdForError: string | null = null;

  try {
    const { report_id, extracted_text } = (await req.json().catch(() => ({}))) as {
      report_id?: string;
      extracted_text?: string;
    };

    if (!report_id) return json({ error: 'Missing report_id.' }, { status: 400 });
    reportIdForError = report_id;
    if (!geminiApiKey) return json({ error: 'Missing GEMINI_API_KEY.' }, { status: 500 });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) return json({ error: 'Unauthorized.' }, { status: 401 });

    // Confirm ownership before doing any privileged writes.
    const { data: reportRow, error: repErr } = await adminClient
      .from('reports')
      .select('id, user_id, parent_report_id')
      .eq('id', report_id)
      .single();

    if (repErr || !reportRow) return json({ error: 'Report not found.' }, { status: 404 });
    if (reportRow.user_id !== userData.user.id) return json({ error: 'Forbidden.' }, { status: 403 });

    const extracted = typeof extracted_text === 'string' ? extracted_text.trim() : '';
    if (!extracted) {
      await adminClient
        .from('reports')
        .update({ status: 'failed', error_message: 'No extracted text provided.' })
        .eq('id', report_id);
      return json({ error: 'No extracted text provided.' }, { status: 400 });
    }

    // --- Helper to report progress to the frontend ---
    const reportProgress = async (step: number, percent: number) => {
      await adminClient
        .from('reports')
        .update({ error_message: JSON.stringify({ step, percent }) })
        .eq('id', report_id);
    };

    await reportProgress(0, 10); // Start

    const clippedText = extracted.slice(0, 120_000);

    // --- Pre-screening: Ensure it's a contract ---
    await reportProgress(1, 20); // Validating document
    const preScreenPrompt = [
      'Determine if the following text is a legal contract, agreement, terms of service, privacy policy, or similar legal/compliance document.',
      'Return exactly a JSON object: {"is_contract": boolean}. Do not include any other text.',
      'Text snippet:',
      clippedText.slice(0, 5000)
    ].join('\n');

    try {
      const preScreenRaw = await callGeminiFallback({
        apiKey: geminiApiKey,
        model: 'gemini-2.5-flash',
        systemPrompt: 'You are a document classifier.',
        userPrompt: preScreenPrompt,
      });
      if (preScreenRaw && typeof (preScreenRaw as any).is_contract === 'boolean' && !(preScreenRaw as any).is_contract) {
        throw new Error("This document does not appear to be a legal contract. Analysis aborted to save resources.");
      }
    } catch (err: any) {
      if (err.message.includes("does not appear to be a legal contract")) {
        throw err; // Re-throw the explicit abort
      }
      // If the pre-screening parsing fails for some reason, just proceed (fail-open)
      console.warn("Pre-screening failed, proceeding anyway", err.message);
    }

    await reportProgress(2, 40); // Running compliance checks
    const relevantContext = retrieveRelevantSections(clippedText);
    const contextStr = relevantContext.map(s => `[${s.act} - ${s.section}: ${s.title}]\n${s.fullText}`).join('\n\n');

    const systemPrompt = [
      'You are an elite legal compliance analyst specializing in Indian law.',
      'Analyze the contract text and extract up to 10 clauses. DO NOT extract standard, harmless boilerplate.',
      'Focus strictly on high-leverage, material risks (e.g., unfair liability limitations, illegal data sharing) AND highly compliant "Safe" clauses (e.g., robust data protection, fair termination rights).',
      'Make sure to include at least 2-3 "Safe" clauses if the contract has good practices, so the overall compliance score is balanced and accurate.',
      'CRITICAL: For original_text, DO NOT extract the entire clause. Provide only a short 1-2 sentence excerpt that captures the core meaning, ending with "...".',
      'Risk levels MUST be exactly one of: Safe | Risky | Non-compliant.',
      'Always cite specific sections where possible (e.g., "Section 7(1) of DPDP Act 2023").',
      '',
      '--- RELEVANT LEGAL PROVISIONS FOR THIS CONTRACT ---',
      contextStr || 'No specific laws found, use general Indian law knowledge.',
      '--------------------------------------------------',
      '',
      foundationDocs ? `Reference materials:\n${foundationDocs}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const userPrompt = [
      'Return ONLY valid JSON matching the provided schema.',
      'Do not wrap in Markdown.',
      '',
      'Contract text:',
      clippedText,
    ].join('\n');

    let raw: unknown;
    try {
      raw = await callGeminiStructured({
        apiKey: geminiApiKey,
        model: geminiModel,
        systemPrompt,
        userPrompt,
      });
    } catch (err) {
      if (!shouldFallbackToPlainJson(err)) throw err;
      raw = await callGeminiFallback({
        apiKey: geminiApiKey,
        model: geminiModel,
        systemPrompt,
        userPrompt,
      });
    }

    const payload = raw as GeminiPayload;
    const clauses = Array.isArray(payload?.clauses) ? payload.clauses : [];

    if (clauses.length === 0) {
      throw new Error('Gemini returned zero clauses.');
    }

    await reportProgress(3, 75); // Scoring risk levels
    // Clean slate in case the function is re-run for the same report.
    await adminClient.from('clauses').delete().eq('report_id', report_id);

    const clauseRows = clauses.map((c, idx) => {
      const clauseId = crypto.randomUUID();
      const regulations = Array.isArray(c.regulations_referenced) ? c.regulations_referenced : [];
      return {
        id: clauseId,
        report_id,
        title: String(c.title ?? '').slice(0, 255) || `Clause ${idx + 1}`,
        original_text: String(c.original_text ?? '').slice(0, 10_000),
        risk_level: normalizeRiskLevel(c.risk_level),
        relevant_law: regulations.filter(Boolean).join('; ').slice(0, 500),
        order_index: idx,
      };
    });

    const issueRows = clauses.flatMap((c, idx) => {
      const clauseId = clauseRows[idx]?.id;
      const issues = Array.isArray(c.issues) ? c.issues : [];
      return issues
        .filter(Boolean)
        .map((desc, i) => ({
          id: crypto.randomUUID(),
          clause_id: clauseId,
          description: String(desc).slice(0, 10_000),
          severity: severityForRisk(normalizeRiskLevel(c.risk_level)),
          order_index: i,
        }));
    });

    const suggestionRows = clauses.flatMap((c, idx) => {
      const clauseId = clauseRows[idx]?.id;
      const recs = Array.isArray(c.recommendations) ? c.recommendations : [];
      return recs
        .filter(Boolean)
        .map((desc, i) => ({
          id: crypto.randomUUID(),
          clause_id: clauseId,
          description: String(desc).slice(0, 10_000),
          suggested_text: null,
          order_index: i,
        }));
    });

    const score = scoreFromClauses(clauses);
    const overall_risk = overallRiskFromScore(score);

    await reportProgress(4, 90); // Building report
    const { error: clausesErr } = await adminClient.from('clauses').insert(clauseRows);
    if (clausesErr) throw new Error(`Insert clauses failed: ${clausesErr.message}`);

    if (issueRows.length > 0) {
      const { error: issuesErr } = await adminClient.from('clause_issues').insert(issueRows);
      if (issuesErr) throw new Error(`Insert issues failed: ${issuesErr.message}`);
    }

    if (suggestionRows.length > 0) {
      const { error: suggErr } = await adminClient.from('clause_suggestions').insert(suggestionRows);
      if (suggErr) throw new Error(`Insert suggestions failed: ${suggErr.message}`);
    }

    const { error: repUpdateErr } = await adminClient
      .from('reports')
      .update({
        contract_type: (payload.contract_type ?? 'Contract').slice(0, 100),
        parties: (payload.parties ?? 'Unknown parties').slice(0, 500),
        compliance_score: score,
        overall_risk,
        status: 'completed',
        error_message: null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', report_id);

    if (repUpdateErr) throw new Error(`Update report failed: ${repUpdateErr.message}`);

    // Finally, if this is a root report (not a versioned retry) and it succeeded, charge the user a credit
    if (!reportRow.parent_report_id) {
      await adminClient.rpc('increment_uploads_used', { user_id_input: userData.user.id });
    }

    return json({ ok: true, report_id, compliance_score: score, overall_risk });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (reportIdForError) {
      await adminClient
        .from('reports')
        .update({ status: 'failed', error_message: message.slice(0, 500) })
        .eq('id', reportIdForError);
    }

    return json({ error: message }, { status: 500 });
  }
});
