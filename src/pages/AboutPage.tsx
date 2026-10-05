import React from 'react';
import { ArrowLeft, Shield, Cpu, Sparkles, Award, MapPin } from 'lucide-react';
import { HERO_PHONE_IMG, LAPTOP_PRO_IMG } from '../data/seedData';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Showroom</span>
          </button>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
            THE STERLING MANIFESTO
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display mt-2 leading-tight">
            Next-Generation Technology, Available Today.
          </h1>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-3xl">
            Sterling Electronic Sales was founded on a singular premise: modern electronics should be evaluated on precision engineering, thermal mastery, acoustic fidelity, and enduring build quality. We curate and deliver hardware designed for what's next.
          </p>
        </div>

        {/* Hero imagery / Visual statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video md:aspect-auto">
            <img src={HERO_PHONE_IMG} alt="Sterling Titanium Engineering" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex items-end">
              <p className="text-xs font-mono text-cyan-300">Grade-5 Titanium & Quantum Optics Laboratory</p>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video md:aspect-auto">
            <img src={LAPTOP_PRO_IMG} alt="Sterling Workstation Assembly" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex items-end">
              <p className="text-xs font-mono text-cyan-300">Tandem OLED & Whisper-Cool Workstation Testing</p>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white font-display">The Four Sterling Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 mb-4 border border-cyan-800">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 font-display">100% Verified Authentic Hardware</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct authorized relationships with top global component manufacturers. Every single device arrives with serialized tamper-evident seals and zero grey-market re-labeling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-800">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 font-display">Zero-Bloatware Pure Silicon</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our bespoke Sterling hardware lines ship exclusively with clean, unadulterated operating systems. No pre-loaded trial software, zero background adware, and maximum compute throughput.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-950 flex items-center justify-center text-violet-400 mb-4 border border-violet-800">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 font-display">2-Year Zero Deductible Warranty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All flagship electronics are backed by the industry-leading Sterling Shield. If your hardware encounters component failure, we repair or replace it with priority doorstep transit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-950 flex items-center justify-center text-amber-400 mb-4 border border-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100 font-display">24-48 Hour Express Air Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strategically positioned air hubs across Bengaluru, Mumbai, and New Delhi ensure immediate fulfillment. Your tech moves with you without prolonged logistics lag.
              </p>
            </div>
          </div>
        </div>

        {/* Flagship Showroom Hubs */}
        <div className="p-8 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white font-display">Experience Centers & Showrooms</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Touch titanium finishes, listen to planar acoustic arrays, and test 8K gaming displays in person at our flagship experiential locations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Bengaluru Flagship</span>
              </div>
              <p className="text-slate-400">100 Feet Road, Indiranagar</p>
              <p className="text-slate-500 font-mono">Open Daily: 10:00 - 21:00</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Mumbai Showroom</span>
              </div>
              <p className="text-slate-400">Bandra Kurla Complex (BKC)</p>
              <p className="text-slate-500 font-mono">Open Daily: 10:00 - 21:00</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Delhi Cyber Hub</span>
              </div>
              <p className="text-slate-400">DLF Phase 2, Gurugram</p>
              <p className="text-slate-500 font-mono">Open Daily: 10:00 - 21:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
