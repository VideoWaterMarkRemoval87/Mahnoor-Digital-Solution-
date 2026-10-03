import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
  Search,
  X,
  SlidersHorizontal,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../config/portfolioData';
import { PortfolioItem } from '../types';
import { ProjectModal } from '../components/ProjectModal';
import { CTASection } from '../components/CTASection';
import { usePageSEO } from '../hooks/usePageSEO';

type CategoryFilter = 'All' | 'WordPress' | 'Canva' | 'Content' | 'AI Solutions';

export const PortfolioPage: React.FC = () => {

  usePageSEO(
    'Portfolio — Recent Web Design & Digital Projects | Mahnoor Digital Solution',
    'Browse recent website design, Canva branding and digital marketing projects delivered for international clients.'
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'timeline' | 'title'>('featured');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Core category list with descriptions
  const categories: { key: CategoryFilter; label: string; description: string }[] = [
    { key: 'All', label: 'All Projects', description: 'Complete showcase across all disciplines' },
    { key: 'WordPress', label: 'WordPress', description: 'Custom layouts, Elementor Pro & WooCommerce' },
    { key: 'Canva', label: 'Canva', description: 'Editable brand kits, real estate collateral & decks' },
    { key: 'Content', label: 'Content', description: 'SEO pillar articles, sales copy & lead nurturing' },
    { key: 'AI Solutions', label: 'AI Solutions', description: 'AI visual workflows, video reels & prototyping' },
  ];

  // Distinct tools extracted from portfolio data
  const availableTools = useMemo(() => {
    const toolsSet = new Set<string>();
    PORTFOLIO_ITEMS.forEach((item) => {
      item.toolsUsed.forEach((tool) => toolsSet.add(tool));
    });
    return ['All', ...Array.from(toolsSet).slice(0, 10)];
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      All: PORTFOLIO_ITEMS.length,
      WordPress: 0,
      Canva: 0,
      Content: 0,
      'AI Solutions': 0,
    };

    PORTFOLIO_ITEMS.forEach((item) => {
      const cat = item.category as CategoryFilter;
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });

    return counts;
  }, []);

  // Filter and sort items
  const filteredProjects = useMemo(() => {
    return PORTFOLIO_ITEMS.filter((item) => {
      // 1. Category filter
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

      // 2. Search query filter (title, shortDesc, fullDesc, clientType, toolsUsed)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.fullDesc.toLowerCase().includes(q) ||
        item.clientType.toLowerCase().includes(q) ||
        item.toolsUsed.some((tool) => tool.toLowerCase().includes(q));

      // 3. Tool tag filter
      const matchesTool = selectedTool === 'All' || item.toolsUsed.includes(selectedTool);

      return matchesCategory && matchesSearch && matchesTool;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'timeline') {
        return a.timeline.localeCompare(b.timeline);
      }
      return 0; // featured maintains curated order
    });
  }, [selectedCategory, searchQuery, selectedTool, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedTool('All');
    setSortBy('featured');
  };

  const isFilteringActive =
    selectedCategory !== 'All' || searchQuery !== '' || selectedTool !== 'All' || sortBy !== 'featured';

  return (
    <div className="min-h-screen bg-white text-[#172222]">
      {/* Page Hero Header */}
      <section className="bg-gradient-to-b from-[#033B39] via-[#064946] to-[#075B57] text-white pt-36 pb-20 md:pt-44 md:pb-24 curved-bottom relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15 backdrop-blur-md">
            <Link to="/" className="hover:text-[#F5A623] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#F5A623]">Portfolio</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            Selected Works & Proof of Digital Craftsmanship.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8">
            Explore recent WordPress websites, editable Canva brand systems, SEO content campaigns, and AI-accelerated workflows delivered for clients worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-7 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Commission Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              <span>Explore My Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Portfolio Explorer Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. Category Filter Navigation Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#064946] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span>Filter by Discipline</span>
                </span>
                <p className="text-xs text-[#526060] mt-0.5">
                  Select a category below to browse specific project case studies
                </p>
              </div>

              {isFilteringActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064946] hover:text-[#033B39] bg-[#F4F9F8] border border-[#0B706A]/20 hover:border-[#0B706A]/40 px-3.5 py-1.5 rounded-full transition-all"
                >
                  <RotateCcw className="w-3 h-3 text-[#F5A623]" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            {/* Category Buttons with Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const count = categoryCounts[cat.key];

                return (
                  <button
                    key={cat.key}
                    type="button"
                    id={`filter-btn-${cat.key.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#064946] text-white border-[#064946] shadow-lg -translate-y-0.5'
                        : 'bg-[#F8FBFA] text-[#172222] border-[#0B706A]/15 hover:border-[#0B706A]/40 hover:bg-[#F0F7F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-[#033B39]'}`}>
                        {cat.label}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${
                          isSelected
                            ? 'bg-[#F5A623] text-[#172222]'
                            : 'bg-white border border-[#0B706A]/20 text-[#064946]'
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] leading-tight line-clamp-2 ${
                        isSelected ? 'text-white/80' : 'text-[#526060]'
                      }`}
                    >
                      {cat.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Secondary Toolbar: Search, Tool Filter, and Sort */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/15 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#526060] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="portfolio-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects (e.g., Elementor, Real Estate, WooCommerce, SEO)..."
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-[#0B706A]/20 focus:border-[#064946] focus:ring-2 focus:ring-[#064946]/10 text-xs sm:text-sm text-[#172222] placeholder-[#526060]/70 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#526060] hover:text-[#172222]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Tool Selector & Sort By */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-[#526060] shrink-0">Tool:</span>
                <select
                  id="portfolio-tool-filter"
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="bg-white border border-[#0B706A]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#064946] outline-none focus:border-[#064946] w-full sm:w-auto cursor-pointer"
                >
                  {availableTools.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool === 'All' ? 'All Technologies' : tool}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-[#526060] shrink-0">Sort:</span>
                <select
                  id="portfolio-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'timeline' | 'title')}
                  className="bg-white border border-[#0B706A]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#064946] outline-none focus:border-[#064946] w-full sm:w-auto cursor-pointer"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="timeline">Fastest Delivery</option>
                  <option value="title">Alphabetical (A–Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Results Summary Row */}
          <div className="pb-6 text-xs font-semibold text-[#526060] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0B706A]/15 mb-8">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider font-bold text-[#064946]">
                Showing {filteredProjects.length} of {PORTFOLIO_ITEMS.length} Projects
              </span>
              {selectedCategory !== 'All' && (
                <span className="px-2 py-0.5 rounded-full bg-[#064946]/10 text-[#064946] text-[11px] font-bold">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedTool !== 'All' && (
                <span className="px-2 py-0.5 rounded-full bg-[#F5A623]/20 text-[#172222] text-[11px] font-bold">
                  Tool: {selectedTool}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-[#172222] text-[11px] font-medium">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            <span className="text-[#064946] text-xs">
              Click any project card to review complete scope and deliverables
            </span>
          </div>

          {/* 4. Project Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
              {filteredProjects.map((item) => (
                <div
                  key={item.id}
                  id={`portfolio-item-${item.id}`}
                  className="bg-[#F8FBFA] rounded-3xl overflow-hidden border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Container with zoom */}
                    <div
                      className="relative h-72 sm:h-80 overflow-hidden bg-[#033B39] cursor-pointer"
                      onClick={() => setSelectedProject(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#033B39]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-[#F5A623] text-[#172222] font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                          <span>View Project Case</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>

                      {/* Top Left: Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#033B39]/90 text-white backdrop-blur-md border border-white/20">
                          {item.category}
                        </span>
                      </div>

                      {/* Top Right: Timeline Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#064946] backdrop-blur-md shadow-sm flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#F5A623]" />
                          <span>{item.timeline}</span>
                        </span>
                      </div>

                      {/* Bottom Left: Live vs Concept badge — honest labeling so
                          visitors know which projects are real, verifiable client
                          work (with a live site) vs. original design samples. */}
                      <div className="absolute bottom-4 left-4">
                        {!item.isConcept && item.liveUrl ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#25D366]/95 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                            ✓ Live Client Site
                          </span>
                        ) : item.isConcept ? (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-[#526060] backdrop-blur-md shadow-sm">
                            Concept Sample
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-7 sm:p-8">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#F5A623] mb-1.5">
                        {item.clientType}
                      </div>

                      <h3
                        onClick={() => setSelectedProject(item)}
                        className="font-display font-bold text-2xl text-[#033B39] mb-3 group-hover:text-[#064946] transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      <p className="text-sm text-[#526060] leading-relaxed mb-6">
                        {item.shortDesc}
                      </p>

                      {/* Tools Used Pills */}
                      <div className="mb-4">
                        <div className="text-[11px] font-bold text-[#064946] uppercase tracking-wider mb-2">
                          Technologies & Tools:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.toolsUsed.map((tool: string, idx: number) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedTool(tool)}
                              className="px-2.5 py-1 rounded-md bg-white border border-[#0B706A]/20 hover:border-[#0B706A] text-xs font-semibold text-[#064946] transition-colors"
                              title={`Filter by ${tool}`}
                            >
                              {tool}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Key Deliverable */}
                      <div className="text-xs text-[#526060] p-3.5 rounded-xl bg-white border border-[#0B706A]/15">
                        <strong className="text-[#064946]">Key Deliverables: </strong>
                        <span>{item.deliverables.join(' • ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-7 sm:px-8 pb-6 pt-3 border-t border-[#0B706A]/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064946] hover:text-[#F5A623] transition-colors"
                    >
                      <span>View Case Study</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      to={`/contact?service=${encodeURIComponent(item.title)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#F5A623] hover:text-[#e0951b] bg-[#064946] hover:bg-[#033B39] px-3.5 py-2 rounded-xl shadow-sm transition-all"
                    >
                      <span>Request Similar Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 5. Zero-State Fallback when no projects match */
            <div className="p-12 sm:p-16 rounded-3xl bg-[#F8FBFA] border border-[#0B706A]/20 text-center max-w-xl mx-auto my-12">
              <div className="w-14 h-14 rounded-2xl bg-[#064946]/10 text-[#064946] flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#033B39] mb-2">
                No Projects Match Your Filter
              </h3>
              <p className="text-xs sm:text-sm text-[#526060] leading-relaxed mb-6">
                We couldn&apos;t find any case studies matching &ldquo;{searchQuery || selectedCategory || selectedTool}&rdquo;.
                Try resetting your filters or selecting another category.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-xs px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>Show All Projects</span>
              </button>
            </div>
          )}

          {/* 6. Custom Consultation Note */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F4F9F8] border border-[#0B706A]/15 text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5A623] block mb-1">
              Custom Requirements
            </span>
            <h4 className="font-display font-extrabold text-xl sm:text-2xl text-[#033B39] mb-2">
              Have a Project That Doesn&apos;t Fit Neatly into a Box?
            </h4>
            <p className="text-xs sm:text-sm text-[#526060] leading-relaxed mb-6 max-w-xl mx-auto">
              I frequently create customized cross-discipline solutions combining custom WordPress architectures, reusable Canva kits, and SEO content strategies for unique client objectives.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <span>Schedule a 1-on-1 Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#F5A623]" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Your Next Success Story?"
        subtitle="Let's create a tailored digital solution that meets your deadlines and exceeds expectations."
      />

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
