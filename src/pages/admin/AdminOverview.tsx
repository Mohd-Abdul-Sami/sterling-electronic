import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { getOrders, getProducts, getUsers, updateOrderStatus, updateProduct } from '../../services/db';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

interface AdminOverviewProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { formatPrice } = useStore();
  const { showToast } = useToast();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed');

  // Revenue chart data mock based on date range
  const chartBars = [
    { label: 'W1', value: 45 },
    { label: 'W2', value: 72 },
    { label: 'W3', value: 58 },
    { label: 'W4', value: 89 },
    { label: 'W5', value: 95 },
    { label: 'W6', value: 110 },
  ];

  const handleQuickRestock = (productId: string, currentStock: number) => {
    updateProduct(productId, { stock: currentStock + 15 }, 'Admin Overview');
    showToast('Restocked +15 units successfully.', 'success');
  };

  const handleQuickStatusChange = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status, `Quick updated via overview dashboard`);
    showToast(`Order status updated to ${status}`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* 1. KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              TOTAL GROSS REVENUE
            </span>
            <h3 className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {formatPrice(totalSales)}
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18.4% vs last period
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              TOTAL ORDERS
            </span>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
              {totalOrders}
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
              {pendingOrders.length} pending fulfillment
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              ACTIVE CUSTOMERS
            </span>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
              {totalCustomers}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Avg Order: {formatPrice(averageOrderValue)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              LOW STOCK ALERTS
            </span>
            <h3 className={`text-2xl font-bold font-mono mt-1 tabular-nums ${lowStockProducts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {lowStockProducts.length} Devices
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-[10px] text-cyan-400 hover:underline font-mono mt-1 block"
            >
              Inspect Inventory →
            </button>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            lowStockProducts.length > 0
              ? 'bg-rose-950/60 border-rose-800/40 text-rose-400'
              : 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">Revenue Velocity</h3>
              <p className="text-xs text-slate-400">Total gross volume in INR across billing cycles</p>
            </div>
            <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-white/10 text-xs font-mono">
              {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    dateRange === r ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-56 flex items-end justify-between gap-4 pt-4 border-b border-white/[0.06] pb-2">
            {chartBars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className="w-full max-w-[42px] bg-gradient-to-t from-cyan-500/40 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300"
                  style={{ height: `${(bar.value / 120) * 100}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Peak Day: Thursday (₹2,48,000)</span>
            <span>Target: On Track (+12%)</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-display">Sales By Category</h3>
          <div className="space-y-3 pt-2">
            {[
              { name: 'Smartphones', pct: 45, color: '#06b6d4' },
              { name: 'Laptops', pct: 30, color: '#3b82f6' },
              { name: 'Gaming Consoles', pct: 15, color: '#ec4899' },
              { name: 'Planar Audio', pct: 10, color: '#a855f7' },
            ].map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{cat.name}</span>
                  <span className="font-mono text-slate-400">{cat.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Critical Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-display">Recent Inbound Orders</h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All Orders →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono font-medium text-cyan-400">{order.orderNumber}</td>
                    <td className="py-3 text-slate-200">{order.customerName}</td>
                    <td className="py-3 font-mono tabular-nums text-slate-100">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-cyan-800 text-cyan-300">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-display">Inventory Alerts</h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
              URGENT
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                  <p className="text-[11px] font-mono text-rose-400">
                    Remaining: {p.stock} units (Threshold: {p.lowStockThreshold})
                  </p>
                </div>
                <button
                  onClick={() => handleQuickRestock(p.id, p.stock)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono whitespace-nowrap cursor-pointer"
                >
                  +15 Units
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
