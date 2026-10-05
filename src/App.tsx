/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/shop/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CustomCursor } from './components/common/CustomCursor';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';

// Admin System
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentRoute.startsWith('/admin');
  const pathname = currentRoute.split('?')[0];
  const searchParams = new URLSearchParams(currentRoute.split('?')[1] || '');

  // Render Admin Layout
  if (isAdminRoute) {
    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onExitToStore={() => navigate('/')}
      >
        {adminTab === 'overview' && <AdminOverview onNavigateTab={setAdminTab} />}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'coupons' && <AdminCoupons />}
        {adminTab === 'banners' && <AdminBanners />}
        {adminTab === 'audit-logs' && <AdminAuditLogs />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Render Customer Storefront Layout
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      <CustomCursor />

      <div>
        <Navbar currentRoute={currentRoute} onNavigate={navigate} />

        <main>
          {pathname === '/' && <HomePage onNavigate={navigate} />}

          {pathname === '/shop' && (
            <ShopPage
              initialCategory={searchParams.get('category') || undefined}
              initialQuery={searchParams.get('q') || ''}
              dealsOnly={searchParams.get('filter') === 'deals'}
              onNavigate={navigate}
            />
          )}

          {pathname.startsWith('/category/') && (
            <ShopPage
              initialCategory={pathname.replace('/category/', '')}
              onNavigate={navigate}
            />
          )}

          {pathname.startsWith('/product/') && (
            <ProductDetailPage
              slug={pathname.replace('/product/', '')}
              onNavigate={navigate}
            />
          )}

          {pathname === '/checkout' && <CheckoutPage onNavigate={navigate} />}

          {pathname.startsWith('/order-tracking/') && (
            <OrderTrackingPage
              orderId={pathname.replace('/order-tracking/', '')}
              onNavigate={navigate}
            />
          )}

          {pathname === '/wishlist' && <WishlistPage onNavigate={navigate} />}

          {pathname.startsWith('/account') && <AccountPage onNavigate={navigate} />}

          {pathname === '/about' && <AboutPage onNavigate={navigate} />}

          {pathname === '/support' && <SupportPage onNavigate={navigate} />}
        </main>
      </div>

      <Footer onNavigate={navigate} />

      {/* Global Slide-over Cart Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Global Quick View Modal */}
      <QuickViewModal onNavigateProduct={(slug) => navigate(`/product/${slug}`)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
