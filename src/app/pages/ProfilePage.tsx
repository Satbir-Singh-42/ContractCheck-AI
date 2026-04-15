import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Mail, Shield, Zap, Bell, Key, LogOut,
  CheckCircle, ChevronRight, FileText, AlertTriangle,
  Eye, EyeOff, X, BellRing, Scale, Globe, Clock, Camera,
} from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';

type Tab = 'general' | 'plan' | 'notifications' | 'security';

const TABS: { id: Tab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'general', label: 'General', icon: User },
  { id: 'plan', label: 'Plan & Usage', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState(() => {
    try {
      const stored = localStorage.getItem('contractcheck_notif_prefs');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      analysisComplete: true,
      analysisFailed: true,
      highRiskAlert: true,
      weeklyDigest: false,
      monthlyReport: false,
      regulationUpdates: true,
      productUpdates: false,
      tips: false,
    };
  });
  const [notifSaved, setNotifSaved] = useState(false);
  const [notifDirty, setNotifDirty] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateUser({ profilePhoto: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    updateUser({ profilePhoto: undefined });
  };

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const usedPct = Math.round((user.uploadsUsed / user.uploadsLimit) * 100);

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[960px] mx-auto px-4 sm:px-6 py-10"
      >
        {/* Page Header with Avatar */}
        <div className="flex items-center gap-5 mb-10">
          <div className="relative group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-[72px] h-[72px] rounded-2xl object-cover shadow-lg shadow-blue-500/20"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[28px] font-bold text-white shrink-0 shadow-lg shadow-blue-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera size={22} className="text-white" />
            </button>
            {user.profilePhoto && (
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate mb-1">{user.name}</h1>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <nav className="md:w-[200px] shrink-0">
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                    activeTab === id
                      ? 'bg-white/[0.07] text-white'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
                  )}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Profile Information</h2>
                  <p className="text-sm text-slate-500">Update your personal details.</p>
                </div>

                <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Full Name</label>
                      <input
                        defaultValue={user.name}
                        className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
                      <input
                        defaultValue={user.email}
                        className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-2">Organization (Optional)</label>
                      <input
                        placeholder="Your company name"
                        className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-400 mb-2">Role (Optional)</label>
                      <select className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors">
                        <option value="">Select your role</option>
                        <option value="lawyer">Lawyer / Advocate</option>
                        <option value="ca">Chartered Accountant</option>
                        <option value="cs">Company Secretary</option>
                        <option value="business">Business Owner</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/[0.05] flex items-center justify-between">
                    <p className="text-xs text-slate-600">
                      Member since April 2026
                    </p>
                    <button
                      onClick={handleSave}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                        saved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      )}
                    >
                      {saved ? <><CheckCircle size={15} /> Saved</> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Plan & Usage Tab */}
            {activeTab === 'plan' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Plan & Usage</h2>
                  <p className="text-sm text-slate-500">Monitor your usage and manage your subscription.</p>
                </div>

                {/* Current Plan Card */}
                <div className={cn(
                  'rounded-2xl border p-6',
                  user.plan === 'pro'
                    ? 'bg-gradient-to-br from-blue-600/[0.08] to-purple-600/[0.04] border-blue-500/20'
                    : 'bg-[#0B0B0E] border-white/[0.06]'
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        user.plan === 'pro' ? 'bg-blue-500/20' : 'bg-white/5'
                      )}>
                        <Zap size={18} className={user.plan === 'pro' ? 'text-blue-400' : 'text-slate-400'} />
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize">{user.plan} Plan</p>
                        <p className="text-xs text-slate-500">
                          {user.plan === 'pro' ? '₹999/month' : 'Free forever'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Analyses used this month</span>
                        <span className="text-sm font-semibold text-white">{user.uploadsUsed} / {user.uploadsLimit}</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-2.5">
                        <div
                          className={cn(
                            'h-2.5 rounded-full transition-all',
                            usedPct >= 90 ? 'bg-red-500' : usedPct >= 60 ? 'bg-amber-500' : 'bg-blue-500'
                          )}
                          style={{ width: `${usedPct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5">
                        {user.uploadsLimit - user.uploadsUsed} remaining &middot; Resets monthly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Reports Generated', value: '6', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'High Risk Found', value: '2', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-4 text-center">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', bg)}>
                        <Icon size={14} className={color} />
                      </div>
                      <p className="text-lg font-bold text-white">{value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Upgrade CTA for free users */}
                {user.plan === 'free' && (
                  <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white mb-1">Unlock more with Pro</p>
                        <p className="text-sm text-slate-400">50 analyses/month, all regulations, AI fix suggestions, PDF export.</p>
                      </div>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shrink-0"
                      >
                        <Zap size={14} /> Upgrade to Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Notifications</h2>
                  <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
                </div>

                {/* Analysis Alerts */}
                <NotifSection
                  title="Analysis Alerts"
                  subtitle="Notifications about your contract analyses"
                  items={[
                    { key: 'analysisComplete', label: 'Analysis complete', sub: 'Get notified via email when your contract analysis is ready.', icon: CheckCircle },
                    { key: 'analysisFailed', label: 'Analysis failed', sub: 'Receive an alert if a contract analysis encounters an error.', icon: AlertTriangle },
                    { key: 'highRiskAlert', label: 'High risk detected', sub: 'Immediate notification when a contract is flagged as high risk.', icon: Shield },
                  ]}
                  notif={notif}
                  onToggle={(key) => {
                    setNotif((n: Record<string, boolean>) => ({ ...n, [key]: !n[key] }));
                    setNotifDirty(true);
                  }}
                />

                {/* Reports & Summaries */}
                <NotifSection
                  title="Reports & Summaries"
                  subtitle="Periodic summaries of your compliance status"
                  items={[
                    { key: 'weeklyDigest', label: 'Weekly compliance digest', sub: 'A summary of your contract health, delivered every Monday.', icon: Clock },
                    { key: 'monthlyReport', label: 'Monthly analytics report', sub: 'Detailed monthly breakdown of all analyses, risk trends, and insights.', icon: FileText },
                  ]}
                  notif={notif}
                  onToggle={(key) => {
                    setNotif((n: Record<string, boolean>) => ({ ...n, [key]: !n[key] }));
                    setNotifDirty(true);
                  }}
                />

                {/* Product & Regulatory */}
                <NotifSection
                  title="Product & Regulatory"
                  subtitle="Stay updated on regulations and platform changes"
                  items={[
                    { key: 'regulationUpdates', label: 'Regulation updates', sub: 'Get notified when new Indian regulations (DPDP Act, GST, etc.) are added.', icon: Scale },
                    { key: 'productUpdates', label: 'Product updates', sub: 'New features, improvements, and platform announcements.', icon: Zap },
                    { key: 'tips', label: 'Compliance tips & best practices', sub: 'Occasional tips on drafting compliant contracts under Indian law.', icon: Globe },
                  ]}
                  notif={notif}
                  onToggle={(key) => {
                    setNotif((n: Record<string, boolean>) => ({ ...n, [key]: !n[key] }));
                    setNotifDirty(true);
                  }}
                />

                {/* Save Bar */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-600">
                    {notifDirty ? 'You have unsaved changes' : 'All preferences are saved'}
                  </p>
                  <button
                    onClick={async () => {
                      await new Promise(r => setTimeout(r, 500));
                      localStorage.setItem('contractcheck_notif_prefs', JSON.stringify(notif));
                      setNotifSaved(true);
                      setNotifDirty(false);
                      setTimeout(() => setNotifSaved(false), 2500);
                    }}
                    disabled={!notifDirty && !notifSaved}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer',
                      notifSaved
                        ? 'bg-emerald-600 text-white'
                        : notifDirty
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-white/5 text-slate-600 cursor-not-allowed'
                    )}
                  >
                    {notifSaved ? <><CheckCircle size={15} /> Preferences Saved</> : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Security</h2>
                  <p className="text-sm text-slate-500">Manage your password and account access.</p>
                </div>

                <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04]">
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center justify-between p-5 text-left group hover:bg-white/[0.02] transition-colors rounded-t-2xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Key size={15} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Change Password</p>
                        <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your account secure.</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                  </button>

                  <button className="w-full flex items-center justify-between p-5 text-left group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Shield size={15} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-500/30 text-slate-500 bg-slate-500/10 shrink-0">
                      Coming Soon
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-5 text-left group hover:bg-white/[0.02] transition-colors rounded-b-2xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                        <LogOut size={15} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Sign Out</p>
                        <p className="text-xs text-slate-500 mt-0.5">Sign out of your ContractCheck account.</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
                  </button>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                  <div className="bg-[#0B0B0E] border border-red-500/15 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">Delete Account</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Permanently remove your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      {!deleteConfirm ? (
                        <button
                          onClick={() => setDeleteConfirm(true)}
                          className="text-sm font-semibold text-red-400 border border-red-500/25 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors shrink-0"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setDeleteConfirm(false)}
                            className="text-sm text-slate-500 hover:text-slate-300 px-3 py-2 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                          <button className="text-sm font-semibold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl transition-colors">
                            Confirm Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => { setShowChangePassword(false); setPasswordSaved(false); }}
          onSave={() => {
            setPasswordSaved(true);
            setTimeout(() => { setShowChangePassword(false); setPasswordSaved(false); }, 1500);
          }}
          passwordSaved={passwordSaved}
        />
      )}
    </AppLayout>
  );
}

function NotifSection({
  title,
  subtitle,
  items,
  notif,
  onToggle,
}: {
  title: string;
  subtitle: string;
  items: { key: string; label: string; sub: string; icon: React.FC<{ size?: number; className?: string }> }[];
  notif: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
      </div>
      <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04]">
        {items.map(({ key, label, sub, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-5 gap-4">
            <div className="flex items-start gap-3.5">
              <div className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                notif[key] ? 'bg-blue-500/10' : 'bg-white/[0.04]'
              )}>
                <Icon size={15} className={cn('transition-colors', notif[key] ? 'text-blue-400' : 'text-slate-500')} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
            <button
              onClick={() => onToggle(key)}
              className={cn(
                'w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer',
                notif[key] ? 'bg-blue-600' : 'bg-white/10'
              )}
            >
              <div className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200',
                notif[key] ? 'right-1' : 'left-1'
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose, onSave, passwordSaved }: { onClose: () => void; onSave: () => void; passwordSaved: boolean }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const isValid = current.length >= 1 && newPass.length >= 8 && newPass === confirm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0B0B0E] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Key size={15} className="text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Change Password</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {newPass.length > 0 && newPass.length < 8 && (
              <p className="text-xs text-red-400 mt-1.5">Password must be at least 8 characters</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirm.length > 0 && newPass !== confirm && (
              <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/[0.05] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!isValid}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
              passwordSaved
                ? 'bg-emerald-600 text-white'
                : isValid
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'
            )}
          >
            {passwordSaved ? <><CheckCircle size={15} /> Updated</> : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}