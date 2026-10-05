import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onNavigate: (route: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    cartCount,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
    freeShippingThreshold,
    freeShippingProgress,
    formatPrice,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCouponCode(couponInput)) {
      setCouponInput('');
    }
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0c0f17] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-semibold text-slate-100 font-display">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress indicator */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                {remainingForFreeShipping > 0 ? (
                  <span className="text-slate-300">
                    Add <strong className="text-cyan-400 font-mono">{formatPrice(remainingForFreeShipping)}</strong> more for Free Shipping
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    ✓ You unlocked Free Priority Delivery!
                  </span>
                )}
                <span className="font-mono text-slate-400">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-200 font-display">
                  YOUR CART IS WAITING FOR ITS FIRST UPGRADE.
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mt-2">
                  Discover flagship smartphones, creator laptops, audio gear, and titanium accessories.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onNavigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore Storefront
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-white/[0.06] bg-slate-900/40 hover:border-white/10 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-[#141722] p-2 flex items-center justify-center shrink-0 border border-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info & Quantity controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.color && (
                        <p className="text-[11px] text-slate-400 mt-0.5">Finish: {item.color}</p>
                      )}
                      <p className="text-[10px] font-mono text-slate-500">SKU: {item.sku}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg p-0.5 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium text-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold font-mono text-slate-100 tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#090b11] space-y-4">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. STERLING10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? <span className="text-emerald-400">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="font-mono tabular-nums">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between text-sm font-bold text-slate-100">
                  <span>Total Amount</span>
                  <span className="font-mono text-cyan-400 text-base tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('/checkout');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Checkout · 30-Day Sterling Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
