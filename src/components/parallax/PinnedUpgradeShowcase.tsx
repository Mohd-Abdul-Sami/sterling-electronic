import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  Cpu,
  Eye,
  ShieldCheck,
  Battery,
  Flame,
  Wifi,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Box,
} from 'lucide-react';
import { HERO_PHONE_IMG } from '../../data/seedData';
import { useStore } from '../../context/StoreContext';
import { getProductBySlug } from '../../services/db';
import { Product3DViewer } from '../3d/Product3DViewer';

interface PinnedUpgradeShowcaseProps {
  onNavigate: (route: string) => void;
}

export const PinnedUpgradeShowcase: React.FC<PinnedUpgradeShowcaseProps> = ({ onNavigate }) => {
  const { addToCart } = useStore();
  const [activePhase, setActivePhase] = useState<number>(2); // Default to Phase 3 (Specs)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [use3DInteractive, setUse3DInteractive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const product = getProductBySlug('iphone-16-pro') || {
    id: 'prod-iphone-16-pro',
    name: 'Sterling Nova Titanium Flagship',
    slug: 'iphone-16-pro',
    price: 999,
    salePrice: 999,
    brand: 'Sterling Flagship',
    category: 'Smartphones',
    images: [HERO_PHONE_IMG],
  };

  const phases = [
    { id: 0, title: 'Arrival', subtitle: 'Sculpted in Grade 5 Titanium' },
    { id: 1, title: '360° Form', subtitle: 'Precision Bezel & Tactile Edge' },
    { id: 2, title: 'Architecture', subtitle: 'A18 Pro & Ceramic Shield' },
    { id: 3, title: 'Depth & Optics', subtitle: '48MP Quad-Pixel Telephoto' },
    { id: 4, title: 'Endurance', subtitle: '29-Hour All-Day Battery' },
    { id: 5, title: 'Configure', subtitle: 'Reserve Your Flagship' },
  ];

  // Rotate smoothly on phase change
  useEffect(() => {
    setRotationAngle(activePhase * 60);
  }, [activePhase]);

  // Handle Quick Add
  const handleAddToCart = () => {
    // @ts-expect-error Product fallback compatibility
    addToCart(product, 1);
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 lg:py-28 bg-gradient-to-b from-[#07080c] via-[#090b12] to-[#08090d] border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.06] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-widest font-sans mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Pinned Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-tight">
            MEET YOUR NEXT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">UPGRADE.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Engineered with aerospace-grade titanium, custom photonic optics, and 3-nanometer neural architecture. Step through each phase to discover what makes this the pinnacle of mobile computing.
          </p>
        </div>

        {/* Phase Stepper Navigation Bar */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`px-3 sm:px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activePhase === phase.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">
                  {phase.id + 1}
                </span>
                <span>{phase.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Stage Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0a0d15]/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative">
          {/* Left Column: Contextual Phase Information Cards */}
          <div className="lg:col-span-4 space-y-5 order-2 lg:order-1">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                Phase 0{activePhase + 1} of 0{phases.length}
              </span>
              <h3 className="text-2xl font-bold text-white font-display uppercase">
                {phases[activePhase].title}
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                {phases[activePhase].subtitle}
              </p>
            </div>

            {/* Dynamic Card Content Based on Active Phase */}
            {activePhase === 0 && (
              <div className="space-y-4 text-xs font-sans text-slate-300">
                <p>
                  Forged from Grade 5 Titanium alloy, boasting one of the highest strength-to-weight ratios of any metal in consumer electronics.
                </p>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Chassis Finish</span>
                  <span className="text-sm font-bold text-cyan-300 font-display">Natural Obsidian Titanium</span>
                </div>
              </div>
            )}

            {activePhase === 1 && (
              <div className="space-y-4 text-xs font-sans text-slate-300">
                <p>
                  Sub-millimeter curved border radii provide exceptional in-hand ergonomics with precision tactile feedback on the new capacitive Camera Control.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Bezel Width</span>
                    <span className="text-sm font-bold text-white font-display">1.15 mm Ultra-Thin</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Tactile Button</span>
                    <span className="text-sm font-bold text-white font-display">Sapphire Haptic</span>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 2 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">A18 Pro 3nm Architecture</h4>
                    <p className="text-[11px] text-slate-400 font-sans">16-core Neural Engine handling 35 TOPS.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Flame className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Sub-Zero Vapor Cooling</h4>
                    <p className="text-[11px] text-slate-400 font-sans">20% improved sustained peak performance.</p>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 3 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Eye className="w-5 h-5 text-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">48MP Fusion Photon Sensor</h4>
                    <p className="text-[11px] text-slate-400 font-sans">2.44μm quad-pixel with 4K 120 fps Dolby Vision.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">5x Optical Tetraprism Zoom</h4>
                    <p className="text-[11px] text-slate-400 font-sans">120mm focal length with 3D sensor-shift stabilization.</p>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 4 && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Battery className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">29-Hour Video Playback</h4>
                    <p className="text-[11px] text-slate-400 font-sans">High-density silicon carbide anode cells.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Tri-Band Wi-Fi 7 & 5G</h4>
                    <p className="text-[11px] text-slate-400 font-sans">Ultra-wide 320MHz channels for instantaneous streaming.</p>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-200 text-xs">
                  <p className="font-semibold text-white mb-1">Ready for Immediate Dispatch</p>
                  <p className="text-slate-300">Free Express Air Shipping, 2-Year Sterling Care Included, and 30-Day Hassle-Free Returns.</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart — $999.00</span>
                  </button>

                  <button
                    onClick={() => onNavigate('/product/iphone-16-pro')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                  >
                    <span>Full Technical Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Center / Right Column: Central 3D Interactive Stage & Parallax Shift */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] flex items-center justify-center order-1 lg:order-2">
            {/* Ambient Platform Glow Ring */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,transparent_68%)] pointer-events-none" />

            {/* Central Stage */}
            <div className="relative w-full h-full flex items-center justify-center">
              {use3DInteractive ? (
                <div className="w-full h-full relative">
                  <Product3DViewer modelType="phone" autoRotate={true} />
                </div>
              ) : (
                <div
                  className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
                  style={{
                    transform: `scale(${1 + activePhase * 0.03}) rotate(${rotationAngle * 0.05}deg)`,
                  }}
                >
                  <img
                    src={HERO_PHONE_IMG}
                    alt="Sterling Flagship Smartphone"
                    referrerPolicy="no-referrer"
                    className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_25px_60px_rgba(6,182,212,0.28)]"
                  />

                  {/* Floating Specification Callout Nodes for Phase 2, 3, 4 */}
                  {activePhase >= 2 && (
                    <>
                      <div className="absolute top-6 left-6 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-300 font-sans shadow-lg animate-pulse hidden sm:flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>A18 Pro 3nm Silicon</span>
                      </div>

                      <div className="absolute bottom-8 right-6 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-blue-500/30 text-[11px] text-blue-300 font-sans shadow-lg hidden sm:flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>Grade 5 Titanium Bezel</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 3D Mode Switcher Toggle Button */}
              <button
                onClick={() => setUse3DInteractive((prev) => !prev)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[11px] font-sans text-slate-200 transition-colors flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>{use3DInteractive ? 'Show Studio Photo' : 'Interactive 3D Inspector'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
