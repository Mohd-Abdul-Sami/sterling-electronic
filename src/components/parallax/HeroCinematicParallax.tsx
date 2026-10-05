import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Box, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';
import { Hero3DScene } from '../3d/Hero3DScene';
import {
  HERO_PHONE_IMG,
  LAPTOP_PRO_IMG,
  AUDIO_ANC_IMG,
  SMARTWATCH_IMG,
  GAMING_RIG_IMG,
  CAMERA_IMG,
  EARBUDS_PRO_IMG,
  TV_IMG,
  MACBOOK_M3_FRONT,
} from '../../data/seedData';

interface HeroCinematicParallaxProps {
  onNavigate: (route: string) => void;
}

export const HeroCinematicParallax: React.FC<HeroCinematicParallaxProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [show3DView, setShow3DView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Mouse parallax interpolation targets and current values
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Smooth lerp mouse tracking loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    let animId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      mouseCurrent.current.x = lerp(mouseCurrent.current.x, mouseTarget.current.x, 0.08);
      mouseCurrent.current.y = lerp(mouseCurrent.current.y, mouseTarget.current.y, 0.08);

      setOffset({
        x: mouseCurrent.current.x,
        y: mouseCurrent.current.y,
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
      mouseTarget.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    };

    const handleMouseLeave = () => {
      mouseTarget.current = { x: 0, y: 0 };
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('mousemove', handleMouseMove);
      node.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animId);
      if (node) {
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [prefersReducedMotion]);

  const slides = [
    {
      id: 'flagship-phone',
      highlightWord: 'TECH',
      headlineRest: 'THAT MOVES WITH YOU.',
      tagline: 'STERLING FLAGSHIP SERIES',
      badge: 'STERLING TITANIUM • NEURAL PHOTON 120HZ',
      description:
        'Discover smartphones, laptops, televisions, gaming gear, audio devices, smart home technology and everyday electronics selected for performance, design and value.',
      mainImage: HERO_PHONE_IMG,
      mainAlt: 'Sterling Nova Flagship Titanium Smartphone',
      ctaText: 'Shop Now',
      ctaRoute: '/shop?category=smartphones',
      specs: [
        { label: 'Display', value: '6.7" ProMotion OLED' },
        { label: 'Processor', value: 'A18 Pro 3nm Silicon' },
        { label: 'Chassis', value: 'Aerospace Grade 5 Titanium' },
      ],
    },
    {
      id: 'macbook-laptop',
      highlightWord: 'POWER',
      headlineRest: 'IN ITS PUREST FORM.',
      tagline: 'APPLE CREATIVE WORKSTATIONS',
      badge: 'M3 SILICON • LIQUID RETINA DISPLAY',
      description:
        'Aerospace aluminum workstations with next-generation M3 architecture, 1 billion colors Liquid Retina display, and all-day 18-hour battery life.',
      mainImage: MACBOOK_M3_FRONT,
      mainAlt: 'MacBook Air M3 Laptop',
      ctaText: 'Explore Laptops',
      ctaRoute: '/product/macbook-air-m3',
      specs: [
        { label: 'Silicon', value: 'Apple M3 8-Core CPU' },
        { label: 'Battery', value: '18-Hour Endurance' },
        { label: 'Weight', value: '1.24 kg Ultralight' },
      ],
    },
    {
      id: 'samsung-tv',
      highlightWord: 'VISION',
      headlineRest: 'THAT REDEFINES REALITY.',
      tagline: 'CINEMATIC QUANTUM PANELS',
      badge: 'QUANTUM MINI-LED • 4K ULTRA-SLIM',
      description:
        'Experience 100% color volume with Quantum Dot and AI neural upscaling with Samsung QLED ultra-slim panels engineered for cinematic immersion.',
      mainImage: TV_IMG,
      mainAlt: 'Samsung QLED 4K Cinema Television',
      ctaText: 'Explore Televisions',
      ctaRoute: '/product/samsung-qled-4k-tv',
      specs: [
        { label: 'Resolution', value: '3840 x 2160 Ultra HD' },
        { label: 'Color', value: '100% Volume Quantum Dot' },
        { label: 'Acoustics', value: 'Object Tracking Sound' },
      ],
    },
    {
      id: 'sony-audio',
      highlightWord: 'SOUND',
      headlineRest: 'WITHOUT DISTRACTION.',
      tagline: 'STUDIO SPATIAL ACOUSTICS',
      badge: 'DUAL-PROCESSOR ANC • HI-RES LOSSLESS',
      description:
        'Sony WH-1000XM5 wireless industry-leading noise cancellation engineered with eight microphones, 30mm precision drivers, and 30-hour battery.',
      mainImage: AUDIO_ANC_IMG,
      mainAlt: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      ctaText: 'Explore Audio',
      ctaRoute: '/product/sony-wh-1000xm5',
      specs: [
        { label: 'ANC', value: 'Auto NC Optimizer (8 Mics)' },
        { label: 'Driver', value: '30mm Carbon Composite' },
        { label: 'Battery', value: '30 Hours Continuous' },
      ],
    },
  ];

  const current = slides[activeSlide];

  // Specific layer parallax offsets based on prompt:
  // Layer 1 (Background): ~2-4px
  // Layer 2 (Particles/Stars): ~5-10px
  // Layer 3 (Holographic shapes): ~10-15px
  // Layer 4 (Products): ~15-25px
  // Layer 5 (Foreground glass): ~20-30px
  const l1X = offset.x * 3;
  const l1Y = offset.y * 3;

  const l2X = offset.x * 8;
  const l2Y = offset.y * 8;

  const l3X = offset.x * 14;
  const l3Y = offset.y * 14;

  const l4X = offset.x * 22;
  const l4Y = offset.y * 22;

  const l5X = offset.x * 28;
  const l5Y = offset.y * 28;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center border-b border-white/[0.06] overflow-hidden bg-[#07080c] select-none"
    >
      {/* ========================================================
          LAYER 1: BACKGROUND GRADIENTS (moves ~2-4px)
          ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${l1X}px, ${l1Y}px, 0)`,
        }}
      >
        <div className="absolute top-1/4 left-1/5 w-[650px] h-[650px] bg-cyan-600/[0.07] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-blue-600/[0.09] rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-violet-700/[0.04] rounded-full blur-[200px]" />
      </div>

      {/* ========================================================
          LAYER 2: STARS / PARTICLES / ATMOSPHERIC ELEMENTS (moves ~5-10px)
          ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${l2X}px, ${l2Y}px, 0)`,
        }}
      >
        {/* Subtle procedural star/dust particles */}
        <div className="absolute top-12 left-[15%] w-1.5 h-1.5 rounded-full bg-cyan-300/40 animate-pulse" />
        <div className="absolute top-36 left-[35%] w-1 h-1 rounded-full bg-blue-300/30" />
        <div className="absolute top-24 right-[25%] w-2 h-2 rounded-full bg-cyan-200/50 blur-[0.5px] animate-pulse" />
        <div className="absolute bottom-32 left-[28%] w-1.5 h-1.5 rounded-full bg-indigo-300/40" />
        <div className="absolute bottom-20 right-[18%] w-2 h-2 rounded-full bg-blue-400/40 animate-pulse" />
        <div className="absolute top-[60%] right-[40%] w-1 h-1 rounded-full bg-cyan-100/60" />

        {/* Ambient grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* ========================================================
          LAYER 3: HOLOGRAPHIC RINGS & ABSTRACT TECH SHAPES (moves ~10-15px)
          ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out overflow-hidden"
        style={{
          transform: `translate3d(${l3X}px, ${l3Y}px, 0)`,
        }}
      >
        <svg
          className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-25"
          viewBox="0 0 600 600"
          fill="none"
        >
          <circle
            cx="300"
            cy="300"
            r="260"
            stroke="url(#holoCyanGrad)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
          />
          <circle
            cx="300"
            cy="300"
            r="190"
            stroke="url(#holoBlueGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="300"
            cy="300"
            r="120"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="holoCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="holoBlueGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================
          LAYER 6 & 7: CONTENT TYPOGRAPHY & INTERACTIVE CONTROLS
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
        {/* Left Column: Headline, Specs, CTAs, Slide Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold tracking-wider uppercase font-sans backdrop-blur-md shadow-lg shadow-cyan-950/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{current.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.06]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              {current.highlightWord}
            </span>{' '}
            {current.headlineRest.split(' ').slice(0, 1).join(' ')} <br className="hidden sm:inline" />
            {current.headlineRest.split(' ').slice(1).join(' ')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-sans font-normal">
            {current.description}
          </p>

          {/* Dynamic Technical Specs Micro-Pills */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md pt-1">
            {current.specs.map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm"
              >
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-sans font-medium">
                  {s.label}
                </span>
                <span className="block text-xs font-bold text-slate-200 mt-0.5 font-display truncate">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs (Layer 7) */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate(current.ctaRoute)}
              className="py-3 px-8 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2 group"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setShow3DView((prev) => !prev)}
              className="py-3 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs transition-all border border-white/10 flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              <span>{show3DView ? 'Show Studio Photo' : 'Interactive 3D Mode'}</span>
            </button>
          </div>

          {/* Slide Indicator & Navigation */}
          <div className="flex items-center gap-4 pt-3 sm:pt-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <button
                onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {slides.map((slide, dot) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(dot)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === dot ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-slate-500 pl-2">
              0{activeSlide + 1} / 0{slides.length}
            </span>
          </div>
        </div>

        {/* Right Column: LAYER 4 & 5 (Product Imagery & Floating Foreground Tech Components) */}
        <div className="lg:col-span-6 relative h-[480px] sm:h-[540px] flex items-center justify-center">
          {/* Main Visual Stage Container */}
          <div className="relative w-full h-full rounded-3xl border border-white/10 bg-[#090b12] shadow-2xl overflow-hidden flex items-center justify-center p-6">
            {/* Ambient Radial Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] pointer-events-none" />

            {show3DView ? (
              <div className="w-full h-full relative">
                <Hero3DScene fallbackImage={current.mainImage} />
              </div>
            ) : (
              /* ========================================================
                 LAYER 4: MAIN PRODUCT + SUPPORTING PRODUCTS (moves ~15-25px)
                 ======================================================== */
              <div
                className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
                style={{
                  transform: `translate3d(${l4X}px, ${l4Y}px, 0)`,
                }}
              >
                {/* Central Main Product Image (Large Futuristic Smartphone / Active Slide) */}
                <img
                  src={current.mainImage}
                  alt={current.mainAlt}
                  referrerPolicy="no-referrer"
                  className="max-h-[88%] max-w-[88%] object-contain drop-shadow-[0_24px_60px_rgba(0,210,255,0.25)] transition-all duration-500 ease-out"
                />

                {/* Orbiting Supporting Product 1: Wireless Earbuds Pro (Top-Left Orbit) */}
                <div
                  className="absolute -top-3 -left-3 sm:top-2 sm:left-2 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-2 shadow-xl hidden sm:flex items-center justify-center group/support transition-transform duration-200"
                  style={{
                    transform: `translate3d(${-l3X * 0.6}px, ${-l3Y * 0.6}px, 0)`,
                  }}
                  title="Sterling Pulse Earbuds Pro"
                >
                  <img
                    src={EARBUDS_PRO_IMG}
                    alt="Wireless Earbuds"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover/support:scale-110 transition-transform"
                  />
                  <span className="absolute -bottom-2 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[9px] text-cyan-300 font-mono">
                    Earbuds
                  </span>
                </div>

                {/* Orbiting Supporting Product 2: Titanium Smartwatch (Bottom-Left Orbit) */}
                <div
                  className="absolute -bottom-3 -left-2 sm:bottom-4 sm:left-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-2 shadow-xl hidden sm:flex items-center justify-center group/support transition-transform duration-200"
                  style={{
                    transform: `translate3d(${-l3X * 0.8}px, ${l3Y * 0.8}px, 0)`,
                  }}
                  title="Titanium Smartwatch"
                >
                  <img
                    src={SMARTWATCH_IMG}
                    alt="Titanium Smartwatch"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover/support:scale-110 transition-transform"
                  />
                  <span className="absolute -bottom-2 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-[9px] text-blue-300 font-mono">
                    Watch
                  </span>
                </div>

                {/* Orbiting Supporting Product 3: Cyber Controller / Gaming Rig (Top-Right Orbit) */}
                <div
                  className="absolute -top-3 -right-2 sm:top-3 sm:right-3 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-2 shadow-xl hidden sm:flex items-center justify-center group/support transition-transform duration-200"
                  style={{
                    transform: `translate3d(${l3X * 0.7}px, ${-l3Y * 0.7}px, 0)`,
                  }}
                  title="Cyber Controller"
                >
                  <img
                    src={GAMING_RIG_IMG}
                    alt="Cyber Controller"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover/support:scale-110 transition-transform"
                  />
                  <span className="absolute -bottom-2 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-[9px] text-purple-300 font-mono">
                    Gaming
                  </span>
                </div>

                {/* Orbiting Supporting Product 4: Mirrorless Camera (Bottom-Right Orbit) */}
                <div
                  className="absolute -bottom-3 -right-2 sm:bottom-4 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-2 shadow-xl hidden sm:flex items-center justify-center group/support transition-transform duration-200"
                  style={{
                    transform: `translate3d(${l3X * 0.8}px, ${l3Y * 0.8}px, 0)`,
                  }}
                  title="Alpha Cinema Camera"
                >
                  <img
                    src={CAMERA_IMG}
                    alt="Alpha Cinema Camera"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow-md group-hover/support:scale-110 transition-transform"
                  />
                  <span className="absolute -bottom-2 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-[9px] text-amber-300 font-mono">
                    Camera
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================
                LAYER 5: FOREGROUND FLOATING GLASS PANELS (moves ~20-30px)
                ======================================================== */}
            {!show3DView && (
              <div
                className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between transition-transform duration-100 ease-out"
                style={{
                  transform: `translate3d(${l5X}px, ${l5Y}px, 0)`,
                }}
              >
                {/* Top Floating Glass Chip */}
                <div className="self-end pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/15 text-[11px] font-sans text-slate-200 flex items-center gap-2 shadow-xl">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-white">Parallax Depth Engine</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* Bottom Floating Glass Badge */}
                <div className="self-start pointer-events-auto px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-xl border border-white/15 text-xs text-slate-200 flex items-center gap-2.5 shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase leading-tight">Authentic Hardware</p>
                    <p className="text-xs font-bold text-white font-display">Sterling Certified</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
