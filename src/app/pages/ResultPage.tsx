import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  AlertTriangle, CheckCircle, XCircle, ChevronDown,
  Download, Share2, ArrowLeft, FileText, BookOpen, Lightbulb,
  Shield, Check, Loader2, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { apiGetReport, apiMarkReportFailed, apiShareReport, apiGetReportVersions, apiStartContractAnalysis, apiUploadContract, type ReportVersion } from '../../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTopNavigate } from '../hooks/useTopNavigate';
import type { ReportResponse } from '../../lib/schema';
import { cn } from '../../lib/utils';
import { extractTextFromFile } from '../../lib/documentExtraction';
import {
  downloadCompliancePdf,
  type PdfClause,
  type PdfReportData,
  type PdfRiskLevel,
} from '../../lib/pdfReport';

// ─── Local UI Types (mapped from API schema) ──────────────────────────────────

type RiskLevel = PdfRiskLevel;
type Clause = PdfClause;
type Report = PdfReportData;

function mapApiToReport(data: ReportResponse): Report {
  return {
    id: data.report.id,
    name: data.report.file_name,
    type: data.report.contract_type,
    parties: data.report.parties,
    overallRisk: data.report.overall_risk,
    date: data.report.created_at?.slice(0, 10) || '',
    status: data.report.status,
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
  color: string; textColor: string; bg: string; border: string; ringColor: string;
}> = {
  Safe: {
    label: 'Safe', icon: CheckCircle,
    color: 'text-emerald-400', textColor: 'text-emerald-300',
    bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20',
    ringColor: 'ring-emerald-500/30',
  },
  Risky: {
    label: 'Risky', icon: AlertTriangle,
    color: 'text-amber-400', textColor: 'text-amber-300',
    bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20',
    ringColor: 'ring-amber-500/30',
  },
  'Non-compliant': {
    label: 'Non-compliant', icon: XCircle,
    color: 'text-red-400', textColor: 'text-red-300',
    bg: 'bg-red-500/[0.06]', border: 'border-red-500/20',
    ringColor: 'ring-red-500/30',
  },
};

// ─── Clause Card ──────────────────────────────────────────────────────────────

function ClauseCard({ clause, index }: { clause: Clause; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = RISK_CONFIG[clause.riskLevel] || RISK_CONFIG.Safe;
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
              {/* Original Text */}
              <div>
                <SectionLabel icon={FileText} label="Original Clause" color="text-slate-400" />
                <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{clause.originalText}"
                  </p>
                </div>
              </div>

              {/* Issues */}
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

              {/* Suggestions */}
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

              {/* Law Reference */}
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

function SectionLabel({ icon: Icon, label, color }: { icon: React.FC<{ size?: number; className?: string }>; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon size={13} className={color} />
      <span className={cn('text-xs font-semibold uppercase tracking-wider', color)}>{label}</span>
    </div>
  );
}

// ─── Overall Risk Config ──────────────────────────────────────────────────────

const OVERALL_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; gradient: string }> = {
  High: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High Risk', gradient: 'from-red-500/10 to-red-500/[0.02]' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Medium Risk', gradient: 'from-amber-500/10 to-amber-500/[0.02]' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Low Risk', gradient: 'from-emerald-500/10 to-emerald-500/[0.02]' },
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'Safe' | 'Risky' | 'Non-compliant';

const FILTER_TABS: { key: FilterTab; label: string; color: string }[] = [
  { key: 'all', label: 'All Clauses', color: 'text-white' },
  { key: 'Non-compliant', label: 'Non-compliant', color: 'text-red-400' },
  { key: 'Risky', label: 'Risky', color: 'text-amber-400' },
  { key: 'Safe', label: 'Safe', color: 'text-emerald-400' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ResultPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useTopNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [versions, setVersions] = useState<ReportVersion[]>([]);
  const revisionInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    
    async function fetchReportAndVersions() {
      try {
        const res = await apiGetReport(id!);
        if (!res) {
          setNotFound(true);
        } else {
          setReport(mapApiToReport(res));
          // If the DB has `parent_report_id` natively, it would be mapped. Since we only mapped simple fields, 
          // let's assume `apiGetReportVersions` just searches where `id` or `parent_report_id` matches.
          // In the API we select parent_report_id natively for `UploadContract`, but wait...
          // We can just rely on `apiGetReportVersions(id)` and it'll pull the tree because it OR matches.
          const rootId = res.report.parent_report_id || res.report.id;
          const vList = await apiGetReportVersions(rootId);
          setVersions(vList);
        }
      } catch (e) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchReportAndVersions();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !report) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
          <p className="text-slate-400 mb-6 max-w-sm">This report may have expired or doesn't exist. Please check the link or return to your dashboard.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  const safe = report.clauses.filter(c => c.riskLevel === 'Safe').length;
  const risky = report.clauses.filter(c => c.riskLevel === 'Risky').length;
  const bad = report.clauses.filter(c => c.riskLevel === 'Non-compliant').length;
  const total = report.clauses.length;
  const score = Math.max(0, Math.round(100 - (bad * 25) - (risky * 10)));
  const ocfg = OVERALL_CONFIG[report.overallRisk] || OVERALL_CONFIG.Medium;

  const filteredClauses = activeFilter === 'all'
    ? report.clauses
    : report.clauses.filter(c => c.riskLevel === activeFilter);

  const totalIssues = report.clauses.reduce((sum, c) => sum + c.issues.length, 0);
  const totalSuggestions = report.clauses.reduce((sum, c) => sum + c.suggestions.length, 0);



  const handleShare = async () => {
    try {
      setSharing(true);
      const res = await apiShareReport(report.id);
      await navigator.clipboard.writeText(res.share_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to share report. Ensure you own this report and try again.');
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    try {
      downloadCompliancePdf(report);
    } catch (err) {
      console.error(err);
      alert('Failed to export PDF. Please try again.');
    }
  };

  // Compliance bar percentages
  const safePct = total > 0 ? (safe / total) * 100 : 0;
  const riskyPct = total > 0 ? (risky / total) * 100 : 0;
  const badPct = total > 0 ? (bad / total) * 100 : 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            
            {/* Version Selection Dropdown */}
            {versions.length > 1 && (
              <div className="relative group z-20">
                <button className="flex items-center gap-2 text-sm text-slate-300 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] px-4 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer">
                  V{versions.find(v => v.id === id)?.version_number || 1} <ChevronDown size={15} />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#111115] border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {versions.map(v => (
                    <button
                      key={v.id}
                      onClick={() => navigate(`/result/${v.id}`)}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm hover:bg-white/[0.04] transition-colors flex items-center justify-between cursor-pointer",
                        v.id === id ? "text-blue-400 font-semibold bg-white/[0.02]" : "text-slate-300"
                      )}
                    >
                      <span>Version {v.version_number}</span>
                      {v.id === id && <Check size={14} className="text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden File Input for Revision Upload */}
            <input 
              type="file" 
              ref={revisionInputRef} 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !report) return;
                setIsUploading(true);
                try {
                  const extractionPromise = extractTextFromFile(file);
                  const rootId = versions.length > 0 ? (versions[0].id) : report.id;
                  const nextV = versions.length > 0 ? Math.max(...versions.map(v => v.version_number)) + 1 : 2;
                  const res = await apiUploadContract(file, rootId, nextV);
                  // Brief pause for aesthetics, then navigate to process
                  await new Promise(r => setTimeout(r, 600));
                  navigate(`/process/${res.report_id}`);

                  void (async () => {
                    try {
                      const extractedText = await extractionPromise;
                      if (!extractedText) {
                        throw new Error('Could not extract text from this file. Try a text-based PDF, DOCX, or TXT (scanned PDFs and .DOC are not supported yet).');
                      }
                      await apiStartContractAnalysis(res.report_id, extractedText);
                    } catch (err: unknown) {
                      const msg = err instanceof Error ? err.message : 'Could not extract text / start analysis.';
                      await apiMarkReportFailed(res.report_id, msg);
                    }
                  })();
                } catch (err) {
                  alert("Failed to upload revision: " + (err instanceof Error ? err.message : String(err)));
                  setIsUploading(false);
                }
              }} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
            />

            {/* Pro Gate: Upload Revision */}
            {user?.plan === 'pro' ? (
              <button
                onClick={() => revisionInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {isUploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Upload Revision
              </button>
            ) : (
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 text-sm text-amber-500/80 hover:text-amber-400 border border-amber-500/10 bg-amber-500/[0.04] hover:bg-amber-500/[0.08] hover:border-amber-500/20 px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <Shield size={14} /> Pro Versioning
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download size={15} /> Export PDF
            </button>
            <button
              onClick={handleShare}
              className={cn(
                'flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap',
                copied ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-500'
              )}
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
              {copied ? 'Link Copied' : 'Share Report'}
            </button>
          </div>
        </motion.div>

        {/* Main Layout: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Report Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn('border rounded-2xl overflow-hidden', ocfg.border)}
            >
              <div className={cn('bg-gradient-to-br p-6', ocfg.gradient)}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <ScoreRing score={score} risk={report.overallRisk} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded">{report.type}</span>
                      <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', ocfg.color, ocfg.border)}>
                        {ocfg.label}
                      </span>
                    </div>
                    <h1 className="text-xl font-bold text-white mb-1">{report.name}</h1>
                    <p className="text-sm text-slate-400 mb-3">{report.parties}</p>

                    {/* Compliance Bar */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1 h-2.5 rounded-full overflow-hidden bg-white/[0.06]">
                        {safePct > 0 && (
                          <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${safePct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                          />
                        )}
                        {riskyPct > 0 && (
                          <motion.div
                            className="h-full bg-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${riskyPct}%` }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                          />
                        )}
                        {badPct > 0 && (
                          <motion.div
                            className="h-full bg-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${badPct}%` }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {safe} Safe</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {risky} Risky</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> {bad} Non-compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 overflow-x-auto"
            >
              {FILTER_TABS.map(tab => {
                const count = tab.key === 'all' ? total
                  : report.clauses.filter(c => c.riskLevel === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex-1 justify-center whitespace-nowrap min-w-fit',
                      activeFilter === tab.key
                        ? 'bg-white/[0.08] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.key === 'all' ? 'All' : tab.key === 'Non-compliant' ? 'Bad' : tab.label}</span>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md',
                      activeFilter === tab.key ? 'bg-white/10' : 'bg-white/[0.04]'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Clause List */}
            <div className="space-y-3">
              {filteredClauses.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-slate-500 text-sm"
                >
                  No clauses match this filter.
                </motion.div>
              ) : (
                filteredClauses.map((clause, i) => (
                  <ClauseCard key={clause.id} clause={clause} index={i} />
                ))
              )}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="border border-white/[0.06] rounded-2xl bg-white/[0.02] p-5 space-y-4"
            >
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Shield size={14} className="text-blue-400" /> Analysis Summary
              </h3>
              <div className="space-y-3">
                <StatRow label="Total Clauses" value={total} />
                <StatRow label="Issues Found" value={totalIssues} valueColor="text-red-400" />
                <StatRow label="AI Suggestions" value={totalSuggestions} valueColor="text-blue-400" />
                <StatRow label="Compliance Score" value={`${score}/100`} valueColor={ocfg.color} />
              </div>
            </motion.div>

            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/[0.06] rounded-2xl bg-white/[0.02] p-5 space-y-4"
            >
              <h3 className="text-sm font-semibold text-white">Risk Distribution</h3>
              <div className="space-y-3">
                <DistBar label="Safe" count={safe} total={total} color="bg-emerald-500" textColor="text-emerald-400" />
                <DistBar label="Risky" count={risky} total={total} color="bg-amber-500" textColor="text-amber-400" />
                <DistBar label="Non-compliant" count={bad} total={total} color="bg-red-500" textColor="text-red-400" />
              </div>
            </motion.div>

            {/* Report Metadata */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="border border-white/[0.06] rounded-2xl bg-white/[0.02] p-5 space-y-3"
            >
              <h3 className="text-sm font-semibold text-white">Report Details</h3>
              <MetaRow label="File" value={report.name} />
              <MetaRow label="Contract Type" value={report.type} />
              <MetaRow label="Parties" value={report.parties} />
              <MetaRow label="Analyzed" value={new Date(report.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
              <MetaRow label="Status" value={report.status} />
            </motion.div>

            {/* Regulations Referenced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-white/[0.06] rounded-2xl bg-white/[0.02] p-5 space-y-3"
            >
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen size={14} className="text-slate-400" /> Regulations Referenced
              </h3>
              <div className="flex flex-wrap gap-2">
                {[...new Set(report.clauses.map(c => c.relevantLaw))].map(law => (
                  <span key={law} className="text-[10px] text-slate-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                    {law.length > 40 ? law.slice(0, 38) + '...' : law}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-10">
          This report is AI-generated and does not constitute legal advice. Always consult a qualified advocate.
        </p>
      </div>
    </AppLayout>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function StatRow({ label, value, valueColor = 'text-white' }: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={cn('text-sm font-semibold', valueColor)}>{value}</span>
    </div>
  );
}

function DistBar({ label, count, total, color, textColor }: { label: string; count: number; total: number; color: string; textColor: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={cn('text-xs font-semibold', textColor)}>{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-xs text-slate-300 text-right truncate">{value}</span>
    </div>
  );
}
