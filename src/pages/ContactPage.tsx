import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SITE_CONFIG, SERVICES } from '../config/portfolioData';
import { buildWhatsAppUrl } from '../config/portfolioData';
import { ContactFormData } from '../types';
import { usePageSEO } from '../hooks/usePageSEO';

export const ContactPage: React.FC = () => {

  usePageSEO(
    'Contact & Get a Free Quote | Mahnoor Digital Solution',
    'Get in touch for a free project quote. WhatsApp, email or fill the quick contact form — response within 2 business hours.'
  );
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: serviceParam || 'WordPress Website Design',
    budgetRange: '$500 – $1,500',
    preferredDateTime: (() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
    })(),
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, projectType: serviceParam }));
    }
  }, [serviceParam]);

  const budgetOptions = [
    'Under $500 (Quick Task / Single Asset / Audit)',
    '$500 – $1,500 (Single-Page Site / Templates Pack / Small Revamp)',
    '$1,500 – $3,000 (Complete Multi-Page WordPress / WooCommerce Store)',
    '$3,000+ (Full Digital Identity, Web & AI Workflows)',
    'Flexible / Let’s Discuss in Consultation',
  ];

  const faqs = [
    {
      q: 'How does the project onboarding work?',
      a: 'Once you submit your project brief, I review your requirements within 24 hours. We align on scope, deliverables, and timeline, then initiate work with clear milestone approvals.',
    },
    {
      q: 'Will I be able to edit and update my website or graphics myself?',
      a: 'Yes, 100%! I build websites with Elementor / Elementor Pro and create visual assets with master Canva links. You will receive clear video walkthroughs demonstrating how to edit text, swap photos, and manage content with zero coding required.',
    },
    {
      q: 'What are your payment terms?',
      a: 'Projects are structured with clear milestone payments (typically a 50% upfront deposit to commence development, and 50% upon final client sign-off and deployment handover).',
    },
    {
      q: 'How long does a typical project take to complete?',
      a: 'Most WordPress business websites and Canva template packs are delivered in 3 to 7 business days, depending on scope complexity and feedback turnaround.',
    },
    {
      q: 'Do you offer post-launch support and revisions?',
      a: 'Yes, every project includes a dedicated revision window to ensure you are completely satisfied, alongside 14 to 30 days of complimentary technical support post-launch.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Client کا نام درج کرنا لازمی ہے۔ (Client name is mandatory)');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('صحیح Email ایڈریس درج کرنا لازمی ہے۔ (Valid email is mandatory)');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      setErrorMessage('فون / WhatsApp نمبر درج کرنا لازمی ہے۔ (Phone / WhatsApp number is mandatory)');
      return;
    }
    if (!formData.phone.trim().startsWith('+')) {
      setErrorMessage(
        'براہ کرم Country Code شامل کریں، جیسے +971501234567 یا +14155551234۔ (Please include your country code, e.g. +971501234567 or +14155551234 — a local number alone cannot be used for international clients.)'
      );
      return;
    }
    if (!formData.projectType.trim()) {
      setErrorMessage('سروس کا انتخاب لازمی ہے۔ (Service selection is mandatory)');
      return;
    }
    if (!formData.preferredDateTime.trim()) {
      setErrorMessage('رابطہ اور مشاورت کی تاریخ اور وقت لازمی ہے۔ (Date & time is mandatory)');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('پروجیکٹ کی تفصیل / میسج درج کرنا لازمی ہے (کم از کم 10 حروف)۔');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          whatsapp: formData.phone.trim(),
          service: formData.projectType,
          budget: formData.budgetRange,
          message: formData.message.trim(),
          preferredDateTime: formData.preferredDateTime.trim(),
          sourcePage: '/contact',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'WordPress Website Design',
      budgetRange: '$500 – $1,500',
      preferredDateTime: new Date().toISOString().slice(0, 16),
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#172222]">
      {/* Page Hero Header */}
      <section className="bg-gradient-to-b from-[#033B39] via-[#064946] to-[#075B57] text-white pt-36 pb-20 md:pt-44 md:pb-24 curved-bottom relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15 backdrop-blur-md">
            <Link to="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Contact & Consultation</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            Let's Start Building Your Digital Presence Today.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-4">
            Have a project in mind, need a quick question answered, or want a custom quotation? Fill out the brief below and I’ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Cards & Studio Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-[#064946] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B706A]/30 rounded-full blur-2xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider text-[#F5A623] mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Direct Communication</span>
                </div>

                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  {SITE_CONFIG.brandName}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                  Independent freelance studio partnering with businesses worldwide to create high-impact websites and creative collateral.
                </p>

                <div className="space-y-4 pt-4 border-t border-white/15 text-sm">
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F5A623] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-white/70 block">Direct Inquiries & Proposals</span>
                      <a
                        href={`mailto:${SITE_CONFIG.email}`}
                        className="font-semibold text-white hover:text-[#F5A623] transition-colors break-all"
                      >
                        {SITE_CONFIG.email}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Direct & Message Button */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <span className="text-xs text-white/70 block">Direct WhatsApp</span>
                      <a
                        href={buildWhatsAppUrl('Hello Mahnoor, I visited your portfolio and want to discuss a project!')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#25D366] transition-colors text-sm"
                      >
                        <span>Send Message</span>
                      </a>
                      <div>
                        <a
                          href={buildWhatsAppUrl('Hello Mahnoor! I visited your website and would like to discuss a project quotation.')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold transition-colors shadow-xs"
                        >
                          <span>Send WhatsApp Message</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F5A623] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-white/70 block">Working Hours & Response</span>
                      <span className="font-semibold text-white">{SITE_CONFIG.workHours}</span>
                      <div className="text-xs text-white/70 mt-0.5">{SITE_CONFIG.responseGuarantee}</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F5A623] shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-white/70 block">Availability</span>
                      <span className="font-semibold text-white">{SITE_CONFIG.location}</span>
                    </div>
                  </div>
                </div>
                {/* Direct Contact Channels */}
                <div className="mt-8 pt-6 border-t border-white/15">
                  <span className="text-xs text-white/70 block mb-3">Direct Contact:</span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={buildWhatsAppUrl('Hello Mahnoor, I want to discuss a project!')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-white"
                      aria-label="WhatsApp"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#F5A623] hover:text-[#172222] transition-colors flex items-center justify-center text-white"
                      aria-label="Email"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Trust Box */}
              <div className="p-6 rounded-3xl bg-[#F4F9F8] border border-[#0B706A]/20">
                <div className="flex items-center gap-2 text-[#064946] font-bold text-sm mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#0B706A]" />
                  <span>The Mahnoor Guarantee</span>
                </div>
                <ul className="text-xs text-[#526060] space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B706A]" />
                    <span>Honest scope analysis & no hidden surprises</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B706A]" />
                    <span>Video handover guides on every website</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0B706A]" />
                    <span>Rapid milestone delivery with continuous updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#F8FBFA] rounded-3xl p-8 sm:p-10 border border-[#0B706A]/15 shadow-sm">
                
                {isSubmitted ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#064946] text-[#F5A623] flex items-center justify-center mb-6 shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#033B39] mb-3">
                      Thank You, {formData.name}!
                    </h3>
                    <p className="text-sm text-[#526060] max-w-md mb-6 leading-relaxed">
                      Your inquiry regarding <strong>{formData.projectType}</strong> has been safely received. I will review your requirements and reach out to <strong>{formData.email}</strong> within 24 hours.
                    </p>
                    <div className="p-4 rounded-2xl bg-white border border-[#0B706A]/15 text-xs text-[#064946] font-medium mb-6">
                      Inquiry Reference: #MDS-{Math.floor(100000 + Math.random() * 900000)}
                    </div>

                    {/* Instant WhatsApp & Email Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                      <a
                        href={buildWhatsAppUrl(
                          `Hello Mahnoor!\n\nName: ${formData.name}\nEmail: ${formData.email}\nProject: ${formData.projectType}\nBudget: ${formData.budgetRange}\n\nDetails: ${formData.message}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-5 py-3 rounded-full transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send Details to WhatsApp Now</span>
                      </a>

                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                          SITE_CONFIG.email
                        )}&su=${encodeURIComponent(
                          `New Project Inquiry: ${formData.projectType} - ${formData.name}`
                        )}&body=${encodeURIComponent(
                          `Client Name: ${formData.name}\nClient Email: ${formData.email}\nService: ${formData.projectType}\nBudget: ${formData.budgetRange}\n\nProject Brief:\n${formData.message}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#EA4335] hover:bg-[#d93025] text-white font-bold text-xs px-5 py-3 rounded-full transition-colors shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open in Gmail (To: {SITE_CONFIG.email})</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-xs px-6 py-3 rounded-full transition-colors"
                    >
                      <span>Send Another Inquiry</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-[#033B39] mb-1">
                        Tell Me About Your Project
                      </h3>
                      <p className="text-xs sm:text-sm text-[#526060]">
                        Fill out the details below to receive a personalized proposal and timeline.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          Client کا نام (Your Name) <span className="text-red-500">* لازمی</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          Email ایڈریس (Email Address) <span className="text-red-500">* لازمی</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. sarah@company.com"
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone / WhatsApp */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          فون / WhatsApp نمبر (with Country Code) <span className="text-red-500">* لازمی</span>
                        </label>
                        <input
                          type="tel"
                          required
                          pattern="^\+[0-9\s\-]{7,16}$"
                          title="Include your country code, e.g. +971501234567 or +14155551234"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+971 50 123 4567 or +1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        />
                        <p className="mt-1 text-[10px] text-[#033B39]/60">
                          Country code required — we work with international clients. (+ کے ساتھ country code لازمی ہے)
                        </p>
                      </div>

                      {/* Date & Time */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          تاریخ اور وقت (Preferred Date & Time) <span className="text-red-500">* لازمی</span>
                        </label>
                        <input
                          type="datetime-local"
                          required
                          value={formData.preferredDateTime}
                          onChange={(e) => setFormData({ ...formData, preferredDateTime: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Service of Interest */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          منتخب کردہ سروس: Client interested in <span className="text-red-500">* لازمی</span>
                        </label>
                        <select
                          required
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        >
                          <optgroup label="WordPress & Web Development">
                            <option value="WordPress Website Design">WordPress Website Design</option>
                            <option value="WordPress Website Redesign">WordPress Website Redesign</option>
                            <option value="Elementor & Elementor Pro">Elementor & Elementor Pro</option>
                            <option value="Business Websites">Business Websites</option>
                            <option value="WooCommerce">WooCommerce Online Store</option>
                            <option value="Website Setup & Hosting">Website Setup & Hosting</option>
                          </optgroup>
                          <optgroup label="Canva & Graphic Design">
                            <option value="Canva Design">Canva Design & Templates</option>
                            <option value="Ebook & Workbook Design">Ebook & Workbook Design</option>
                            <option value="Social Media Post Design">Social Media Post Design</option>
                            <option value="Flyer & Poster Design">Flyer & Poster Design</option>
                            <option value="Real Estate Design">Real Estate Design</option>
                          </optgroup>
                          <optgroup label="Content Writing & Marketing">
                            <option value="SEO Content Writing">SEO Content Writing</option>
                            <option value="Social Media Management">Social Media Management</option>
                            <option value="Pinterest Marketing">Pinterest Marketing</option>
                          </optgroup>
                          <optgroup label="AI Solutions">
                            <option value="AI Website Development">AI Website Development</option>
                            <option value="AI Website Editing & Redesign">AI Website Editing & Redesign</option>
                            <option value="AI Video Creation">AI Video Creation</option>
                            <option value="AI-Powered Design & Content">AI-Powered Design & Content</option>
                          </optgroup>
                          <option value="Custom Multi-Service Package">Custom Multi-Service Package</option>
                        </select>
                      </div>

                      {/* Budget Tier */}
                      <div>
                        <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                          Estimated Budget
                        </label>
                        <select
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                        >
                          {budgetOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message / Project Details */}
                    <div>
                      <label className="block text-xs font-bold text-[#033B39] uppercase tracking-wider mb-2">
                        میسج / پروجیکٹ کی تفصیل (Project Details & Requirements) <span className="text-red-500">* لازمی</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your business, the pages/templates you need, any reference websites you like, and your ideal launch date..."
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm sm:text-base py-4 px-8 rounded-full transition-transform active:scale-[0.98] shadow-lg disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Submitting Your Brief...</span>
                        ) : (
                          <>
                            <span>Send Project Inquiry</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-center text-[11px] text-[#526060]">
                      Protected by 24h response guarantee. Your data is kept strictly confidential.
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#F4F9F8] border-t border-[#0B706A]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4 text-[#F5A623]" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#033B39]">
              Everything You Need to Know Before We Start
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#0B706A]/15 shadow-sm"
              >
                <h3 className="font-display font-bold text-base sm:text-lg text-[#033B39] mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#526060] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
