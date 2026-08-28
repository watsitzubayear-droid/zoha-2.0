import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { X, Youtube, Share2, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const {
    activeVideo,
    closeVideoModal,
    favorites,
    toggleFavorite,
    isFavorite,
    showToast,
  } = useData();

  if (!activeVideo) return null;

  const isFav = isFavorite('videos', activeVideo.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: activeVideo.title,
          text: `Watch "${activeVideo.title}" by ZOHA on YouTube`,
          url: activeVideo.youtubeUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(activeVideo.youtubeUrl);
      showToast('YouTube video link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeVideoModal}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-[#090c1f] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden z-10 flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <Youtube className="w-5 h-5 text-red-500" />
              <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase">
                {activeVideo.category} • CINEMATIC PLAYER
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite('videos', activeVideo.id)}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                  isFav ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Share video"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                title="Open directly on YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={closeVideoModal}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 16:9 Responsive Video Iframe Container */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={activeVideo.title}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Video Information Info Footer */}
          <div className="p-6 bg-[#080b18] border-t border-white/5 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              {activeVideo.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              {activeVideo.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-2">
              <span className="text-cyan-400 font-bold">Category: {activeVideo.category}</span>
              {activeVideo.duration && <span>Duration: {activeVideo.duration}</span>}
              {activeVideo.views && <span>Views: {activeVideo.views.toLocaleString()}</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
