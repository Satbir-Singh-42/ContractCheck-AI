import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Upload, FileText, AlertTriangle, CheckCircle, Clock, TrendingUp, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { useAuth } from '../context/AuthContext';
import { mockReports, Report } from '../../lib/mockData';
import { cn } from '../../lib/utils';

const RISK_COLORS: Record<string, string> = {
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const RISK_DOT: Record<string, string> = {
  High: 'bg-red-500',
  Medium: 'bg-amber-500',
  Low: 'bg-emerald-500',
};

function ReportCard({ report }: { report: Report }) {
  const navigate = useNavigate();
  const safe = report.clauses.filter(c => c.riskLevel === 'Safe').length;
  const risky = report.clauses.filter(c => c.riskLevel === 'Risky').length;
  const bad = report.clauses.filter(c => c.riskLevel === 'Non-compliant').length;

  return (
    <div
      onClick={() => navigate(`/result/${report.id}`)}
      className="group bg-[#0B0B0E] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 cursor-pointer transition-all hover:bg-[#0f0f12]"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{report.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{report.type} · {report.date}</p>
          </div>
        </div>
        <span className={cn('text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0', RISK_COLORS[report.overallRisk])}>
          <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', RISK_DOT[report.overallRisk])} />
          {report.overallRisk} Risk
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4 truncate">Parties: {report.parties}</p>

      <div className="flex items-center gap-3">
        {safe > 0 && (
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> {safe} Safe
          </div>
        )}
        {risky > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> {risky} Risky
          </div>
        )}
        {bad > 0 && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500" /> {bad} Non-compliant
          </div>
        )}
        <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const usedPct = user ? Math.round((user.uploadsUsed / user.uploadsLimit) * 100) : 0;

  const filteredReports = mockReports.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.parties.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Reports Generated', value: mockReports.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'High Risk Found', value: mockReports.filter(r => r.overallRisk === 'High').length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Issues Resolved', value: 4, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg. Turnaround', value: '~8s', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
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
                <p className="text-xs text-slate-400">{user.uploadsUsed}/{user.uploadsLimit} analyses used</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${usedPct}%` }}
                />
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

        {/* Reports List */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
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
              <span className="text-xs text-slate-500">{filteredReports.length} total</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {filteredReports.length === 0 && mockReports.length > 0 && (
            <div className="text-center py-12">
              <Search size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No reports match your search.</p>
            </div>
          )}

          {mockReports.length === 0 && (
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
        </div>
      </div>
    </AppLayout>
  );
}