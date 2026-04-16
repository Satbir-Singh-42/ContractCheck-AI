import React from 'react';
import { Link } from 'react-router';
import { Shield, Twitter, Github, Linkedin } from 'lucide-react';
import { cn } from '../../lib/utils';

type PublicFooterProps = {
  className?: string;
};

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

export function PublicFooter({ className }: PublicFooterProps) {
  return (
    <footer className={cn('border-t border-white/[0.05] bg-[#060608] pt-12 sm:pt-16 pb-8', className)}>
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
              <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/upload" className="text-slate-400 hover:text-white transition-colors">Analyze Contract</Link>
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
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
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

        <p className="text-center text-xs text-slate-700 mt-6">
          ContractCheck is an AI tool and does not provide legal advice. Always consult a qualified advocate for legal matters.
        </p>
      </div>
    </footer>
  );
}