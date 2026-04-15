import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  CheckCircle, AlertTriangle, XCircle, ChevronDown, Shield,
  FileText, Lightbulb, BookOpen, Download, ExternalLink, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiGetReport } from '../../lib/api';
import type { ReportResponse } from '../../lib/schema';
import { cn } from '../../lib/utils';

// ─── Local UI Types ───────────────────────────────────────────────────

type RiskLevel = 'Safe' | 'Risky' | 'Non-compliant';

interface Clause {
  id: string;
  title: string;
  originalText: string;
  riskLevel: RiskLevel;
  issues: string[];
  suggestions: string[];
  relevantLaw: string;
}

interface Report {
  id: string;
  name: string;
  type: string;
  parties: string;
  overallRisk: 'High' | 'Medium' | 'Low';
  date: string;
  clauses: Clause[];
}

function mapApiToReport(data: ReportResponse): Report {
  return {
    id: data.report.id,
    name: data.report.file_name,
    type: data.report.contract_type,
    parties: data.report.parties,
    overallRisk: data.report.overall_risk,
    date: data.report.created_at?.slice(0, 10) || '',
    clauses: data.clauses.map(c => ({
      id: c.id,
      title: c.title,
      originalText: c.original_text,
      riskLevel: c.risk_level as RiskLevel,
      issues: c.issues.map(i => i.description),
      suggestions: c.suggestions.map(s => s.description),
      relevantLaw: c.relevant_law,
    })),
  };
}

// ─── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, risk }: { score: number; risk: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = risk === 'High' ? '#ef4444' : risk === 'Medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx="64" cy="64" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-black text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
}

// ─── Risk Config ──────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, {
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  color: string; textColor: string; bg: string; border: string;
}> = {
  Safe: {
    label: 'Safe', icon: CheckCircle,
    color: 'text-emerald-400', textColor: 'text-emerald-300',
    bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20',
  },
  Risky: {
    label: 'Risky', icon: AlertTriangle,
    color: 'text-amber-400', textColor: 'text-amber-300',
    bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20',
  },
  'Non-compliant': {
    label: 'Non-compliant', icon: XCircle,
    color: 'text-red-400', textColor: 'text-red-300',
    bg: 'bg-red-500/[0.06]', border: 'border-red-500/20',
  },
};

const OVERALL_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  High: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High Risk' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Medium Risk' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Low Risk' },
};

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label, color }: { icon: React.FC<{ size?: number; className?: string }>; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon size={13} className={color} />
      <span className={cn('text-xs font-semibold uppercase tracking-wider', color)}>{label}</span>
    </div>
  );
}

// ─── Clause Card ──────────────────────────────────────────────────────────────

function ClauseCard({ clause, index }: { clause: Clause; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = RISK_CONFIG[clause.riskLevel];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={cn(
        'border rounded-2xl overflow-hidden transition-all duration-200',
        cfg.border,
        expanded ? cfg.bg : 'bg-white/[0.02] hover:bg-white/[0.04]'
      )}
    >
      <button
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', cfg.bg, 'border', cfg.border)}>
          <Icon size={16} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">{clause.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{clause.relevantLaw}</p>
        </div>
        <span className={cn(
          'text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border shrink-0 tracking-wide',
          cfg.color, cfg.border, cfg.bg
        )}>
          {cfg.label}
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-slate-500 shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/[0.05] pt-4">
              <div>
                <SectionLabel icon={FileText} label="Original Clause" color="text-slate-400" />
                <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{clause.originalText}"
                  </p>
                </div>
              </div>

              {clause.issues.length > 0 && (
                <div>
                  <SectionLabel icon={AlertTriangle} label={`${clause.issues.length} Issue${clause.issues.length > 1 ? 's' : ''} Found`} color="text-red-400" />
                  <div className="space-y-2">
                    {clause.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 bg-red-500/[0.04] border border-red-500/10 rounded-xl px-4 py-3">
                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 shrink-0" />
                        <p className="text-sm text-slate-300">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clause.suggestions.length > 0 && (
                <div>
                  <SectionLabel icon={Lightbulb} label="AI Recommendations" color="text-blue-400" />
                  <div className="space-y-2">
                    {clause.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 bg-blue-500/[0.04] border border-blue-500/10 rounded-xl px-4 py-3">
                        <span className="w-5 h-5 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1 px-1">
                <BookOpen size={13} className="text-slate-600" />
                <span className="text-xs text-slate-500">Reference: {clause.relevantLaw}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Share Page ────────────────────────────────────────────────────────────────

export function SharePage() {
  const { reportId } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!reportId) { setNotFound(true); setLoading(false); return; }
    apiGetReport(reportId)
      .then(res => {
        if (!res) { setNotFound(true); }
        else { setReport(mapApiToReport(res)); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <XCircle size={28} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-sm">This shared report may have expired or doesn't exist.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
          Go Home
        </Link>
      </div>
    );
  }

  const safe = report.clauses.filter(c => c.riskLevel === 'Safe').length;
  const risky = report.clauses.filter(c => c.riskLevel === 'Risky').length;
  const bad = report.clauses.filter(c => c.riskLevel === 'Non-compliant').length;
  const total = report.clauses.length;
  const score = Math.max(0, Math.round(100 - (bad * 25) - (risky * 10)));
  const ocfg = OVERALL_CONFIG[report.overallRisk] || OVERALL_CONFIG['High'];
  const totalIssues = report.clauses.reduce((sum, c) => sum + c.issues.length, 0);

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30">
      {/* Background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 rounded-full bg-blue-600/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 rounded-full bg-blue-500/[0.04] blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#060608]/90 backdrop-blur-xl">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">ContractCheck</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-semibold uppercase tracking-wider">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download size={13} /> Export PDF
            </button>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
            >
              <ExternalLink size={13} /> Analyze Your Contract
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 py-8">
          {/* Public Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-white/[0.03] border border-white/[0.05] px-4 py-2.5 rounded-xl"
          >
            <Shield size={13} className="text-blue-400 shrink-0" />
            This is a read-only shared compliance report generated by ContractCheck AI.
          </motion.div>

          {/* Report Header with Score Ring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 sm:p-8 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={score} risk={report.overallRisk} />

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <FileText size={16} className="text-slate-500" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{report.type}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">{report.name}</h1>
                <p className="text-sm text-slate-400 mb-1">Parties: {report.parties}</p>
                <p className="text-xs text-slate-600">Analyzed on {report.date}</p>

                <div className="mt-3">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1 rounded-lg border',
                    ocfg.color, ocfg.border, ocfg.bg
                  )}>
                    <AlertTriangle size={12} />
                    {ocfg.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stat Boxes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          >
            <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{safe}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">Safe</p>
            </div>
            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{risky}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">Risky</p>
            </div>
            <div className="bg-red-500/[0.06] border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{bad}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">Non-compliant</p>
            </div>
            <div className="bg-blue-500/[0.06] border border-blue-500/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{totalIssues}</p>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">Issues Found</p>
            </div>
          </motion.div>

          {/* Compliance Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Clause Compliance Breakdown</span>
              <span>{total} clauses analyzed</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {safe > 0 && (
                <motion.div
                  className="bg-emerald-500 rounded-l-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(safe / total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              )}
              {risky > 0 && (
                <motion.div
                  className="bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(risky / total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              )}
              {bad > 0 && (
                <motion.div
                  className="bg-red-500 rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(bad / total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              )}
            </div>
            <div className="flex items-center gap-4 mt-2.5 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe ({safe})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Risky ({risky})</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Non-compliant ({bad})</span>
            </div>
          </motion.div>

          {/* Clause Cards */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Detailed Clause Analysis</h2>
            <span className="text-xs text-slate-500">{total} clauses</span>
          </div>
          <div className="space-y-3">
            {report.clauses.map((clause, i) => (
              <ClauseCard key={clause.id} clause={clause} index={i} />
            ))}
          </div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8"
          >
            <p className="text-lg font-bold mb-2">Want to check your own contracts?</p>
            <p className="text-sm text-slate-400 mb-5">Get 3 free analyses. No credit card required.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Start Free with ContractCheck <ExternalLink size={16} />
            </Link>
          </motion.div>

          <p className="text-center text-xs text-slate-700 mt-8">
            AI-generated report. Not legal advice. Powered by ContractCheck AI.
          </p>
        </div>
    </div>
  );
}
