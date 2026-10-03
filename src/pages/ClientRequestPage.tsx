import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MessageCircle,
  Layers,
  ArrowRight,
  DollarSign,
  Calendar,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { SITE_CONFIG, SERVICES } from '../config/portfolioData';
import { buildWhatsAppUrl } from '../config/portfolioData';
import { usePageSEO } from '../hooks/usePageSEO';

export const ClientRequestPage: React.FC = () => {

  usePageSEO(
    'Request a Project — Submit Your Brief | Mahnoor Digital Solution',
    'Submit your project details (service, budget, timeline) and get a tailored quote from Mahnoor Digital Solution within 2 business hours.'
  );
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [existingWebsite, setExistingWebsite] = useState('');
  const [selectedService, setSelectedService] = useState(
    serviceParam || 'WordPress Website Design'
  );
  const [preferredDateTime, setPreferredDateTime] = useState(() => {
    // Default to current date and time formatted for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [budget, setBudget] = useState('$500 – $1,500');
  const [timeline, setTimeline] = useState('1 – 2 Weeks');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState('');
  const [ownerWhatsAppLink, setOwnerWhatsAppLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
  }, [serviceParam]);

  const budgetOptions = [
    'Under $500 (Single Page / Fast Fix / Audit)',
    '$500 – $1,500 (Standard Business Site / Canva Pack)',
    '$1,500 – $3,000 (Complete Multi-Page WordPress / WooCommerce)',
    '$3,000+ (Full Brand Identity & AI Systems)',
    'Flexible / Let’s Discuss Consultation',
  ];

  const timelineOptions = [
    'Urgent (< 1 Week)',
    '1 – 2 Weeks (Standard Turnaround)',
    '2 – 4 Weeks (Comprehensive Project)',
    'Flexible / Long-term Retainer',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim()) {
      setErrorMessage('Client کا نام درج کرنا لازمی ہے۔ (Client name is mandatory)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('صحیح Email ایڈریس درج کرنا لازمی ہے۔ (Valid email is mandatory)');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage('فون / WhatsApp نمبر درج کرنا لازمی ہے۔ (Phone / WhatsApp number is mandatory)');
      return;
    }
    if (!phone.trim().startsWith('+')) {
      setErrorMessage(
        'براہ کرم Country Code شامل کریں، جیسے +971501234567 یا +14155551234۔ (Please include your country code, e.g. +971501234567 or +14155551234 — a local number alone cannot be used for international clients.)'
      );
      return;
    }
    if (!selectedService.trim()) {
      setErrorMessage('سروس کا انتخاب لازمی ہے۔ (Service selection is mandatory)');
      return;
    }
    if (!preferredDateTime.trim()) {
      setErrorMessage('تاریخ اور وقت کا انتخاب لازمی ہے۔ (Date & Time is mandatory)');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('پروجیکٹ کی تفصیل / پیغام درج کرنا لازمی ہے (کم از کم 10 حروف)۔');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullMessage = [
        message.trim(),
        company ? `Company / Organization: ${company}` : '',
        existingWebsite ? `Existing Website: ${existingWebsite}` : '',
        `Desired Timeline: ${timeline}`,
        `Preferred Consultation Date & Time: ${preferredDateTime}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          whatsapp: phone.trim(),
          service: selectedService,
          budget,
          message: fullMessage,
          preferredDateTime: preferredDateTime.trim(),
          sourcePage: '/client-request',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit client request. Please try again.');
      }

      setSubmittedInquiryId(data.inquiry?.id || `REQ-${Date.now().toString().slice(-6)}`);
      if (data.ownerWhatsAppUrl) {
        setOwnerWhatsAppLink(data.ownerWhatsAppUrl);
      }
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setExistingWebsite('');
    setMessage('');
    setIsSuccess(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#172222]">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#033B39] via-[#064946] to-[#075B57] text-white pt-36 pb-20 md:pt-44 md:pb-24 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15 backdrop-blur-md">
            <Link to="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">Client Action & Project Brief</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            Start Your Project. Request a Dedicated Proposal.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8">
            Tell me about your business goals, target deliverables, and timeline. I review every submission personally and respond with a structured action roadmap within 2 hours.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5A623]" />
              <span>Rapid 2-Hour Response</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
              <span>Direct Studio Contract & NDA Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>Zero-Obligation Project Assessment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Request Form & Side Info */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form Container */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#0B706A]/15 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-[#0B706A]/10 mb-8">
                <div>
                  <h2 className="font-display font-bold text-2xl text-[#033B39]">
                    Client Project Brief Form
                  </h2>
                  <p className="text-xs sm:text-sm text-[#526060] mt-1">
                    Fill out the fields below. All requests trigger an instant notification to the studio lead.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Studio Accepting Projects</span>
                </div>
              </div>

              {/* Success Screen */}
              {isSuccess ? (
                <div className="text-center py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#033B39] mb-3">
                    Your Project Request Has Been Dispatched!
                  </h3>

                  <p className="text-sm text-[#344040] max-w-md mx-auto leading-relaxed mb-6">
                    Thank you, <span className="font-bold text-[#064946]">{clientName}</span>. Your brief for{' '}
                    <span className="font-semibold text-[#0B706A]">{selectedService}</span> is logged in the studio database (Ref: <span className="font-mono font-bold text-[#172222]">{submittedInquiryId}</span>).
                  </p>

                  <div className="bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl p-5 max-w-md mx-auto mb-8 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#526060]">Client Contact:</span>
                      <span className="font-semibold text-[#033B39]">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526060]">Selected Service:</span>
                      <span className="font-semibold text-[#064946]">{selectedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526060]">Estimated Budget:</span>
                      <span className="font-semibold text-[#033B39]">{budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#526060]">Response Guarantee:</span>
                      <span className="font-semibold text-emerald-700">Within 2 Business Hours</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={buildWhatsAppUrl(
                        phone
                          ? `Hello Mahnoor, I just submitted project brief #${submittedInquiryId} for ${selectedService}. Looking forward to discussing details!`
                          : 'Hello Mahnoor, I visited your portfolio and want to discuss a project!'
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Instantly on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Step 1: Service Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                      منتخب کردہ سروس: Client interested in: <span className="text-[#0B706A] font-extrabold">{selectedService}</span> * (لازمی / Mandatory)
                    </label>
                    <select
                      value={selectedService}
                      required
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title} ({s.categoryLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Client کا نام (Full Name) * لازمی
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Email ایڈریس (Business Email) * لازمی
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        فون / WhatsApp نمبر (with Country Code) * لازمی
                      </label>
                      <input
                        type="tel"
                        required
                        pattern="^\+[0-9\s\-]{7,16}$"
                        title="Include your country code, e.g. +971501234567 or +14155551234"
                        placeholder="+971 50 123 4567 or +1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                      <p className="mt-1 text-[10px] text-[#064946]/60">
                        Country code required — we work with international clients. (+ کے ساتھ country code لازمی ہے)
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        تاریخ اور وقت (Preferred Date & Time) * لازمی
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={preferredDateTime}
                        onChange={(e) => setPreferredDateTime(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3 text-sm font-medium text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Company and Existing Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Company / Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Dental or Solace Boutique"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Existing Website Link (if any)
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={existingWebsite}
                        onChange={(e) => setExistingWebsite(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Estimated Budget Range
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      >
                        {budgetOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                        Target Timeline
                      </label>
                      <select
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all"
                      >
                        {timelineOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Scope Description */}
                  <div>
                    <label className="block text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                      میسج / پروجیکٹ کی تفصیل (Message / Project Details & Requirements) * لازمی
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please share what you are looking to build or improve (e.g. number of pages, current issues with speed or layout, branding guidelines, or specific functionality like WooCommerce or appointment booking)..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#F8FBFA] border border-[#0B706A]/20 rounded-2xl p-4 text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#064946] focus:border-transparent transition-all leading-relaxed"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#064946] hover:bg-[#033B39] disabled:bg-gray-400 text-white font-bold text-sm sm:text-base py-4 px-8 rounded-full transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg active:scale-[0.99] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Dispatching Request to Studio Backend...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Request</span>
                          <Send className="w-4 h-4 text-[#F5A623]" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#526060] text-center mt-3">
                      Your details are held in confidence. No spam or third-party sharing.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar / Assurance Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Consultation Card */}
            <div className="bg-[#033B39] text-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/30 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5A623] uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Direct Studio Access</span>
              </div>

              <h3 className="font-display font-bold text-xl mb-3">
                Prefer an Immediate Discussion?
              </h3>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                If you have an urgent deadline or need an instant feasibility check, connect with Mahnoor Naaz directly via WhatsApp or official email.
              </p>

              <div className="space-y-3">
                <a
                  href={buildWhatsAppUrl('Hello Mahnoor, I visited your portfolio and want to discuss a project!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {SITE_CONFIG.whatsappUsername}</span>
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Project%20Inquiry%20from%20Website`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  <span>Email: {SITE_CONFIG.email}</span>
                </a>
              </div>
            </div>

            {/* What Happens Next Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm">
              <h4 className="font-display font-bold text-base text-[#033B39] mb-4">
                What Happens Next?
              </h4>

              <div className="space-y-4 text-xs text-[#344040]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#064946] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-[#033B39] block mb-0.5">Brief Review</span>
                    <span className="text-[#526060] leading-snug">
                      I review your scope, verify domain requirements, and evaluate layout needs within 2 hours.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#064946] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="font-bold text-[#033B39] block mb-0.5">Roadmap & Quotation</span>
                    <span className="text-[#526060] leading-snug">
                      You receive a transparent scope breakdown with milestones, exact pricing, and live wireframe preview.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#064946] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="font-bold text-[#033B39] block mb-0.5">Kickoff & Delivery</span>
                    <span className="text-[#526060] leading-snug">
                      Upon sign-off, work commences with regular staging previews and complete video handover.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
