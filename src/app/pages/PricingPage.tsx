import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle, Zap, Building2, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';

const getPlans = (isAnnual: boolean) => [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for trying out the platform.',
    icon: Shield,
    color: 'slate',
    features: [
      '3 contract analyses/month',
      'Basic clause detection',
      'DPDP & GST checks',
      'Risk color coding',
      'Email support',
    ],
    cta: 'Get Started Free',
    popular: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: isAnnual ? '₹8,999' : '₹999',
    period: isAnnual ? 'per year' : 'per month',
    description: 'For freelancers and small businesses.',
    icon: Zap,
    color: 'blue',
    features: [
      '50 contract analyses/month',
      'All regulations: DPDP, GST, Labour, Contract Act',
      'AI-powered fix suggestions',
      'PDF export & shareable links',
      'Priority support',
      'Clause history & versioning',
    ],
    cta: 'Start Pro Plan',
    popular: true,
    badge: isAnnual ? 'Save 25%' : 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per year',
    description: 'For law firms and large organizations.',
    icon: Building2,
    color: 'purple',
    features: [
      'Unlimited analyses',
      'Custom regulation sets',
      'API access',
      'Team collaboration',
      'Dedicated account manager',
      'SLA & data residency',
    ],
    cta: 'Contact Sales',
    popular: false,
    badge: null,
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; btn: string; badge: string }> = {
  slate: {
    border: 'border-white/[0.07]',
    bg: 'bg-[#0B0B0E]',
    text: 'text-slate-300',
    btn: 'bg-white/10 hover:bg-white/15 text-white',
    badge: '',
  },
  blue: {
    border: 'border-blue-500/40',
    bg: 'bg-[#0C0F1A]',
    text: 'text-blue-300',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]',
    badge: 'Most Popular',
  },
  purple: {
    border: 'border-purple-500/30',
    bg: 'bg-[#0D0B14]',
    text: 'text-purple-300',
    btn: 'bg-purple-600 hover:bg-purple-500 text-white',
    badge: '',
  },
};

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleCta = (plan: string) => {
    if (plan === 'Free') {
      navigate(user ? '/upload' : '/signup');
    } else if (plan === 'Pro') {
      navigate(user ? '/payment' : '/signup');
    } else {
      // Contact sales
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060608] text-white relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[220px] rounded-full bg-blue-600/8 blur-[80px] pointer-events-none sm:w-[800px] sm:h-[400px] sm:blur-[120px]" />

      <PublicNavbar />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20"
      >
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-[500px] mx-auto mb-6 sm:mb-8">
            Start free. Scale as your compliance needs grow. Cancel anytime.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span 
              className={cn('text-sm font-medium transition-colors cursor-pointer', !isAnnual ? 'text-white' : 'text-slate-500')} 
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 relative flex items-center px-1 cursor-pointer transition-colors shadow-inner focus:outline-none"
            >
              <div className={cn('w-4 h-4 rounded-full bg-blue-400 transition-all shadow-sm', isAnnual ? 'translate-x-6' : 'translate-x-0')} />
            </button>
            <span 
              className={cn('text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer flex-wrap justify-center', isAnnual ? 'text-white' : 'text-slate-500')} 
              onClick={() => setIsAnnual(true)}
            >
              Annually <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {getPlans(isAnnual).map((plan) => {
            const c = colorMap[plan.color] || colorMap.slate;
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={cn(
                  'relative min-w-0 rounded-2xl border p-6 sm:p-8 flex flex-col',
                  c.border, c.bg,
                  plan.popular && 'md:-translate-y-4 shadow-[0_0_60px_-10px_rgba(37,99,235,0.2)]'
                )}
              >
                {(plan.badge || c.badge) && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-xs font-bold text-white whitespace-nowrap">
                    {plan.badge || c.badge}
                  </div>
                )}

                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', `bg-${plan.color}-500/10`)}>
                  <Icon size={20} className={c.text} />
                </div>

                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-slate-500 ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 break-words">
                      <CheckCircle size={15} className={cn('mt-0.5 shrink-0', c.text)} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCta(plan.name)}
                  className={cn('w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm', c.btn)}
                >
                  {plan.cta} <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Row */}
        <div className="mt-14 sm:mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          {[
            { q: 'Is my data secure?', a: 'All documents are processed in-memory and never stored permanently without your permission.' },
            { q: 'Can I upgrade later?', a: 'Yes. Upgrade or downgrade at any time. Billing is prorated automatically.' },
            { q: 'What regulations are covered?', a: 'DPDP Act 2023, GST/CGST Act, Indian Contract Act 1872, and Labour Laws.' },
          ].map(({ q, a }, i) => (
            <div key={i} className="text-left">
              <p className="font-semibold text-white mb-2">{q}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}