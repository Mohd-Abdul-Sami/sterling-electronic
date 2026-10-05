import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, Check, Shield, Truck, RotateCcw, Box } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product3DViewer } from '../3d/Product3DViewer';

interface QuickViewModalProps {
  onNavigateProduct: (slug: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigateProduct }) => {
  const { quickViewProduct, closeQuickView, addToCart, isInWishlist, toggleWishlist, formatPrice } = useStore();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [show3d, setShow3d] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFav = isInWishlist(product.id);
  const currentColorHex = product.colors?.find((c) => c.name === selectedColor)?.hex || '#1e2433';

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || product.colors?.[0]?.name, selectedVariantId);
    closeQuickView();
  };

  const handleViewFullPage = () => {
    closeQuickView();
    onNavigateProduct(product.slug);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-4xl bg-[#0c0f17] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery or 3D view */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-[#121622] to-[#090b10] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.08]">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                {product.brand} · {product.category}
              </span>

              <button
                onClick={() => setShow3d((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
                  show3d
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{show3d ? '2D Gallery' : 'Explore in 3D'}</span>
              </button>
            </div>

            {/* Main Stage */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center p-4 bg-[#0a0d14] border border-white/5">
              {show3d ? (
                <Product3DViewer
                  modelType={product.model3dType || 'phone'}
                  primaryColor={currentColorHex}
                  productName={product.name}
                  fallbackImage={product.images[0]}
                />
              ) : (
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              )}
            </div>

            {/* Thumbnail switcher (when not in 3D) */}
            {!show3d && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-14 h-14 rounded-xl p-1 bg-slate-900 border transition-all ${
                      selectedImageIdx === idx ? 'border-cyan-400 ring-2 ring-cyan-500/20' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-xs font-mono font-medium text-slate-200">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} verified reviews)</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-emerald-400">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-100 font-display leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                  {formatPrice(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm font-mono text-slate-500 line-through tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-mono text-rose-400 font-semibold">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Color variant chooser */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-slate-400 block mb-2">
                    Select Finish: <strong className="text-slate-200 font-medium">{selectedColor || product.colors[0].name}</strong>
                  </span>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          (selectedColor || product.colors![0].name) === c.name
                            ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-110'
                            : 'border-white/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {(selectedColor || product.colors![0].name) === c.name && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hardware Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-slate-400 block mb-2">Configuration</span>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          (selectedVariantId || product.variants![0].id) === v.id
                            ? 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200'
                            : 'border-white/10 bg-slate-900/40 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <p className="font-semibold">{v.name}</p>
                        <p className="font-mono text-[11px] text-slate-400">{formatPrice(v.price)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/40 border border-white/5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Free Express</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/40 border border-white/5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2-Yr Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/40 border border-white/5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isFav
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart ({formatPrice(product.salePrice || product.price)})</span>
              </button>

              <button
                onClick={handleViewFullPage}
                className="px-3.5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
                title="View full specifications & reviews"
              >
                Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
