import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Zap, Building2, Shield, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLayout } from '../components/AppLayout';
import { useTopNavigate } from '../hooks/useTopNavigate';
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
    periodLabel: '/yr',
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
  {
    id: 'razorpay',
    label: 'Razorpay',
    desc: 'UPI, Cards, Net Banking',
    logoSrc: '/razorpay.png',
    logoAlt: 'Razorpay logo',
    logoWrapClass: 'bg-white rounded-lg w-10 h-10',
    logoClass: 'object-cover',
  },
  {
    id: 'stripe',
    label: 'Stripe',
    desc: 'International Cards',
    logoSrc: '/stripe.png',
    logoAlt: 'Stripe logo',
    logoWrapClass: 'bg-white rounded-lg w-10 h-10',
    logoClass: 'object-cover',
  },
];

export function PaymentPage() {
  const navigate = useTopNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'checkout'>('select');

  const forceTopScroll = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Re-assert on next frame for browsers that restore previous scroll.
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  React.useEffect(() => {
    forceTopScroll();
  }, [step, forceTopScroll]);

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const selectedMethodInfo = PAYMENT_METHODS.find(m => m.id === selectedMethod) ?? PAYMENT_METHODS[0];
  const gstAmount = plan.price ? Math.round(plan.price * 0.18) : 0;
  const totalDue = plan.price ? plan.price + gstAmount : 0;
  const isPaidPlan = plan.price > 0;

  const handlePay = async () => {
    setLoading(true);
    // Simulate payment gateway call
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    // Mock success
    navigate('/success');
  };

  const handleContinue = () => {
    if (isPaidPlan) {
      setStep('checkout');
      return;
    }
    navigate('/contact');
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-[980px] mx-auto px-4 sm:px-6 py-10 sm:py-12"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-36 -left-12 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Upgrade Your Plan</h1>
            <p className="text-sm text-slate-400">Choose a plan and complete checkout in under a minute.</p>
          </div>
          <span className="inline-flex h-9 items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 text-xs font-semibold text-blue-300">
            {step === 'select' ? 'Step 1/2: Select plan' : 'Step 2/2: Secure checkout'}
          </span>
        </div>

        {step === 'select' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => {
                  const Icon = plan.icon;
                  const active = selectedPlan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        'relative overflow-hidden text-left p-5 rounded-2xl border transition-all duration-300',
                        active
                          ? 'border-blue-500/60 bg-gradient-to-b from-blue-500/15 to-blue-500/5 shadow-[0_18px_60px_-34px_rgba(37,99,235,0.85)]'
                          : 'border-white/[0.08] bg-[#090B12]/85 hover:border-white/20 hover:bg-[#0D1220]'
                      )}
                    >
                      {plan.badge && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}

                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', active ? 'bg-blue-500/20' : 'bg-white/5')}>
                        <Icon size={18} className={active ? 'text-blue-300' : 'text-slate-400'} />
                      </div>

                      <p className="font-semibold text-white mb-1">{plan.name}</p>
                      <p className="text-2xl font-black mb-3">
                        {plan.priceLabel ? plan.priceLabel : `₹${plan.price.toLocaleString()}`}
                        {!plan.priceLabel && (
                          <span className="text-sm font-normal text-slate-500 ml-1">{(plan as any).periodLabel || '/mo'}</span>
                        )}
                      </p>

                      <ul className="space-y-1.5">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle size={12} className="text-blue-400 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {active && (
                        <div className="mt-4 inline-flex items-center rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-[10px] font-semibold text-blue-200">
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-[#090B12]/90 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">Payment Method</h3>
                  <span className="text-[11px] text-slate-500">Switch anytime before payment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(m => {
                    const active = selectedMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300',
                          active
                            ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/15 to-blue-500/5'
                            : 'border-white/[0.08] bg-[#0B101D] hover:border-white/20 hover:bg-[#10182B]'
                        )}
                      >
                        <span className={cn('flex items-center justify-center shrink-0 overflow-hidden', m.logoWrapClass)}>
                          <img
                            src={m.logoSrc}
                            alt={m.logoAlt}
                            className={cn('w-full h-full', m.logoClass)}
                            loading="lazy"
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{m.label}</p>
                          <p className="text-xs text-slate-400 truncate">{m.desc}</p>
                        </div>

                        <CheckCircle
                          size={14}
                          className={cn('ml-auto shrink-0 transition-opacity', active ? 'text-blue-400 opacity-100' : 'text-slate-700 opacity-0')}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-blue-500/25 bg-gradient-to-b from-blue-500/12 to-[#0A1020] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-blue-300/80 mb-3">Order Summary</p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{plan.name}</span>
                  <span className="text-sm font-semibold text-white">{plan.priceLabel || `₹${plan.price.toLocaleString()}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">GST (18%)</span>
                  <span className="text-sm text-white">{plan.price ? `₹${gstAmount.toLocaleString()}` : 'Included'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.1] pt-3">
                  <span className="font-semibold text-white">Total Due</span>
                  <span className="text-xl font-black text-white">{plan.priceLabel ? 'Custom' : `₹${totalDue.toLocaleString()}`}</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.1] bg-[#0D1528] p-3 mb-5 flex items-center gap-3">
                <span
                  className={cn('flex items-center justify-center shrink-0 overflow-hidden', selectedMethodInfo.logoWrapClass)}
                >
                  <img
                    src={selectedMethodInfo.logoSrc}
                    alt={selectedMethodInfo.logoAlt}
                    className={cn('w-full h-full', selectedMethodInfo.logoClass)}
                    loading="lazy"
                  />
                </span>
                <div>
                  <p className="text-xs text-slate-400">Pay using</p>
                  <p className="text-sm font-semibold text-white">{selectedMethodInfo.label}</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.9)]"
              >
                {isPaidPlan ? (
                  <>
                    <Lock size={16} /> Continue to Secure Payment <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    Contact Sales <ChevronRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
                <Shield size={12} /> End-to-end encrypted checkout and PCI DSS compliance.
              </p>
            </aside>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
            <div>
              <div className="bg-[#090B12]/90 border border-white/[0.08] rounded-2xl p-6 mb-5">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-blue-400" />
                    <h3 className="font-semibold text-white">Card Details</h3>
                  </div>

                  <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#10182B] px-3 py-1.5">
                    <span
                      className={cn('flex items-center justify-center shrink-0 overflow-hidden', selectedMethodInfo.logoWrapClass)}
                    >
                      <img
                        src={selectedMethodInfo.logoSrc}
                        alt={selectedMethodInfo.logoAlt}
                        className={cn('w-full h-full', selectedMethodInfo.logoClass)}
                        loading="lazy"
                      />
                    </span>
                    <span className="text-xs font-medium text-slate-200">{selectedMethodInfo.label}</span>
                  </div>

                  <Lock size={14} className="text-slate-500" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-[#111625] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-colors font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full bg-[#111625] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">CVC</label>
                      <input
                        type="text"
                        placeholder="***"
                        className="w-full bg-[#111625] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Name on Card</label>
                    <input
                      type="text"
                      placeholder="Arjun Sharma"
                      className="w-full bg-[#111625] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-4 mb-5 flex items-center justify-between">
                <span className="text-sm text-slate-200">Amount to pay</span>
                <span className="font-bold text-white">₹{totalDue.toLocaleString()} (incl. GST)</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_20px_50px_-30px_rgba(6,182,212,0.9)]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Pay ₹{totalDue.toLocaleString()}
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('select')}
                className="w-full text-sm text-slate-500 hover:text-slate-300 mt-3 py-2 transition-colors"
              >
                Back to plan selection
              </button>
            </div>

            <aside className="h-fit bg-[#090B12]/90 border border-white/[0.08] rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-3">Checkout Summary</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Plan</span>
                  <span className="text-sm font-semibold text-white">{plan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Gateway</span>
                  <span className="text-sm font-semibold text-white">{selectedMethodInfo.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Subtotal</span>
                  <span className="text-sm text-white">₹{plan.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">GST (18%)</span>
                  <span className="text-sm text-white">₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/[0.08] pt-3 flex items-center justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-lg font-black text-white">₹{totalDue.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 mt-5">
                <p className="text-xs text-emerald-200">Includes a 7-day money-back guarantee for your first payment.</p>
              </div>

              <p className="text-xs text-slate-500 mt-4 flex items-center gap-1">
                <Shield size={12} className="shrink-0" />
                Your card details are encrypted and never stored in plain text.
              </p>
            </aside>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}