import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  Shield, Upload, ArrowRight, Lock, Scale, Gavel, Building2,
  FileSearch, Brain, Database, Users,
  CheckCircle, Code, Briefcase, TrendingUp, Eye,
  Twitter, Github, Linkedin, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { PublicNavbar } from '../components/PublicNavbar';

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.6)]" style={{ width: size, height: size }}>
      <Shield size={size * 0.55} className="text-white" />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pt-20 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 lg:pb-24 flex flex-col items-center text-center relative overflow-visible">
      {/* Dynamic background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none sm:w-[600px] sm:h-[600px] sm:blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold mb-8 uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </span>
        About ContractCheck AI
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }} className="mb-10 relative">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] drop-shadow-2xl">
          COMPLIANCE
        </h1>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 pb-2">
          INTELLIGENCE.
        </h1>
      </motion.div>

      <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-[800px] mb-6 leading-relaxed px-4 font-light">
        ContractCheck AI is not a chatbot. It is a{' '}
        <span className="text-white font-medium bg-white/5 px-3 py-1 rounded-lg border border-white/10 shadow-inner">Legal Compliance Engine</span>{' '}
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
  { value: '30s', label: 'Analysis Time' },
  { value: '4', label: 'Laws Covered' },
  { value: '3', label: 'Risk Levels' },
];

const OUTPUT_CARDS = [
  { label: 'PDF Export', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
  { label: 'Shareable Links', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  { label: 'AI Fix Suggestions', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
];

function CoreCapabilities() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 relative z-10">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="mb-16 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Operational Capabilities</h2>
        <p className="text-slate-400 max-w-[650px] text-lg leading-relaxed">Built from the ground up for Indian legal compliance. Every component is purpose-engineered for true accuracy and speed.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, margin: '-50px' }} 
          transition={{ duration: 0.6 }} 
          className="bg-gradient-to-b from-white/[0.03] to-[#060608] border border-white/[0.08] rounded-3xl p-8 md:p-10 hover:border-blue-500/30 transition-all duration-500 group shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Code size={24} className="text-blue-400" />
            </div>
            <h3 className="font-bold text-white text-2xl tracking-tight">Architecture & Pipeline</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            {ARCH_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.02] group-hover:border-white/[0.06] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center shrink-0 shadow-sm border border-white/[0.02]"><Icon size={18} className="text-blue-400" /></div>
                  <span className="text-base font-medium text-slate-300">{item.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center gap-3 relative z-10">
            <Shield size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Python + FastAPI Backend</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, margin: '-50px' }} 
          transition={{ duration: 0.6, delay: 0.1 }} 
          className="bg-gradient-to-b from-white/[0.03] to-[#060608] border border-white/[0.08] rounded-3xl p-8 md:p-10 hover:border-blue-500/30 transition-all duration-500 group shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <FileSearch size={24} className="text-purple-400" />
            </div>
            <h3 className="font-bold text-white text-2xl tracking-tight">Output & Reporting</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
            {OUTPUT_STATS.map((stat, i) => (
              <div key={i} className="bg-[#0B0B0E]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 text-center group-hover:bg-white/[0.04] transition-colors relative overflow-hidden shadow-sm">
                <div className="text-3xl font-black text-white mb-2 tracking-tighter drop-shadow-md">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-400 mb-5 relative z-10">Deliverables are presented securely and cleanly:</p>
          <div className="flex flex-wrap gap-3 relative z-10">
            {OUTPUT_CARDS.map((card, i) => (
              <span key={i} className={cn('text-sm font-bold px-4 py-2 rounded-xl border transition-all duration-300 cursor-default bg-[#0B0B0E] shadow-sm', card.color)}>{card.label}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────
const USE_CASES = [
  { title: 'For Startups', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', hoverBorder: 'group-hover:border-blue-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]', items: ['Vendor contract compliance', 'DPDP Act data handling checks', 'Investor agreement review', 'Non-compete validity (Section 27)', 'SaaS terms of service audit'] },
  { title: 'For Law Firms', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', hoverBorder: 'group-hover:border-purple-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]', items: ['Bulk contract screening', 'Multi-regulation coverage', 'Client-ready PDF reports', 'Shareable compliance links', 'Clause risk annotation'] },
  { title: 'For Enterprise', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', hoverBorder: 'group-hover:border-amber-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]', items: ['Procurement contract review', 'GST/CGST clause validation', 'Employee agreement compliance', 'Vendor onboarding checks', 'Regulatory audit readiness'] },
  { title: 'For HR Teams', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', hoverBorder: 'group-hover:border-emerald-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]', items: ['Employment contract analysis', 'Labour law compliance', 'Working hours & overtime checks', 'Gratuity & benefits clauses', 'Termination clause review'] },
  { title: 'For Finance', icon: Briefcase, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hoverBorder: 'group-hover:border-cyan-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]', items: ['Payment terms analysis', 'GST invoice requirements', 'ITC eligibility checks', 'Reverse charge compliance', 'Financial penalty clauses'] },
  { title: 'For Compliance Officers', icon: Eye, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', hoverBorder: 'group-hover:border-rose-500/40', hoverShadow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]', items: ['Data protection audits', 'Cross-border data flow checks', 'Consent mechanism review', 'Breach notification clauses', 'Third-party sharing assessment'] },
];

function UseCasesSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.05] relative z-10 mt-8 sm:mt-12">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="mb-16 flex flex-col justify-center items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Sector-Specific Intelligence</h2>
        <p className="text-slate-400 max-w-[700px] text-lg leading-relaxed">Whether you are a startup founder, advocate, or compliance officer — ContractCheck AI adapts seamlessly to your unique regulatory needs.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {USE_CASES.map((uc, i) => {
          const Icon = uc.icon;
          return (
            <motion.div 
              key={uc.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: '-50px' }} 
              transition={{ duration: 0.5, delay: i * 0.05 }} 
              className={cn("bg-[#0B0B0E] border border-white/[0.06] rounded-3xl p-8 transition-all duration-500 group relative overflow-hidden shadow-lg hover:-translate-y-1", uc.hoverBorder, uc.hoverShadow)}
            >
              <div className={cn("absolute -right-20 -top-20 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", uc.bg)} />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 shadow-inner', uc.bg, uc.border)}><Icon size={26} className={uc.color} /></div>
                <h3 className="font-bold text-white text-xl">{uc.title}</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {uc.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 group/item">
                    <CheckCircle size={18} className={cn('mt-0.5 shrink-0 transition-opacity opacity-50 group-hover/item:opacity-100', uc.color)} />
                    <span className="text-sm font-medium text-slate-400 group-hover/item:text-slate-200 transition-colors leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Regulations ──────────────────────────────────────────────────────────────
const REGULATIONS = [
  { icon: Lock, name: 'DPDP Act 2023', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', hoverBg: 'hover:bg-purple-500/5', shadow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]', desc: 'Consent requirements, Data Fiduciary roles, third-party sharing, breach notification.' },
  { icon: Building2, name: 'GST / CGST Act', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', hoverBg: 'hover:bg-amber-500/5', shadow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]', desc: 'GSTIN mandates, ITC eligibility, reverse charge mechanism, tax-exclusive clauses.' },
  { icon: Scale, name: 'Contract Act 1872', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', hoverBg: 'hover:bg-blue-500/5', shadow: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]', desc: 'Void clauses, non-compete validity, jurisdiction conflicts, arbitration gaps.' },
  { icon: Gavel, name: 'Labour Laws', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', hoverBg: 'hover:bg-emerald-500/5', shadow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]', desc: 'Working hours, overtime, gratuity, employee benefits, termination compliance.' },
];

function RegulationsSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-t border-white/[0.05] mt-8 sm:mt-12">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }} className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Regulations We Cover</h2>
        <p className="text-slate-400 max-w-[650px] mx-auto text-lg leading-relaxed">Purpose-built for Indian law. Every single clause is meticulously cross-referenced against the latest legislation to ensure absolute compliance.</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REGULATIONS.map((reg, i) => {
          const Icon = reg.icon;
          return (
            <motion.div 
              key={reg.name} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: '-50px' }} 
              transition={{ duration: 0.5, delay: i * 0.1 }} 
              className={cn('rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-2 group cursor-default relative overflow-hidden bg-white/[0.02] backdrop-blur-md shadow-lg', reg.border, reg.shadow, reg.hoverBg)}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-white/[0.03] to-transparent" />
              
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#060608] border border-white/[0.08] mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Icon size={30} className={reg.color} />
              </div>
              <h3 className="font-bold text-white text-xl mb-3 tracking-tight relative z-10">{reg.name}</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors relative z-10">{reg.desc}</p>
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
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden mt-8 sm:mt-12">
      <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-blue-600/5 to-[#060608] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[240px] bg-blue-600/15 blur-[80px] rounded-full pointer-events-none sm:w-[800px] sm:h-[400px] sm:blur-[150px]" />
      
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0B0E] border border-white/[0.08] rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center gap-10 sm:gap-16 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5 pointer-events-none" />
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-blue-500/20 blur-[100px] pointer-events-none opacity-50" />
          
          <div className="relative z-10 flex-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-4">
              BEYOND{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">THE</span><br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">FINE</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-white/60">PRINT.</span><br />
              <span className="text-white/30">INTO</span>{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">CLARITY.</span>
            </h2>
          </div>
          <div className="relative z-10 flex-1 flex flex-col gap-8 md:pl-10 lg:border-l border-white/[0.08]">
            <p className="text-slate-300 text-lg leading-relaxed font-light">ContractCheck AI represents the monumental shift from manual, error-prone contract review to intelligent, regulation-aware compliance analysis. Built exclusively for Indian businesses. Powered by AI.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:-translate-y-1 w-full sm:w-auto whitespace-nowrap">
                <Upload size={22} /> Start Analyzing Free
              </Link>
              <Link to="/pricing" className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 w-full sm:w-auto whitespace-nowrap">
                View Pricing <ArrowRight size={22} />
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
  const handleFooterLinkClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  return (
    <footer className="border-t border-white/[0.05] bg-[#060608] pt-12 sm:pt-20 pb-8 sm:pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-20">
          <div className="max-w-[300px]">
            <div className="flex items-center gap-3 mb-6">
              <BrandLogo size={34} />
              <span className="font-black text-2xl tracking-tighter">ContractCheck</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">AI-powered contract compliance for Indian businesses. Built strictly with DPDP, GST, Labour Laws & Contract Act in mind.</p>
          </div>
          <div className="flex flex-wrap gap-x-20 gap-y-10 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white mb-2 uppercase tracking-wider text-xs">Product</span>
              <Link to="/pricing" onClick={handleFooterLinkClick} className="text-slate-400 font-medium hover:text-blue-400 transition-colors">Pricing Options</Link>
              <Link to="/upload" onClick={handleFooterLinkClick} className="text-slate-400 font-medium hover:text-blue-400 transition-colors">Analyze Contract</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-white mb-2 uppercase tracking-wider text-xs">Company</span>
              <Link to="/about" onClick={handleFooterLinkClick} className="text-slate-400 font-medium hover:text-blue-400 transition-colors">About Us</Link>
              <Link to="/privacy" onClick={handleFooterLinkClick} className="text-slate-400 font-medium hover:text-blue-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.05] text-sm text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} ContractCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-6 md:mt-0">
            <a href="#" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><Twitter size={18} /></a>
            <a href="#" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><Github size={18} /></a>
            <a href="#" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><Linkedin size={18} /></a>
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-8 font-medium">ContractCheck is an AI tool and does not provide legal advice. Always consult a qualified advocate for legal matters.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30 overflow-x-clip">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-3/4 h-1/2 rounded-full bg-blue-600/[0.05] blur-[90px] sm:w-1/2 sm:blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-3/5 h-2/5 rounded-full bg-purple-600/[0.03] blur-[75px] sm:w-2/5 sm:blur-[130px]" />
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