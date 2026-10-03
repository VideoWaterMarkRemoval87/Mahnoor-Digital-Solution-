import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Layers,
  Palette,
  Terminal,
} from 'lucide-react';
import { ASSETS, SITE_CONFIG, PROCESS_STEPS } from '../config/portfolioData';
import { WhyChooseMe } from '../components/WhyChooseMe';
import { CTASection } from '../components/CTASection';
import { usePageSEO } from '../hooks/usePageSEO';

export const AboutPage: React.FC = () => {

  usePageSEO(
    'About Mahnoor Naaz — Freelance Web Designer & Digital Solutions Specialist',
    'Learn about Mahnoor Naaz, a freelance WordPress developer and digital designer with 6+ years experience serving clients across Pakistan, USA, UK and UAE.'
  );
  const milestones = [
    {
      label: 'Global Clients',
      value: '20+',
      description: 'Entrepreneurs, agencies, and clinics served across North America, Europe & GCC',
    },
    {
      label: 'Satisfaction Rate',
      value: '99%',
      description: 'Committed to iterative revisions until every project detail is 100% right',
    },
    {
      label: 'Turnaround Time',
      value: '3-7 Days',
      description: 'Rapid sprint delivery powered by modern design frameworks & smart workflows',
    },
    {
      label: 'Service Coverage',
      value: '18 Services',
      description: 'From WordPress & WooCommerce to Canva suites, SEO copy & AI solutions',
    },
  ];

  const pillars = [
    {
      title: 'Human-Centered Design',
      description:
        'Every button, font choice, and responsive layout is crafted with real people in mind. I prioritize legibility, speed, and seamless navigation over visual clutter.',
      icon: HeartHandshake,
    },
    {
      title: 'No Client Lock-In',
      description:
        'I build websites in Elementor and designs in Canva so that YOU own and control your assets. Every client receives video guides and master links for easy updates.',
      icon: ShieldCheck,
    },
    {
      title: 'AI Speed + Human Artistry',
      description:
        'I utilize modern AI tools (Claude, ChatGPT, Gemini, ElevenLabs) to cut research and drafting time in half, while personally reviewing and refining every pixel.',
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#172222]">
      {/* Page Hero Header */}
      <section className="bg-gradient-to-b from-[#033B39] via-[#064946] to-[#075B57] text-white pt-36 pb-20 md:pt-44 md:pb-24 curved-bottom relative overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          {/* Breadcrumbs / Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15 backdrop-blur-md">
            <Link to="/" className="hover:text-[#F5A623] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F5A623]">About Me</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] mb-6 max-w-4xl">
            Passionate About Crafting High-Impact Digital Experiences for Modern Businesses.
          </h1>

          <p className="text-base sm:text-xl text-white/85 max-w-2xl font-normal leading-relaxed mb-8">
            Get to know the consultant, methodology, and philosophy behind Mahnoor Digital Solution.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-sm px-6 py-3.5 rounded-full transition-transform hover:-translate-y-0.5 shadow-lg"
            >
              <span>Work With Me</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              <span>Explore My Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Introduction & Background */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#033B39]">
                <img
                  src={ASSETS.heroFreelancer}
                  alt="Mahnoor Digital Specialist"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#033B39]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-1">
                    Mahnoor
                  </div>
                  <div className="font-display font-extrabold text-xl">
                    Founder & Lead Digital Specialist
                  </div>
                </div>
              </div>

              {/* Floating detail badge */}
              <div className="absolute -bottom-6 -right-2 sm:right-4 bg-white rounded-2xl p-4 shadow-xl border border-[#0B706A]/20 max-w-[240px]">
                <div className="flex items-center gap-2 text-[#064946] mb-1">
                  <Globe className="w-4 h-4 text-[#F5A623]" />
                  <span className="font-bold text-xs">Remote Worldwide</span>
                </div>
                <p className="text-[11px] text-[#526060]">
                  Delivering seamlessly across time zones with fluent English communication.
                </p>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-[#F5A623]" />
                <span>My Story & Mission</span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#033B39] tracking-tight leading-tight mb-6">
                A Dedicated Partner for Your Online Success
              </h2>

              <div className="space-y-4 text-[#526060] text-sm sm:text-base leading-relaxed mb-8">
                <p>
                  I created <strong className="text-[#033B39]">Mahnoor Digital Solution</strong> with a single mission: to eliminate the friction, delays, and confusing technical jargon that business owners encounter when trying to launch or scale their online presence.
                </p>
                <p>
                  Too many business owners are handed broken, sluggish websites built on complicated custom systems they can't manage themselves. My approach is different: I combine the unmatched versatility of <strong>WordPress & Elementor</strong> with the intuitive simplicity of <strong>Canva Pro templates</strong>. This guarantees that your brand looks world-class today and remains completely editable by you tomorrow.
                </p>
                <p>
                  By thoughtfully embracing next-generation AI tools, I am able to prototype, draft, and organize assets in hours rather than weeks. This translates to faster turnaround times, lower overhead, and more attention invested in your unique brand narrative.
                </p>
              </div>

              {/* Key Values List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#033B39] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0B706A] shrink-0" />
                  <span>Bespoke, original layouts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#033B39] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0B706A] shrink-0" />
                  <span>Mobile & desktop responsiveness</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#033B39] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0B706A] shrink-0" />
                  <span>Clear project milestones & deadlines</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#033B39] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#0B706A] shrink-0" />
                  <span>Complete post-launch handover training</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-150 shadow-md"
              >
                <span>Discuss Your Project Directly</span>
                <ArrowRight className="w-4 h-4 text-[#F5A623]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Milestones & Experience Stats */}
      <section className="py-16 bg-[#F4F9F8] border-y border-[#0B706A]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#0B706A]/15 shadow-sm text-center sm:text-left flex flex-col justify-between"
              >
                <div>
                  <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#064946] mb-2">
                    {m.value}
                  </div>
                  <div className="text-sm font-bold text-[#033B39] mb-2 uppercase tracking-wide">
                    {m.label}
                  </div>
                </div>
                <p className="text-xs text-[#526060] leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Philosophies */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#064946]/10 text-[#064946] text-xs sm:text-sm font-bold uppercase tracking-wider mb-4">
              <span>My Philosophy</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#033B39] tracking-tight mb-4">
              Built on Principles That Prioritize Your Growth
            </h2>
            <p className="text-base text-[#526060]">
              Working with a freelancer should feel like a relief, not an ordeal. Here is what you can count on when we collaborate:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FBFA] rounded-3xl p-8 border border-[#0B706A]/15 hover:border-[#0B706A]/40 transition-all hover:shadow-lg flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#064946] text-[#F5A623] flex items-center justify-center mb-6 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#033B39] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#526060] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Approach & 4-Step Process */}
      <section className="py-20 bg-[#033B39] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-white/15">
              <span>Methodology</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4">
              A Clear, Stress-Free 4-Step Process
            </h2>
            <p className="text-base text-white/80">
              No guesswork. From our initial conversation to post-launch handover, you always know what is happening next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.number}
                className="bg-[#064946]/80 rounded-3xl p-6 border border-[#0B706A]/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-extrabold text-3xl text-[#F5A623]">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white/90">
                      Phase {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] text-[#F5A623] font-semibold">
                  Deliverables: {step.deliverables.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser Box for Skills & Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F4F9F8] rounded-3xl p-8 sm:p-12 border border-[#0B706A]/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#064946] uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4 text-[#F5A623]" />
                <span>Toolbox & Technical Proficiency</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#033B39] mb-3">
                Curious About the Exact Tools & Technologies I Use?
              </h3>
              <p className="text-sm sm:text-base text-[#526060] leading-relaxed">
                Explore my full toolkit including WordPress, Elementor Pro, Canva Pro, Hostinger, plus smart AI workflows using Claude, ChatGPT, ElevenLabs, and Gemini.
              </p>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-2 bg-[#064946] hover:bg-[#033B39] text-white font-bold text-sm px-7 py-4 rounded-full transition-transform hover:-translate-y-0.5 shrink-0 shadow-md"
            >
              <span>View Skills & Tools Page</span>
              <ArrowRight className="w-4 h-4 text-[#F5A623]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Me Matrix */}
      <WhyChooseMe />

      {/* Call To Action */}
      <CTASection
        title="Ready to Collaborate on Your Next Digital Project?"
        subtitle="Let's build a clean, high-performing website and memorable visual identity for your business."
      />
    </div>
  );
};
