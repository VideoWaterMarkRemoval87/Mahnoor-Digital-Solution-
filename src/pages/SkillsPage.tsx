import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  Palette,
  PenTool,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { AI_TOOLS, SKILL_CATEGORIES } from '../config/portfolioData';
import { CTASection } from '../components/CTASection';
import { usePageSEO } from '../hooks/usePageSEO';

export const SkillsPage: React.FC = () => {

  usePageSEO(
    'Skills & Expertise — WordPress, Elementor Pro, Canva, SEO | Mahnoor Digital Solution',
    'Technical skills in WordPress, Elementor Pro, Canva graphic design, SEO content writing, social media management and AI tools for freelance digital projects.'
  );
  const [activeToolCategory, setActiveToolCategory] = useState<string>('all');
  const [toolSearch, setToolSearch] = useState<string>('');

  const toolCategories = [
    { id: 'all', label: 'All Tools' },
    { id: 'ai', label: 'AI & Generative Tools' },
    { id: 'web', label: 'Web & CMS Engines' },
    { id: 'design', label: 'Design & UI/UX' },
    { id: 'productivity', label: 'Hosting & Infrastructure' },
  ];

  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter((tool) => {
      const matchesCategory =
        activeToolCategory === 'all' || tool.category === activeToolCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.role.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.useCase.toLowerCase().includes(toolSearch.toLowerCase()) ||
        tool.badge.toLowerCase().includes(toolSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeToolCategory, toolSearch]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return Globe;
      case 'Palette':
        return Palette;
      case 'PenTool':
        return PenTool;
      case 'Cpu':
      default:
        return Cpu;
    }
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
            <span className="text-[#F5A623]">Skills & Tools</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            Modern Tech Stack, Design Systems & AI-Accelerated Capabilities.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8">
            A transparent view into the software, platforms, generative models, and engineering standards that power Mahnoor Digital Solution.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-7 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Start a Project With This Tech Stack</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              <span>See Associated Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tool Cards Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>Dedicated Tool Cards</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#033B39] tracking-tight mb-4">
              The Tools & Software I Command Daily
            </h2>
            <p className="text-sm sm:text-base text-[#526060]">
              From industry staples like WordPress, Elementor, and Canva to cutting-edge AI powerhouses like Claude, ChatGPT, Antigravity, and ElevenLabs.
            </p>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-[#0B706A]/15">
            <div className="flex flex-wrap items-center gap-2">
              {toolCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveToolCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    activeToolCategory === cat.id
                      ? 'bg-[#064946] text-white shadow-md'
                      : 'bg-[#F4F9F8] text-[#526060] hover:bg-[#E8F3F1] hover:text-[#064946]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#526060] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Search tools & models..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F4F9F8] border border-[#0B706A]/20 text-xs sm:text-sm text-[#172222] focus:outline-none focus:ring-2 focus:ring-[#0B706A]"
              />
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-[#F8FBFA] rounded-3xl p-6 border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all duration-200 hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#064946]/10 text-[#064946]">
                      {tool.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#F5A623] group-hover:scale-125 transition-transform" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#033B39] mb-1 group-hover:text-[#064946] transition-colors">
                    {tool.name}
                  </h3>

                  <div className="text-xs font-semibold text-[#0B706A] mb-3">
                    {tool.role}
                  </div>

                  <p className="text-xs text-[#526060] leading-relaxed mb-4">
                    {tool.useCase}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0B706A]/10 text-[11px] font-semibold text-[#064946] flex items-center justify-between">
                  <span>Production Ready</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B706A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Professional Skill Matrices */}
      <section className="py-20 bg-[#F4F9F8] border-y border-[#0B706A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <span>Skill Matrix</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#033B39] tracking-tight mb-4">
              Core Competencies Grouped by Domain
            </h2>
            <p className="text-sm sm:text-base text-[#526060]">
              Every project is supported by proven technical depth and practical execution standards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SKILL_CATEGORIES.map((cat, idx) => {
              const IconComponent = getCategoryIcon(cat.icon);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-[#0B706A]/15 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#0B706A]/10">
                    <div className="w-12 h-12 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#033B39]">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-[#526060]">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {cat.skills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 rounded-2xl bg-[#F8FBFA] border border-[#0B706A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#033B39]">
                            {skill.name}
                          </div>
                          <div className="text-[11px] text-[#526060]">
                            {skill.description}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#064946] text-[#F5A623] self-start sm:self-center shrink-0">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Human-In-The-Loop Quality & Ethics Standard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#064946] to-[#033B39] rounded-3xl sm:rounded-[36px] p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#F5A623] mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Mahnoor Quality Standard</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white mb-4 leading-tight">
                  Why Human Supervision Is Non-Negotiable in My Studio
                </h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6">
                  Artificial intelligence is an extraordinary accelerator for prototyping, copy ideation, and code scaffolding—but pure AI output is generic, prone to subtle bugs, and lacks emotional nuance. Every deliverable produced by Mahnoor Digital Solution undergoes rigorous human review:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-white/90">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                    <span><strong>Manual Code & Layout QA:</strong> Verifying responsiveness on actual physical devices.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                    <span><strong>Fact-Checked Editorial Content:</strong> Eliminating generic AI hallucinations or clichés.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                    <span><strong>Original Brand Identity:</strong> Ensuring your business stands apart from competitors.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" />
                    <span><strong>Ethical AI Use:</strong> Respecting copyright, privacy, and licensed assets at all times.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl border border-white/15 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5A623] text-[#172222] flex items-center justify-center font-bold text-2xl mb-4 shadow-lg">
                  100%
                </div>
                <div className="font-display font-bold text-lg text-white mb-1">
                  Human-Crafted Polish
                </div>
                <p className="text-xs text-white/70 mb-6">
                  No automated dumps. Every asset is delivered ready for client presentation.
                </p>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-xs py-3 px-4 rounded-xl transition-all shadow"
                >
                  <span>Inquire for Your Brand</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Build With a Forward-Thinking Partner?"
        subtitle="Let's leverage the right technology and design system to accelerate your business goals."
      />
    </div>
  );
};
