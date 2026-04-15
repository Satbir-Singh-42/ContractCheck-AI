import React, { useState } from 'react';
import { Link } from 'react-router';
import { Shield, Mail, MapPin, Phone, Send } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { motion } from 'motion/react';

function BrandLogo({ size = 24 }: { size?: number }) {
  return (
    <div className="rounded-lg bg-blue-600 flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <Shield size={size * 0.6} className="text-white" />
    </div>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white">
      <PublicNavbar />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-400 max-w-[560px] mx-auto">
            Have questions about ContractCheck AI? We are here to help. Reach out and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Mail size={18} className="text-blue-400" />
                </div>
                <h3 className="font-semibold">Email</h3>
              </div>
              <p className="text-slate-400 text-sm">support@contractcheck.ai</p>
              <p className="text-slate-400 text-sm">enterprise@contractcheck.ai</p>
            </div>

            <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Phone size={18} className="text-purple-400" />
                </div>
                <h3 className="font-semibold">Phone</h3>
              </div>
              <p className="text-slate-400 text-sm">+91 80-4567-8900</p>
              <p className="text-slate-400 text-sm">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
            </div>

            <div className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin size={18} className="text-emerald-400" />
                </div>
                <h3 className="font-semibold">Office</h3>
              </div>
              <p className="text-slate-400 text-sm">
                ContractCheck AI Pvt. Ltd.<br />
                4th Floor, Tower B, Embassy TechVillage<br />
                Outer Ring Road, Devarabeesanahalli<br />
                Bengaluru, Karnataka 560103, India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-[#0B0B0E] border border-emerald-500/20 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <Send size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                <p className="text-slate-400 mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#0B0B0E] border border-white/[0.06] rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#060608] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#060608] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    required
                    className="w-full bg-[#060608] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    <option value="" className="text-slate-600">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="enterprise">Enterprise Plan</option>
                    <option value="partnership">Partnership</option>
                    <option value="bug">Bug Report</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-[#060608] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-colors shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-[#060608] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} ContractCheck AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}