import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Globe,
  Layout,
  RefreshCw,
  Sliders,
  ShoppingBag,
  Server,
  Palette,
  BookOpen,
  Share2,
  FileText,
  Home,
  PenTool,
  Calendar,
  TrendingUp,
  Cpu,
  Video,
  Briefcase,
  Layers,
} from 'lucide-react';
import { SERVICES } from '../config/portfolioData';
import { ServiceItem } from '../types';
import { CTASection } from '../components/CTASection';
import { usePageSEO } from '../hooks/usePageSEO';

// Icon map helper
const iconMap: Record<string, React.ElementType> = {
  Globe,
  Layout,
  RefreshCw,
  Sliders,
  ShoppingBag,
  Server,
  Palette,
  BookOpen,
  Share2,
  FileText,
  Home,
  PenTool,
  Calendar,
  TrendingUp,
  Cpu,
  Video,
  Briefcase,
  Layers,
  Sparkles,
};

// Client suitability recommendations
const clientSuitability: Record<string, string> = {
  'wp-design': 'Startups, consultants, and companies needing a modern digital home.',
  'wp-redesign': 'Established businesses with slow, outdated, or broken WordPress sites.',
  'elementor-pro': 'Business owners wanting complete visual control without coding.',
  'business-websites': 'Corporate firms, professional practices, clinics, and B2B agencies.',
  'woocommerce': 'Merchants, digital product creators, and physical storefronts.',
  'website-hosting': 'Anyone launching a new domain or migrating to Hostinger / cPanel.',
  'canva-design': 'Brand managers and creators needing editable, reusable daily templates.',
  'ebook-workbook': 'Coaches, educators, course creators, and marketing lead campaigns.',
  'social-post-design': 'Brands building authority and community on Instagram & LinkedIn.',
  'flyer-poster': 'Events, local businesses, retail promotions, seminars, and menus.',
  'real-estate-design': 'Real estate agents, brokerages, and luxury property managers.',
  'seo-content-writing': 'Blogs, service providers, and brands aiming for organic Google rank.',
  'social-management': 'Busy founders needing consistent weekly social media distribution.',
  'pinterest-marketing': 'E-commerce shops, lifestyle bloggers, and creative professionals.',
  'ai-web-development': 'Fast-paced projects requiring rapid scaffolding and urgent launch.',
  'ai-web-editing': 'Sites needing swift CSS adjustments, speed upgrades, and mobile fixes.',
  'ai-video-creation': 'Marketing campaigns wanting high-energy vertical reels with voiceovers.',
  'ai-content-design': 'Brands looking for bespoke creative art direction & custom concepts.',
};

export const ServicesPage: React.FC = () => {

  usePageSEO(
    'Services — WordPress Websites, Canva Design, SEO Content & More | Mahnoor Digital Solution',
    'Explore freelance services: WordPress/Elementor Pro websites, Canva graphic design, SEO content writing, social media management and AI-powered digital solutions.'
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Services', count: 18 },
    { id: 'web', label: 'WordPress & Web', count: 6 },
    { id: 'canva', label: 'Creative & Canva', count: 5 },
    { id: 'marketing', label: 'Marketing & SEO', count: 3 },
    { id: 'ai', label: 'AI Solutions', count: 4 },
  ];

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            <span className="text-[#F5A623]">Digital Services</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            18 Specialized Digital Services Designed to Elevate Your Brand.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8">
            Every service is tailored with transparent deliverables, clean engineering, bespoke design, and ongoing client independence.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-7 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Request a Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              <span>View Past Work</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Directory Section */}
      <section className="py-20 bg-white" id="service-directory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar: Category Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#0B706A]/15">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    selectedCategory === cat.id
                      ? 'bg-[#064946] text-white shadow-md'
                      : 'bg-[#F4F9F8] text-[#526060] hover:bg-[#E8F3F1] hover:text-[#064946]'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#526060] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F4F9F8] border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="pt-6 pb-8 text-xs font-semibold text-[#526060] uppercase tracking-wider">
            Showing {filteredServices.length} of {SERVICES.length} Services
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service: ServiceItem) => {
              const IconComponent = iconMap[service.icon] || Globe;
              const suitability = clientSuitability[service.id] || 'Businesses looking for top-tier digital execution.';

              return (
                <div
                  key={service.id}
                  id={`service-${service.id}`}
                  className="bg-[#F8FBFA] rounded-3xl p-7 border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#064946]/10 text-[#064946]">
                        {service.categoryLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-xl text-[#033B39] mb-3 group-hover:text-[#064946] transition-colors leading-snug">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#526060] leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Ideal Client Archetype */}
                    <div className="mb-5 p-3 rounded-xl bg-white/70 border border-[#0B706A]/15 text-[11px] text-[#344040]">
                      <strong className="text-[#064946] block mb-0.5">Best Suited For:</strong>
                      {suitability}
                    </div>

                    {/* Feature Details List */}
                    <div className="space-y-2 mb-6">
                      <div className="text-[11px] font-bold text-[#064946] uppercase tracking-wider">
                        Key Features & Deliverables:
                      </div>
                      {service.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#344040]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B706A] shrink-0 mt-0.5" />
                          <span className="leading-snug">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Deliverable Badge & CTA */}
                  <div className="pt-4 border-t border-[#0B706A]/10 flex flex-col gap-3">
                    <div className="text-[11px] text-[#526060] flex items-center gap-1.5">
                      <span className="font-bold text-[#064946]">Deliverable:</span>
                      <span className="truncate">{service.deliverables}</span>
                    </div>

                    <Link
                      to={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98]"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F5A623]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="text-center py-16 bg-[#F8FBFA] rounded-3xl border border-[#0B706A]/15 my-8">
              <p className="text-sm text-[#526060] mb-4">
                No services found matching "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#064946] text-white text-xs font-semibold"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Process Reminder Section */}
      <section className="py-20 bg-[#F4F9F8] border-t border-[#0B706A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#033B39] mb-4">
              Need a Custom Multi-Service Package?
            </h2>
            <p className="text-sm sm:text-base text-[#526060] leading-relaxed mb-8">
              Many clients combine website design with a full Canva social kit, SEO content bundle, or AI video campaign. Let’s create a tailored package fitting your specific timeline and budget.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-8 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <span>Request Custom Package</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Started on Your Digital Solution?"
        subtitle="Select any service above or drop me a message with your project goals."
      />
    </div>
  );
};
