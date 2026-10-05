import React, { useState } from 'react';
import { Search, Eye, Truck, CheckCircle2, X, Clock, MapPin, ArrowRight } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../services/db';
import { Order, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const { formatPrice } = useStore();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>(getOrders());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Inspector modal update fields
  const [editStatus, setEditStatus] = useState<OrderStatus>('confirmed');
  const [editTracking, setEditTracking] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const refreshList = () => {
    setOrders(getOrders());
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenInspector = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setEditTracking(order.trackingNumber || '');
    setStatusNote('');
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(
      selectedOrder.id,
      editStatus,
      statusNote || `Status updated to ${editStatus} by Administrator`,
      editTracking || undefined,
      'Admin Portal'
    );

    showToast(`Order ${selectedOrder.orderNumber} updated to ${editStatus}.`, 'success');
    refreshList();
    setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: editStatus, trackingNumber: editTracking } : null));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Order Fulfillment & Logistics</h2>
          <p className="text-xs text-slate-400">Total {orders.length} orders recorded</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-mono text-slate-400">Status:</span>
          {['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#090b12] text-slate-400 font-mono text-[11px]">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-mono font-bold text-cyan-400">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-100">{order.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{order.email}</p>
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4 font-mono text-slate-300">{order.items.length} units</td>
                  <td className="p-4 font-mono font-bold tabular-nums text-slate-100">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 font-mono uppercase">
                    <span className="text-emerald-400">{order.paymentMethod}</span> ({order.paymentStatus})
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold bg-slate-900 border border-cyan-800 text-cyan-300">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenInspector(order)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c0f17] border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedOrder.orderNumber}</span>
                <h3 className="text-base font-bold text-white font-display">Manage Fulfillment</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <form onSubmit={handleUpdateStatus} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Update Status & Tracking
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Carrier Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ST-EXP-88912401"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-xs">Fulfillment Note (Saved to Timeline)</label>
                <input
                  type="text"
                  placeholder="e.g. Handed over to BlueDart priority courier at Bengaluru air cargo hub"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase"
                >
                  Save Status Update
                </button>
              </div>
            </form>

            {/* Destination & Customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <p className="font-bold text-slate-200">Customer</p>
                <p>{selectedOrder.customerName}</p>
                <p className="text-slate-400 font-mono">{selectedOrder.email}</p>
                <p className="text-slate-400 font-mono">{selectedOrder.phone}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
                <p className="font-bold text-slate-200">Delivery Address</p>
                <p>{selectedOrder.shippingAddress.addressLine1}</p>
                <p>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-black p-0.5 flex items-center justify-center">
                        <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-slate-200">{item.name}</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-bold tabular-nums">
                      Qty: {item.quantity} · {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
