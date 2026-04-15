import React from 'react';
import { XCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { useTopNavigate } from '../hooks/useTopNavigate';

export function FailurePage() {
  const navigate = useTopNavigate();

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[80vh] flex items-center justify-center px-4"
      >
        <div className="text-center max-w-[440px]">
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="relative w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <XCircle size={40} className="text-red-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3">Payment Failed</h1>
          <p className="text-slate-400 mb-8">
            Your payment could not be processed. No charges have been made. Please check your payment details and try again.
          </p>

          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-8 text-left text-sm text-slate-400">
            <p className="font-semibold text-red-300 mb-2">Common reasons for failure:</p>
            <ul className="space-y-1.5">
              {[
                'Insufficient balance in your account',
                'Card declined by the issuing bank',
                'Incorrect OTP or authentication failed',
                'Internet connection was interrupted',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/payment')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-sm text-slate-400 hover:text-white border border-white/[0.06] hover:border-white/10 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={15} /> Contact Support
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-6">
            Need help? Email us at <span className="text-slate-500">support@contractcheck.ai</span>
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
}
