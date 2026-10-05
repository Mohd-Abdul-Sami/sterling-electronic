import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X, Tag, Check } from 'lucide-react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/db';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useStore } from '../../context/StoreContext';

export const AdminCoupons: React.FC = () => {
  const { showToast } = useToast();
  const { formatPrice } = useStore();

  const [coupons, setCoupons] = useState<Coupon[]>(getCoupons());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<'percentage' | 'fixed'>('percentage');
  const [formValue, setFormValue] = useState(10);
  const [formMinCart, setFormMinCart] = useState(5000);
  const [formMaxUses, setFormMaxUses] = useState(500);
  const [formExpiresAt, setFormExpiresAt] = useState('2026-12-31');

  const refresh = () => setCoupons(getCoupons());

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormCode('');
    setFormType('percentage');
    setFormValue(10);
    setFormMinCart(5000);
    setFormMaxUses(500);
    setFormExpiresAt('2026-12-31');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingId(c.id);
    setFormCode(c.code);
    setFormType(c.discountType);
    setFormValue(c.discountValue);
    setFormMinCart(c.minCartValue);
    setFormMaxUses(c.maxUses);
    setFormExpiresAt(c.expiresAt.substring(0, 10));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Delete coupon code ${code}?`)) {
      deleteCoupon(id, 'Admin Portal');
      refresh();
      showToast(`Coupon ${code} deleted.`, 'info');
    }
  };

  const handleToggleActive = (c: Coupon) => {
    updateCoupon(c.id, { isActive: !c.isActive }, 'Admin Portal');
    refresh();
    showToast(`Coupon ${c.code} status toggled.`, 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) return;

    if (editingId) {
      updateCoupon(
        editingId,
        {
          code: formCode.toUpperCase().trim(),
          discountType: formType,
          discountValue: formValue,
          minCartValue: formMinCart,
          maxUses: formMaxUses,
          expiresAt: `${formExpiresAt}T23:59:59Z`,
        },
        'Admin Portal'
      );
      showToast(`Coupon ${formCode} updated.`, 'success');
    } else {
      createCoupon(
        {
          code: formCode.toUpperCase().trim(),
          discountType: formType,
          discountValue: formValue,
          minCartValue: formMinCart,
          maxUses: formMaxUses,
          expiresAt: `${formExpiresAt}T23:59:59Z`,
          isActive: true,
        },
        'Admin Portal'
      );
      showToast(`Created coupon ${formCode}.`, 'success');
    }

    setIsModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Coupons & Promotional Rules</h2>
          <p className="text-xs text-slate-400">Server-validated discounts and cart threshold incentives</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-cyan-400 tracking-wider">
                  {c.code}
                </span>
                <div className="flex gap-1.5">
                  <button onClick={() => handleOpenEdit(c)} className="p-1 rounded bg-slate-900 text-slate-300 hover:text-white">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.code)} className="p-1 rounded bg-slate-900 text-slate-300 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-xs">
                <p className="text-slate-200 font-semibold">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                </p>
                <p className="text-slate-400">Min Cart: {formatPrice(c.minCartValue)}</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Redeemed {c.usedCount} / {c.maxUses} times
                </p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Expires: {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${c.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300'}`}>
                {c.isActive ? 'ACTIVE' : 'DEACTIVATED'}
              </span>
              <button
                onClick={() => handleToggleActive(c)}
                className="text-xs text-slate-400 hover:text-white underline font-mono"
              >
                {c.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0f17] border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-display">
                {editingId ? 'Edit Promotional Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STERLING20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Minimum Cart Total (₹)</label>
                  <input
                    type="number"
                    required
                    value={formMinCart}
                    onChange={(e) => setFormMinCart(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formExpiresAt}
                    onChange={(e) => setFormExpiresAt(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold uppercase">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
