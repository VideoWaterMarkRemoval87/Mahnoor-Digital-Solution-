import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Smile,
  Globe,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface StatMetric {
  id: string;
  category: 'all' | 'web' | 'design' | 'satisfaction';
  targetValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  subtitle: string;
  highlight: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Every number below is something Mahnoor can stand behind if a client asks
// "how do you know that?" — years of experience, platforms she's actually on,
// and service commitments she controls. The previous version of this file had
// specific unverifiable claims (140 "projects completed", 98% "happy clients",
// 65 "global clients" across "14+ countries", 320 "Canva templates", a 4.9/5.0
// "average rating") with no data behind them. Besides being dishonest to
// visitors, specific fabricated numbers like these are also what real client
// reviews and Google's ad/structured-data policies actively check for — so
// they're a business risk, not just an ethics one. Replace any of these with
// your real figures the moment you have them (e.g. from Fiverr/Upwork stats).
const STATS_DATA: StatMetric[] = [
  {
    id: 'years-experience',
    category: 'all',
    targetValue: 6,
    suffix: '+',
    label: 'Years Freelancing',
    subtitle: 'Web design, graphic design, content writing and social media management.',
    highlight: 'Since 2020',
    icon: Briefcase,
  },
  {
    id: 'platforms-active',
    category: 'all',
    targetValue: 3,
    suffix: '',
    label: 'Freelance Platforms',
    subtitle: 'Active and verifiable on Fiverr, Upwork and LinkedIn.',
    highlight: 'Fiverr • Upwork • LinkedIn',
    icon: Globe,
  },
  {
    id: 'service-categories',
    category: 'all',
    targetValue: 5,
    suffix: '+',
    label: 'Core Services',
    subtitle: 'WordPress/Elementor, Canva design, SEO content, social media & AI workflows.',
    highlight: 'One Freelancer, Full Toolkit',
    icon: TrendingUp,
  },
  {
    id: 'turnaround',
    category: 'all',
    targetValue: 7,
    prefix: '3–',
    suffix: ' Days',
    label: 'Typical Turnaround',
    subtitle: 'Standard delivery window for most WordPress/Elementor website projects.',
    highlight: 'Timeline Confirmed Upfront',
    icon: Zap,
  },
  {
    id: 'response-time',
    category: 'satisfaction',
    targetValue: 2,
    prefix: '< ',
    suffix: ' Hours',
    label: 'Response Time Commitment',
    subtitle: 'Every inquiry gets a reply within this window during working hours.',
    highlight: 'WhatsApp & Email',
    icon: Clock,
  },
];

// Custom Animated Counter component using requestAnimationFrame
interface CounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  trigger: boolean;
  replayKey: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({
  end,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  trigger,
  replayKey,
}) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (!trigger) {
      setCurrent(0);
      return;
    }

    // Check for user reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrent(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (x: number): number => {
      return 1 - Math.pow(1 - x, 3);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const nextVal = easedProgress * end;
      setCurrent(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, trigger, replayKey]);

  const formattedNumber = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();

  return (
    <span className="tabular-nums tracking-tight">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'web' | 'design' | 'satisfaction'>('all');
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Trigger counters when scrolled into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  // Filtered metrics or all overview
  const displayedStats =
    selectedFilter === 'all'
      ? STATS_DATA.slice(0, 4)
      : STATS_DATA.filter((s) => s.category === selectedFilter || s.category === 'all');

  return (
    <section
      id="stats-section"
      ref={sectionRef}
      className="relative py-20 sm:py-24 bg-[#033B39] text-white overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B706A]/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Proven Track Record & Client Success</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Quantifiable Results Delivered Worldwide
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
              Every project is measured by performance, visual impact, and customer satisfaction.
              Here is a look at the milestones achieved across web development, brand kits, and digital solutions.
            </p>
          </div>

          {/* Interactive Filter Pills & Replay Trigger */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 p-1 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md">
              <button
                type="button"
                id="btn-filter-stats-all"
                onClick={() => setSelectedFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-[#F5A623] text-[#172222] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                id="btn-filter-stats-satisfaction"
                onClick={() => setSelectedFilter('satisfaction')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedFilter === 'satisfaction'
                    ? 'bg-[#F5A623] text-[#172222] shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Satisfaction
              </button>
            </div>

            {/* Replay Counters Button */}
            <button
              type="button"
              id="btn-replay-stats-counter"
              onClick={handleReplay}
              title="Re-run animated counters"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 text-xs font-semibold rounded-xl border border-white/15 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          </div>
        </div>

        {/* Stats Grid with Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                id={`stat-card-${stat.id}`}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F5A623]/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                {/* Top Row: Icon & Highlight Badge */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#F5A623] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#0B706A]/40 text-emerald-300 border border-emerald-400/30">
                      {stat.highlight}
                    </span>
                  </div>

                  {/* Animated Counter Number */}
                  <div className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-2 tracking-tight">
                    <AnimatedCounter
                      end={stat.targetValue}
                      decimals={stat.decimals ?? 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      trigger={isVisible}
                      replayKey={replayKey}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="font-display font-bold text-lg text-[#F5A623] mb-2">
                    {stat.label}
                  </h3>

                  {/* Context Subtitle */}
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    {stat.subtitle}
                  </p>
                </div>

                {/* Bottom Proof Micro-indicator */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span>Verified Client Outcome</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Proof Strip with Client Assurance */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-white/10 via-[#064946] to-white/10 border border-white/15 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5A623] text-[#172222] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-base font-bold text-white">
                Guaranteed Satisfaction & Post-Launch Support
              </div>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                Every project includes 14 days of complimentary post-delivery support, clear video handovers, and full ownership transfer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/portfolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5A623] hover:bg-[#e0951b] text-[#172222] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <span>Explore Verified Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full border border-white/20 transition-all"
            >
              <span>Hire Mahnoor</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
