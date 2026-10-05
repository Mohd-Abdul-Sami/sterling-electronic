import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Layers, Sliders, Check } from 'lucide-react';
import {
  HERO_PHONE_IMG,
  MACBOOK_M3_FRONT,
  EARBUDS_PRO_IMG,
  SMARTWATCH_IMG,
} from '../../data/seedData';

interface LayeredProductShowcaseProps {
  onNavigate: (route: string) => void;
}

export const LayeredProductShowcase: React.FC<LayeredProductShowcaseProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [depthMode, setDepthMode] = useState<'deep' | 'balanced' | 'focus-phone' | 'focus-laptop'>('balanced');
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setPointerOffset({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };

    const node = containerRef.current;
    if (node) node.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (node) node.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Multipliers for layer depth movement
  const bgX = pointerOffset.x * 10;
  const bgY = pointerOffset.y * 10;

  const midX = pointerOffset.x * 20;
  const midY = pointerOffset.y * 20;

  const fgX = pointerOffset.x * 35;
  const fgY = pointerOffset.y * 35;

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#08090d] border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Dynamic ambient background glow following pointer */}
      <div
        className="absolute top-1/2 left-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-purple-600/10 rounded-full blur-[180px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(-50%, -50%, 0) translate3d(${bgX * 1.5}px, ${bgY * 1.5}px, 0)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-sans mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spatial Depth Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
              THE STERLING ECOSYSTEM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                IN PHYSICAL DEPTH.
              </span>
            </h2>
          </div>

          {/* Depth of Field Controller Buttons */}
          <div className="flex items-center gap-2 bg-[#0d1019] p-1.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 px-3 hidden sm:inline">Depth Focus:</span>
            {[
              { id: 'balanced', label: 'Balanced' },
              { id: 'focus-phone', label: 'Phone' },
              { id: 'focus-laptop', label: 'Laptop' },
              { id: 'deep', label: 'Deep Field' },
            ].map((d) => (
              <button
                key={d.id}
                // @ts-expect-error mode state string
                onClick={() => setDepthMode(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  depthMode === d.id
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layered Stage Showcase */}
        <div className="relative h-[480px] sm:h-[580px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#0b0e17] to-[#07090f] overflow-hidden flex items-center justify-center p-6 shadow-2xl">
          {/* Depth Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

          {/* ========================================================
              BACKGROUND LAYER: WIRELESS EARBUDS & SMARTWATCH (z-index 10)
              ======================================================== */}
          <div
            className="absolute inset-0 flex items-center justify-between px-6 sm:px-16 pointer-events-none transition-all duration-300 ease-out"
            style={{
              transform: `translate3d(${bgX}px, ${bgY}px, 0)`,
              filter: depthMode === 'focus-phone' ? 'blur(3.5px) opacity(0.6)' : 'none',
            }}
          >
            {/* Left Background Product: Wireless Earbuds */}
            <div
              onClick={() => onNavigate('/product/sterling-pulse-earbuds-pro')}
              className="pointer-events-auto p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col items-center cursor-pointer hover:border-cyan-500/40 transition-all hover:scale-105"
            >
              <img
                src={EARBUDS_PRO_IMG}
                alt="Sterling Earbuds Pro"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-lg"
              />
              <span className="text-[11px] font-mono text-cyan-400 mt-2">Layer 3: Planar Buds</span>
            </div>

            {/* Right Background Product: Titanium Smartwatch */}
            <div
              onClick={() => onNavigate('/product/prod-ac-1')}
              className="pointer-events-auto p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col items-center cursor-pointer hover:border-cyan-500/40 transition-all hover:scale-105"
            >
              <img
                src={SMARTWATCH_IMG}
                alt="Sterling Smartwatch"
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-lg"
              />
              <span className="text-[11px] font-mono text-cyan-400 mt-2">Layer 3: Neural Watch</span>
            </div>
          </div>

          {/* ========================================================
              MIDDLEGROUND LAYER: AEROSPACE LAPTOP PRO (z-index 20)
              ======================================================== */}
          <div
            onClick={() => onNavigate('/product/macbook-air-m3')}
            className="absolute z-20 w-[320px] sm:w-[480px] lg:w-[560px] cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02]"
            style={{
              transform: `translate3d(${midX}px, ${midY - 30}px, 0)`,
              filter: depthMode === 'focus-phone' ? 'blur(2px) opacity(0.8)' : 'none',
            }}
          >
            <div className="relative group/laptop">
              <img
                src={MACBOOK_M3_FRONT}
                alt="MacBook Air M3 Laptop"
                referrerPolicy="no-referrer"
                className="w-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
              />

              {/* Floating Layer Tag */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] text-slate-300 font-mono backdrop-blur-md opacity-0 group-hover/laptop:opacity-100 transition-opacity">
                Layer 2: MacBook Air M3 Workstation
              </div>
            </div>
          </div>

          {/* ========================================================
              FOREGROUND LAYER: STERLING FLAGSHIP SMARTPHONE (z-index 30)
              ======================================================== */}
          <div
            onClick={() => onNavigate('/product/iphone-16-pro')}
            className="absolute z-30 w-[180px] sm:w-[240px] lg:w-[280px] bottom-4 sm:bottom-6 cursor-pointer transition-all duration-300 ease-out hover:scale-105"
            style={{
              transform: `translate3d(${fgX}px, ${fgY}px, 0)`,
              filter: depthMode === 'focus-laptop' ? 'blur(3px) opacity(0.7)' : 'none',
            }}
          >
            <div className="relative group/phone">
              <img
                src={HERO_PHONE_IMG}
                alt="Sterling Flagship Smartphone"
                referrerPolicy="no-referrer"
                className="w-full object-contain drop-shadow-[0_30px_60px_rgba(0,210,255,0.35)]"
              />

              {/* Foreground Pill Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-semibold font-sans uppercase tracking-wider shadow-lg shadow-blue-600/30 whitespace-nowrap">
                Foreground: Nova Phone 1
              </div>
            </div>
          </div>

          {/* Foreground Glass Kicker Info Node */}
          <div className="absolute bottom-5 left-5 z-40 px-3.5 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-[11px] font-sans text-slate-300 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3-Tier Physical Depth</span>
          </div>
        </div>
      </div>
    </section>
  );
};
