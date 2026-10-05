import React from 'react';
import { Package, Truck, ArrowLeft, ShieldCheck, MapPin, Calendar, Clock } from 'lucide-react';
import { getOrderById } from '../services/db';
import { OrderTimeline } from '../components/shop/OrderTimeline';
import { useStore } from '../context/StoreContext';

interface OrderTrackingPageProps {
  orderId: string;
  onNavigate: (route: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, onNavigate }) => {
  const { formatPrice } = useStore();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-[#08090d]">
        <h2 className="text-xl font-bold font-display text-slate-100">ORDER NOT FOUND</h2>
        <p className="text-xs text-slate-400 mt-2">Could not locate order reference {orderId}.</p>
        <button
          onClick={() => onNavigate('/account/orders')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-semibold uppercase"
        >
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/account/orders')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Order History</span>
          </button>
          <span className="text-xs font-mono text-slate-500">
            PLACED: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Main Status Header Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                  LIVE SHIPMENT DISPATCH
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400">{order.orderNumber}</span>
              </div>
              <h1 className="text-2xl font-bold text-white font-display mt-1">
                Estimated Delivery: In Transit
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Carrier: Sterling BlueDart Express Priority · Tracking #:{' '}
                <strong className="text-cyan-300 font-mono">{order.trackingNumber || 'PENDING'}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-800">
                {order.orderStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Interactive Progress Timeline */}
          <OrderTimeline currentStatus={order.orderStatus} />

          {/* Activity Log */}
          <div className="pt-4 border-t border-white/[0.08]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
              Status Event Log
            </h3>
            <div className="space-y-2.5">
              {order.statusHistory.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium">{item.note}</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Shipping Destination</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-100">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p className="font-mono text-slate-400 pt-1">Phone: {order.phone}</p>
            </div>
          </div>

          {/* Payment & Invoice summary */}
          <div className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              <span>Financial Record</span>
              <span className="text-emerald-400">PAID VIA {order.paymentMethod.toUpperCase()}</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-slate-200">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Savings</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono text-slate-200">{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-mono text-slate-200">{formatPrice(order.tax)}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between font-bold text-white text-sm">
                <span>Total Paid</span>
                <span className="font-mono text-cyan-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-display">
            Purchased Devices ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-black p-1 shrink-0 flex items-center justify-center border border-white/5">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-100">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Qty: {item.quantity} · SKU: {item.sku}</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-cyan-400 tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
