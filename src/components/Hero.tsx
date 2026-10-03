import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, Layers, Wand2 } from 'lucide-react';
import { ASSETS, SITE_CONFIG } from '../config/portfolioData';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  onStartProject?: () => void;
  onExploreServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreServices }) => {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-[#033B39] via-[#064946] to-[#075B57] text-white pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden curved-bottom"
    >
      {/* Subtle organic background decoration */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Decorative stars and geometric marks */}
      <div className="absolute top-28 left-8 sm:left-16 text-[#F5A623]/40 pointer-events-none animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute top-1/2 right-6 text-white/20 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div className="absolute bottom-24 left-1/3 text-white/15 pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Eyebrow with <MDS> Brand Emblem */}
            <div className="flex items-center gap-2.5 mb-6 flex-wrap">
              <BrandLogo variant="light" size="sm" showText={false} />
              <div
                id="hero-eyebrow"
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-ping" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90">
                  DIGITAL SOLUTIONS • DESIGN • AI
                </span>
              </div>
            </div>

            {/* Large Main Headline */}
            <h1
              id="hero-headline"
              className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.12] mb-4"
            >
              I Build Digital Experiences That Help Businesses Stand Out.
            </h1>

            {/* Highlighted Phrase */}
            <div className="mb-6">
              <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F5A623] tracking-wide inline-block">
                Design. Build. Grow.
              </span>
            </div>

            {/* Supporting Text */}
            <p
              id="hero-subtext"
              className="text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8"
            >
              Professional websites, creative designs, content and AI-powered digital solutions
              designed to help businesses build a stronger online presence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                id="btn-hero-primary"
                to="/contact"
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-3 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-base px-8 py-4 rounded-full transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#F5A623]/40"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                id="btn-hero-secondary"
                to="/services"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-4 rounded-full border border-white/25 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <span>Explore My Services</span>
              </Link>
            </div>

            {/* Small Trust-Oriented Info */}
            <div className="pt-6 border-t border-white/15 w-full flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-white/75 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>Web Design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>Creative Design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>Content & SEO</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                <span>AI Solutions</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Outer Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0B706A]/40 to-[#F5A623]/20 rounded-3xl blur-2xl transform scale-95" />

            {/* Main Visual Container */}
            <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#064946]/40 backdrop-blur-sm">
              <img
                src={ASSETS.heroFreelancer}
                alt="Mahnoor Digital Solution Freelancer in modern design studio"
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />

              {/* Bottom Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#033B39]/80 via-transparent to-transparent pointer-events-none" />

              {/* In-Frame Brand Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#033B39]/85 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                      Client-Ready Solutions
                    </h2>
                    <p className="text-sm font-bold text-white">
                      Full-Cycle Digital Delivery
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-[#0B706A] text-white px-2.5 py-1 rounded-full font-semibold">
                  Active
                </span>
              </div>
            </div>

            {/* Floating Glass UI Element 1: WordPress & Elementor */}
            <div className="hidden sm:flex absolute -top-5 -left-6 bg-[#033B39]/90 border border-white/20 backdrop-blur-md rounded-2xl p-3 shadow-xl items-center gap-3 text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#075B57] flex items-center justify-center text-[#F5A623]">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <div className="text-xs font-bold text-white">WordPress & Elementor</div>
                <div className="text-[11px] text-white/70">Custom Responsive Sites</div>
              </div>
            </div>

            {/* Floating Glass UI Element 2: AI-Powered Workflows */}
            <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-[#033B39]/90 border border-white/20 backdrop-blur-md rounded-2xl p-3 shadow-xl items-center gap-3 text-white transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center text-[#172222]">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="text-left pr-2">
                <div className="text-xs font-bold text-white">AI-Powered Delivery</div>
                <div className="text-[11px] text-white/70">Rapid Turnaround & Polish</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
