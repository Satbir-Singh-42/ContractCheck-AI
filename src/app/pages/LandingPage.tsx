import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Shield, FileText, AlertTriangle,
  ArrowRight, Upload, Zap, Lock, Share2, Download,
  Scale, FileSearch, ClipboardCheck, Gavel, Building2,
  Twitter, Github, Linkedin, ChevronRight, Check, Star, Users, BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PublicNavbar } from '../components/PublicNavbar';

// ─── Brand Logo ───────────────────────────────────────────────────────────────
function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div
      className="rounded-lg bg-blue-600 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <Shield size={size * 0.6} className="text-white" />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-8 uppercase tracking-wider"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </span>
        AI-Powered Contract Analysis for India
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-[900px] leading-[1.08] mb-6"
      >
        Stop Signing Contracts<br />
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">You Don't Understand.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg sm:text-xl text-slate-400 max-w-[620px] mb-10 leading-relaxed"
      >
        Upload any contract. Get a clause-by-clause risk breakdown against DPDP Act 2023, GST rules, Labour Laws &amp; Contract Act -- in under 30 seconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-wrap items-center justify-center gap-4 mb-10"
      >
        <Link
          to="/signup"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-full font-semibold transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] hover:scale-[1.02]"
        >
          <Upload size={17} /> Analyze Free Contract
        </Link>
        <Link
          to="/share/rep_12345"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
        >
          <FileText size={17} /> See Sample Report
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="text-xs text-slate-600"
      >
        Trusted by Indian startups, SMEs, and law firms. Not a substitute for legal advice.
      </motion.p>
    </section>
  );
}

// ─── Regulations Section ──────────────────────────────────────────────────────
const REGULATIONS = [
  {
    icon: Lock,
    name: 'DPDP Act 2023',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    desc: 'Checks for consent requirements, Data Fiduciary roles, third-party data sharing violations, and breach notification clauses.',
    tags: ['Consent', 'Data Fiduciary', 'Third-party sharing'],
  },
  {
    icon: Building2,
    name: 'GST / CGST Act 2017',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    desc: 'Validates GSTIN mandates on invoices, tax-exclusive payment language, ITC eligibility, and reverse charge mechanism clauses.',
    tags: ['GSTIN', 'ITC', 'Reverse Charge'],
  },
  {
    icon: Scale,
    name: 'Indian Contract Act 1872',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    desc: 'Identifies void clauses, unreasonable non-competes (Section 27), foreign jurisdiction conflicts, and arbitration gaps.',
    tags: ['Non-compete', 'Jurisdiction', 'Arbitration'],
  },
  {
    icon: Gavel,
    name: 'Labour Laws',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    desc: 'Reviews working hour limits, overtime compliance (Factories Act), gratuity clauses, and employee benefit obligations.',
    tags: ['Working Hours', 'Gratuity', 'Termination'],
  },
];

function RegulationsSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="text-center mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Shield size={11} /> Covered Regulations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            4 Laws. Every Clause. Zero Guesswork.
          </h2>
          <p className="text-slate-400 max-w-[560px] mx-auto">
            Our AI is trained on the latest Indian legislation. Each contract clause is mapped to the relevant law and scored for compliance risk.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REGULATIONS.map((reg, i) => {
          const Icon = reg.icon;
          return (
            <motion.div
              key={reg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn('rounded-2xl border p-6 transition-all hover:scale-[1.01] hover:shadow-lg', reg.border, reg.bg)}
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-black/20')}>
                  <Icon size={20} className={reg.color} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">{reg.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{reg.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {reg.tags.map(tag => (
                      <span key={tag} className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', reg.color, reg.border)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    num: '01',
    icon: Upload,
    title: 'Upload Your Contract',
    desc: 'Supports PDF, DOCX, and TXT files up to 10MB. Your document is processed securely in-memory.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    num: '02',
    icon: FileSearch,
    title: 'AI Clause Detection',
    desc: 'Our LangChain + RAG pipeline extracts every clause and maps it to relevant sections of Indian law.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    num: '03',
    icon: ClipboardCheck,
    title: 'Risk Scoring & Fixes',
    desc: 'Each clause is tagged Safe, Risky, or Non-compliant with AI-generated fix suggestions.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    num: '04',
    icon: Share2,
    title: 'Export & Share',
    desc: 'Download a PDF report or generate a shareable link for your client, legal team, or co-founder.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

function HowItWorksSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            From Upload to Report in 30 Seconds.
          </h2>
          <p className="text-slate-400 text-lg max-w-[580px] mx-auto">
            No manual review. No waiting days. Just instant, reliable AI analysis calibrated for Indian regulations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 hover:border-blue-500/30 hover:bg-[#0d0d12] transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-blue-400">{step.num}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap, title: 'Results in under 30s', desc: 'Powered by OpenAI + LangChain + FAISS vector search for fast, accurate retrieval.' },
  { icon: Shield, title: 'Indian Law Native', desc: 'Trained specifically on DPDP, GST, Contract Act, and Labour laws — not generic global law.' },
  { icon: AlertTriangle, title: 'Risk Color Coding', desc: 'Safe · Risky · Non-compliant. Instantly see where your exposure lies.' },
  { icon: Zap, title: 'AI Fix Suggestions', desc: 'Get specific, actionable rewrites for every non-compliant or risky clause.' },
  { icon: Download, title: 'PDF Export', desc: 'Download a clean, printable compliance report to share with stakeholders.' },
  { icon: Share2, title: 'Shareable Reports', desc: 'Generate a public link for clients or co-founders to view the report without logging in.' },
  { icon: Lock, title: 'Secure Processing', desc: 'Documents are processed in-memory. We never permanently store your legal files.' },
  { icon: FileText, title: 'Multi-format Support', desc: 'Works with PDF, DOCX, DOC, and TXT contracts up to 10MB.' },
];

function FeaturesGrid() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.05]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Everything you need for contract compliance.
        </h2>
        <p className="text-slate-400 max-w-[480px] mx-auto">
          No bloated features. Just the tools Indian businesses need to stay legally safe.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="bg-[#0B0B0E] border border-white/[0.06] p-6 rounded-2xl hover:border-white/[0.12] hover:bg-[#0f0f12] transition-all group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Icon size={18} className="text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{f.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Social Proof ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: 'We caught a DPDP non-compliance clause in our vendor contract before signing. Saved us from a potential liability.',
    name: 'Priya Nair',
    role: 'Co-founder, FinStack',
    avatar: 'PN',
  },
  {
    quote: 'Used ContractCheck on our standard employment contract. Found 3 Labour Law gaps we had no idea about. Fixed in minutes.',
    name: 'Rahul Mehta',
    role: 'HR Lead, BuildAI',
    avatar: 'RM',
  },
  {
    quote: 'Finally an AI tool that understands Indian law, not just US law. The GST clause checker alone is worth it.',
    name: 'Ananya Krishnan',
    role: 'Advocate, Delhi HC',
    avatar: 'AK',
  },
];

function SocialProof() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.05]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Trusted by Indian founders, lawyers &amp; HR teams.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[240px] bg-blue-500/15 blur-[80px] rounded-full pointer-events-none sm:w-[800px] sm:h-[400px] sm:blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)]">
          <Shield size={28} className="text-white" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Stop signing risky<br />contracts blindly.
        </h2>
        <p className="text-lg text-slate-400 max-w-[520px] mb-8">
          Get your first 3 contract analyses free. No credit card. No lawyers needed upfront.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] text-lg"
          >
            <Upload size={20} /> Analyze Your Contract Free
          </Link>
          <Link
            to="/pricing"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 transition-colors text-lg"
          >
            See Pricing <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const handleFooterLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  return (
    <footer className="border-t border-white/[0.05] bg-[#060608] pt-12 sm:pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
          <div className="max-w-[260px]">
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo size={28} />
              <span className="font-bold text-lg tracking-tight">ContractCheck</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI-powered contract compliance for Indian businesses. Built with DPDP, GST, Labour Laws &amp; Contract Act in mind.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white mb-1">Product</span>
              <Link to="/pricing" onClick={handleFooterLinkClick} className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/upload" onClick={handleFooterLinkClick} className="text-slate-400 hover:text-white transition-colors">Analyze Contract</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white mb-1">Regulations</span>
              <span className="text-slate-400">DPDP Act 2023</span>
              <span className="text-slate-400">GST / CGST Act</span>
              <span className="text-slate-400">Contract Act 1872</span>
              <span className="text-slate-400">Labour Laws</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white mb-1">Company</span>
              <Link to="/about" onClick={handleFooterLinkClick} className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" onClick={handleFooterLinkClick} className="text-slate-400 hover:text-white transition-colors">Contact</Link>
              <Link to="/privacy" onClick={handleFooterLinkClick} className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05] text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} ContractCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-5 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors"><Twitter size={16} /></a>
            <a href="#" className="hover:text-slate-300 transition-colors"><Github size={16} /></a>
            <a href="#" className="hover:text-slate-300 transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          ContractCheck is an AI tool and does not provide legal advice. Always consult a qualified advocate for legal matters.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30 overflow-x-clip">
      {/* Background glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-3/4 h-1/2 rounded-full bg-blue-600/[0.08] blur-[90px] sm:w-1/2 sm:blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-3/5 h-2/5 rounded-full bg-blue-500/[0.05] blur-[75px] sm:w-2/5 sm:blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col">
        <PublicNavbar />

        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
          <RegulationsSection />
          <HowItWorksSection />
          <FeaturesGrid />
          <SocialProof />
        </main>

        <BottomCTA />
        <Footer />
      </div>
    </div>
  );
}