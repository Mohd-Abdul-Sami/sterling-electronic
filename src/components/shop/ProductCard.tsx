import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView, formatPrice } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  const isFavorite = isInWishlist(product.id);
  const effectivePrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Controlled 3D tilt: max 5-6 degrees
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    setTilt({
      rotateX,
      rotateY,
      glowX: x * 100,
      glowY: y * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  const displayImage = isHovered && product.hoverImage ? product.hoverImage : product.images[0];

  return (
    <article
      onClick={() => onNavigate(product.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, border-color 0.3s, box-shadow 0.3s',
      }}
      className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#0c0f16] hover:border-cyan-500/40 hover:shadow-[0_16px_40px_rgba(6,182,212,0.16)] cursor-pointer overflow-hidden"
    >
      {/* Visual Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-[#131722] to-[#0a0c12] p-5 flex items-center justify-center">
        {/* Dynamic pointer-following radial glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(56, 189, 248, 0.15) 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0.4,
          }}
        />

        {/* Quiet, unboxed text kicker in corner (Anti-slop compliant) */}
        <div className="absolute top-3.5 left-3.5 z-10 text-[11px] font-mono tracking-wider text-slate-400">
          {product.isNewArrival ? (
            <span className="text-cyan-400 font-semibold">NEW RELEASE</span>
          ) : product.isBestSeller ? (
            <span className="text-amber-300 font-semibold">BESTSELLER</span>
          ) : hasDiscount ? (
            <span className="text-rose-400 font-semibold">SAVE {product.discountPercent}%</span>
          ) : (
            <span className="text-slate-500">TITANIUM ED.</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          title={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 backdrop-blur-md border border-white/10 transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-[82%] max-w-[82%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Floating Quick Action Overlay on hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center gap-2 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={handleQuickView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0e121a]/95 hover:bg-slate-800 text-xs font-medium text-slate-200 backdrop-blur-md border border-white/10 transition-colors shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick 3D View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-lg ${
              justAdded
                ? 'bg-emerald-500 text-black'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black'
            }`}
            title="Quick add to cart"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-[#0c0f16]">
        <div>
          {/* Clean unboxed metadata with dot separator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-sans">
            <span className="font-semibold text-slate-300">{product.brand}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 leading-snug font-display group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-sans font-medium text-slate-300">{product.rating}</span>
            <span className="text-[11px] text-slate-500 font-sans">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing Baseline with Tabular Figures */}
        <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold font-display tabular-nums text-slate-100">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs font-sans tabular-nums text-slate-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="text-[11px] font-sans">
            {product.stock > 0 ? (
              product.stock <= product.lowStockThreshold ? (
                <span className="text-amber-400 font-medium">Only {product.stock} left</span>
              ) : (
                <span className="text-emerald-400">In Stock</span>
              )
            ) : (
              <span className="text-rose-400">Sold Out</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
