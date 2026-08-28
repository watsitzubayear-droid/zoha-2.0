import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GalleryItem, GalleryCategory } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { ImageDropzone } from './ImageDropzone';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Search,
  Maximize2,
  Sparkles,
  X,
} from 'lucide-react';

const CATEGORIES: GalleryCategory[] = [
  'Portraits',
  'Performances',
  'Studio',
  'Travel',
  'Behind the Scenes',
  'Artwork',
  'Memories',
];

export const AdminGalleryManager: React.FC = () => {
  const { data, addGalleryItem, updateGalleryItem, deleteGalleryItem, openLightbox, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    highResUrl: '',
    category: 'Portraits' as GalleryCategory,
    description: '',
    featured: false,
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
      highResUrl: '',
      category: 'Portraits',
      description: '',
      featured: false,
      published: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (g: GalleryItem) => {
    setFormData({
      title: g.title,
      imageUrl: g.imageUrl,
      highResUrl: g.highResUrl || '',
      category: g.category,
      description: g.description,
      featured: g.featured || false,
      published: g.published,
    });
    setEditingItem(g);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      showToast('Please provide a title and image URL', 'error');
      return;
    }

    if (editingItem) {
      await updateGalleryItem(editingItem.id, formData);
      showToast(`Photograph "${formData.title}" updated.`);
    } else {
      await addGalleryItem({
        ...formData,
        order: (data?.gallery.length || 0) + 1,
        createdAt: new Date().toISOString(),
      });
      showToast(`Photograph "${formData.title}" added to gallery.`);
    }

    setIsCreating(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteGalleryItem(deleteTargetId);
      showToast('Photo deleted from gallery.');
      setDeleteTargetId(null);
    }
  };

  const gallery = data?.gallery || [];
  const filteredGallery = gallery.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-400" />
            <span>VISUAL WORLD & GALLERY MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage concert stills, editorial portraits, tour memories, and digital photography.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-purple-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PHOTOGRAPH</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search photography by title or category..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 transition-colors"
        />
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGallery.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-2xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-bold text-purple-300 font-mono">
                  {item.category}
                </span>

                {item.featured && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-bold font-cinzel text-white truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-4 pb-4 pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.published ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                <span className="text-[11px] text-slate-400">
                  {item.published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openLightbox(idx)}
                  className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Preview Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Edit Photo"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#090c1f] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingItem ? 'EDIT PHOTOGRAPH' : 'ADD NEW PHOTOGRAPH'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Midnight Reverie — Studio Portrait"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <ImageDropzone
                  label="Photograph Image Upload"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  description="Drag & drop high-resolution concert or studio portrait image"
                  aspectRatio="auto"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as GalleryCategory })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  High-Resolution Master Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.highResUrl}
                  onChange={(e) => setFormData({ ...formData, highResUrl: e.target.value })}
                  placeholder="Direct link to full uncompressed image..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Context
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Camera gear, lighting notes, emotional location..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Mark as Homepage Featured Photo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span>Published (Visible to Visitors)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingItem ? 'SAVE PHOTO' : 'CREATE PHOTO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Photograph"
        message="Are you sure you want to delete this photograph from the gallery?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
