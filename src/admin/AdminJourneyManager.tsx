import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { JourneyItem } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { ImageDropzone } from './ImageDropzone';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';

export const AdminJourneyManager: React.FC = () => {
  const { data, addJourneyItem, updateJourneyItem, deleteJourneyItem, showToast } = useData();

  const [editingItem, setEditingItem] = useState<JourneyItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    year: '2026',
    date: '2026',
    title: '',
    description: '',
    category: 'Evolution',
    imageUrl: '',
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      year: '2026',
      date: 'Late 2026',
      title: '',
      description: '',
      category: 'Evolution',
      imageUrl: '',
      published: true,
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (j: JourneyItem) => {
    setFormData({
      year: j.year,
      date: j.date || j.year,
      title: j.title,
      description: j.description,
      category: j.category,
      imageUrl: j.imageUrl || '',
      published: j.published,
    });
    setEditingItem(j);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.year) {
      showToast('Please provide a milestone title and year', 'error');
      return;
    }

    if (editingItem) {
      await updateJourneyItem(editingItem.id, formData);
      showToast(`Journey milestone "${formData.title}" updated.`);
    } else {
      await addJourneyItem({
        ...formData,
        order: (data?.journey.length || 0) + 1,
      });
      showToast(`Milestone "${formData.title}" added to Journey.`);
    }

    setIsCreating(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteJourneyItem(deleteTargetId);
      showToast('Journey milestone removed.');
      setDeleteTargetId(null);
    }
  };

  const journey = data?.journey || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            <span>JOURNEY TIMELINE MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Document key eras, studio milestones, concert tours, and future visions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TIMELINE MILESTONE</span>
        </button>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {journey.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col items-center justify-center shrink-0 text-center font-mono">
                <span className="text-xs text-cyan-400 font-bold">{item.year}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">• {item.date}</span>
                </div>
                <h3 className="text-base font-bold font-cinzel text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xl line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.published ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                title="Edit Milestone"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTargetId(item.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Delete Milestone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editor */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#090c1f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingItem ? 'EDIT TIMELINE MILESTONE' : 'ADD NEW MILESTONE'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date Tag (e.g. Spring 2026)
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. World Tour Debut"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Studio, Live, Origins, Milestone..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <ImageDropzone
                  label="Milestone Event Image / Memory"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  description="Drag & drop journey milestone photo or archival image"
                  aspectRatio="auto"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <span>Published (Visible on Timeline)</span>
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
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingItem ? 'SAVE MILESTONE' : 'ADD MILESTONE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Milestone"
        message="Are you sure you want to remove this milestone from the timeline?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
