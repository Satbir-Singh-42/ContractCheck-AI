import React, { useEffect, useState } from 'react';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { useTopNavigate } from '../hooks/useTopNavigate';

export function SuccessPage() {
  const navigate = useTopNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); navigate('/dashboard'); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [navigate]);

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[70vh] flex items-center justify-center px-4"
      >
        <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-3xl p-8 max-w-[440px] w-full text-center shadow-2xl">
          {/* Animated Check */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap size={11} /> Payment Successful
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3">You're now on Pro!</h1>
          <p className="text-slate-400 mb-4">
            Your plan has been activated. You now have access to 50 contract analyses per month with all Indian regulations.
          </p>

          <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-5 mb-8 text-left space-y-2">
            {[
              'DPDP Act 2023 compliance checks',
              'GST & CGST clause validation',
              'Labour Law & Contract Act analysis',
              'AI-generated fix suggestions',
              'PDF export & shareable links',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" /> {f}
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Go to Dashboard <ArrowRight size={16} />
          </button>

          <p className="text-xs text-slate-600 mt-4">
            Auto-redirecting in {count}s...
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
}