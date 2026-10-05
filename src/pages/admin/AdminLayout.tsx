import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  MessageSquare,
  Tag,
  Image as ImageIcon,
  History,
  Settings,
  ShieldAlert,
  ArrowLeft,
  Search,
  Bell,
  CheckCircle,
  Menu,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetDatabaseToSeeds } from '../../services/db';
import { SterlingLogo } from '../../components/common/SterlingLogo';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'reviews'
  | 'coupons'
  | 'banners'
  | 'audit-logs'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onExitToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onExitToStore,
  children,
}) => {
  const { currentUser, switchUserRole, isAdmin, canManageProducts, canManageOrders, canManageInventory } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: any; allowed: boolean }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, allowed: true },
    { id: 'products', label: 'Products Catalog', icon: Package, allowed: canManageProducts },
    { id: 'categories', label: 'Categories', icon: Layers, allowed: canManageProducts },
    { id: 'orders', label: 'Order Fulfillment', icon: ShoppingBag, allowed: canManageOrders },
    { id: 'inventory', label: 'Stock & Inventory', icon: Boxes, allowed: canManageInventory },
    { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare, allowed: canManageProducts },
    { id: 'coupons', label: 'Promotions & Coupons', icon: Tag, allowed: canManageProducts },
    { id: 'banners', label: 'Campaign Banners', icon: ImageIcon, allowed: canManageProducts },
    { id: 'audit-logs', label: 'Security & Audit Logs', icon: History, allowed: isAdmin },
    { id: 'settings', label: 'Store Settings', icon: Settings, allowed: isAdmin },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (products, orders, coupons, inventory) to original showroom seeds?')) {
      resetDatabaseToSeeds();
      showToast('Database reset to original showroom seeds successfully.', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col antialiased">
      {/* Top Admin Notice Bar */}
      <div className="bg-[#111624] border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-amber-300">
            STERLING ENTERPRISE CONSOLE
          </span>
          <span className="text-slate-400 hidden sm:inline">
            · Authenticated as {currentUser.name} ({currentUser.role.replace('_', ' ')})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role switcher for review */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400">Role:</span>
            <select
              value={currentUser.role}
              onChange={(e) => switchUserRole(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="order_manager">Order Manager</option>
              <option value="inventory_manager">Inventory Manager</option>
              <option value="content_manager">Content Manager</option>
            </select>
          </div>

          <button
            onClick={handleResetData}
            title="Reset DB to initial demo seeds"
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExitToStore}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Storefront</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0d14] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SterlingLogo size="sm" showSubtitle={false} />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 tracking-wider">
                  ADMIN
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                if (!item.allowed) return null;
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile footer */}
          <div className="p-4 border-t border-white/[0.06] bg-[#07090f]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.name}</p>
                <p className="text-[10px] font-mono text-amber-400 capitalize truncate">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Admin top bar */}
          <header className="h-14 border-b border-white/[0.06] bg-[#090c12]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-bold text-slate-200 capitalize font-display">
                {currentTab.replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
              </button>

              {notificationsOpen && (
                <div className="absolute top-14 right-6 w-80 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-2xl p-3 z-50 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2">
                    <span className="font-bold text-slate-200">System Notifications</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                      <p className="text-slate-200 font-medium">New Order STL-2026-10492 placed</p>
                      <p className="text-[10px] text-slate-500 font-mono">Princesami · Total ₹1,19,769</p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                      <p className="text-amber-300 font-medium">Low Stock Warning: Titan Gaming Console</p>
                      <p className="text-[10px] text-slate-500 font-mono">Remaining: 4 units</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main View Area */}
          <main className="p-6 md:p-8 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};
