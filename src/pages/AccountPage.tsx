import React, { useState } from 'react';
import { User, Package, MapPin, Shield, Plus, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { getOrders } from '../services/db';

interface AccountPageProps {
  onNavigate: (route: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { currentUser, updateCurrentUserProfile, addAddress, switchUserRole } = useAuth();
  const { formatPrice } = useStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Address Modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  // Profile fields
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');

  // User orders
  const allOrders = getOrders();
  const userOrders = allOrders.filter(
    (o) => o.customerId === currentUser.id || o.email === currentUser.email
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ name: profileName, phone: profilePhone });
    showToast('Profile information updated successfully.', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrLine1 || !addrCity || !addrPin) {
      showToast('Please fill all required address fields.', 'error');
      return;
    }
    addAddress({
      fullName: addrName,
      phone: addrPhone || currentUser.phone || '',
      addressLine1: addrLine1,
      city: addrCity,
      state: addrState || 'Karnataka',
      postalCode: addrPin,
      country: 'India',
    });
    setShowAddressModal(false);
    showToast('New shipping address saved.', 'success');
    setAddrName('');
    setAddrLine1('');
    setAddrCity('');
    setAddrPin('');
  };

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 text-2xl font-bold font-display">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-display">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Member since {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/admin')}
              className="py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Admin Management Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders & Shipments ({userOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'addresses'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Addresses ({(currentUser.addresses || []).length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile & Security
          </button>
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-white/[0.08] bg-[#0c0f17] p-8">
                <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200 font-display">
                  YOUR NEXT DELIVERY STARTS HERE.
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  You haven't placed an order with this account yet.
                </p>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-semibold uppercase"
                >
                  Explore Showroom
                </button>
              </div>
            ) : (
              userOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-[#0c0f17] border border-white/10 space-y-4 shadow-xl hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-cyan-400">
                          {order.orderNumber}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tracking: <span className="font-mono text-slate-300">{order.trackingNumber || 'Pending'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 text-cyan-300 border border-cyan-800">
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => onNavigate(`/order-tracking/${order.id}`)}
                        className="py-1.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Track Live</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                        <div className="w-12 h-12 rounded-lg bg-black p-1 shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
                    <span className="text-slate-400">Paid via {order.paymentMethod.toUpperCase()}</span>
                    <span className="font-mono font-bold text-slate-100 text-sm">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. SAVED ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Saved Shipping Destinations
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="py-2 px-3.5 rounded-xl bg-cyan-500 text-black text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentUser.addresses || []).map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 rounded-2xl bg-[#0c0f17] border border-white/10 space-y-2 relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      DEFAULT
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-slate-100">{addr.fullName}</h4>
                  <p className="text-xs text-slate-300">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-xs text-slate-400">{addr.addressLine2}</p>}
                  <p className="text-xs text-slate-300">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-xs font-mono text-slate-500 pt-2">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROFILE & SECURITY TAB */}
        {activeTab === 'profile' && (
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 max-w-xl">
            <h3 className="text-base font-bold text-slate-100 font-display mb-4">
              Profile & Contact Information
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-[#0c0f17] border border-white/10 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 font-display">Add Delivery Address</h3>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addrName}
                  onChange={(e) => setAddrName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Address Line 1 (Street, Building, Flat)"
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={addrPin}
                    onChange={(e) => setAddrPin(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
