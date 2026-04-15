import React from 'react';
import { Link } from 'react-router';
import { Shield, ArrowLeft } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-lg bg-blue-600 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <Shield size={size * 0.6} className="text-white" />
    </div>
  );
}

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
  return (
    <div className="min-h-screen bg-[#060608] text-white">
      <PublicNavbar />

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Shield size={11} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-400">
            Last updated: April 15, 2026 | Effective date: April 15, 2026
          </p>
          <p className="text-slate-400 mt-4 leading-relaxed">
            ContractCheck AI Pvt. Ltd. (&quot;ContractCheck&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered contract compliance analysis service, in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and other applicable Indian laws.
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4 text-white">{section.title}</h2>
              <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {section.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-slate-200">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-[#060608] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} ContractCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}