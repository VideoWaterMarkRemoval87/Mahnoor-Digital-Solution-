import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'light' means light text for dark backgrounds (navbar/footer), 'dark' means dark text for light backgrounds
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  showText = true,
  showTagline = true,
  className = '',
}) => {
  // Dimensions for the <MDS> mark
  const sizeConfig = {
    sm: {
      emblemClass: 'w-8 h-8 rounded-lg text-xs',
      brandText: 'text-xs sm:text-sm font-bold tracking-tight',
      taglineText: 'text-[9px] sm:text-[10px]',
      bracketSize: 'text-xs',
      mdsSize: 'text-[10px] sm:text-[11px] font-extrabold tracking-tight',
    },
    md: {
      emblemClass: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm shrink-0',
      brandText: 'text-sm sm:text-base lg:text-lg font-bold tracking-tight',
      taglineText: 'text-[10px] sm:text-[11px]',
      bracketSize: 'text-xs sm:text-sm',
      mdsSize: 'text-xs sm:text-[13px] font-black tracking-tight',
    },
    lg: {
      emblemClass: 'w-12 h-12 rounded-2xl text-base',
      brandText: 'text-xl sm:text-2xl font-black',
      taglineText: 'text-xs',
      bracketSize: 'text-base',
      mdsSize: 'text-base font-black tracking-tight',
    },
    xl: {
      emblemClass: 'w-16 h-16 rounded-2xl text-xl',
      brandText: 'text-2xl sm:text-3xl font-black',
      taglineText: 'text-sm',
      bracketSize: 'text-xl',
      mdsSize: 'text-xl font-black tracking-tight',
    },
  }[size];

  const isLight = variant === 'light'; // Light text for dark backgrounds

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* The <MDS> Brand Emblem */}
      <div
        className={`${sizeConfig.emblemClass} relative flex items-center justify-center bg-gradient-to-br from-[#0B706A] via-[#064946] to-[#033B39] border border-[#F5A623]/40 shadow-md group-hover:border-[#F5A623] group-hover:shadow-[#F5A623]/20 transition-all duration-300 flex-shrink-0`}
        aria-hidden="true"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-black/20 via-transparent to-white/15 pointer-events-none" />

        {/* <MDS> Text with Stylized Brackets */}
        <div className="relative z-10 flex items-center justify-center font-mono leading-none">
          <span className={`text-[#F5A623] ${sizeConfig.bracketSize} font-bold opacity-90 group-hover:translate-x-[-1px] transition-transform`}>
            &lt;
          </span>
          <span className={`text-white ${sizeConfig.mdsSize} px-[1.5px] uppercase font-sans tracking-tighter drop-shadow-sm`}>
            MDS
          </span>
          <span className={`text-[#F5A623] ${sizeConfig.bracketSize} font-bold opacity-90 group-hover:translate-x-[1px] transition-transform`}>
            &gt;
          </span>
        </div>

        {/* Active pulse corner dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F5A623] border-2 border-[#033B39]" />
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`${sizeConfig.brandText} tracking-tight leading-tight transition-colors ${
                isLight ? 'text-white group-hover:text-white/95' : 'text-[#033B39] group-hover:text-[#064946]'
              }`}
            >
              Mahnoor Digital Solution
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`${sizeConfig.taglineText} font-medium tracking-wide uppercase ${
                  isLight ? 'text-[#F5A623]' : 'text-[#0B706A]'
                }`}
              >
                Web Design • Creative • AI
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
