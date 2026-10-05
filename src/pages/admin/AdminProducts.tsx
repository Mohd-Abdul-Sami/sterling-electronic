import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, X, Check, Eye } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../services/db';
import { Product, ProductCategory } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const AdminProducts: React.FC = () => {
  const { formatPrice } = useStore();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(getProducts());
  const categories = getCategories();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Sterling');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Smartphones');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState(49999);
  const [formSalePrice, setFormSalePrice] = useState<number | undefined>(undefined);
  const [formCostPrice, setFormCostPrice] = useState(30000);
  const [formStock, setFormStock] = useState(20);
  const [formThreshold, setFormThreshold] = useState(5);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('/src/assets/images/hero_flagship_phone_1791208440568.jpg');
  const [formStatus, setFormStatus] = useState<'active' | 'draft'>('active');

  const refreshList = () => {
    setProducts(getProducts());
  };

  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.category.toLowerCase() !== selectedCat.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormName('');
    setFormBrand('Sterling');
    setFormCategory('Smartphones');
    setFormSku(`ST-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(49999);
    setFormSalePrice(undefined);
    setFormCostPrice(30000);
    setFormStock(20);
    setFormThreshold(5);
    setFormShortDesc('');
    setFormDesc('');
    setFormImageUrl('/src/assets/images/hero_flagship_phone_1791208440568.jpg');
    setFormStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormSku(p.sku);
    setFormPrice(p.price);
    setFormSalePrice(p.salePrice);
    setFormCostPrice(p.costPrice);
    setFormStock(p.stock);
    setFormThreshold(p.lowStockThreshold);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormImageUrl(p.images[0] || '');
    setFormStatus(p.status === 'archived' ? 'draft' : p.status);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Permanently delete "${name}" from product catalog?`)) {
      deleteProduct(id, 'Admin Portal');
      refreshList();
      showToast(`Product "${name}" deleted.`, 'info');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      showToast('Please provide both product title and SKU.', 'error');
      return;
    }

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingProductId) {
      updateProduct(
        editingProductId,
        {
          name: formName,
          slug,
          brand: formBrand,
          category: formCategory,
          sku: formSku,
          price: formPrice,
          salePrice: formSalePrice || undefined,
          costPrice: formCostPrice,
          stock: formStock,
          lowStockThreshold: formThreshold,
          shortDescription: formShortDesc,
          description: formDesc,
          images: [formImageUrl],
          status: formStatus,
        },
        'Admin Portal'
      );
      showToast(`Product "${formName}" updated successfully.`, 'success');
    } else {
      createProduct(
        {
          name: formName,
          slug,
          brand: formBrand,
          category: formCategory,
          sku: formSku,
          price: formPrice,
          salePrice: formSalePrice || undefined,
          costPrice: formCostPrice,
          discountPercent: formSalePrice ? Math.round(((formPrice - formSalePrice) / formPrice) * 100) : 0,
          stock: formStock,
          lowStockThreshold: formThreshold,
          rating: 5.0,
          reviewCount: 1,
          description: formDesc || formShortDesc,
          shortDescription: formShortDesc || formName,
          images: [formImageUrl],
          warranty: '2 Years Sterling Shield',
          specs: { 'Origin': 'Sterling Engineering Labs', 'Grade': 'Aerospace Spec' },
          features: ['Factory calibrated optics & thermals'],
          tags: [formBrand, formCategory, 'Flagship'],
          status: formStatus,
        },
        'Admin Portal'
      );
      showToast(`Created new product "${formName}".`, 'success');
    }

    setIsModalOpen(false);
    refreshList();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Product Catalog Management</h2>
          <p className="text-xs text-slate-400">Total {products.length} registered electronic devices</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#0c0f17] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#090b12] text-slate-400 font-mono text-[11px]">
                <th className="p-4">Device</th>
                <th className="p-4">SKU / Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black p-1 shrink-0 flex items-center justify-center border border-white/5">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-slate-100 truncate">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ★ {product.rating} ({product.reviewCount} reviews)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    <p>{product.sku}</p>
                    <p className="text-[10px] text-slate-500">{product.brand}</p>
                  </td>
                  <td className="p-4 text-slate-300">{product.category}</td>
                  <td className="p-4 font-mono tabular-nums">
                    <p className="text-slate-100 font-bold">
                      {formatPrice(product.salePrice || product.price)}
                    </p>
                    {product.salePrice && (
                      <p className="text-[10px] text-slate-500 line-through">
                        {formatPrice(product.price)}
                      </p>
                    )}
                  </td>
                  <td className="p-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        product.stock <= product.lowStockThreshold
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-white/10 text-slate-300">
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0c0f17] border border-white/10 p-6 md:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white font-display">
                {editingProductId ? 'Edit Product Details' : 'Add New Hardware Device'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Stock Keeping Unit (SKU)</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Visibility Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sale Price (Optional ₹)</label>
                  <input
                    type="number"
                    value={formSalePrice || ''}
                    onChange={(e) => setFormSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Leave empty for regular"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Available Stock</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image Asset Path / URL</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Short Description</label>
                <input
                  type="text"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="One sentence summary of specs and finish..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold uppercase tracking-wider"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
