import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Video, VideoCategory } from '../types';
import {
  Play,
  Youtube,
  Clock,
  Eye,
  Sparkles,
  Heart,
  Share2,
  Film,
} from 'lucide-react';

export const YouTubeHub: React.FC = () => {
  const { data, openVideoModal, favorites, toggleFavorite, isFavorite } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const videos = data?.videos.filter((v) => v.published) || [];

  const categories: string[] = [
    'ALL',
    'MUSIC',
    'COVER',
    'LIVE',
    'ACOUSTIC',
    'SHORTS',
    'VLOG',
    'BEHIND THE SCENES',
  ];

  const filteredVideos = videos.filter((video) => {
    if (selectedCategory === 'ALL') return true;
    return video.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <section id="videos" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            Official YouTube Hub
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
            LATEST VIDEOS
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Watch official music videos, acoustic guitar covers, live concert solos, and behind-the-scenes vlogs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10">
          <Film className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-50" />
          <p className="text-base text-slate-300 font-semibold">No videos found in this category.</p>
          <p className="text-xs text-slate-500 mt-1">New YouTube uploads are synced in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isFav = isFavorite('videos', video.id);

            return (
              <motion.div
                key={video.id}
                layout
                whileHover={{ y: -6 }}
                className="rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              >
                <div>
                  {/* Video Thumbnail with Hover Play Button */}
                  <div
                    className="relative aspect-video w-full bg-[#0d1024] overflow-hidden cursor-pointer"
                    onClick={() => openVideoModal(video)}
                    data-cursor="PLAY"
                  >
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                      }
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Icon Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Category Badge & Duration */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      {video.category}
                    </div>

                    {video.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Details */}
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold font-cinzel text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {video.views ? `${video.views.toLocaleString()} views` : 'YouTube Official'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('videos', video.id);
                      }}
                      className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                        isFav ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                      }`}
                      title={isFav ? 'Favorited' : 'Favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => openVideoModal(video)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      WATCH
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};
