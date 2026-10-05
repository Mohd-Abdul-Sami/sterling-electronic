import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Check } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/db';
import { CategoryItem, ProductCategory } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminCategories: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>(getCategories());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('#06b6d4');

  const refresh = () => setCategories(getCategories());

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormColor('#06b6d4');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormDesc(c.description);
    setFormColor(c.accentColor);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      deleteCategory(id, 'Admin Portal');
      refresh();
      showToast(`Category "${name}" deleted.`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug = formSlug || formName.toLowerCase().replace(/\s+/g, '-');

    if (editingId) {
      updateCategory(
        editingId,
        {
          name: formName as ProductCategory,
          slug,
          description: formDesc,
          accentColor: formColor,
        },
        'Admin Portal'
      );
      showToast(`Category "${formName}" updated.`, 'success');
    } else {
      createCategory(
        {
          name: formName as ProductCategory,
          slug,
          description: formDesc,
          accentColor: formColor,
          itemCount: 0,
          image: '/src/assets/images/hero_flagship_phone_1791208440568.jpg',
        },
        'Admin Portal'
      );
      showToast(`Created category "${formName}".`, 'success');
    }

    setIsModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Category Taxonomy CRUD</h2>
          <p className="text-xs text-slate-400">Total {categories.length} showroom departments</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: cat.accentColor }}
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 rounded bg-slate-900 text-slate-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1 rounded bg-slate-900 text-slate-300 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-white font-display mt-2">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Slug: /{cat.slug}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
            </div>
            <div className="pt-3 border-t border-white/[0.04] text-[11px] font-mono text-cyan-400">
              {cat.itemCount} linked devices
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0f17] border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-display">
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. smartphones"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Accent Hex Color</label>
                <input
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
