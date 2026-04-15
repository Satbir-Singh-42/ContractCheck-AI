import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Shield, Upload, ArrowRight, Lock, Scale, Gavel, Building2,
  FileSearch, Brain, Database, Users,
  CheckCircle, Code, Briefcase, TrendingUp, Eye,
  Twitter, Github, Linkedin,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PublicNavbar } from '../components/PublicNavbar';

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-lg bg-blue-600 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <Shield size={size * 0.6} className="text-white" />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pt-24 pb-20 flex flex-col items-center text-center relative overflow-hidden">
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
        About ContractCheck AI
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">COMPLIANCE</h1>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30">INTELLIGENCE.</h1>
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-base sm:text-lg md:text-xl text-slate-400 max-w-[700px] mb-4 leading-relaxed px-2 sm:px-0">
        ContractCheck AI is not a chatbot. It is a{' '}
        <span className="text-white font-medium">Legal Compliance Engine</span>{' '}
        designed to analyze contracts against Indian regulations and deliver actionable risk intelligence.
      </motion.p>
    </section>
  );
}

// ─── Core Capabilities ────────────────────────────────────────────────────────
const ARCH_ITEMS = [
  { icon: Brain, label: 'OpenAI GPT-4 powered analysis' },
  { icon: Database, label: 'FAISS vector search for legal retrieval' },
  { icon: Code, label: 'LangChain RAG pipeline' },
  { icon: FileSearch, label: 'Clause-level granular parsing' },
];

const OUTPUT_STATS = [
  { value: '<30s', label: 'Analysis Time' },
  { value: '4', label: 'Laws Covered' },
  { value: '3', label: 'Risk Levels' },
];

const OUTPUT_CARDS = [
  { label: 'PDF Export', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  { label: 'Shareable Links', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { label: 'AI Fix Suggestions', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
];

function CoreCapabilities() {
  return (
    <section className="py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Operational Capabilities</h2>
        <p className="text-slate-400 max-w-[600px]">Built from the ground up for Indian legal compliance. Every component is purpose-engineered for accuracy and speed.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4 }} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-8 hover:border-blue-500/20 transition-all">
          <h3 className="font-bold text-white text-lg mb-6">Architecture & Pipeline</h3>
          <div className="space-y-4">
            {ARCH_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"><Icon size={16} className="text-blue-400" /></div>
                  <span className="text-sm text-slate-300">{item.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs text-slate-500"><Shield size={12} className="text-blue-400" /><span>Python + FastAPI Backend</span></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-8 hover:border-blue-500/20 transition-all">
          <h3 className="font-bold text-white text-lg mb-6">Output & Reporting</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {OUTPUT_STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-[11px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {OUTPUT_CARDS.map((card, i) => (
              <span key={i} className={cn('text-xs font-semibold px-3 py-1.5 rounded-full border', card.color)}>{card.label}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────
const USE_CASES = [
  { title: 'For Startups', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', items: ['Vendor contract compliance', 'DPDP Act data handling checks', 'Investor agreement review', 'Non-compete validity (Section 27)', 'SaaS terms of service audit'] },
  { title: 'For Law Firms', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', items: ['Bulk contract screening', 'Multi-regulation coverage', 'Client-ready PDF reports', 'Shareable compliance links', 'Clause risk annotation'] },
  { title: 'For Enterprise', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', items: ['Procurement contract review', 'GST/CGST clause validation', 'Employee agreement compliance', 'Vendor onboarding checks', 'Regulatory audit readiness'] },
  { title: 'For HR Teams', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', items: ['Employment contract analysis', 'Labour law compliance', 'Working hours & overtime checks', 'Gratuity & benefits clauses', 'Termination clause review'] },
  { title: 'For Finance', icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', items: ['Payment terms analysis', 'GST invoice requirements', 'ITC eligibility checks', 'Reverse charge compliance', 'Financial penalty clauses'] },
  { title: 'For Compliance Officers', icon: Eye, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', items: ['Data protection audits', 'Cross-border data flow checks', 'Consent mechanism review', 'Breach notification clauses', 'Third-party sharing assessment'] },
];

function UseCasesSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-white/[0.05]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Sector-Specific Intelligence</h2>
        <p className="text-slate-400 max-w-[600px]">Whether you are a startup founder, advocate, or compliance officer -- ContractCheck AI adapts to your regulatory needs.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {USE_CASES.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <motion.div key={uc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', uc.bg)}><Icon size={20} className={uc.color} /></div>
                <h3 className="font-bold text-white">{uc.title}</h3>
              </div>
              <div className="space-y-3">
                {uc.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className={cn('mt-0.5 shrink-0', uc.color)} />
                    <span className="text-sm text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Regulations ──────────────────────────────────────────────────────────────
const REGULATIONS = [
  { icon: Lock, name: 'DPDP Act 2023', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', desc: 'Consent requirements, Data Fiduciary roles, third-party sharing, breach notification.' },
  { icon: Building2, name: 'GST / CGST Act', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', desc: 'GSTIN mandates, ITC eligibility, reverse charge mechanism, tax-exclusive clauses.' },
  { icon: Scale, name: 'Contract Act 1872', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', desc: 'Void clauses, non-compete validity, jurisdiction conflicts, arbitration gaps.' },
  { icon: Gavel, name: 'Labour Laws', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', desc: 'Working hours, overtime, gratuity, employee benefits, termination compliance.' },
];

function RegulationsSection() {
  return (
    <section className="py-16 sm:py-24 border-t border-white/[0.05]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Regulations We Cover</h2>
        <p className="text-slate-400 max-w-[560px] mx-auto">Purpose-built for Indian law. Every clause is cross-referenced against the latest legislation.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REGULATIONS.map((reg, i) => {
          const Icon = reg.icon;
          return (
            <motion.div key={reg.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.4, delay: i * 0.1 }} className={cn('rounded-2xl border p-6 transition-all hover:scale-[1.02]', reg.border, reg.bg)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 mb-4"><Icon size={20} className={reg.color} /></div>
              <h3 className="font-bold text-white mb-2">{reg.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{reg.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/15 blur-[150px] rounded-full pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 flex flex-col md:flex-row items-start gap-6 sm:gap-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-2">
              BEYOND{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">THE</span><br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">FINE</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-white/60">PRINT.</span><br />
              <span className="text-white/30">INTO</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">CLARITY.</span>
            </h2>
          </div>
          <div className="relative z-10 flex-1 flex flex-col gap-6">
            <p className="text-slate-400 leading-relaxed">ContractCheck AI represents the shift from manual, error-prone contract review to intelligent, regulation-aware compliance analysis. Built for Indian businesses. Powered by AI.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)]">
                <Upload size={17} /> Start Analyzing Free
              </Link>
              <Link to="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 transition-colors">
                View Pricing <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#060608] pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
          <div className="max-w-[260px]">
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo size={28} />
              <span className="font-bold text-lg tracking-tight">ContractCheck</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">AI-powered contract compliance for Indian businesses. Built with DPDP, GST, Labour Laws & Contract Act in mind.</p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white mb-1">Product</span>
              <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/upload" className="text-slate-400 hover:text-white transition-colors">Analyze Contract</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-white mb-1">Company</span>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
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
        <p className="text-center text-xs text-slate-700 mt-6">ContractCheck is an AI tool and does not provide legal advice. Always consult a qualified advocate for legal matters.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full bg-blue-600/[0.08] blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-2/5 h-2/5 rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>
      <div className="relative z-10 flex flex-col">
        <PublicNavbar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <CoreCapabilities />
          <UseCasesSection />
          <RegulationsSection />
        </main>
        <BottomCTA />
        <Footer />
      </div>
    </div>
  );
}