import React, { useState } from 'react';
import { ArrowRight, Star, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Sparkles } from 'lucide-react';
import { HeroCinematicParallax } from '../components/parallax/HeroCinematicParallax';
import { CategoryParallaxGrid } from '../components/parallax/CategoryParallaxGrid';
import { PinnedUpgradeShowcase } from '../components/parallax/PinnedUpgradeShowcase';
import { LayeredProductShowcase } from '../components/parallax/LayeredProductShowcase';
import { HorizontalTrendingRail } from '../components/parallax/HorizontalTrendingRail';
import { GamingZoneParallax } from '../components/parallax/GamingZoneParallax';
import { AudioParallaxSection } from '../components/parallax/AudioParallaxSection';
import { SmartHomeParallax } from '../components/parallax/SmartHomeParallax';
import { TextParallaxBanner } from '../components/parallax/TextParallaxBanner';
import { ProductCard } from '../components/shop/ProductCard';
import { getProducts } from '../services/db';
import { useStore } from '../context/StoreContext';

interface HomePageProps {
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { addToCart, formatPrice, isInWishlist, toggleWishlist } = useStore();
  const products = getProducts();
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new' | 'onsale'>('bestsellers');

  // Filter products for the Featured Products row
  const featuredProducts = products.filter((p) => {
    if (activeTab === 'onsale') return !!p.salePrice && p.salePrice < p.price;
    if (activeTab === 'new') return !!p.isNewArrival;
    return true; // bestsellers default
  }).slice(0, 4);

  return (
    <div className="w-full bg-[#08090d] text-slate-100 overflow-hidden font-sans">
      {/* 1. CINEMATIC 7-LAYER HERO PARALLAX WITH 3D WEBGL STAGE */}
      <HeroCinematicParallax onNavigate={onNavigate} />

      {/* 2. OVERSIZED TYPOGRAPHY STREAM PARALLAX */}
      <TextParallaxBanner
        words={['TECH', 'POWER', 'CONNECT', 'PLAY', 'CREATE', 'DISCOVER']}
      />

      {/* 3. 10 CATEGORY PARALLAX CARDS WITH POINTER-FOLLOWING LIGHTING */}
      <CategoryParallaxGrid onNavigate={onNavigate} />

      {/* 4. PINNED 3D PRODUCT MULTI-PHASE EXPERIENCE: "MEET YOUR NEXT UPGRADE" */}
      <PinnedUpgradeShowcase onNavigate={onNavigate} />

      {/* 5. 3-TIER LAYERED PHYSICAL DEPTH PRODUCT SHOWCASE */}
      <LayeredProductShowcase onNavigate={onNavigate} />

      {/* 6. HORIZONTAL SCROLL EXPERIENCE: "TRENDING NOW" */}
      <HorizontalTrendingRail onNavigate={onNavigate} />

      {/* 7. FEATURED PRODUCTS CATALOG ROW WITH 3D TILT CARDS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-sans mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Hardware</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight">
              FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PRODUCTS.</span>
            </h2>

            <div className="flex items-center gap-6 mt-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`pb-1 transition-colors cursor-pointer ${
                  activeTab === 'bestsellers'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`pb-1 transition-colors cursor-pointer ${
                  activeTab === 'new'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('onsale')}
                className={`pb-1 transition-colors cursor-pointer ${
                  activeTab === 'onsale'
                    ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                On Sale
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Product Cards Grid with Independent Tilt & Parallax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={(slug) => onNavigate(`/product/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* 8. CYBERNETIC GAMING PARALLAX SECTION: "ENTER THE GAMING ZONE" */}
      <GamingZoneParallax onNavigate={onNavigate} />

      {/* 9. ACOUSTIC AUDIO PARALLAX SECTION: "HEAR EVERY DETAIL" */}
      <AudioParallaxSection onNavigate={onNavigate} />

      {/* 10. SMART HOME PARALLAX SECTION: "MAKE YOUR HOME SMARTER" */}
      <SmartHomeParallax onNavigate={onNavigate} />

      {/* 11. SECOND TEXT PARALLAX BANNER */}
      <TextParallaxBanner
        words={['PERFORMANCE', 'PRECISION', 'AEROSPACE', 'IMMERSION', 'INTELLIGENCE', 'STERLING']}
        className="bg-[#050609]"
      />

      {/* 12. BRAND TRUST & GUARANTEE VALUES */}
      <section className="py-14 border-t border-white/[0.06] bg-[#07080d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Truck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white font-display uppercase">Free Express Shipping</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Complimentary express air delivery on all orders over $99.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white font-display uppercase">2-Year Sterling Care</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Comprehensive hardware guarantee and authorized repair coverage.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <RotateCcw className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white font-display uppercase">30-Day Hassle Free</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Zero restocking fees on original condition returns.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <Headphones className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white font-display uppercase">24/7 Specialist Concierge</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Dedicated electronics engineers ready to assist.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
