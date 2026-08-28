import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Story } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { ImageDropzone } from './ImageDropzone';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Search,
  Sparkles,
  X,
  Calendar,
  Clock,
} from 'lucide-react';

export const AdminStoriesManager: React.FC = () => {
  const { data, addStory, updateStory, deleteStory, openStoryModal, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '2026',
    excerpt: '',
    content: '',
    coverImage: '',
    readTime: '3 min read',
    youtubeUrl: '',
    audioTrackId: '',
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      date: '2026',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      readTime: '4 min read',
      youtubeUrl: '',
      audioTrackId: '',
      published: true,
    });
    setEditingStory(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (s: Story) => {
    setFormData({
      title: s.title,
      date: s.date,
      excerpt: s.excerpt,
      content: s.content,
      coverImage: s.coverImage,
      readTime: s.readTime,
      youtubeUrl: s.youtubeUrl || '',
      audioTrackId: s.audioTrackId || '',
      published: s.published,
    });
    setEditingStory(s);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast('Please provide a title and story content', 'error');
      return;
    }

    if (editingStory) {
      await updateStory(editingStory.id, formData);
      showToast(`Story "${formData.title}" updated.`);
    } else {
      await addStory({
        ...formData,
        order: (data?.stories.length || 0) + 1,
        createdAt: new Date().toISOString(),
      });
      showToast(`Story "${formData.title}" published to Autobiography.`);
    }

    setIsCreating(false);
    setEditingStory(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteStory(deleteTargetId);
      showToast('Story deleted.');
      setDeleteTargetId(null);
    }
  };

  const stories = data?.stories || [];
  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-pink-400" />
            <span>STORIES & AUTOBIOGRAPHY MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Craft autobiographical chapters, song origins, backstage essays, and artist lore.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-pink-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>WRITE NEW STORY</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search stories by title..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-400 transition-colors"
        />
      </div>

      {/* Stories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex gap-4 mb-3">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-black">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-pink-400 font-mono">
                    <Calendar className="w-3 h-3" />
                    <span>{story.date}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{story.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold font-cinzel text-white mt-1 line-clamp-1">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{story.excerpt}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    story.published ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                <span className="text-[11px] text-slate-400">
                  {story.published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openStoryModal(story)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-pink-300 font-bold transition-colors"
                >
                  Read Modal
                </button>
                <button
                  onClick={() => handleOpenEdit(story)}
                  className="p-1.5 text-slate-400 hover:text-pink-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Edit Story"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(story.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Delete Story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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

          <div className="relative w-full max-w-3xl bg-[#090c1f] border border-pink-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingStory ? 'EDIT AUTOBIOGRAPHY CHAPTER' : 'WRITE NEW STORY'}
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
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Midnight Frequency: Birth of ZOHA 2.0"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <ImageDropzone
                  label="Story Hero / Cover Image"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  description="Drag & drop story header photograph or conceptual artwork"
                  aspectRatio="video"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date Tag (e.g. Autumn 2025)
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="3 min read"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Short Excerpt / Teaser
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A two-line summary shown on the card..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Story Content (Markdown / Multi-paragraph text) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full autobiographical essay here..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-light focus:outline-none focus:border-pink-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Companion YouTube Video URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Companion Soundtrack Track
                  </label>
                  <select
                    value={formData.audioTrackId}
                    onChange={(e) => setFormData({ ...formData, audioTrackId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400"
                  >
                    <option value="">None</option>
                    {data?.songs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.genre})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-pink-500 rounded"
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
                  className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingStory ? 'SAVE STORY' : 'PUBLISH STORY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Story"
        message="Are you sure you want to delete this autobiography chapter?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
