import {
  Product,
  CategoryItem,
  Order,
  Review,
  Coupon,
  Banner,
  AuditLog,
  User,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS,
} from '../data/seedData';

const STORAGE_KEYS = {
  PRODUCTS: 'sterling_products_v5',
  CATEGORIES: 'sterling_categories_v5',
  ORDERS: 'sterling_orders_v5',
  REVIEWS: 'sterling_reviews_v5',
  COUPONS: 'sterling_coupons_v5',
  BANNERS: 'sterling_banners_v5',
  AUDIT_LOGS: 'sterling_audit_logs_v5',
  USERS: 'sterling_users_v5',
  SETTINGS: 'sterling_settings_v5',
};

type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

export function subscribeToDb(listener: ChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading ${key} from storage, using fallback:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// ---------------- PRODUCTS ----------------
export function getProducts(): Product[] {
  return loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, adminName = 'Admin'): Product {
  const products = getProducts();
  const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const newProduct: Product = {
    ...productData,
    id,
    createdAt: now,
    updatedAt: now,
  };
  saveToStorage(STORAGE_KEYS.PRODUCTS, [newProduct, ...products]);
  logAuditAction(adminName, 'admin', 'CREATE', 'Product', id, `Created product "${newProduct.name}" (SKU: ${newProduct.sku})`);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>, adminName = 'Admin'): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: Product = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  logAuditAction(adminName, 'admin', 'UPDATE', 'Product', id, `Updated product "${updated.name}"`);
  return updated;
}

export function deleteProduct(id: string, adminName = 'Admin'): boolean {
  const products = getProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return false;

  const filtered = products.filter((p) => p.id !== id);
  saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
  logAuditAction(adminName, 'admin', 'DELETE', 'Product', id, `Deleted product "${target.name}"`);
  return true;
}

// ---------------- CATEGORIES ----------------
export function getCategories(): CategoryItem[] {
  return loadFromStorage<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function createCategory(cat: Omit<CategoryItem, 'id'>, adminName = 'Admin'): CategoryItem {
  const categories = getCategories();
  const id = `cat-${Date.now()}`;
  const newCat: CategoryItem = { ...cat, id };
  saveToStorage(STORAGE_KEYS.CATEGORIES, [...categories, newCat]);
  logAuditAction(adminName, 'admin', 'CREATE', 'Category', id, `Created category "${newCat.name}"`);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<CategoryItem>, adminName = 'Admin'): CategoryItem | null {
  const categories = getCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...categories[idx], ...updates };
  categories[idx] = updated;
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  logAuditAction(adminName, 'admin', 'UPDATE', 'Category', id, `Updated category "${updated.name}"`);
  return updated;
}

export function deleteCategory(id: string, adminName = 'Admin'): boolean {
  const categories = getCategories();
  const target = categories.find((c) => c.id === id);
  if (!target) return false;
  const filtered = categories.filter((c) => c.id !== id);
  saveToStorage(STORAGE_KEYS.CATEGORIES, filtered);
  logAuditAction(adminName, 'admin', 'DELETE', 'Category', id, `Deleted category "${target.name}"`);
  return true;
}

// ---------------- ORDERS ----------------
export function getOrders(): Order[] {
  return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id || o.orderNumber === id);
}

export function createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Order {
  const orders = getOrders();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `STL-${new Date().getFullYear()}-${randomSuffix}`;
  const id = `ord-${Date.now()}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderPayload,
    id,
    orderNumber,
    statusHistory: [
      {
        status: orderPayload.orderStatus || 'pending',
        timestamp: now,
        note: `Order placed securely via ${orderPayload.paymentMethod.toUpperCase()}`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  // Decrement inventory for each item
  const products = getProducts();
  newOrder.items.forEach((item) => {
    const pIdx = products.findIndex((p) => p.id === item.productId);
    if (pIdx !== -1) {
      products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
    }
  });
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);

  saveToStorage(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note = '',
  trackingNumber?: string,
  adminName = 'Order Manager'
): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const existing = orders[idx];

  const updated: Order = {
    ...existing,
    orderStatus: newStatus,
    trackingNumber: trackingNumber !== undefined ? trackingNumber : existing.trackingNumber,
    updatedAt: now,
    statusHistory: [
      ...existing.statusHistory,
      {
        status: newStatus,
        timestamp: now,
        note: note || `Status updated to ${newStatus.replace('_', ' ')}`,
      },
    ],
  };

  orders[idx] = updated;
  saveToStorage(STORAGE_KEYS.ORDERS, orders);
  logAuditAction(adminName, 'order_manager', 'UPDATE', 'Order', orderId, `Changed status of ${existing.orderNumber} to ${newStatus}`);
  return updated;
}

// ---------------- REVIEWS ----------------
export function getReviews(): Review[] {
  return loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}

export function getProductReviews(productId: string): Review[] {
  return getReviews().filter((r) => r.productId === productId && r.status === 'approved');
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>): Review {
  const reviews = getReviews();
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    status: 'approved', // Auto-approved in demo for instant gratification
    createdAt: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.REVIEWS, [newReview, ...reviews]);

  // Recalculate product rating
  const products = getProducts();
  const pIdx = products.findIndex((p) => p.id === reviewData.productId);
  if (pIdx !== -1) {
    const prodReviews = reviews.filter((r) => r.productId === reviewData.productId && r.status === 'approved');
    const all = [newReview, ...prodReviews];
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
    products[pIdx].rating = Number(avg.toFixed(1));
    products[pIdx].reviewCount = all.length;
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  return newReview;
}

export function updateReviewStatus(id: string, status: 'approved' | 'pending' | 'rejected', adminName = 'Admin'): Review | null {
  const reviews = getReviews();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reviews[idx].status = status;
  saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
  logAuditAction(adminName, 'admin', 'UPDATE', 'Review', id, `Updated review status to ${status}`);
  return reviews[idx];
}

export function deleteReview(id: string, adminName = 'Admin'): boolean {
  const reviews = getReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  saveToStorage(STORAGE_KEYS.REVIEWS, filtered);
  logAuditAction(adminName, 'admin', 'DELETE', 'Review', id, 'Deleted customer review');
  return true;
}

// ---------------- COUPONS ----------------
export function getCoupons(): Coupon[] {
  return loadFromStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
}

export function validateCoupon(code: string, cartSubtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid promotional coupon code.' };
  }
  if (!coupon.isActive) {
    return { valid: false, discount: 0, message: 'This coupon has been deactivated.' };
  }
  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, discount: 0, message: 'This coupon code has expired.' };
  }
  if (cartSubtotal < coupon.minCartValue) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum cart value of ₹${coupon.minCartValue.toLocaleString('en-IN')} required for this coupon.`,
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue;
  }

  return {
    valid: true,
    discount: Math.min(discount, cartSubtotal),
    message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discount.toLocaleString('en-IN')}`,
    coupon,
  };
}

export function createCoupon(coupon: Omit<Coupon, 'id' | 'usedCount'>, adminName = 'Admin'): Coupon {
  const coupons = getCoupons();
  const newCoupon: Coupon = {
    ...coupon,
    id: `cpn-${Date.now()}`,
    usedCount: 0,
  };
  saveToStorage(STORAGE_KEYS.COUPONS, [newCoupon, ...coupons]);
  logAuditAction(adminName, 'admin', 'CREATE', 'Coupon', newCoupon.id, `Created coupon ${newCoupon.code}`);
  return newCoupon;
}

export function updateCoupon(id: string, updates: Partial<Coupon>, adminName = 'Admin'): Coupon | null {
  const coupons = getCoupons();
  const idx = coupons.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  coupons[idx] = { ...coupons[idx], ...updates };
  saveToStorage(STORAGE_KEYS.COUPONS, coupons);
  logAuditAction(adminName, 'admin', 'UPDATE', 'Coupon', id, `Updated coupon ${coupons[idx].code}`);
  return coupons[idx];
}

export function deleteCoupon(id: string, adminName = 'Admin'): boolean {
  const coupons = getCoupons();
  const filtered = coupons.filter((c) => c.id !== id);
  saveToStorage(STORAGE_KEYS.COUPONS, filtered);
  logAuditAction(adminName, 'admin', 'DELETE', 'Coupon', id, 'Deleted promotional coupon');
  return true;
}

// ---------------- BANNERS ----------------
export function getBanners(): Banner[] {
  return loadFromStorage<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
}

export function createBanner(banner: Omit<Banner, 'id'>, adminName = 'Admin'): Banner {
  const banners = getBanners();
  const newBanner: Banner = { ...banner, id: `ban-${Date.now()}` };
  saveToStorage(STORAGE_KEYS.BANNERS, [newBanner, ...banners]);
  logAuditAction(adminName, 'admin', 'CREATE', 'Banner', newBanner.id, `Created banner "${newBanner.title}"`);
  return newBanner;
}

export function updateBanner(id: string, updates: Partial<Banner>, adminName = 'Admin'): Banner | null {
  const banners = getBanners();
  const idx = banners.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  banners[idx] = { ...banners[idx], ...updates };
  saveToStorage(STORAGE_KEYS.BANNERS, banners);
  logAuditAction(adminName, 'admin', 'UPDATE', 'Banner', id, `Updated banner "${banners[idx].title}"`);
  return banners[idx];
}

export function deleteBanner(id: string, adminName = 'Admin'): boolean {
  const banners = getBanners();
  const filtered = banners.filter((b) => b.id !== id);
  saveToStorage(STORAGE_KEYS.BANNERS, filtered);
  logAuditAction(adminName, 'admin', 'DELETE', 'Banner', id, 'Deleted banner');
  return true;
}

// ---------------- AUDIT LOGS ----------------
export function getAuditLogs(): AuditLog[] {
  return loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

export function logAuditAction(
  adminName: string,
  adminRole: any,
  action: string,
  entity: string,
  entityId: string,
  details: string
) {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    adminName,
    adminRole,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 99)]);
}

// ---------------- USERS ----------------
export function getUsers(): User[] {
  return loadFromStorage<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveToStorage(STORAGE_KEYS.USERS, users);
  return users[idx];
}

// ---------------- SYSTEM RESET ----------------
export function resetDatabaseToSeeds() {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
  notifyListeners();
}
