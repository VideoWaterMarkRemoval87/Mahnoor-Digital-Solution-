import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config/portfolioData';

interface CTASectionProps {
  onStartProject?: () => void;
  onViewServices?: () => void;
  title?: string;
  subtitle?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onStartProject,
  onViewServices,
  title = "Have a Project in Mind? Let's Build It.",
  subtitle = "Tell me what you need and let's turn your idea into a professional digital experience.",
}) => {
  return (
    <section className="py-16 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="cta-banner"
          className="relative bg-gradient-to-br from-[#033B39] via-[#064946] to-[#075B57] text-white rounded-[32px] sm:rounded-[44px] px-6 sm:px-12 py-16 sm:py-20 overflow-hidden shadow-2xl"
        >
          {/* Decorative ambient blurred orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0B706A]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5A623]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Decorative Star Icon */}
          <div className="absolute top-8 right-10 text-[#F5A623]/30 pointer-events-none">
            <Sparkles className="w-10 h-10" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
              <span>Available for New Projects</span>
            </div>

            {/* Headline */}
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6">
              {title}
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg sm:text-xl text-white/85 max-w-xl mb-10 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                id="btn-cta-start-project"
                to="/contact"
                onClick={onStartProject}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-base px-9 py-4 rounded-full transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#F5A623]/40"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                id="btn-cta-view-services"
                to="/services"
                onClick={onViewServices}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-8 py-4 rounded-full border border-white/25 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <span>View All Services</span>
              </Link>
            </div>

            {/* Guarantee footnote */}
            <div className="mt-8 text-xs text-white/70">
              {SITE_CONFIG.responseGuarantee} • Clear project roadmap • No obligations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
