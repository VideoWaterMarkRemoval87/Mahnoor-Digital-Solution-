import React from 'react';
import {
  Sparkles,
  Smartphone,
  MessageSquare,
  Target,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { VALUE_CARDS } from '../config/portfolioData';

export const WhyChooseMe: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#F5A623]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#F5A623]" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-[#F5A623]" />;
      case 'Target': return <Target className="w-5 h-5 text-[#F5A623]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#F5A623]" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-[#F5A623]" />;
      default: return <Sparkles className="w-5 h-5 text-[#F5A623]" />;
    }
  };

  return (
    <section
      id="why-choose-me"
      className="py-20 md:py-28 bg-[#064946] text-white relative curved-top curved-bottom overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B706A]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
            Quality & Partnership
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            Why Clients Choose Professional Digital Solutions
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            Delivering clean execution, rigorous attention to layout, and reliable turnaround that supports your long-term business reputation.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {VALUE_CARDS.map((card, idx) => (
            <div
              key={idx}
              id={`why-card-${idx}`}
              className="p-7 rounded-[22px] bg-[#033B39]/70 border border-white/15 hover:border-[#F5A623]/50 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 border border-white/10">
                  {getIcon(card.icon)}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2.5">
                  {card.title}
                </h3>
                <p className="text-sm text-white/75 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-[#F5A623]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                <span>Client-Focused Standard</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
