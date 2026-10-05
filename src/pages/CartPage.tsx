import React from 'react';
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, cartCount, subtotal, shippingFee, tax, total, updateQuantity, removeFromCart, formatPrice } = useStore();

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center text-center p-8 bg-[#08090d] text-slate-100 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-slate-100">YOUR CART IS EMPTY</h2>
        <p className="text-xs text-slate-400 mt-2">Explore smartphones, laptops, audio gear and accessories.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore Showroom
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-8">
          Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#0c0f17] border border-white/[0.08]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-black p-2 flex items-center justify-center border border-white/5 shrink-0">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">{item.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.color ? `Color: ${item.color}` : `SKU: ${item.sku}`}
                    </p>
                    <p className="text-sm font-bold font-mono text-white mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stepper */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary Card matching screenshot */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">Order Summary</h3>

              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-semibold">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono text-slate-200">{formatPrice(tax)}</span>
                </div>
                <div className="pt-3 border-t border-white/[0.08] flex justify-between text-base font-extrabold text-white">
                  <span>Total</span>
                  <span className="font-mono text-cyan-400">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/30"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigate('/shop')}
                  className="text-xs text-slate-400 hover:text-cyan-300 underline font-mono"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
