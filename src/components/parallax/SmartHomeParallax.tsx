import React, { useRef, useState, useEffect } from 'react';
import { Home, ArrowRight, ShieldCheck, Wifi, SunMedium, Lock, Sparkles } from 'lucide-react';
import { SMARTHOME_IMG, TV_IMG } from '../../data/seedData';

interface SmartHomeParallaxProps {
  onNavigate: (route: string) => void;
}

export const SmartHomeParallax: React.FC<SmartHomeParallaxProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const sX = pointerOffset.x * 16;
  const sY = pointerOffset.y * 16;

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#08090f] border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Ambient Warm & Neutral Lighting */}
      <div
        className="absolute top-1/3 left-1/3 w-[600px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[180px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${sX * 1.2}px, ${sY * 1.2}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-blue-500/[0.06] rounded-full blur-[180px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Connected Ecosystem Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider font-sans">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Matter 2.0 & Thread Certified</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-[1.05]">
              MAKE YOUR HOME <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                SMARTER.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Unify your living space with intelligent ambient displays, automated multi-spectrum lighting, end-to-end encrypted security nodes, and zero-latency local Matter hubs.
            </p>

            {/* Smart Home Feature Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-display">Local Security</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">On-device neural processing without mandatory cloud locks.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-display">Thread Mesh</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">Self-healing local network with sub-10ms response.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/shop?category=smart-home')}
                className="py-3 px-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center gap-2 group"
              >
                <span>EXPLORE SMART HOME</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/product/prod-sh-1')}
                className="py-3 px-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs transition-colors border border-white/10 cursor-pointer"
              >
                <span>View Smart Hub</span>
              </button>
            </div>
          </div>

          {/* Right Column: Layered Room-like Stage */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] flex items-center justify-center">
            <div className="relative w-full h-full rounded-3xl border border-white/10 bg-[#0a0d16] p-6 overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Room Lighting Gradients */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />

              {/* Main Product: Smart Home Ambient Hub (Middleground) */}
              <div
                className="relative z-10 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${sX}px, ${sY}px, 0)`,
                }}
              >
                <img
                  src={SMARTHOME_IMG}
                  alt="Sterling Smart Home Hub"
                  referrerPolicy="no-referrer"
                  className="max-h-[300px] sm:max-h-[360px] object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.2)]"
                />
              </div>

              {/* Floating Display Unit in Upper Corner */}
              <div
                onClick={() => onNavigate('/product/samsung-qled-4k-tv')}
                className="absolute top-6 left-6 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md hidden sm:flex items-center gap-3 transition-transform duration-200 cursor-pointer hover:border-emerald-500/40 shadow-xl"
                style={{
                  transform: `translate3d(${-sX * 0.8}px, ${-sY * 0.8}px, 0)`,
                }}
              >
                <img
                  src={TV_IMG}
                  alt="Smart TV Panel"
                  referrerPolicy="no-referrer"
                  className="w-14 h-10 object-contain"
                />
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono block">Cinema Display</span>
                  <span className="text-xs font-bold text-white font-display">Samsung QLED 4K</span>
                </div>
              </div>

              {/* Ecosystem Active Node Status */}
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-slate-900/85 border border-white/10 backdrop-blur-md text-xs text-slate-200 flex items-center gap-2.5 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="font-semibold text-white">14 Connected Matter Nodes Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
