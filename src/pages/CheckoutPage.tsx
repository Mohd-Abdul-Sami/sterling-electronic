import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, discount, shippingFee, tax, total, formatPrice, checkoutOrder } = useStore();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');

  // Form Fields as in screenshot
  const [fullName, setFullName] = useState(currentUser.name || 'John Smith');
  const [address, setAddress] = useState('123 Tech Avenue');
  const [city, setCity] = useState('San Francisco');
  const [stateName, setStateName] = useState('CA');
  const [zipCode, setZipCode] = useState('94107');
  const [description, setDescription] = useState('Industry-leading noise cancellation, exceptional sound quality, and all-day comfort.');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-8 bg-[#08090d] text-slate-100 font-sans">
        <h2 className="text-xl font-bold font-display text-white">YOUR CART IS EMPTY</h2>
        <p className="text-xs text-slate-400 mt-2">Add devices to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const order = checkoutOrder({
        fullName,
        email: currentUser.email || 'john@sterling.com',
        phone: currentUser.phone || '+1 555 987 6543',
        addressLine1: address,
        city,
        state: stateName,
        postalCode: zipCode,
        paymentMethod,
      });

      setIsProcessing(false);

      if (order) {
        try {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.log(e);
        }

        showToast(`Order ${order.orderNumber} confirmed!`, 'success');
        onNavigate(`/order-tracking/${order.id}`);
      }
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper matching reference Screen 4: Shipping ---- Payment ---- Review */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: step === 'shipping' ? '0%' : step === 'payment' ? '50%' : '100%',
                }}
              />
            </div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 'shipping'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                    : 'bg-blue-600 text-white'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-mono mt-1 text-slate-300">Shipping</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 'payment'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                    : step === 'review'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-white/20 text-slate-400'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-mono mt-1 text-slate-400">Payment</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 'review'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                    : 'bg-slate-900 border border-white/20 text-slate-400'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-mono mt-1 text-slate-400">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Column matching reference Screen 4 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white font-display">Shipping Address</h2>

              {step === 'shipping' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Description / Delivery Note</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      onClick={() => setStep('payment')}
                      className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-blue-600/20"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => onNavigate('/cart')}
                      className="py-2.5 px-4 rounded-xl text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                        paymentMethod === 'card' ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <span>Credit / Debit Card (Tokenized Secure)</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                        paymentMethod === 'upi' ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                      />
                      <span>UPI Instant Pay (GPay / PhonePe / QR)</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                        paymentMethod === 'cod' ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/10'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <span>Cash on Delivery (Doorstep Verification)</span>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep('review')}
                      className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-blue-600/20"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {step === 'review' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                    <p className="font-semibold text-white">Shipping to: {fullName}</p>
                    <p className="text-slate-400">{address}, {city}, {stateName} {zipCode}</p>
                    <p className="text-slate-400">Payment: <strong className="text-white uppercase">{paymentMethod}</strong></p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setStep('payment')}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      disabled={isProcessing}
                      className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Confirming...' : `Place Order ${formatPrice(total)}`}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Order Summary Card matching Screen 4 */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">Order Summary</h3>

              {/* Item thumbnails list */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-black p-1 shrink-0 flex items-center justify-center border border-white/5">
                        <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-100">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-semibold">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-mono text-slate-200">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between text-base font-extrabold text-white">
                  <span>Total</span>
                  <span className="font-mono text-cyan-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
