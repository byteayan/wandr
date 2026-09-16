import React from 'react';

interface WandrLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'icon-only' | 'stacked' | 'horizontal';
  theme?: 'dark' | 'light' | 'white' | 'color';
  animated?: boolean;
  withTagline?: boolean;
}

export const WandrLogo: React.FC<WandrLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  theme = 'color',
  animated = false,
  withTagline = false,
}) => {
  // Dimension definitions
  const sizeMap = {
    xs: { icon: 'w-5 h-3.5', text: 'text-sm', badge: 'text-[8px]', box: 'w-6 h-6' },
    sm: { icon: 'w-6 h-4', text: 'text-base', badge: 'text-[9px]', box: 'w-7 h-7' },
    md: { icon: 'w-8 h-5.5', text: 'text-lg sm:text-xl', badge: 'text-[10px]', box: 'w-9 h-9' },
    lg: { icon: 'w-11 h-7.5', text: 'text-2xl sm:text-3xl', badge: 'text-xs', box: 'w-12 h-12' },
    xl: { icon: 'w-16 h-11', text: 'text-3xl sm:text-4xl', badge: 'text-xs', box: 'w-16 h-16' },
    hero: { icon: 'w-24 h-16', text: 'text-5xl sm:text-6xl', badge: 'text-sm', box: 'w-24 h-24' },
  };

  const currentSize = sizeMap[size];

  // Mountain SVG Icon Component matching uploaded design precisely
  const MountainIcon = ({ iconClass = '' }: { iconClass?: string }) => (
    <svg
      viewBox="0 0 100 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconClass || currentSize.icon} shrink-0 transition-transform duration-300 ${
        animated ? 'hover:scale-105' : ''
      }`}
    >
      <defs>
        <linearGradient id="wandrMountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA726" />
          <stop offset="35%" stopColor="#FF7043" />
          <stop offset="70%" stopColor="#FF5722" />
          <stop offset="100%" stopColor="#E64A19" />
        </linearGradient>
        <linearGradient id="wandrMountainGlow" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FFB300" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF5722" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D84315" stopOpacity="0.8" />
        </linearGradient>
        <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FF5722" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Stylized Dual/Tri-Peak Geometric Mountain Silhouette */}
      <path
        d="M 6 44 
           L 28 22 
           L 41 33 
           L 60 7 
           L 78 33 
           L 87 23 
           L 96 44 
           L 84 34 
           L 77 41 
           L 60 17 
           L 41 41 
           L 28 32 
           Z"
        fill="url(#wandrMountainGrad)"
        filter="url(#subtleGlow)"
      />
    </svg>
  );

  // Text color based on theme
  const getTextColor = () => {
    switch (theme) {
      case 'white':
        return 'text-white';
      case 'dark':
        return 'text-[#181E24]';
      case 'light':
        return 'text-stone-900';
      case 'color':
      default:
        return 'text-[#181E24]';
    }
  };

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <MountainIcon />
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center text-center select-none ${className}`}
      >
        <div className="p-3.5 rounded-3xl bg-[#181E24] shadow-xl border border-stone-800/80 mb-2 flex items-center justify-center">
          <MountainIcon iconClass="w-14 h-9" />
        </div>
        <span
          className={`font-sans font-bold tracking-tight lowercase text-xl sm:text-2xl ${getTextColor()}`}
        >
          wandr
        </span>
        {withTagline && (
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400 mt-1">
            Curated Journeys
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Dark brand badge container matching uploaded aesthetic */}
        <div
          className={`${currentSize.box} rounded-2xl bg-[#181E24] border border-stone-800/90 flex items-center justify-center shadow-xs transition-all duration-300 group-hover:border-[#FF5722]/50 group-hover:shadow-[#FF5722]/20`}
        >
          <MountainIcon />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-sans font-bold tracking-tight lowercase ${currentSize.text} ${getTextColor()}`}
          >
            wandr
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] mt-0.5 inline-block" />
        </div>
        {withTagline && (
          <span
            className={`uppercase tracking-[0.22em] font-medium text-stone-400 mt-1 hidden sm:block ${currentSize.badge}`}
          >
            Curated Journeys
          </span>
        )}
      </div>
    </div>
  );
};
