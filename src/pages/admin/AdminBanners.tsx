import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Eye } from 'lucide-react';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../../services/db';
import { Banner } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminBanners: React.FC = () => {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(getBanners());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formTag, setFormTag] = useState('');
  const [formImage, setFormImage] = useState('/src/assets/images/hero_flagship_phone_1791208440568.jpg');
  const [formCtaText, setFormCtaText] = useState('EXPLORE NOW');
  const [formCtaLink, setFormCtaLink] = useState('/shop');
  const [formPriority, setFormPriority] = useState(1);

  const refresh = () => setBanners(getBanners());

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormTag('LAUNCH SPOTLIGHT');
    setFormImage('/src/assets/images/hero_flagship_phone_1791208440568.jpg');
    setFormCtaText('EXPLORE NOW');
    setFormCtaLink('/shop');
    setFormPriority(1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingId(b.id);
    setFormTitle(b.title);
    setFormSubtitle(b.subtitle);
    setFormTag(b.tag || '');
    setFormImage(b.image);
    setFormCtaText(b.ctaText);
    setFormCtaLink(b.ctaLink);
    setFormPriority(b.priority);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete promotional campaign banner?')) {
      deleteBanner(id, 'Admin Portal');
      refresh();
      showToast('Banner deleted.', 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingId) {
      updateBanner(
        editingId,
        {
          title: formTitle,
          subtitle: formSubtitle,
          tag: formTag,
          image: formImage,
          ctaText: formCtaText,
          ctaLink: formCtaLink,
          priority: formPriority,
        },
        'Admin Portal'
      );
      showToast('Banner updated successfully.', 'success');
    } else {
      createBanner(
        {
          title: formTitle,
          subtitle: formSubtitle,
          tag: formTag,
          image: formImage,
          ctaText: formCtaText,
          ctaLink: formCtaLink,
          priority: formPriority,
          isActive: true,
        },
        'Admin Portal'
      );
      showToast('Created campaign banner.', 'success');
    }

    setIsModalOpen(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Homepage Campaigns & Banners</h2>
          <p className="text-xs text-slate-400">Manage hero showcases and seasonal launch graphics</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative border border-white/5 mb-3">
                <img src={b.image} alt={b.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-black/80 text-cyan-300 border border-white/10">
                  {b.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display">{b.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{b.subtitle}</p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Target: {b.ctaLink}</span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenEdit(b)} className="p-1 rounded bg-slate-900 text-slate-300 hover:text-white">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="p-1 rounded bg-slate-900 text-slate-300 hover:text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#0c0f17] border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white font-display">
                {editingId ? 'Edit Campaign Banner' : 'Create Campaign'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Subtext</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Banner Image Asset URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Button Route</label>
                  <input
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-400 text-black font-semibold uppercase">
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
