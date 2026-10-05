import React, { useState } from 'react';
import { Settings, RefreshCw, Save, Check } from 'lucide-react';
import { resetDatabaseToSeeds } from '../../services/db';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();

  const [currency, setCurrency] = useState('INR (₹)');
  const [taxRate, setTaxRate] = useState(18);
  const [shippingThreshold, setShippingThreshold] = useState(4999);
  const [companyName, setCompanyName] = useState('Sterling Electronic Sales');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Storefront configurations saved successfully.', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all catalog devices, orders, and customer accounts to initial showroom demo data?')) {
      resetDatabaseToSeeds();
      showToast('Database reset to initial demo seeds.', 'success');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Storefront System Settings</h2>
        <p className="text-xs text-slate-400">Configure global currency, GST tax rates, and database state</p>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Company Registered Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Store Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
              <option value="USD ($)">USD ($ - US Dollar)</option>
              <option value="EUR (€)">EUR (€ - Euro)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Standard GST Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Free Priority Shipping Threshold (₹)</label>
          <input
            type="number"
            value={shippingThreshold}
            onChange={(e) => setShippingThreshold(Number(e.target.value))}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Save Configuration
        </button>
      </form>

      {/* Danger Zone / Reset */}
      <div className="p-6 md:p-8 rounded-3xl bg-rose-950/20 border border-rose-500/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-300 font-display">Database Reset & Demo Seeding</h3>
        <p className="text-xs text-slate-400">
          Restore all 45+ demo devices, categories, banners, sample customer orders, and reviews to pristine factory state.
        </p>
        <button
          onClick={handleReset}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Showroom Database</span>
        </button>
      </div>
    </div>
  );
};
