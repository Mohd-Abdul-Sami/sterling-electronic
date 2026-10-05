import React from 'react';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MobileBottomBarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentRoute, onNavigate }) => {
  const { cartCount, setIsCartDrawerOpen } = useStore();

  const isHome = currentRoute === '/';
  const isShop = currentRoute.startsWith('/shop') || currentRoute.startsWith('/category');
  const isAccount = currentRoute.startsWith('/account');

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#090b11]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 flex items-center justify-around lg:hidden shadow-2xl">
      <button
        onClick={() => onNavigate('/')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          isHome ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="text-[10px] font-mono">Home</span>
      </button>

      <button
        onClick={() => onNavigate('/shop')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          isShop ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Grid className="w-4 h-4" />
        <span className="text-[10px] font-mono">Shop</span>
      </button>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-slate-400 hover:text-slate-200 relative"
      >
        <ShoppingBag className="w-4 h-4" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white font-mono text-[8px] flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-mono">Cart</span>
      </button>

      <button
        onClick={() => onNavigate('/account')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          isAccount ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[10px] font-mono">Account</span>
      </button>
    </nav>
  );
};
