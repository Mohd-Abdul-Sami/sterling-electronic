import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, X, ArrowRight, ShieldAlert, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../services/db';
import { Product } from '../../types';
import { SterlingLogo } from './SterlingLogo';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { cartCount, wishlist, setIsCartDrawerOpen, formatPrice } = useStore();
  const { currentUser, switchUserRole } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allProducts = getProducts();
  const searchResults: Product[] = searchQuery.trim()
    ? allProducts
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
          );
        })
        .slice(0, 5)
    : [];

  const handleSearchResultClick = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    onNavigate(`/product/${slug}`);
  };

  const navLinks = [
    { label: 'Shop', route: '/shop' },
    { label: 'Deals', route: '/shop?filter=deals' },
    { label: 'Brands', route: '/shop?filter=brands' },
    { label: 'Support', route: '/support' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ease-out ${
          isScrolled
            ? 'bg-[#08090e]/92 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.55)] py-2.5 sm:py-3'
            : 'bg-transparent backdrop-blur-none border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* 1. Left: Official Logo Lockup */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => onNavigate('/')}
              className="cursor-pointer text-left focus:outline-none"
            >
              <SterlingLogo size="md" showSubtitle={true} />
            </button>
          </div>

          {/* 2. Center: Search Bar as shown in reference */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121622] hover:bg-[#161b2a] focus:bg-[#161b2a] border border-white/10 hover:border-white/20 focus:border-cyan-400 rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.route)}
                  className={`py-1 transition-colors hover:text-white cursor-pointer ${
                    isActive ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* 4. Right Actions: Wishlist, Account, Cart */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => onNavigate('/wishlist')}
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                title="Account"
              >
                <UserIcon className="w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-white/[0.08] mb-1">
                    <p className="font-semibold text-slate-100">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] font-mono truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/account');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-900 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      <span>My Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/account');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-900 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/admin');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 font-semibold text-center flex items-center justify-center gap-1.5 text-xs text-amber-300 mt-2"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Management Dashboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Bag with Blue Indicator */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim() && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
            <div className="max-w-md mx-auto rounded-2xl bg-[#0c0f18] border border-white/10 shadow-2xl p-3 space-y-2">
              <div className="flex justify-between items-center px-2 py-1 text-slate-400 text-xs font-mono">
                <span>Matching Devices ({searchResults.length})</span>
                <button onClick={() => setIsSearchOpen(false)} className="text-slate-500 hover:text-white">
                  Close
                </button>
              </div>

              {searchResults.length === 0 ? (
                <p className="text-xs text-slate-500 p-2 italic">No devices found matching "{searchQuery}"</p>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product.slug)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-black p-1 flex items-center justify-center shrink-0">
                        <img src={product.images[0]} alt={product.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-100">{product.name}</p>
                        <p className="text-[10px] text-slate-400">{product.brand} · {product.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">{formatPrice(product.salePrice || product.price)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
