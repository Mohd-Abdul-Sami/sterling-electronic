import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/db';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface HorizontalTrendingRailProps {
  onNavigate: (route: string) => void;
}

export const HorizontalTrendingRail: React.FC<HorizontalTrendingRailProps> = ({ onNavigate }) => {
  const { addToCart, isInWishlist, toggleWishlist, formatPrice } = useStore();
  const railRef = useRef<HTMLDivElement>(null);
  const products = getProducts().slice(0, 8); // Top 8 trending products

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scrollByAmount = (offset: number) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#07080d] border-b border-white/[0.06] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Rail Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-sans mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Real-Time Velocity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
              TRENDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">NOW.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-2 max-w-xl">
              High-velocity hardware across sound, computing, and visual optics ordered by current shopper demand.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollByAmount(-340)}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-full border border-white/10 transition-colors cursor-pointer ${
                canScrollLeft
                  ? 'bg-white/[0.06] text-white hover:bg-white/[0.12]'
                  : 'bg-white/[0.02] text-slate-600 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollByAmount(340)}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-full border border-white/10 transition-colors cursor-pointer ${
                canScrollRight
                  ? 'bg-white/[0.06] text-white hover:bg-white/[0.12]'
                  : 'bg-white/[0.02] text-slate-600 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className="ml-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Rail */}
        <div
          ref={railRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
        >
          {products.map((item, index) => {
            const isFav = isInWishlist(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(`/product/${item.slug}`)}
                className="group min-w-[280px] sm:min-w-[320px] max-w-[320px] flex flex-col justify-between p-4 rounded-2xl border border-white/[0.08] bg-[#0c0f16] hover:border-cyan-500/40 hover:shadow-[0_12px_36px_rgba(6,182,212,0.14)] transition-all duration-300 cursor-pointer overflow-hidden snap-start relative"
              >
                {/* Ranking Index Pill */}
                <span className="absolute top-3.5 left-3.5 z-10 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-cyan-300">
                  #0{index + 1} TRENDING
                </span>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className="absolute top-3.5 right-3.5 z-10 p-2 rounded-xl bg-black/60 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Image Stage with Parallax Lift */}
                <div className="relative aspect-[4/3] w-full rounded-xl bg-[#121622] p-5 flex items-center justify-center overflow-hidden mb-4 mt-6">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-md"
                  />
                </div>

                {/* Product Metadata */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-sans font-medium uppercase tracking-wider block">
                    {item.brand} · {item.category}
                  </span>

                  <h3 className="text-sm font-bold text-slate-100 font-display line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold font-display tabular-nums text-white">
                      {formatPrice(item.salePrice || item.price)}
                    </span>
                    {item.salePrice && item.salePrice < item.price && (
                      <span className="text-xs font-sans text-slate-500 line-through tabular-nums">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 pt-1 text-amber-400 text-xs">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans">({item.reviewCount})</span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, 1);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
