import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Heart,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';

export const GalleryLightbox: React.FC = () => {
  const {
    data,
    activeLightboxIndex,
    closeLightbox,
    openLightbox,
    favorites,
    toggleFavorite,
    isFavorite,
    showToast,
  } = useData();

  const [isZoomed, setIsZoomed] = useState(false);

  const galleryItems = data?.gallery.filter((g) => g.published) || [];

  useEffect(() => {
    setIsZoomed(false);
  }, [activeLightboxIndex]);

  if (activeLightboxIndex === null || galleryItems.length === 0) return null;

  const currentItem = galleryItems[activeLightboxIndex] || galleryItems[0];
  const isFav = isFavorite('gallery', currentItem.id);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(prev);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (activeLightboxIndex + 1) % galleryItems.length;
    openLightbox(next);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentItem.title,
          text: `Check out "${currentItem.title}" from ZOHA Visual World`,
          url: currentItem.imageUrl,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(currentItem.imageUrl);
      showToast('Image URL copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 lg:p-10 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl"
        />

        {/* Modal Shell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col items-center z-10"
        >
          {/* Top Bar Navigation */}
          <div className="w-full flex items-center justify-between px-4 py-3 bg-[#080b18]/80 backdrop-blur-md rounded-t-2xl border-t border-x border-purple-500/30">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                {currentItem.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeLightboxIndex + 1} / {galleryItems.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed((prev) => !prev)}
                className="p-2 rounded-full text-slate-400 hover:text-purple-300 hover:bg-white/10 transition-colors"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              <button
                onClick={() => toggleFavorite('gallery', currentItem.id)}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                  isFav ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                }`}
                title={isFav ? 'Favorited' : 'Favorite'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Share Image"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={closeLightbox}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Frame with Prev/Next buttons */}
          <div className="relative w-full flex-1 max-h-[68vh] sm:max-h-[72vh] flex items-center justify-center bg-black/60 overflow-hidden border-x border-purple-500/30">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-3 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-purple-600 hover:text-white transition-all shadow-xl"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.img
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
              transition={{ duration: 0.3 }}
              src={currentItem.imageUrl}
              alt={currentItem.title}
              className={`max-h-[65vh] sm:max-h-[70vh] w-auto max-w-full object-contain cursor-${
                isZoomed ? 'zoom-out' : 'zoom-in'
              } transition-transform duration-300`}
              onClick={() => setIsZoomed((prev) => !prev)}
              referrerPolicy="no-referrer"
            />

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-3 z-20 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-purple-600 hover:text-white transition-all shadow-xl"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Captions Bar */}
          <div className="w-full p-4 sm:p-5 bg-[#080b18]/90 backdrop-blur-md rounded-b-2xl border-b border-x border-purple-500/30 text-left">
            <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white">
              {currentItem.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentItem.description}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
