import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Upload, FileText, AlertTriangle, CheckCircle, Clock,
  TrendingUp, ChevronRight, Plus, Search, Loader2, MoreVertical, Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();
  const score = report.compliance_score ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div
      onClick={() => { if (!menuOpen) navigate(`/result/${report.id}`); }}
      className="group relative bg-[#0B0B0E] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 cursor-pointer transition-all hover:bg-[#0f0f12]"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{report.file_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {report.contract_type} · {report.created_at?.slice(0, 10)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border', RISK_COLORS[report.overall_risk])}>
            <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', RISK_DOT[report.overall_risk])} />
            {report.overall_risk} Risk
          </span>

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

      <p className="text-xs text-slate-500 mb-4 truncate">Parties: {report.parties}</p>

      <div className="flex items-center gap-3">
        {/* Compliance score bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
            <span>Compliance</span>
            <span>{score}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full',
                score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState<DBReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Use the PERMANENT counter from the user profile.
  // This only goes up on upload and NEVER decreases on delete,
  // so users cannot game the free plan by deleting old reports.
  const usedCount = user?.uploadsUsed || 0;
  const usedPct = user ? Math.min(100, Math.round((usedCount / user.uploadsLimit) * 100)) : 0;

  useEffect(() => {
    if (!user) return; // Wait until authentication completes
    setLoading(true);
    setErrorMsg(null);
    apiGetReports()
      .then(res => { setReports(res.reports); setLoading(false); })
      .catch((err) => { 
         setErrorMsg(err instanceof Error ? err.message : String(err)); 
         setLoading(false); 
      });
  }, [user, location.key]);

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
    { label: 'Reports Generated',  value: loading ? '…' : reports.length, icon: FileText,       color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
    { label: 'High Risk Found',    value: loading ? '…' : highRiskCount,   icon: AlertTriangle,  color: 'text-red-400',     bg: 'bg-red-500/10'     },
    { label: 'Avg. Compliance',    value: loading ? '…' : `${avgCompliance}%`, icon: CheckCircle,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg. Turnaround',    value: loading ? '…' : turnaroundStr,                           icon: Clock,          color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  ];

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10"
      >

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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]"
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
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors shrink-0"
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