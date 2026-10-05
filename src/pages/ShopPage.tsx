import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, List, X, Search, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { getProducts, getCategories } from '../services/db';
import { Product, ProductCategory } from '../types';
import { useStore } from '../context/StoreContext';

interface ShopPageProps {
  initialCategory?: string;
  initialQuery?: string;
  dealsOnly?: boolean;
  onNavigate: (route: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialQuery = '',
  dealsOnly = false,
  onNavigate,
}) => {
  const { formatPrice } = useStore();
  const allProducts = getProducts();
  const categories = getCategories();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(360000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(allProducts.map((p) => p.brand)));
    return ['all', ...list];
  }, [allProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catMatch =
          product.category.toLowerCase() === selectedCategory.toLowerCase() ||
          product.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // Price filter
      const price = product.salePrice || product.price;
      if (price > maxPrice) {
        return false;
      }

      // Stock filter
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Deals only flag
      if (dealsOnly && (!product.salePrice || product.salePrice >= product.price)) {
        return false;
      }

      // Search query
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesSku = product.sku.toLowerCase().includes(q);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesSku && !matchesTag) {
          return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0; // featured default
    });

    return result;
  }, [allProducts, selectedCategory, selectedBrand, maxPrice, onlyInStock, minRating, dealsOnly, searchFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(360000);
    setOnlyInStock(false);
    setMinRating(0);
    setSearchFilter('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    maxPrice < 360000 ||
    onlyInStock ||
    minRating > 0 ||
    searchFilter.trim() !== '';

  return (
    <div className="w-full min-h-screen bg-[#08090d] text-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <button onClick={() => onNavigate('/')} className="hover:text-cyan-300">
              Home
            </button>
            <span>/</span>
            <span className="text-slate-200">Catalog Showroom</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-cyan-400 capitalize">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display">
                {selectedCategory !== 'all'
                  ? `${selectedCategory.toUpperCase()} COLLECTION`
                  : dealsOnly
                  ? 'EXCLUSIVE PROMOTIONAL DEALS'
                  : 'ALL ELECTRONIC HARDWARE'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Showing {filteredProducts.length} verified products with real-time stock allocation.
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-medium text-slate-200"
              >
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>

              <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-slate-900 text-slate-200">
                    Featured First
                  </option>
                  <option value="price-asc" className="bg-slate-900 text-slate-200">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-slate-900 text-slate-200">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-slate-900 text-slate-200">
                    Highest Customer Rating
                  </option>
                  <option value="discount" className="bg-slate-900 text-slate-200">
                    Biggest Percentage Discount
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Filter Sidebar (Desktop) + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="p-5 rounded-2xl bg-[#0c0f17] border border-white/[0.08] space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
                    Filter Hardware
                  </span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Keyword Search Filter */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Search In Catalog</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, brand, SKU..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Category</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    All Categories ({allProducts.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Brands ({brands.length - 1})</option>
                  {brands
                    .filter((b) => b !== 'all')
                    .map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Max Budget</span>
                  <span className="font-mono text-cyan-400 font-bold">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="360000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">In Stock Only</span>
                <button
                  onClick={() => setOnlyInStock((prev) => !prev)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    onlyInStock ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-black absolute top-0.5 transition-transform ${
                      onlyInStock ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">Minimum Rating</label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[0, 4.0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`py-1.5 rounded-lg border text-center font-mono ${
                        minRating === r
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                          : 'border-white/10 text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-3">
            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-slate-500 font-mono">Active:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchFilter && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                    Query: "{searchFilter}"
                    <button onClick={() => setSearchFilter('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {maxPrice < 360000 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                    ≤ {formatPrice(maxPrice)}
                    <button onClick={() => setMaxPrice(360000)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-white underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl border border-white/[0.08] bg-[#0c0f17] p-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 font-display">
                  WE COULDN'T FIND THAT DEVICE.
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
                  No products matched your exact filter combination. Try resetting your search or expanding the price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={(slug) => onNavigate(`/product/${slug}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#0c0f17] border border-white/10 p-6 max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-sm font-bold text-slate-100 font-display">Filter Products</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs text-slate-400 block mb-2 font-medium">Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-2 text-xs rounded-lg border text-left ${
                    selectedCategory === 'all'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`p-2 text-xs rounded-lg border text-left ${
                      selectedCategory.toLowerCase() === c.slug.toLowerCase()
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                        : 'border-white/10 text-slate-400'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Max Budget</span>
                <span className="font-mono text-cyan-400 font-bold">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="360000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-xl bg-cyan-500 text-black font-semibold text-xs uppercase tracking-wider"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
