import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CreditCard, Lock, CheckCircle, Zap, Building2, Shield, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { cn } from '../../lib/utils';

const PLANS = [
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 999,
    icon: Zap,
    features: ['50 analyses/month', 'All regulation checks', 'AI fix suggestions', 'PDF export & sharing'],
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: 8999,
    badge: 'Save 25%',
    icon: Zap,
    features: ['50 analyses/month', 'All regulation checks', 'AI fix suggestions', 'PDF export & sharing', 'Priority support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    priceLabel: 'Contact Sales',
    icon: Building2,
    features: ['Unlimited analyses', 'API access', 'Team seats', 'SLA & dedicated support'],
  },
];

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay', desc: 'UPI, Cards, Net Banking', logo: 'RP' },
  { id: 'stripe', label: 'Stripe', desc: 'International Cards', logo: 'ST' },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'checkout'>('select');

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const handlePay = async () => {
    setLoading(true);
    // Simulate payment gateway call
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    // Mock success
    navigate('/success');
  };

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[860px] mx-auto px-4 sm:px-6 py-12"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Upgrade Your Plan</h1>
          <p className="text-sm text-slate-400">Get unlimited access to AI contract compliance checks.</p>
        </div>

        {step === 'select' ? (
          <>
            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PLANS.map(plan => {
                const Icon = plan.icon;
                const active = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      'relative text-left p-5 rounded-2xl border transition-all',
                      active ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/[0.06] bg-[#0B0B0E] hover:border-white/10'
                    )}
                  >
                    {plan.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-4', active ? 'bg-blue-500/20' : 'bg-white/5')}>
                      <Icon size={18} className={active ? 'text-blue-400' : 'text-slate-400'} />
                    </div>
                    <p className="font-semibold text-white mb-1">{plan.name}</p>
                    <p className="text-2xl font-black mb-3">
                      {plan.priceLabel ? plan.priceLabel : `₹${plan.price.toLocaleString()}`}
                      {!plan.priceLabel && <span className="text-sm font-normal text-slate-500 ml-1">/mo</span>}
                    </p>
                    <ul className="space-y-1.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle size={12} className="text-blue-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    {active && (
                      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                      selectedMethod === m.id ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/[0.06] bg-[#0B0B0E] hover:border-white/10'
                    )}
                  >
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 rounded-lg w-10 h-10 flex items-center justify-center shrink-0">{m.logo}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.label}</p>
                      <p className="text-xs text-slate-500">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & CTA */}
            <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{plan.name}</span>
                <span className="text-sm font-semibold text-white">
                  {plan.priceLabel || `₹${plan.price.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">GST (18%)</span>
                <span className="text-sm text-white">{plan.price ? `₹${Math.round(plan.price * 0.18).toLocaleString()}` : '—'}</span>
              </div>
              <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                <span className="font-semibold text-white">Total Due Today</span>
                <span className="text-xl font-bold text-white">
                  {plan.priceLabel ? 'Custom' : `₹${Math.round(plan.price * 1.18).toLocaleString()}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => plan.price > 0 ? setStep('checkout') : undefined}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
            >
              <Lock size={16} /> Proceed to Secure Payment <ChevronRight size={16} />
            </button>
            <p className="text-center text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
              <Shield size={12} /> Secured by {selectedMethod === 'razorpay' ? 'Razorpay' : 'Stripe'} · PCI DSS Compliant
            </p>
          </>
        ) : (
          /* Checkout Form */
          <div className="max-w-[440px]">
            <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={18} className="text-blue-400" />
                <h3 className="font-semibold">Card Details</h3>
                <Lock size={14} className="text-slate-500 ml-auto" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">CVC</label>
                    <input
                      type="text"
                      placeholder="•••"
                      className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Name on Card</label>
                  <input
                    type="text"
                    placeholder="Arjun Sharma"
                    className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-300">Amount to pay</span>
              <span className="font-bold text-white">₹{Math.round(plan.price * 1.18).toLocaleString()} (incl. GST)</span>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Processing...</>
              ) : (
                <><Lock size={16} /> Pay ₹{Math.round(plan.price * 1.18).toLocaleString()}</>
              )}
            </button>

            <button
              onClick={() => setStep('select')}
              className="w-full text-sm text-slate-500 hover:text-slate-300 mt-3 py-2 transition-colors"
            >
              ← Back to plan selection
            </button>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}