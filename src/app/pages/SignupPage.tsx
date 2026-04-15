import React, { useState } from 'react';
import { Link } from 'react-router';
import { Shield, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTopNavigate } from '../hooks/useTopNavigate';

export function SignupPage() {
  const { signup, user, isLoading } = useAuth();
  const navigate = useTopNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Analyze contracts against DPDP, GST & Labour laws',
    '3 free contract checks included',
    'AI-powered fix suggestions',
    'Shareable reports with clients',
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#060608] text-white flex"
    >
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#0B0B14] to-[#060608] border-r border-white/[0.05] relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-7 h-7 text-blue-400" />
            <span className="font-semibold text-lg tracking-tight">ContractCheck</span>
          </Link>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            AI-Powered for Indian Law
          </div>
          <h2 className="text-4xl font-bold tracking-tight leading-[1.2] mb-6">
            Your AI contract<br />counsel, available<br />24/7.
          </h2>
          <ul className="space-y-3">
            {perks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                <CheckCircle size={16} className="text-blue-400 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-slate-600">
          Designed for Indian businesses. Not legal advice.
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-8 lg:hidden">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-semibold tracking-tight">ContractCheck</span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Create your account</h1>
            <p className="text-sm text-slate-400">Start checking contracts in under a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Arjun Sharma"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Work Email</label>
              <input
                type="email"
                placeholder="arjun@company.in"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
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
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-600 mt-4">
            By signing up, you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Terms</span> &{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}