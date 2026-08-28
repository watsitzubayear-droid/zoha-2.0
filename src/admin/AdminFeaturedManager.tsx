import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Sparkles, Save, Music, Video, Image, BookOpen } from 'lucide-react';

export const AdminFeaturedManager: React.FC = () => {
  const { data, updateFeatured, showToast } = useData();
  const featured = data?.featured;

  const [formData, setFormData] = useState({
    songId: featured?.songId || '',
    videoId: featured?.videoId || '',
    photoId: featured?.photoId || '',
    storyId: featured?.storyId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFeatured(formData);
    showToast('Homepage featured spotlight items updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <span>FEATURED SPOTLIGHT MASTERWORKS</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Select which specific song, video release, gallery photo, and story are highlighted on the main page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Featured Song Selector */}
          <div>
            <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Music className="w-4 h-4" />
              <span>Featured Music Track</span>
            </label>
            <select
              value={formData.songId}
              onChange={(e) => setFormData({ ...formData, songId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="">Select a Track...</option>
              {data?.songs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.genre})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Video Selector */}
          <div>
            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Video className="w-4 h-4" />
              <span>Featured YouTube Video</span>
            </label>
            <select
              value={formData.videoId}
              onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select a Video...</option>
              {data?.videos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({v.category})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Image className="w-4 h-4" />
              <span>Featured Gallery Photograph</span>
            </label>
            <select
              value={formData.photoId}
              onChange={(e) => setFormData({ ...formData, photoId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400"
            >
              <option value="">Select a Photo...</option>
              {data?.gallery.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.category})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Story Selector */}
          <div>
            <label className="block text-xs font-semibold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Featured Story / Chapter</span>
            </label>
            <select
              value={formData.storyId}
              onChange={(e) => setFormData({ ...formData, storyId: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400"
            >
              <option value="">Select a Story...</option>
              {data?.stories.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.title} ({st.readTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-101 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>UPDATE HOMEPAGE SPOTLIGHT SELECTION</span>
        </button>
      </form>
    </div>
  );
};
