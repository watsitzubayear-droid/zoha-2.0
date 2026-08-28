import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Video, VideoCategory } from '../types';
import { ConfirmModal } from './ConfirmModal';
import {
  Video as VideoIcon,
  Plus,
  Trash2,
  Edit2,
  Play,
  Sparkles,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
} from 'lucide-react';

const CATEGORIES: VideoCategory[] = [
  'MUSIC',
  'COVER',
  'LIVE',
  'ACOUSTIC',
  'SHORTS',
  'VLOG',
  'BEHIND THE SCENES',
  'OTHER',
];

export const AdminVideoManager: React.FC = () => {
  const { data, addVideo, updateVideo, deleteVideo, openVideoModal, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    videoId: '',
    thumbnail: '',
    category: 'MUSIC' as VideoCategory,
    description: '',
    duration: '',
    views: 0,
    featured: false,
    published: true,
  });

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleUrlChange = (url: string) => {
    const id = extractYoutubeId(url);
    if (id) {
      setFormData((prev) => ({
        ...prev,
        youtubeUrl: url,
        videoId: id,
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }));
      showToast('YouTube Video ID & Thumbnail auto-extracted!');
    } else {
      setFormData((prev) => ({ ...prev, youtubeUrl: url }));
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      youtubeUrl: '',
      videoId: '',
      thumbnail: '',
      category: 'MUSIC',
      description: '',
      duration: '',
      views: 0,
      featured: false,
      published: true,
    });
    setEditingVideo(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (v: Video) => {
    setFormData({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      videoId: v.videoId,
      thumbnail: v.thumbnail,
      category: v.category,
      description: v.description,
      duration: v.duration || '',
      views: v.views || 0,
      featured: v.featured || false,
      published: v.published,
    });
    setEditingVideo(v);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoId) {
      showToast('Please provide a title and valid YouTube URL / Video ID', 'error');
      return;
    }

    if (editingVideo) {
      await updateVideo(editingVideo.id, formData);
      showToast(`Video "${formData.title}" updated successfully.`);
    } else {
      await addVideo({
        ...formData,
        order: (data?.videos.length || 0) + 1,
        createdAt: new Date().toISOString(),
      });
      showToast(`Video "${formData.title}" added to YouTube Hub.`);
    }

    setIsCreating(false);
    setEditingVideo(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteVideo(deleteTargetId);
      showToast('Video deleted.');
      setDeleteTargetId(null);
    }
  };

  const videos = data?.videos || [];
  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-cyan-400" />
            <span>YOUTUBE HUB MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Add, update, or feature official YouTube releases, acoustic sessions, and vlogs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW VIDEO</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search videos by title or category..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => openVideoModal(video)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Preview in Video Modal"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </button>

                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-bold text-cyan-300 font-mono">
                  {video.category}
                </span>

                {video.featured && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase">
                    FEATURED
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold font-cinzel text-white line-clamp-1">
                {video.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{video.description}</p>
            </div>

            {/* Actions Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    video.published ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                <span className="text-[11px] text-slate-400">
                  {video.published ? 'Published' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(video)}
                  className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-colors"
                  title="Edit Video"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTargetId(video.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Delete Video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#090c1f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingVideo ? 'EDIT YOUTUBE VIDEO' : 'ADD NEW YOUTUBE VIDEO'}
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
                  Paste YouTube URL (Auto-Detects Video ID & Thumbnail) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Extracted Video ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.videoId}
                    onChange={(e) =>
                      setFormData({ ...formData, videoId: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as VideoCategory,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. ZOHA - Midnight Reverie (Official Music Video)"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (e.g. 4:18)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="4:20"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Story Note
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Behind the performance or recording lore..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Mark as Homepage Featured Video</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="w-4 h-4 accent-cyan-500 rounded"
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
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingVideo ? 'SAVE CHANGES' : 'CREATE VIDEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete YouTube Video"
        message="Are you sure you want to delete this video from the ZOHA platform? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
