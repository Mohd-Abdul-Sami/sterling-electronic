import React, { useRef, useState, useEffect } from 'react';
import { Gamepad2, ArrowRight, Zap, Flame, Shield, Monitor, Sparkles, Tv } from 'lucide-react';
import {
  CONSOLE_RETRO_MAIN,
  CONSOLE_RETRO_RACING,
  CONSOLE_RETRO_TVOUT,
  AUDIO_ANC_IMG,
} from '../../data/seedData';

interface GamingZoneParallaxProps {
  onNavigate: (route: string) => void;
}

export const GamingZoneParallax: React.FC<GamingZoneParallaxProps> = ({ onNavigate }) => {
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

  const gX = pointerOffset.x * 20;
  const gY = pointerOffset.y * 20;

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#05060a] border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Cyber Neon Atmospheric Light Trails */}
      <div
        className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-cyan-500/[0.14] rounded-full blur-[180px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${gX * 1.5}px, ${gY * 1.5}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-[650px] h-[650px] bg-purple-600/[0.15] rounded-full blur-[200px] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-gX * 1.2}px, ${-gY * 1.2}px, 0)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-300 text-xs font-semibold uppercase tracking-wider font-sans shadow-lg shadow-purple-950/40">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cybernetic Performance Node</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-[1.05]">
              ENTER THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500">
                GAMING ZONE.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Experience the ultimate fusion of handheld freedom and tactile controller mastery. Featuring a crystal-clear 3.0-inch color screen, 500 built-in classic FC games, ergonomic dual-handle grips, and instant synchronized TV output.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 backdrop-blur-md">
                <span className="text-[10px] text-cyan-400 uppercase font-mono block">Integrated Screen</span>
                <span className="text-sm font-bold text-white font-display">3.0" Color Display</span>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 backdrop-blur-md">
                <span className="text-[10px] text-fuchsia-400 uppercase font-mono block">Arcade Library</span>
                <span className="text-sm font-bold text-white font-display">500 FC Retro Games</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/product/sterling-titan-apex-gaming-console')}
                className="py-3 px-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2 group"
              >
                <span>EXPLORE S10 CONSOLE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/shop?category=gaming')}
                className="py-3 px-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs transition-colors border border-white/10 cursor-pointer"
              >
                <span>View All Gaming Gear</span>
              </button>
            </div>
          </div>

          {/* Right Column: Layered Gaming Console Showcase */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] flex items-center justify-center">
            {/* Cyber Container Frame */}
            <div className="relative w-full h-full rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[#0c0817] to-[#06040e] p-6 overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Neon Grid Backing */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.06)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

              {/* Main S10 Retro Game Console with Parallax */}
              <div
                onClick={() => onNavigate('/product/sterling-titan-apex-gaming-console')}
                className="absolute inset-0 flex items-center justify-center cursor-pointer transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  transform: `translate3d(${gX * 1.1}px, ${gY * 1.1}px, 0)`,
                }}
              >
                <img
                  src={CONSOLE_RETRO_MAIN}
                  alt="S10 Integrated Retro Game Console"
                  referrerPolicy="no-referrer"
                  className="max-h-[88%] max-w-[88%] object-contain drop-shadow-[0_20px_50px_rgba(6,182,212,0.45)]"
                />
              </div>

              {/* Floating Synchronized TV Output Preview in Top-Right */}
              <div
                onClick={() => onNavigate('/product/sterling-titan-apex-gaming-console')}
                className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/70 border border-cyan-500/30 backdrop-blur-md hidden sm:flex items-center gap-3 transition-transform duration-300 shadow-xl cursor-pointer hover:border-cyan-400"
                style={{
                  transform: `translate3d(${-gX * 0.8}px, ${-gY * 0.8}px, 0)`,
                }}
              >
                <img
                  src={CONSOLE_RETRO_TVOUT}
                  alt="Synchronized TV Output"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-xl border border-white/10"
                />
                <div className="pr-1">
                  <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                    <Tv className="w-3 h-3" />
                    <span>Sync Output</span>
                  </div>
                  <span className="text-xs font-bold text-white font-display">Big Screen Mirror</span>
                </div>
              </div>

              {/* Floating Status Pill */}
              <div className="absolute bottom-5 left-5 px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 backdrop-blur-md text-xs text-purple-200 flex items-center gap-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-semibold text-white">500 Classic FC Games Built-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
