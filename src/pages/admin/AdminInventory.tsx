import React, { useState } from 'react';
import { Boxes, Search, Plus, Minus, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { getProducts, updateProduct } from '../../services/db';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminInventory: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out'>('all');

  const refresh = () => setProducts(getProducts());

  const handleAdjustStock = (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    updateProduct(p.id, { stock: newStock }, 'Inventory Desk');
    showToast(`Adjusted ${p.sku} stock to ${newStock} units.`, 'success');
    refresh();
  };

  const handleUpdateThreshold = (p: Product, newThreshold: number) => {
    updateProduct(p.id, { lowStockThreshold: Math.max(1, newThreshold) }, 'Inventory Desk');
    showToast(`Updated low stock threshold for ${p.sku}`, 'info');
    refresh();
  };

  const filtered = products.filter((p) => {
    if (statusFilter === 'low' && (p.stock > p.lowStockThreshold || p.stock === 0)) return false;
    if (statusFilter === 'out' && p.stock > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Stock Allocation & Inbound Control</h2>
          <p className="text-xs text-slate-400">Real-time telemetry of physical hardware quantities</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or device name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
              statusFilter === 'all' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-900 text-slate-400'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setStatusFilter('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
              statusFilter === 'low' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Low Stock Alerts
          </button>
          <button
            onClick={() => setStatusFilter('out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono ${
              statusFilter === 'out' ? 'bg-amber-400 text-black font-bold' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#090b12] text-slate-400 font-mono text-[11px]">
                <th className="p-4">SKU / Device</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Low-Stock Alert Trigger</th>
                <th className="p-4">Inventory State</th>
                <th className="p-4 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((product) => {
                const isLow = product.stock <= product.lowStockThreshold && product.stock > 0;
                const isOut = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-white/[0.02]">
                    <td className="p-4">
                      <p className="font-mono font-bold text-cyan-400">{product.sku}</p>
                      <p className="text-slate-200 font-semibold truncate max-w-xs">{product.name}</p>
                    </td>
                    <td className="p-4 text-slate-400">{product.category}</td>
                    <td className="p-4 font-mono font-bold text-base text-slate-100">
                      {product.stock}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      <input
                        type="number"
                        defaultValue={product.lowStockThreshold}
                        onBlur={(e) => handleUpdateThreshold(product, Number(e.target.value))}
                        className="w-16 bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-slate-200"
                      />
                    </td>
                    <td className="p-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                          IN STOCK
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        <button
                          onClick={() => handleAdjustStock(product, -1)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                          title="Decrement 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(product, 5)}
                          className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs"
                          title="Restock 5"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(product, 20)}
                          className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded text-xs"
                          title="Restock 20"
                        >
                          +20
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
