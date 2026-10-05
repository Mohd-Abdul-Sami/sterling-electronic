import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon, Order } from '../types';
import { validateCoupon, getProducts, subscribeToDb, createOrder } from '../services/db';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  wishlist: string[];
  quickViewProduct: Product | null;
  addToCart: (product: Product, quantity?: number, selectedColor?: string, variantId?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => boolean;
  removeCoupon: () => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  formatPrice: (amount: number) => string;
  checkoutOrder: (payload: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    paymentMethod: 'card' | 'upi' | 'cod';
  }) => Order | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sterling_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sterling_wishlist');
      return saved ? JSON.parse(saved) : ['prod-sp-1', 'prod-au-1'];
    } catch {
      return ['prod-sp-1', 'prod-au-1'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sterling_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sterling_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Subscribe to DB updates
  useEffect(() => {
    return subscribeToDb(() => {
      // Re-validate stock in cart against DB products
      const products = getProducts();
      setCart((prev) =>
        prev.map((item) => {
          const matched = products.find((p) => p.id === item.productId);
          if (matched) {
            return {
              ...item,
              price: matched.salePrice || matched.price,
              originalPrice: matched.price,
              maxStock: matched.stock,
              quantity: Math.min(item.quantity, Math.max(1, matched.stock)),
            };
          }
          return item;
        })
      );
    });
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Re-evaluate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const validation = validateCoupon(appliedCoupon.code, subtotal);
      if (validation.valid) {
        setCouponDiscount(validation.discount);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        showToast(validation.message, 'info');
      }
    } else {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon]);

  const freeShippingThreshold = 4999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const tax = Math.round((subtotal - couponDiscount) * 0.18); // 18% standard GST
  const total = Math.max(0, subtotal - couponDiscount + shippingFee + tax);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, variantId?: string) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    const effectivePrice = product.salePrice || product.price;
    const cartItemId = `${product.id}-${selectedColor || 'default'}-${variantId || 'standard'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`Updated quantity for ${product.name}`, 'success');
        return prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item));
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          variantId,
          name: product.name,
          price: effectivePrice,
          originalPrice: product.price,
          image: product.images[0] || product.hoverImage || '',
          color: selectedColor || (product.colors?.[0]?.name ?? undefined),
          sku: product.sku,
          quantity: Math.min(quantity, product.stock),
          maxStock: product.stock,
        };
        showToast(`Added ${product.name} to cart`, 'success');
        return [newItem, ...prev];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const updated = item.quantity + delta;
            if (updated <= 0) return null;
            if (updated > item.maxStock) {
              showToast(`Only ${item.maxStock} units currently available.`, 'info');
              return item;
            }
            return { ...item, quantity: updated };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string): boolean => {
    const res = validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponDiscount(res.discount);
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const checkoutOrder = (payload: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    paymentMethod: 'card' | 'upi' | 'cod';
  }): Order | null => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }

    try {
      const created = createOrder({
        customerId: currentUser.id,
        customerName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName: payload.fullName,
          phone: payload.phone,
          addressLine1: payload.addressLine1,
          addressLine2: payload.addressLine2,
          city: payload.city,
          state: payload.state,
          postalCode: payload.postalCode,
          country: 'India',
        },
        items: [...cart],
        subtotal,
        discount: couponDiscount,
        shippingFee,
        tax,
        total,
        couponCode: appliedCoupon?.code,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'confirmed',
        trackingNumber: `ST-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      });

      clearCart();
      return created;
    } catch (err) {
      console.error(err);
      showToast('Failed to place order. Please try again.', 'error');
      return null;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount: couponDiscount,
        shippingFee,
        tax,
        total,
        appliedCoupon,
        isCartDrawerOpen,
        freeShippingThreshold,
        freeShippingProgress,
        wishlist,
        quickViewProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon,
        setIsCartDrawerOpen,
        toggleWishlist,
        isInWishlist,
        openQuickView,
        closeQuickView,
        formatPrice,
        checkoutOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
