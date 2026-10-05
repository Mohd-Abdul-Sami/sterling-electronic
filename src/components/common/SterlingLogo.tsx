import React, { useState } from 'react';

// Authentic logo images matching the user's uploaded branding
export const STERLING_LOGO_IMG = '/src/assets/images/sterling_brand_logo_1791210416862.jpg';
export const STERLING_EMBLEM_IMG = '/src/assets/images/sterling_emblem_icon_1791210437099.jpg';

interface SterlingLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'image' | 'hybrid' | 'vector';
  onClick?: () => void;
}

export const SterlingLogo: React.FC<SterlingLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  variant = 'hybrid',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height configurations for image representation
  const imgHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.14em]',
    md: 'text-xl sm:text-2xl tracking-[0.16em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.18em]',
    xl: 'text-5xl tracking-[0.20em]',
  };

  const subSizes = {
    sm: 'text-[8px] tracking-[0.28em]',
    md: 'text-[9.5px] tracking-[0.32em]',
    lg: 'text-[12px] tracking-[0.36em]',
    xl: 'text-[14px] tracking-[0.40em]',
  };

  // If user requests direct image mode (or default hybrid on larger hero displays)
  if (variant === 'image' && !imageError) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none group cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${className}`}
      >
        <img
          src={STERLING_LOGO_IMG}
          alt="Sterling Electronic Sales"
          onError={() => setImageError(true)}
          className={`${imgHeights[size]} object-contain object-left mix-blend-screen drop-shadow-[0_0_24px_rgba(0,210,255,0.4)] filter contrast-110`}
        />
      </div>
    );
  }

  // Hybrid Mode: Crisp 3D shield emblem + metallic beveled typography + circuit motherboard trace
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none group ${className}`}
    >
      {/* 1. Shield Emblem with Cyan Aura */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Electric cyan backlight glow behind shield */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/25 blur-md group-hover:bg-cyan-400/40 transition-all duration-300 pointer-events-none scale-125" />

        {/* 3D Faceted Shield Emblem SVG */}
        <svg
          className={`${emblemSizes[size]} relative z-10 drop-shadow-[0_4px_14px_rgba(0,210,255,0.5)] transition-transform duration-300 group-hover:scale-105`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer metallic shield gradient */}
            <linearGradient id="shieldMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="35%" stopColor="#1e293b" />
              <stop offset="70%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Cyan glow facet gradient */}
            <linearGradient id="shieldCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Chrome edge highlight */}
            <linearGradient id="chromeEdge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Glowing Lightning bolt gradient */}
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#00d2ff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Filter for glowing neon core */}
            <filter id="neonCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Shield Hexagonal Silhouette */}
          <path
            d="M50 4 L88 20 L84 64 L50 96 L16 64 L12 20 Z"
            fill="url(#shieldMetallicGrad)"
            stroke="url(#chromeEdge)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Top-Right Faceted Chamfer */}
          <path
            d="M50 4 L88 20 L76 34 L50 22 Z"
            fill="#64748b"
            opacity="0.35"
          />

          {/* Left Faceted Wing with Electric Cyan Accent */}
          <path
            d="M12 20 L50 4 L50 22 L24 34 Z"
            fill="url(#shieldCyanGlow)"
            opacity="0.85"
          />

          {/* Lower Right Facet */}
          <path
            d="M84 64 L50 96 L50 74 L74 54 Z"
            fill="#1e293b"
            opacity="0.9"
          />

          {/* Lower Left Facet with Cyan Highlight */}
          <path
            d="M16 64 L50 96 L50 74 L26 54 Z"
            fill="url(#shieldCyanGlow)"
            opacity="0.7"
          />

          {/* Circular Cybernetic Core Background */}
          <circle
            cx="50"
            cy="48"
            r="24"
            fill="#030712"
            stroke="#0ea5e9"
            strokeWidth="1.8"
            opacity="0.9"
          />

          {/* Cybernetic Circuit Track Ring */}
          <circle
            cx="50"
            cy="48"
            r="19"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 2 8 2"
            opacity="0.8"
          />

          {/* Upper Right Circuit Node with Trace */}
          <path
            d="M64 34 L72 26"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="72" cy="26" r="3" fill="#00d2ff" stroke="#fff" strokeWidth="1" />

          {/* Lower Left Circuit Node with Trace */}
          <path
            d="M36 62 L28 70"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="28" cy="70" r="3" fill="#00d2ff" stroke="#fff" strokeWidth="1" />

          {/* Central Glowing Lightning Bolt Symbol */}
          <g filter="url(#neonCoreGlow)">
            <path
              d="M52 28 L38 48 H50 L46 68 L64 44 H52 Z"
              fill="url(#boltGrad)"
            />
          </g>
        </svg>
      </div>

      {/* 2. Metallic Beveled Typography & Circuit Subtitle */}
      <div className="flex flex-col leading-none">
        {/* Main "STERLING" Wordmark in Metallic Steel Chrome */}
        <span
          className={`${titleSizes[size]} font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-[0.16em]`}
          style={{
            fontFamily: "'Outfit', 'Montserrat', sans-serif",
            textShadow: '0 0 16px rgba(56, 189, 248, 0.25)',
          }}
        >
          STERLING
        </span>

        {/* Subtitle with Circuit Motherboard Trace Lines */}
        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1 sm:mt-1.5">
            {/* SVG Circuit Motherboard Trace Line Icon matching the logo picture */}
            <svg
              className="h-2.5 sm:h-3 w-8 sm:w-10 shrink-0 text-cyan-400"
              viewBox="0 0 60 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main horizontal bus */}
              <line x1="2" y1="9" x2="36" y2="9" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="3" cy="9" r="2" fill="#38bdf8" />
              {/* Upper angled branch */}
              <path d="M14 9 L20 3 H44" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="45" cy="3" r="1.8" fill="#38bdf8" />
              {/* Lower angled branch */}
              <path d="M22 9 L28 15 H54" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="55" cy="15" r="1.8" fill="#38bdf8" />
            </svg>

            {/* "ELECTRONIC SALES" Text */}
            <span
              className={`${subSizes[size]} font-semibold text-slate-300 uppercase tracking-[0.32em] font-sans`}
              style={{ letterSpacing: '0.32em' }}
            >
              ELECTRONIC SALES
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

