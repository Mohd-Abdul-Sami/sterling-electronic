import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Check, MapPin, Mail, Phone } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SterlingLogo } from './SterlingLogo';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to Sterling Insider. You will receive private previews and offers.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#050609] border-t border-white/[0.08] text-slate-300 relative overflow-hidden">
      {/* 1. Value Proposition Pillars */}
      <div className="border-b border-white/[0.06] bg-[#07090e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Priority Express</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Free air shipping on orders above ₹4,999 across India.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">2-Year Warranty</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Comprehensive zero-deductible hardware protection.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">30-Day Returns</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free doorstep pickup with instant refunds.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Dedicated Concierge</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">24/7 technical experts ready to optimize your setup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Columns & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <SterlingLogo
              size="lg"
              showSubtitle={true}
              onClick={() => onNavigate('/')}
              className="cursor-pointer"
            />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover smartphones, laptops, televisions, gaming gear, audio devices, smart home technology and everyday electronics selected for performance, design and value.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2 font-display">
                Stay Ahead of What's Next
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4 font-display">
              Showroom Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/category/smartphones')} className="hover:text-cyan-300 transition-colors">
                  Flagship Smartphones
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/laptops')} className="hover:text-cyan-300 transition-colors">
                  Creator & Pro Laptops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/audio')} className="hover:text-cyan-300 transition-colors">
                  Planar Audio & ANC
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/gaming')} className="hover:text-cyan-300 transition-colors">
                  Gaming Consoles & Gear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/televisions')} className="hover:text-cyan-300 transition-colors">
                  8K Quantum Mini-LED TVs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/wearables')} className="hover:text-cyan-300 transition-colors">
                  Titanium Smartwatches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/accessories')} className="hover:text-cyan-300 transition-colors">
                  GaN 240W Power Stations
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4 font-display">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/account/orders')} className="hover:text-cyan-300 transition-colors">
                  Track Live Shipment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-cyan-300 transition-colors">
                  Customer Support Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-cyan-300 transition-colors">
                  Warranty Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-cyan-300 transition-colors">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-cyan-300 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4 font-display">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-cyan-300 transition-colors">
                  About Sterling
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-cyan-300 transition-colors">
                  Engineering Standards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-cyan-300 transition-colors">
                  Physical Experience Centers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Administrator Portal →
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Showroom */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4 font-display">
              Flagship Hubs
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Sterling Pavilion, Indiranagar, Bengaluru, KA 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-mono text-[11px]">concierge@sterlingelectronics.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="font-mono text-[11px]">+91 (800) 420-7799</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Huge Display Brand Outro */}
        <div className="mt-16 pt-12 border-t border-white/[0.06] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white/20 select-none font-display block">
              STERLING
            </span>
            <p className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest">
              TECH THAT MOVES WITH YOU.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>© 2026 Sterling Electronic Sales. All rights reserved.</span>
            <span>·</span>
            <button onClick={() => onNavigate('/support')} className="hover:text-slate-300 transition-colors">
              Privacy
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/support')} className="hover:text-slate-300 transition-colors">
              Terms
            </button>
            <span>·</span>
            <button onClick={() => onNavigate('/support')} className="hover:text-slate-300 transition-colors">
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
