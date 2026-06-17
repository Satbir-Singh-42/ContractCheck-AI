import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Eye, EyeOff, Loader2, Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTopNavigate } from '../hooks/useTopNavigate';
import { supabase } from '../../lib/supabase';

export function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useTopNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password state
  const [mode, setMode] = useState<'login' | 'forgot' | 'forgot_sent'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  React.useEffect(() => {
    if (user && !isLoading) {
      const from = (location.state as any)?.from as string | undefined;
      navigate(from || '/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Both fields are required.'); return; }
    setLoading(true); setError('');
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Login Request Timed Out!")), 10000));
      await Promise.race([
        login(form.email, form.password),
        timeout
      ]);
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.message === "Login Request Timed Out!") {
        setError('Login is stuck. Please refresh the page or clear your browser history/cache.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { setResetError('Please enter your email address.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(resetEmail.trim())) { setResetError('Please enter a valid email address.'); return; }

    setResetLoading(true);
    setResetError('');
    try {
      const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${siteUrl}/login`,
      });
      if (error) throw error;
      setMode('forgot_sent');
    } catch (err: any) {
      setResetError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060608] text-white flex items-center justify-center px-4 py-6 sm:p-6 overflow-x-clip">
      <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[280px] h-[180px] rounded-full bg-blue-600/10 blur-[70px] pointer-events-none sm:w-[520px] sm:h-[320px] sm:blur-[110px]" />

      <div className="relative w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity mb-10">
          <Shield className="w-7 h-7 text-blue-400" />
          <span className="font-semibold text-lg tracking-tight">ContractCheck</span>
        </Link>

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#0B0B0E] border border-white/[0.07] rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold tracking-tight mb-1">Welcome back</h1>
                  <p className="text-sm text-slate-400">Sign in to your ContractCheck account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="you@company.in"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => { setResetEmail(form.email); setResetError(''); setMode('forgot'); }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
                  </button>
                </form>
              </div>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign up free
                </Link>
              </p>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#0B0B0E] border border-white/[0.07] rounded-2xl p-8 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
                >
                  <ArrowLeft size={15} /> Back to sign in
                </button>

                <div className="mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight mb-1">Reset your password</h1>
                  <p className="text-sm text-slate-400">Enter your email and we'll send you a reset link.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                    <input
                      type="email"
                      placeholder="you@company.in"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                      autoFocus
                    />
                  </div>

                  {resetError && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      {resetError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {resetLoading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {mode === 'forgot_sent' && (
            <motion.div
              key="forgot_sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#0B0B0E] border border-white/[0.07] rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={26} className="text-emerald-400" />
                </div>
                <h1 className="text-xl font-bold tracking-tight mb-2">Check your inbox</h1>
                <p className="text-sm text-slate-400 mb-1">We've sent a password reset link to:</p>
                <p className="text-sm font-semibold text-white mb-6">{resetEmail}</p>
                <p className="text-xs text-slate-500 mb-6">
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setResetError(''); }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    try again
                  </button>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ArrowLeft size={14} /> Back to sign in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
