import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { GalleryItem, GalleryCategory } from '../types';
import {
  Image as ImageIcon,
  Sparkles,
  SlidersHorizontal,
  Maximize,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const VisualWorld: React.FC = () => {
  const { data, openLightbox, favorites, toggleFavorite, isFavorite } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cinematicMode, setCinematicMode] = useState(false);
  const [cinematicIndex, setCinematicIndex] = useState(0);

  const gallery = data?.gallery.filter((g) => g.published) || [];

  const categories = [
    'ALL',
    'Portraits',
    'Performances',
    'Studio',
    'Travel',
    'Behind the Scenes',
    'Artwork',
    'Memories',
  ];

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const nextCinematic = () => {
    setCinematicIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  const prevCinematic = () => {
    setCinematicIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const currentCinematicItem = filteredGallery[cinematicIndex] || filteredGallery[0];

  return (
    <section id="gallery" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-purple-600/5 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <ImageIcon className="w-3.5 h-3.5" />
            Curated Visual Gallery
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
            VISUAL WORLD
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Moments frozen in time—live concert lighting, studio composition, editorial portraits, and memories.
          </p>
        </div>

        {/* Action controls: Mode switcher & Category filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Cinematic Exhibition Mode Toggle */}
          <button
            onClick={() => setCinematicMode((prev) => !prev)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              cinematicMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-white/5 border border-purple-500/30 text-purple-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cinematicMode ? 'GRID VIEW' : 'CINEMATIC EXHIBITION VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      {!cinematicMode && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Mode 1: CINEMATIC VIEW (Full exhibition slide-through) */}
      {cinematicMode ? (
        filteredGallery.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl">
            <p className="text-slate-400">No images available for cinematic view.</p>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-purple-500/40 p-3 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {/* Main Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentCinematicItem.id}
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  src={currentCinematicItem.imageUrl}
                  alt={currentCinematicItem.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-black/40" />

              {/* Overlay Nav Arrows */}
              <button
                onClick={prevCinematic}
                className="absolute left-4 z-20 p-3.5 rounded-full bg-black/60 border border-white/15 text-white hover:bg-purple-600 transition-all shadow-2xl"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextCinematic}
                className="absolute right-4 z-20 p-3.5 rounded-full bg-black/60 border border-white/15 text-white hover:bg-purple-600 transition-all shadow-2xl"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Cinematic Bottom Captions */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <motion.div
                  key={`text-${currentCinematicItem.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="px-2.5 py-1 rounded bg-purple-500/40 border border-purple-400/50 text-[10px] font-bold text-purple-200 uppercase tracking-widest">
                    {currentCinematicItem.category} • {cinematicIndex + 1} / {filteredGallery.length}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black font-cinzel text-white text-glow-gold mt-1.5">
                    {currentCinematicItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                    {currentCinematicItem.description}
                  </p>
                </motion.div>

                <button
                  onClick={() => openLightbox(gallery.findIndex((g) => g.id === currentCinematicItem.id))}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shrink-0 transition-all"
                >
                  <Maximize className="w-4 h-4" />
                  <span>FULLSCREEN LIGHTBOX</span>
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        /* Mode 2: Standard Dynamic Masonry Grid */
        filteredGallery.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-2xl border border-white/10">
            <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-3 opacity-50" />
            <p className="text-base text-slate-300 font-semibold">No visual memories in this category.</p>
            <p className="text-xs text-slate-500 mt-1">Upload new photography via the Control Center.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => {
              const fullIndex = gallery.findIndex((g) => g.id === item.id);
              const isFav = isFavorite('gallery', item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-purple-500/40 shadow-lg transition-all duration-500 cursor-pointer"
                  onClick={() => openLightbox(fullIndex)}
                  data-cursor="VIEW"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full bg-[#0d1024] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                      {item.category}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('gallery', item.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md transition-colors ${
                        isFav ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                      }`}
                      title={isFav ? 'Favorited' : 'Favorite'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Bottom Title & Description info */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <h3 className="text-base sm:text-lg font-bold font-cinzel text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      )}
    </section>
  );
};
