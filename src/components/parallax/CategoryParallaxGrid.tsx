import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getCategories } from '../../services/db';
import { CategoryItem } from '../../types';

interface CategoryParallaxGridProps {
  onNavigate: (route: string) => void;
}

interface CategoryCardProps {
  category: CategoryItem;
  onNavigate: (route: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onNavigate }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setPointer({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setPointer({ x: 0, y: 0, active: false });
  };

  const imgX = pointer.x * 12;
  const imgY = pointer.y * 12;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(`/category/${category.slug}`)}
      className="group relative p-5 rounded-2xl border border-white/[0.08] bg-[#0c0f17] hover:border-cyan-500/40 hover:bg-[#101422] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-56 shadow-lg text-left"
    >
      {/* Background Lighting Following Pointer */}
      <div
        className="absolute w-44 h-44 rounded-full blur-[60px] pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: category.accentColor || '#00d2ff',
          opacity: pointer.active ? 0.18 : 0.05,
          left: `calc(50% + ${pointer.x * 40}px)`,
          top: `calc(50% + ${pointer.y * 40}px)`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Top Header inside Card: Name & Count */}
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-sm font-bold text-slate-100 font-display group-hover:text-cyan-300 transition-colors uppercase">
          {category.name}
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/5">
          {category.itemCount || 10}+
        </span>
      </div>

      {/* Floating Product Image with Parallax Shift */}
      <div className="relative aspect-[16/10] w-full rounded-xl bg-black/40 p-3 flex items-center justify-center overflow-hidden border border-white/5 my-2">
        <img
          src={category.image}
          alt={category.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-110 drop-shadow-md"
          style={{
            transform: pointer.active ? `translate3d(${imgX}px, ${imgY}px, 0)` : 'none',
          }}
        />
      </div>

      {/* Bottom CTA Link */}
      <div className="relative z-10 flex items-center justify-between pt-1">
        <span className="text-[11px] font-sans font-medium text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
          <span>Explore Category</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
};

export const CategoryParallaxGrid: React.FC<CategoryParallaxGridProps> = ({ onNavigate }) => {
  const categories = getCategories(); // All 10 categories

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-sans mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete Hardware Catalog</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display uppercase tracking-tight">
            DISCOVER BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CATEGORY.</span>
          </h2>
        </div>

        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-sans"
        >
          <span>All 10 Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of 10 categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
};
