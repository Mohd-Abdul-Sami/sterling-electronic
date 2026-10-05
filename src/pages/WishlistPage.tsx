import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProducts } from '../services/db';

interface WishlistPageProps {
  onNavigate: (route: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlist, toggleWishlist, addToCart, formatPrice } = useStore();
  const allProducts = getProducts();

  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
              Saved Wishlist ({wishlist.length})
            </h1>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-white/[0.08] bg-[#0c0f17] p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-200 font-display">
              SAVE THE TECH YOU'RE WATCHING.
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">
              Keep track of flagships, audio monitors, and custom creator workstations for later purchase.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Discover Hardware
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="p-5 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="aspect-[4/3] w-full rounded-xl bg-black p-4 flex items-center justify-center mb-4 border border-white/5 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-rose-400 hover:text-rose-300 border border-white/10"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    {product.brand} · {product.category}
                  </p>
                  <h3
                    onClick={() => onNavigate(`/product/${product.slug}`)}
                    className="text-sm font-semibold text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1 mt-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-slate-100 tabular-nums">
                    {formatPrice(product.salePrice || product.price)}
                  </span>

                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      toggleWishlist(product.id);
                    }}
                    className="py-2 px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
