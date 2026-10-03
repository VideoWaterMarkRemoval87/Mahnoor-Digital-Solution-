import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../config/portfolioData';

// Research finding: the #1 reason otherwise-interested visitors leave without
// ordering is unanswered objections (price, timeline, trust, revisions). An
// FAQ section addresses these directly on the page instead of making the
// visitor ask and wait for a reply — which is often where leads are lost.
const FAQS = [
  {
    q: 'How long does a project usually take?',
    a: 'Most WordPress/Elementor websites are completed in 3–7 business days depending on scope. Smaller tasks like Canva design sets or SEO articles are typically delivered in 24–48 hours. Exact timelines are always confirmed with you before work starts.',
  },
  {
    q: 'How much does a project cost?',
    a: 'It depends on scope — a landing page costs less than a full multi-page business site. Share your requirements via the quote form or WhatsApp and you will get a clear, upfront price before any work begins. No hidden charges.',
  },
  {
    q: 'Do you offer revisions if I don\u2019t like something?',
    a: 'Yes. Every project includes revision rounds until you are satisfied with the core deliverable, discussed upfront so both sides are clear on scope.',
  },
  {
    q: 'I\u2019m not in Pakistan — can you still work with me?',
    a: 'Yes, this is remote, international work. Clients are based in Pakistan, the USA, UK, UAE and elsewhere. Communication happens over WhatsApp and email, and work is delivered digitally regardless of your time zone.',
  },
  {
    q: 'How do I pay, and is it safe?',
    a: 'Payment terms (upfront/milestone/on-delivery) are agreed with you before work starts, so there are no surprises. For first-time clients, starting with a smaller task is a low-risk way to build trust before a bigger project.',
  },
  {
    q: 'What if I need changes after the project is delivered?',
    a: 'Ongoing support and future edits are available — just message on WhatsApp any time. Many clients come back for updates, new pages, or a full redesign later on.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#F4F9F8] border-y border-[#0B706A]/10">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#0B706A] bg-[#0B706A]/10 px-3 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#033B39]">
            Questions clients ask before starting
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="bg-white rounded-2xl border border-[#0B706A]/15 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                >
                  <span className="font-bold text-sm text-[#172222]">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-[#0B706A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#526060] leading-relaxed">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[#526060] mb-3">Still have a question?</p>
          <a
            href={buildWhatsAppUrl('Hello Mahnoor, I have a question before starting a project.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-5 py-3 rounded-full transition-colors shadow-sm"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
