import React, { useState, useEffect } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { cn } from '../../lib/utils';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you use ContractCheck AI, we collect the following types of information:

**Account Information:** Name, email address, and password when you create an account.

**Uploaded Documents:** Contracts and legal documents you upload for analysis. These are processed in-memory and are not permanently stored on our servers unless you explicitly save a report.

**Usage Data:** Pages visited, features used, timestamps, device type, browser type, and IP address for analytics and service improvement.

**Payment Information:** If you subscribe to a paid plan, payment details are processed securely through our third-party payment processor (Razorpay). We do not store your full card details.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- Provide, maintain, and improve ContractCheck AI services
- Process and analyze your uploaded contracts using our AI pipeline
- Generate compliance reports and risk assessments
- Send you service-related communications and updates
- Process payments for premium subscriptions
- Detect and prevent fraud, abuse, or security issues
- Comply with legal obligations under Indian law`,
  },
  {
    title: '3. Document Processing & Data Security',
    content: `**In-Memory Processing:** Your uploaded contracts are processed in-memory using our AI analysis pipeline. Documents are not written to persistent storage during analysis.

**Report Storage:** Generated compliance reports are stored in encrypted form if you choose to save them. You can delete saved reports at any time from your dashboard.

**Encryption:** All data in transit is encrypted using TLS 1.3. Data at rest is encrypted using AES-256 encryption.

**Access Controls:** Strict role-based access controls ensure that only authorized systems can process your documents. Our engineering team does not have access to your uploaded documents or reports.`,
  },
  {
    title: '4. Data Sharing & Third Parties',
    content: `We do not sell, rent, or trade your personal information. We may share data with:

**AI Processing Partners:** OpenAI and/or Anthropic for contract clause analysis. Documents are sent via encrypted API calls and are subject to their respective data processing agreements. These providers do not retain your data for training purposes.

**Payment Processors:** Razorpay for handling subscription payments, subject to their privacy policy.

**Cloud Infrastructure:** AWS / Google Cloud for hosting, with data centers located in India (Mumbai region) to comply with data localization preferences.

**Legal Requirements:** We may disclose information if required by Indian law, court order, or government authority.`,
  },
  {
    title: '5. Your Rights Under DPDP Act 2023',
    content: `As a Data Principal under the Digital Personal Data Protection Act, 2023, you have the right to:

- **Access:** Request a summary of your personal data we process
- **Correction:** Request correction of inaccurate or incomplete personal data
- **Erasure:** Request deletion of your personal data, subject to legal retention requirements
- **Grievance Redressal:** File a complaint with our Data Protection Officer or the Data Protection Board of India
- **Nomination:** Nominate another individual to exercise your rights in case of death or incapacity
- **Withdraw Consent:** Withdraw your consent for data processing at any time

To exercise any of these rights, contact our Data Protection Officer at dpo@contractcheck.ai.`,
  },
  {
    title: '6. Data Retention',
    content: `- **Account Data:** Retained for as long as your account is active, plus 90 days after deletion request
- **Uploaded Documents:** Processed in-memory and discarded immediately after analysis (not stored)
- **Saved Reports:** Retained until you delete them, or for 30 days after account deletion
- **Usage Logs:** Retained for 12 months for analytics and security purposes
- **Payment Records:** Retained for 8 years as required by Indian tax and accounting regulations`,
  },
  {
    title: '7. Cookies & Tracking',
    content: `We use essential cookies to maintain your session and authentication state. We use analytics cookies (with your consent) to understand how you use our service. You can manage cookie preferences in your browser settings. We do not use third-party advertising cookies.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `ContractCheck AI is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that we have collected data from a minor, we will delete it promptly.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or an in-app notification at least 30 days before the changes take effect. Continued use of ContractCheck AI after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have questions or concerns about this Privacy Policy, contact us at:

**Data Protection Officer**
ContractCheck AI Pvt. Ltd.
4th Floor, Tower B, Embassy TechVillage
Outer Ring Road, Devarabeesanahalli
Bengaluru, Karnataka 560103, India

Email: dpo@contractcheck.ai
Phone: +91 80-4567-8900`,
  },
];

export function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].title);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      let curr = SECTIONS[0].title;
      for (const s of SECTIONS) {
        const id = s.title.replace(/\s+/g, '-').toLowerCase();
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          curr = s.title;
        }
      }
      setActiveSection(curr);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (title: string) => {
    const id = title.replace(/\s+/g, '-').toLowerCase();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-blue-500/30">
      <PublicNavbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-purple-600/[0.04] blur-[100px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Shield size={14} /> Legal Trust & Security
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            ContractCheck AI Pvt. Ltd. is committed to protecting your privacy in compliance with the Digital Personal Data Protection Act, 2023.
          </motion.p>
          
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="text-sm text-slate-500 mt-6 font-medium"
          >
            Effective Date: April 15, 2026
          </motion.p>
        </div>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Table of Contents - Sticky Sidebar */}
          <div className="lg:w-1/3 shrink-0">
            <div className="sticky top-32 bg-[#0B0B0E]/80 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 hidden lg:block shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 px-2">Table of Contents</h3>
              <nav className="space-y-1">
                {SECTIONS.map((s) => {
                  const isActive = activeSection === s.title;
                  return (
                    <button
                      key={s.title}
                      onClick={() => scrollToSection(s.title)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 text-left cursor-pointer group",
                        isActive 
                          ? "bg-blue-600/10 text-blue-400 font-semibold shadow-inner" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                      )}
                    >
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-300",
                        isActive ? "bg-blue-400 scale-100 shadow-[0_0_8px_rgba(96,165,250,0.6)]" : "bg-slate-600 scale-0 group-hover:scale-100"
                      )} />
                      <span className="truncate">{s.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Mobile TOC - Select form */}
            <div className="lg:hidden mb-12 relative z-20">
               <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-xl p-1 flex items-center relative overflow-hidden shadow-lg">
                 <select 
                    className="w-full bg-transparent text-white appearance-none outline-none py-3 px-4 text-sm z-10 cursor-pointer"
                    value={activeSection}
                    onChange={(e) => scrollToSection(e.target.value)}
                 >
                   {SECTIONS.map(s => (
                     <option key={s.title} value={s.title} className="bg-[#0B0B0E]">{s.title}</option>
                   ))}
                 </select>
                 <ChevronRight size={16} className="absolute right-4 text-slate-500 pointer-events-none rotate-90" />
               </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="lg:w-2/3 space-y-16">
            {SECTIONS.map((section) => {
              const id = section.title.replace(/\s+/g, '-').toLowerCase();
              return (
                <motion.section 
                  key={section.title} 
                  id={id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="scroll-mt-32 relative group"
                >
                  {/* Timeline connecting line (desktop) */}
                  <div className="absolute -left-10 top-4 bottom-[-64px] w-px bg-gradient-to-b from-white/[0.1] to-transparent hidden lg:block group-last:hidden" />
                  {/* Timeline dot (desktop) */}
                  <div className="absolute -left-[44px] top-5 w-2 h-2 rounded-full border border-[#060608] bg-slate-700 group-hover:bg-blue-500 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300 hidden lg:block" />
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white tracking-tight flex items-center gap-4">
                    {section.title}
                  </h2>
                  <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-3xl p-6 md:p-10 hover:border-white/[0.1] hover:bg-white/[0.01] transition-all duration-500 shadow-xl">
                    <div className="text-base text-slate-400 leading-relaxed space-y-6">
                      {section.content.split('\n\n').map((paragraph, pIdx) => {
                        // Check if paragraph is list
                        if (paragraph.startsWith('- ')) {
                          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                          return (
                            <div key={pIdx} className="space-y-4 mt-6 bg-white/[0.02] border border-white/[0.04] p-5 rounded-2xl">
                              {items.map((item, i) => {
                                const liContent = item.substring(2);
                                const subParts = liContent.split(/(\*\*.*?\*\*)/g).filter(Boolean);
                                return (
                                  <div key={i} className="flex items-start gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                    <span className="flex-1 text-slate-300">
                                      {subParts.map((sp, k) => (
                                        sp.startsWith('**') && sp.endsWith('**') 
                                          ? <strong key={k} className="text-white font-semibold">{sp.slice(2, -2)}</strong>
                                          : <span key={k}>{sp}</span>
                                      ))}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        
                        // Normal paragraph parsing
                        const parts = paragraph.split(/(\*\*.*?\*\*)/g).filter(Boolean);
                        
                        return (
                          <div key={pIdx} className="text-slate-400">
                            {parts.map((p, i) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                // If the paragraph started with this bold phrase, treat as subheader
                                if (i === 0) {
                                  return <strong key={i} className="text-white block font-semibold text-lg mb-2 mt-2">{p.slice(2, -2)}</strong>;
                                }
                                return <strong key={i} className="text-slate-200 font-semibold">{p.slice(2, -2)}</strong>;
                              }
                              return <span key={i}>{p}</span>;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>

        </div>
      </main>

      <PublicFooter className="mt-12" />
    </div>
  );
}