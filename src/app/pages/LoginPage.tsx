import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Both fields are required.'); return; }
    setLoading(true); setError('');
    try {
      // Set a 10s timeout to forcefully prevent infinite hangs if LocalStorage/Supabase locks
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Login Request Timed Out!")), 10000));
      await Promise.race([
        login(form.email, form.password),
        timeout
      ]);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      // If it explicitly timed out, suggest clearing cache
      if (err.message === "Login Request Timed Out!") {
        setError('Login is stuck. Please refresh the page or clear your browser history/cache.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center p-6">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[400px]"
      >
        <Link to="/" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity mb-10">
          <Shield className="w-7 h-7 text-blue-400" />
          <span className="font-semibold text-lg tracking-tight">ContractCheck</span>
        </Link>

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
                <span className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">Forgot?</span>
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
    </div>
  );
}