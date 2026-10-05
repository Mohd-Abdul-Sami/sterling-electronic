export type UserRole = 'super_admin' | 'admin' | 'inventory_manager' | 'order_manager' | 'content_manager' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type ProductCategory = 
  | 'Smartphones'
  | 'Laptops'
  | 'Audio'
  | 'Gaming'
  | 'Televisions'
  | 'Wearables'
  | 'Smart Home'
  | 'Accessories'
  | 'Cameras'
  | 'Tablets';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  discountPercent?: number;
  stock: number;
  lowStockThreshold: number;
  sku: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  hoverImage?: string;
  model3dType?: 'phone' | 'laptop' | 'audio' | 'watch' | 'console' | 'sphere';
  colors?: ProductColor[];
  variants?: ProductVariant[];
  warranty: string;
  specs: Record<string, string>;
  features: string[];
  whatsInTheBox?: string[];
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isLimitedDeal?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  sku: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'card' | 'upi' | 'cod';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  eligibleCategories?: ProductCategory[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  priority: number;
}

export interface AuditLog {
  id: string;
  adminName: string;
  adminRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface CategoryItem {
  id: string;
  name: ProductCategory;
  slug: string;
  description: string;
  itemCount: number;
  accentColor: string;
  image: string;
}
