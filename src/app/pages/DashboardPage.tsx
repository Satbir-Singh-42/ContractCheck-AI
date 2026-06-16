import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  Upload, FileText, AlertTriangle, CheckCircle, Clock,
  TrendingUp, ChevronRight, Plus, Search, Loader2, MoreVertical, Trash2, XCircle, RefreshCw,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { useTopNavigate } from '../hooks/useTopNavigate';
import { apiGetReports, apiDeleteReport } from '../../lib/api';
import type { DBReport } from '../../lib/schema';
import { cn } from '../../lib/utils';

const RISK_COLORS: Record<string, string> = {
  High:   'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const RISK_DOT: Record<string, string> = {
  High:   'bg-red-500',
  Medium: 'bg-amber-500',
  Low:    'bg-emerald-500',
};

function ReportCard({ report, onDelete }: { report: DBReport; onDelete: (id: string) => void }) {
  const navigate = useTopNavigate();
  const score = report.compliance_score ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isFailed     = report.status === 'failed';
  const isProcessing = report.status === 'processing' || report.status === 'pending';
  const isCompleted  = report.status === 'completed';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!confirm(`Delete "${report.file_name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await apiDeleteReport(report.id);
      onDelete(report.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Delete error:', msg);
      alert(`Delete failed: ${msg}`);
      setDeleting(false);
    }
  };

  const StatusBadge = () => {
    if (isFailed) return (
      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border text-red-400 bg-red-500/10 border-red-500/20 flex items-center gap-1">
        <XCircle size={10} /> Failed
      </span>
    );
    if (isProcessing) return (
      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/20 flex items-center gap-1">
        <Loader2 size={10} className="animate-spin" /> Processing
      </span>
    );
    return (
      <span className={cn('text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border', RISK_COLORS[report.overall_risk])}>
        <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', RISK_DOT[report.overall_risk])} />
        {report.overall_risk} Risk
      </span>
    );
  };

  return (
    <div
      onClick={() => {
        if (menuOpen || isFailed || isProcessing) return;
        navigate(`/result/${report.id}`);
      }}
      className={cn(
        'group relative border rounded-2xl p-6 transition-all',
        isFailed
          ? 'bg-red-950/10 border-red-500/10 opacity-80 cursor-default'
          : isProcessing
          ? 'bg-amber-950/10 border-amber-500/10 cursor-default'
          : 'bg-[#0B0B0E] border-white/[0.06] hover:border-white/[0.12] cursor-pointer hover:bg-[#0f0f12]'
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            isFailed ? 'bg-red-500/10' : isProcessing ? 'bg-amber-500/10' : 'bg-white/5'
          )}>
            {isFailed
              ? <XCircle size={18} className="text-red-400" />
              : isProcessing
              ? <Loader2 size={18} className="text-amber-400 animate-spin" />
              : <FileText size={18} className="text-slate-400" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{report.file_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {report.contract_type || (isFailed ? 'Analysis failed' : 'Processing...')} · {report.created_at?.slice(0, 10)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge />

          {/* 3-dot menu */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <>
                {/* Click-away backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-[#111115] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-20">
                  {isFailed && (
                    <button
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        setMenuOpen(false); 
                        try {
                          const { apiRetryAnalysis } = await import('../../lib/api');
                          await apiRetryAnalysis(report);
                          // We navigate to process page so the user can watch the retry
                          navigate(`/process/${report.id}`);
                        } catch (err) {
                          alert(err instanceof Error ? err.message : String(err));
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={14} /> Try Again
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    {deleting ? 'Deleting…' : 'Delete Report'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error message for failed reports */}
      {isFailed && (
        <p className="text-xs text-red-400/80 mb-3 bg-red-500/5 rounded-lg px-3 py-2 border border-red-500/10">
          Analysis could not be completed. Please try uploading the document again.
        </p>
      )}

      {!isFailed && (
        <>
          <p className="text-xs text-slate-500 mb-4 truncate">Parties: {report.parties || '—'}</p>
          <div className="flex items-center gap-3">
            {/* Compliance score bar */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                <span>Compliance</span>
                <span>{isProcessing ? '—' : `${score}%`}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                {!isProcessing && (
                  <div
                    className={cn(
                      'h-full rounded-full',
                      score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ width: `${score}%` }}
                  />
                )}
              </div>
            </div>
            {isCompleted && <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />}
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useTopNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<DBReport[]>([]);
  const [loading, setLoading] = useState(true);   // true only on FIRST load
  const [refreshing, setRefreshing] = useState(false); // silent background refresh
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Use the PERMANENT counter from the user profile.
  // This only goes up on upload and NEVER decreases on delete,
  // so users cannot game the free plan by deleting old reports.
  const usedCount = user?.uploadsUsed || 0;
  const usedPct = user ? Math.min(100, Math.round((usedCount / user.uploadsLimit) * 100)) : 0;

  useEffect(() => {
    if (!user) return;
    // First load: show spinner. Subsequent navigations: keep old data visible and refresh silently.
    const isFirstLoad = reports.length === 0;
    if (isFirstLoad) setLoading(true);
    else setRefreshing(true);
    setErrorMsg(null);
    apiGetReports()
      .then(res => {
        setReports(res.reports);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : String(err));
        setLoading(false);
        setRefreshing(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const filteredReports = reports.filter(r =>
    r.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.contract_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.parties?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highRiskCount = reports.filter(r => r.overall_risk === 'High').length;

  const avgCompliance = reports.length 
    ? Math.round(reports.reduce((acc, r) => acc + (r.compliance_score || 0), 0) / reports.length)
    : 0;

  const completedReports = reports.filter(r => r.completed_at && r.status === 'completed');
  const avgTurnaroundSecs = completedReports.length
    ? Math.round(completedReports.reduce((acc, r) => acc + (new Date(r.completed_at!).getTime() - new Date(r.created_at).getTime()), 0) / completedReports.length / 1000)
    : 0;
  const turnaroundStr = avgTurnaroundSecs > 0 ? `~${avgTurnaroundSecs}s` : '0s';

  const stats = [
    { label: 'Reports Generated',  value: loading ? '…' : reports.length,        icon: FileText,      color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
    { label: 'High Risk Found',    value: loading ? '…' : highRiskCount,          icon: AlertTriangle, color: 'text-red-400',     bg: 'bg-red-500/10'     },
    { label: 'Avg. Compliance',    value: loading ? '…' : `${avgCompliance}%`,    icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg. Turnaround',    value: loading ? '…' : turnaroundStr,          icon: Clock,         color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  ];

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10"
      >
        {/* Silent refresh indicator */}
        {refreshing && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#111115] border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-400 shadow-xl">
            <Loader2 size={12} className="animate-spin" />
            Refreshing...
          </div>
        )}

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-sm text-blue-400 mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold tracking-tight">
              {user?.name?.split(' ')[0]}'s Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Your contract compliance overview at a glance.</p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]"
          >
            <Plus size={16} /> New Analysis
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-5">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', bg)}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Usage & Upgrade Banner */}
        {user?.plan === 'free' && (
          <div className="mb-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">Free Plan Usage</p>
                <p className="text-xs text-slate-400">{usedCount}/{user.uploadsLimit} analyses used</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${usedPct}%` }} />
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors shrink-0"
            >
              <TrendingUp size={15} /> Upgrade to Pro
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 relative min-h-[400px]">
          {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-sm">
              API Error: {errorMsg}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white">Recent Reports</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-[#0B0B0E] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors w-[200px]"
                />
              </div>
              {!loading && (
                <span className="text-xs text-slate-500">{filteredReports.length} total</span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="text-slate-600 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDelete={(id) => setReports(prev => prev.filter(r => r.id !== id))}
                  />
                ))}
              </div>

              {filteredReports.length === 0 && reports.length > 0 && (
                <div className="text-center py-12">
                  <Search size={32} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400">No reports match your search.</p>
                </div>
              )}

              {reports.length === 0 && (
                <div className="text-center py-20">
                  <FileText size={40} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No reports yet. Upload your first contract.</p>
                  <button
                    onClick={() => navigate('/upload')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold text-sm"
                  >
                    Upload Contract
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}