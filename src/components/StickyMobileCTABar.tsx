import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import { buildWhatsAppUrl } from '../config/portfolioData';

// Research on high-converting agency/freelancer sites (2026) consistently shows
// the same pattern: mobile visitors (59%+ of traffic) leave without contacting
// you because the CTA scrolled out of view. A CTA bar that's ALWAYS visible at
// the bottom of the screen — one tap to WhatsApp, one tap to the quote form —
// removes that friction. Desktop already has the floating WhatsApp button, so
// this only renders on small screens to avoid duplicating CTAs.
export const StickyMobileCTABar: React.FC = () => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex sm:hidden border-t border-[#0B706A]/15 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(3,59,57,0.12)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <a
        href={buildWhatsAppUrl('Hello Mahnoor, I want a free quote for my project!')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wide active:bg-[#1fb257]"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp Now
      </a>
      <Link
        to="/client-request"
        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#033B39] text-white font-bold text-xs uppercase tracking-wide active:bg-[#022826]"
      >
        <Send className="w-4 h-4" />
        Get Free Quote
      </Link>
    </div>
  );
};
