import React, { useRef, useState, useEffect } from 'react';
import { Volume2, ArrowRight, Activity, Waves, Sparkles, Disc, Radio } from 'lucide-react';
import { AUDIO_ANC_IMG, EARBUDS_PRO_IMG } from '../../data/seedData';

interface AudioParallaxSectionProps {
  onNavigate: (route: string) => void;
}

export const AudioParallaxSection: React.FC<AudioParallaxSectionProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isPlayingMode, setIsPlayingMode] = useState(true);

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

  const aX = pointerOffset.x * 18;
  const aY = pointerOffset.y * 18;

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#06080e] border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Waveform-inspired Background Motion (moves slower with depth blur) */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out overflow-hidden flex items-center justify-center"
        style={{
          transform: `translate3d(${aX * 0.4}px, ${aY * 0.4}px, 0)`,
        }}
      >
        <svg
          className="w-full max-w-6xl h-64 opacity-20 filter blur-[1.5px]"
          viewBox="0 0 1200 300"
          fill="none"
        >
          {/* Animated soundwave paths */}
          <path
            d="M0,150 Q150,30 300,150 T600,150 T900,150 T1200,150"
            stroke="url(#waveCyanGrad)"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M0,150 Q150,270 300,150 T600,150 T900,150 T1200,150"
            stroke="url(#waveBlueGrad)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M0,150 Q150,80 300,150 T600,150 T900,150 T1200,150"
            stroke="rgba(56,189,248,0.4)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            fill="none"
          />
          <defs>
            <linearGradient id="waveCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="waveBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Rotating Studio Headphones & Earbuds Stage */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[500px] flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full h-full rounded-3xl border border-white/10 bg-[#090c15] p-6 overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Radial Acoustic Aura */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.14)_0%,transparent_70%)] pointer-events-none" />

              {/* Main Headphones Image (rotates gently with mouse) */}
              <div
                className="relative z-10 transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(${aX}px, ${aY}px, 0) rotate(${aX * 0.3}deg)`,
                }}
              >
                <img
                  src={AUDIO_ANC_IMG}
                  alt="Sony WH-1000XM5 Studio Headphones"
                  referrerPolicy="no-referrer"
                  className="max-h-[320px] sm:max-h-[380px] object-contain drop-shadow-[0_20px_50px_rgba(0,210,255,0.25)]"
                />
              </div>

              {/* Orbiting Wireless Earbuds (Layer 2 of Audio) */}
              <div
                onClick={() => onNavigate('/product/sterling-pulse-earbuds-pro')}
                className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-3 transition-transform duration-200 cursor-pointer hover:border-cyan-500/40 shadow-xl"
                style={{
                  transform: `translate3d(${-aX * 0.8}px, ${-aY * 0.8}px, 0)`,
                }}
              >
                <img
                  src={EARBUDS_PRO_IMG}
                  alt="Pulse Earbuds"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono block">Planar Earbuds</span>
                  <span className="text-xs font-bold text-white font-display">Sterling Pulse Pro</span>
                </div>
              </div>

              {/* Equalizer Frequency Bars Indicator */}
              <div className="absolute bottom-6 left-6 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex items-center gap-3 shadow-xl">
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-cyan-300 rounded-full animate-pulse" />
                  <span className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3.5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-mono block uppercase">Lossless Master</span>
                  <span className="text-xs font-bold text-white font-display">24-bit / 192kHz Spatial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Audio Content */}
          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-sans">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acoustic Planar Transducers</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-[1.05]">
              HEAR EVERY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                DETAIL.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              From planar magnetic open-back studio monitors to hybrid active noise-cancelling travel headphones, experience lossless high-fidelity acoustics tuned for surgical frequency separation.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[10px] text-cyan-400 uppercase font-mono block">Noise Attenuation</span>
                <span className="text-sm font-bold text-white font-display">Up to -42dB Adaptive</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-[10px] text-blue-400 uppercase font-mono block">Frequency Range</span>
                <span className="text-sm font-bold text-white font-display">4Hz – 40,000Hz Hi-Res</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/shop?category=audio')}
                className="py-3 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2 group"
              >
                <span>EXPLORE AUDIO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/product/sony-wh-1000xm5')}
                className="py-3 px-6 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs transition-colors border border-white/10 cursor-pointer"
              >
                <span>Sony WH-1000XM5</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
