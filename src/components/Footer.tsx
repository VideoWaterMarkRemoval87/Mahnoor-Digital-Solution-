import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  Sparkles,
  Globe,
  MessageCircle,
  Mail,
  Target,
  Heart,
  Bookmark,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/portfolioData';
import { buildWhatsAppUrl } from '../config/portfolioData';
import { BrandLogo } from './BrandLogo';
import { OwnerAccess } from './OwnerAccess';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Skills & Tools', path: '/skills' },
    { name: 'Client Request', path: '/client-request' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <footer id="main-footer" className="bg-[#033B39] text-white pt-16 pb-12 border-t border-[#0B706A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            
            {/* Brand Identity & Summary */}
            <div className="md:col-span-6 flex flex-col items-start">
              <Link to="/" className="mb-4">
                <BrandLogo variant="light" size="md" />
              </Link>

              <div className="text-xs sm:text-sm font-semibold text-[#F5A623] tracking-wide mb-3">
                {SITE_CONFIG.tagline}
              </div>

              <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed mb-6">
                Independent digital solutions studio specialized in bespoke WordPress & Elementor website design, Canva marketing collateral, editorial content writing, and AI-accelerated workflows.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                <span>
                  Direct Contact:{' '}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-white hover:text-[#F5A623] underline transition-colors"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </span>
                <span>•</span>
                <span className="text-white/60">
                  Worldwide Client Delivery • Remote Studio
                </span>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
                Explore Pages
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/75">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="hover:text-[#F5A623] transition-colors inline-flex items-center gap-1.5 hover:translate-x-0.5 transform duration-150"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Profiles & Back to Top */}
            <div className="md:col-span-3 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
                  Connect & Network
                </h4>
                <p className="text-xs text-white/70 mb-4">
                  Available for global freelance commissions and contracts:
                </p>
                <div className="flex items-center gap-2.5">
                  <a
                    href={buildWhatsAppUrl('Hello Mahnoor, I visited your portfolio and want to discuss a project!')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-white"
                    aria-label={`WhatsApp: ${SITE_CONFIG.whatsappUsername}`}
                    title={`WhatsApp: ${SITE_CONFIG.whatsappUsername}`}
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

              <div className="pt-6">
                <button
                  type="button"
                  id="btn-footer-back-to-top"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-[#F5A623] transition-colors py-2"
                >
                  <span>Back to top</span>
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
          {/* Bottom Copyright Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <div className="flex flex-wrap items-center gap-3">
              <span>© 2026 {SITE_CONFIG.brandName}. All rights reserved.</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <OwnerAccess />
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <span>High-Performance WordPress & Canva Studio</span>
              <span>•</span>
              <span>Worldwide Remote Delivery</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};
