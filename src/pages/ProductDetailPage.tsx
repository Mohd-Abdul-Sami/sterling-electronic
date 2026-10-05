import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Shield,
  Truck,
  Box,
  Plus,
  Minus,
  Cpu,
  Battery,
  HardDrive,
  Award,
} from 'lucide-react';
import { Product, Review } from '../types';
import { getProductBySlug, getProducts, getProductReviews, addReview } from '../services/db';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product3DViewer } from '../components/3d/Product3DViewer';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { addToCart, isInWishlist, toggleWishlist, formatPrice, setIsCartDrawerOpen } = useStore();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const product = getProductBySlug(slug) || getProducts()[0];
  const allProducts = getProducts();

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [is3DMode, setIs3DMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const isFav = isInWishlist(product.id);
  const activeColor = selectedColor || product.colors?.[0]?.name;
  const activeColorHex = product.colors?.find((c) => c.name === activeColor)?.hex || '#1e2433';
  const effectivePrice = product.salePrice || product.price;
  const reviews = getProductReviews(product.id);

  // Accessories matching "You May Also Like" in reference screenshot
  const accessoryItems = allProducts.filter((p) => p.category === 'Accessories').slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeColor);
  };

  const handleAddAccessory = (acc: Product) => {
    addToCart(acc, 1);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      showToast('Please provide a title and review comment.', 'error');
      return;
    }

    addReview({
      productId: product.id,
      productName: product.name,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
    });

    setReviewTitle('');
    setReviewComment('');
    showToast('Your verified review was published.', 'success');
  };

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Stage Box matching reference Screen 2 */}
        <div className="p-6 md:p-8 rounded-3xl bg-[#0c0f17] border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Vertical Thumbnails Rail + Big Image / 3D Canvas */}
            <div className="lg:col-span-7 flex gap-4 items-start">
              {/* Vertical thumbnail switcher on the left */}
              {!is3DMode && (
                <div className="flex flex-col gap-2 shrink-0">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-14 h-14 rounded-xl p-1 bg-black border transition-all ${
                        selectedImgIdx === idx
                          ? 'border-cyan-400 ring-2 ring-cyan-500/20'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </button>
                  ))}
                  <button
                    onClick={() => setIs3DMode(true)}
                    className="w-14 h-14 rounded-xl p-1 bg-slate-900 border border-cyan-500/40 text-cyan-400 flex flex-col items-center justify-center text-[9px] font-mono hover:bg-cyan-950/30"
                    title="Inspect in 3D"
                  >
                    <Box className="w-4 h-4 mb-0.5" />
                    <span>3D</span>
                  </button>
                </div>
              )}

              {/* Central Main Showcase */}
              <div className="flex-1 relative aspect-[4/3] rounded-2xl bg-[#080a10] border border-white/5 p-6 flex items-center justify-center overflow-hidden">
                {is3DMode ? (
                  <div className="w-full h-full relative">
                    <button
                      onClick={() => setIs3DMode(false)}
                      className="absolute top-2 right-2 z-20 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-xs text-slate-300 font-mono"
                    >
                      Exit 3D
                    </button>
                    <Product3DViewer
                      modelType={product.model3dType || 'laptop'}
                      primaryColor={activeColorHex}
                      productName={product.name}
                      fallbackImage={product.images[0]}
                    />
                  </div>
                ) : (
                  <img
                    src={product.images[selectedImgIdx] || product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
                  />
                )}
              </div>
            </div>

            {/* Right Column: Title, Specs, Price, CTA, Feature Badges */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  {product.shortDescription ? product.shortDescription.split('•')[0] : 'Flagship Specification'}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2 text-amber-400 text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-sans text-slate-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold font-display text-white tabular-nums">
                  {formatPrice(effectivePrice)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm font-sans text-slate-500 line-through tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* In Stock & Free Shipping Pills */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  In Stock
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Free Shipping
                </span>
              </div>

              {/* Stepper + Blue Add to Cart + Heart wishlist */}
              <div className="flex items-center gap-3 pt-2">
                {/* Stepper */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Blue Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-blue-600/30"
                >
                  Add to Cart
                </button>

                {/* Heart */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFav
                      ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Feature 4-Item Grid as shown in reference */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06] text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-200">Apple M3 Chip</p>
                    <p className="text-[10px] text-slate-400">8-core CPU / 10-core GPU</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Battery className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-200">Up to 18 Hours</p>
                    <p className="text-[10px] text-slate-400">All-day Battery Life</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-200">8GB Unified Memory</p>
                    <p className="text-[10px] text-slate-400">256GB SSD Storage</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-white/5">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-200">1 Year Warranty</p>
                    <p className="text-[10px] text-slate-400">Authorized Reseller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Section: Tabs (Description / Specs / Reviews) & "You May Also Like" Accessories */}
          <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Tabs & Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-6 border-b border-white/[0.08] pb-3 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'desc' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'specs' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'reviews' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {activeTab === 'desc' && (
                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="space-y-2 pt-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>13.6" Liquid Retina display</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>Apple M3 chip</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>8GB unified memory</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>256GB SSD storage</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                      <span className="text-slate-500 font-mono block text-[10px] uppercase">{key}</span>
                      <span className="text-slate-200 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{rev.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
                      </div>
                      <p className="text-slate-400">{rev.comment}</p>
                      <p className="text-[10px] text-slate-500 font-mono">By {rev.customerName}</p>
                    </div>
                  ))}
                  <form onSubmit={handleSubmitReview} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-100">Write a Review</h4>
                    <input
                      type="text"
                      placeholder="Review Title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full bg-[#0c0f17] border border-white/10 rounded-lg px-3 py-2 text-slate-200"
                    />
                    <textarea
                      placeholder="Comment..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-[#0c0f17] border border-white/10 rounded-lg px-3 py-2 text-slate-200"
                    />
                    <button type="submit" className="py-2 px-4 rounded-lg bg-cyan-500 text-black font-semibold text-xs">
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* "You May Also Like" Accessories Rail matching screenshot */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-bold text-white font-display">You May Also Like</h3>
              <div className="space-y-3">
                {accessoryItems.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black p-1 flex items-center justify-center shrink-0 border border-white/5">
                        <img src={acc.images[0]} alt={acc.name} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200">{acc.name}</h4>
                        <p className="text-xs font-mono font-bold text-white">{formatPrice(acc.price)}</p>
                        <div className="flex items-center text-amber-400 text-[10px]">
                          <span>★★★★★</span>
                          <span className="text-slate-500 ml-1">({acc.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddAccessory(acc)}
                      className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
