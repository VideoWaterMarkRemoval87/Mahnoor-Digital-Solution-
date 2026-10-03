import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Globe,
  Palette,
  PenTool,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Target,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { StatsSection } from '../components/StatsSection';
import { WhyChooseMe } from '../components/WhyChooseMe';
import { CTASection } from '../components/CTASection';
import { FAQSection } from '../components/FAQSection';
import { ProjectModal } from '../components/ProjectModal';
import {
  ASSETS,
  SITE_CONFIG,
  SERVICES,
  PORTFOLIO_ITEMS,
  VALUE_CARDS,
} from '../config/portfolioData';
import { PortfolioItem } from '../types';
import { usePageSEO } from '../hooks/usePageSEO';

export const HomePage: React.FC = () => {

  usePageSEO(
    'Mahnoor Digital Solution — WordPress Web Design, Canva Graphics & SEO Content | Freelance Digital Services',
    'Freelance WordPress websites, Elementor Pro design, Canva graphics, SEO content writing and social media management for international clients. Free quote on WhatsApp.'
  );
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Featured 4 projects for home page
  const featuredProjects = PORTFOLIO_ITEMS.slice(0, 4);

  // 4 Main Pillars for home overview
  const servicePillars = [
    {
      id: 'web',
      icon: Globe,
      title: 'WordPress & Web Design',
      tagline: 'High-Converting & Responsive',
      description:
        'Bespoke WordPress & Elementor websites, redesigns, WooCommerce setups, and secure hosting configuration.',
      highlightList: [
        'WordPress Business Websites',
        'Elementor & Elementor Pro Customization',
        'WooCommerce E-Commerce Setup',
        'Hosting, Domain & SSL Assistance',
      ],
      link: '/services?category=web',
    },
    {
      id: 'canva',
      icon: Palette,
      title: 'Creative Canva & Brand Design',
      tagline: 'Bespoke & Reusable Templates',
      description:
        'Editable Canva template suites, luxury real estate kits, social carousels, ebooks, and print-ready collateral.',
      highlightList: [
        'Editable Master Canva Templates',
        'Ebook & Course Workbook Design',
        'Social Media Posts & Carousels',
        'Luxury Real Estate Marketing Collateral',
      ],
      link: '/services?category=canva',
    },
    {
      id: 'marketing',
      icon: PenTool,
      title: 'Content & SEO Marketing',
      tagline: 'Human-Crafted & Traffic-Driven',
      description:
        'Audience-centric SEO website copywriting, strategic social media calendars, and Pinterest traffic funnels.',
      highlightList: [
        'SEO-Optimized Website Copy & Articles',
        'Monthly Social Media Management',
        'Pinterest Visual Marketing & Pin SEO',
        'Conversion-Focused Copywriting',
      ],
      link: '/services?category=marketing',
    },
    {
      id: 'ai',
      icon: Cpu,
      title: 'AI Solutions & Video',
      tagline: 'Modern Speed & Human Art Direction',
      description:
        'Fast-track web scaffolding, short-form video generation, studio voiceovers, and intelligent redesigns.',
      highlightList: [
        'AI Website Rapid Scaffolding',
        'Short-Form Video & Captions',
        'Generative Visual Concepts & Moodboards',
        'Strict Human-in-the-Loop Quality Control',
      ],
      link: '/services?category=ai',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#172222]">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Short Introduction Section */}
      <section className="py-20 bg-[#F4F9F8] border-b border-[#0B706A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={ASSETS.workspaceAbout}
                  alt="Mahnoor Digital Solutions Workspace"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#033B39]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#F5A623] block mb-1">
                    Independent Consultant
                  </span>
                  <div className="font-display font-bold text-xl">
                    Dedicated to Precision & Client Growth
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -right-3 sm:right-4 bg-white rounded-2xl p-4 shadow-lg border border-[#0B706A]/15 max-w-[210px]">
                <div className="flex items-center gap-2 mb-1 text-[#064946]">
                  <ShieldCheck className="w-5 h-5 text-[#0B706A]" />
                  <span className="font-bold text-sm">100% Reliable</span>
                </div>
                <p className="text-xs text-[#526060] leading-snug">
                  Fast delivery, transparent communication & reliable support.
                </p>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-[#F5A623]" />
                <span>About Mahnoor Digital Solution</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#033B39] tracking-tight leading-tight mb-5">
                Bridging Design Craftsmanship, Modern Web Architecture & AI Efficiency
              </h2>

              <p className="text-base sm:text-lg text-[#526060] leading-relaxed mb-4">
                Hello! I am Mahnoor, a dedicated freelance digital specialist providing comprehensive design, development, and marketing solutions to businesses, entrepreneurs, and agencies worldwide.
              </p>

              <p className="text-sm sm:text-base text-[#526060] leading-relaxed mb-8">
                Whether you need a bespoke WordPress business website, high-impact Canva brand kits, SEO-optimized content, or modern AI-accelerated workflows, I deliver polished assets built to drive tangible results for your business.
              </p>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full py-5 border-y border-[#0B706A]/15 mb-8">
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#064946]">
                    18+
                  </div>
                  <div className="text-xs sm:text-sm text-[#526060] font-medium">
                    Specialized Services
                  </div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#064946]">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-[#526060] font-medium">
                    Human Quality Assurance
                  </div>
                </div>
                <div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-[#064946]">
                    &lt;24h
                  </div>
                  <div className="text-xs sm:text-sm text-[#526060] font-medium">
                    Response Guarantee
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-semibold text-sm px-6 py-3 rounded-full transition-all duration-150 shadow hover:shadow-md"
                >
                  <span>Learn More About Me</span>
                  <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                </Link>

                <Link
                  to="/skills"
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#F4F9F8] text-[#064946] border border-[#0B706A]/30 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-150"
                >
                  <span>View Skills & Tools</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quantifiable Results & Animated Stats Section */}
      <StatsSection />

      {/* 4. Main Skills / Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <span>What I Offer</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#033B39] tracking-tight mb-4">
              Comprehensive Digital Services for Growing Brands
            </h2>
            <p className="text-base sm:text-lg text-[#526060] leading-relaxed">
              From responsive WordPress websites and editable Canva templates to SEO copy and AI workflows, every solution is customized to your exact requirements.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            {servicePillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-[#F8FBFA] rounded-3xl p-8 border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#064946]/10 text-[#064946]">
                        {pillar.tagline}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-2xl text-[#033B39] mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#526060] leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="space-y-2.5 mb-8">
                      {pillar.highlightList.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#344040]">
                          <CheckCircle2 className="w-4 h-4 text-[#0B706A] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#0B706A]/10">
                    <Link
                      to={pillar.link}
                      className="inline-flex items-center gap-2 font-bold text-sm text-[#064946] hover:text-[#F5A623] transition-colors"
                    >
                      <span>Explore these services</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered Button to View all 18 Services */}
          <div className="text-center">
            <Link
              to="/services"
              id="btn-home-all-services"
              className="inline-flex items-center justify-center gap-3 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <span>Explore All 18 Detailed Services</span>
              <ArrowRight className="w-5 h-5 text-[#F5A623]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Visual Website Showcase */}
      <section className="py-20 bg-[#F4F9F8] border-y border-[#0B706A]/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#064946] to-[#033B39] rounded-3xl sm:rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-4">
                  <Zap className="w-3.5 h-3.5" />
                  <span>WordPress & Elementor Excellence</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white mb-4 leading-tight">
                  High-Speed, Mobile-First Websites Engineered to Convert
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                  Every website project is built with clean architecture, responsive breakpoints, lightning-fast Hostinger optimization, and intuitive Elementor controls so you can update text and images anytime without touching code.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-white/90 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                    <span>Elementor Pro Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                    <span>Free SSL & DNS Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                    <span>Lead Capture Forms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
                    <span>WhatsApp Quick-Chat</span>
                  </div>
                </div>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5 shadow-md"
                >
                  <span>See Website Case Studies</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#172222]">
                  {/* Browser top chrome */}
                  <div className="bg-[#033B39] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div className="ml-3 bg-white/10 text-white/70 text-[11px] px-3 py-0.5 rounded-md flex-1 truncate font-mono">
                      https://mahnoordigitalsolution.com/client-preview
                    </div>
                  </div>
                  <img
                    src={ASSETS.websiteShowcase}
                    alt="Live Website Showcase"
                    className="w-full h-auto object-cover object-top"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Work Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
                <span>Featured Projects</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#033B39] tracking-tight">
                Recent Client Deliveries
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#064946] hover:text-[#F5A623] transition-colors"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((item) => (
              <div
                key={item.id}
                className="bg-[#F8FBFA] rounded-3xl overflow-hidden border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all duration-300 hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-[#033B39]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#033B39]/90 text-white backdrop-blur-sm border border-white/20">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="font-display font-bold text-xl text-[#033B39] mb-2 group-hover:text-[#0B706A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#526060] leading-relaxed mb-4 line-clamp-2">
                      {item.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.toolsUsed.slice(0, 3).map((tool: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-white border border-[#0B706A]/20 text-[11px] font-semibold text-[#064946]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-[#0B706A]/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064946] hover:text-[#F5A623] transition-colors"
                  >
                    <span>View Case Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to={`/contact?service=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#526060] hover:text-[#064946]"
                  >
                    <span>Request Similar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <span>Explore All Projects & Case Studies</span>
              <ArrowRight className="w-4 h-4 text-[#F5A623]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Why Work With Me Section */}
      <WhyChooseMe />

      {/* 7b. FAQ — answers common objections before visitors leave */}
      <FAQSection />

      {/* 8. Call To Action Section */}
      <CTASection />

      {/* Case Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={(projectName) => {
          setSelectedProject(null);
          window.location.href = `/contact?service=${encodeURIComponent(projectName)}`;
        }}
      />
    </div>
  );
};
