import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Upload, User, LogOut, Menu, X, FileText, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTopNavigate } from '../hooks/useTopNavigate';
import { cn } from '../../lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: Upload },
  { to: '/profile', label: 'Profile', icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useTopNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    navigate('/', { replace: true });
    void logout();
  };

  return (
    <div className="min-h-screen w-full bg-[#060608] text-white flex flex-col">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#060608]/90 md:backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="font-semibold tracking-tight">ContractCheck</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
              AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <span className={cn(
                  'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border',
                  user.plan === 'pro'
                    ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                    : 'border-slate-500/30 text-slate-400 bg-slate-500/10'
                )}>
                  {user.plan}
                </span>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xs font-bold text-white border-2 border-white/10">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <LogOut size={15} /> Logout
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0B0B0E] px-4 py-3 space-y-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </header>

      <div className="h-16 shrink-0" aria-hidden="true" />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}