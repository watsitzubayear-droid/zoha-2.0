import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Search, X, Music, Video, Image, BookOpen, MapPin, Play, ExternalLink } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const {
    data,
    searchOpen,
    setSearchOpen,
    playSong,
    openVideoModal,
    openLightbox,
    openStoryModal,
  } = useData();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!data || !query.trim()) return [];
    const q = query.toLowerCase();
    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'MUSIC' | 'VIDEO' | 'GALLERY' | 'STORY' | 'JOURNEY';
      icon: any;
      action: () => void;
      meta?: string;
    }> = [];

    // Search Songs
    data.songs
      .filter((s) => s.published)
      .forEach((song) => {
        if (
          song.title.toLowerCase().includes(q) ||
          song.genre.toLowerCase().includes(q) ||
          song.description.toLowerCase().includes(q)
        ) {
          items.push({
            id: song.id,
            title: song.title,
            subtitle: `${song.genre} • ${song.duration}`,
            category: 'MUSIC',
            icon: Music,
            action: () => {
              playSong(song);
              setSearchOpen(false);
            },
            meta: 'Play Song',
          });
        }
      });

    // Search Videos
    data.videos
      .filter((v) => v.published)
      .forEach((video) => {
        if (
          video.title.toLowerCase().includes(q) ||
          video.category.toLowerCase().includes(q) ||
          video.description.toLowerCase().includes(q)
        ) {
          items.push({
            id: video.id,
            title: video.title,
            subtitle: `YouTube Video • ${video.category}`,
            category: 'VIDEO',
            icon: Video,
            action: () => {
              openVideoModal(video);
              setSearchOpen(false);
            },
            meta: 'Watch Video',
          });
        }
      });

    // Search Gallery
    data.gallery
      .filter((g) => g.published)
      .forEach((item, index) => {
        if (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        ) {
          items.push({
            id: item.id,
            title: item.title,
            subtitle: `Visual • ${item.category}`,
            category: 'GALLERY',
            icon: Image,
            action: () => {
              openLightbox(index);
              setSearchOpen(false);
            },
            meta: 'View Photo',
          });
        }
      });

    // Search Stories
    data.stories
      .filter((s) => s.published)
      .forEach((story) => {
        if (
          story.title.toLowerCase().includes(q) ||
          story.excerpt.toLowerCase().includes(q) ||
          story.content.toLowerCase().includes(q)
        ) {
          items.push({
            id: story.id,
            title: story.title,
            subtitle: `${story.date} • ${story.readTime}`,
            category: 'STORY',
            icon: BookOpen,
            action: () => {
              openStoryModal(story);
              setSearchOpen(false);
            },
            meta: 'Read Story',
          });
        }
      });

    // Search Journey
    data.journey
      .filter((j) => j.published)
      .forEach((item) => {
        if (
          item.title.toLowerCase().includes(q) ||
          item.year.includes(q) ||
          item.description.toLowerCase().includes(q)
        ) {
          items.push({
            id: item.id,
            title: `${item.year} - ${item.title}`,
            subtitle: item.description.slice(0, 70) + '...',
            category: 'JOURNEY',
            icon: MapPin,
            action: () => {
              const el = document.getElementById('journey');
              el?.scrollIntoView({ behavior: 'smooth' });
              setSearchOpen(false);
            },
            meta: 'Jump to Journey',
          });
        }
      });

    return items;
  }, [data, query, playSong, openVideoModal, openLightbox, openStoryModal, setSearchOpen]);

  if (!searchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0b0e22] border border-amber-500/25 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10"
        >
          {/* Input field */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-5 h-5 text-amber-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, YouTube videos, photography, stories..."
              className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1.5">
            {query.trim() === '' ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm">Type to search songs, acoustic sessions, videos, or tour dates...</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                  <span className="text-slate-500">Popular:</span>
                  {['Midnight Resonance', 'Guitar Cover', 'Live Solo', 'Tour', 'Portraits'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => setQuery(hint)}
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors border border-white/5"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-slate-500 mt-1">Try another keyword or browse sections directly.</p>
              </div>
            ) : (
              results.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-amber-500/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full shrink-0 ml-3 group-hover:bg-amber-500/20">
                      {item.meta}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hints */}
          <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">ESC</kbd> Close
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">SPACE</kbd> Play/Pause
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px]">Z</kbd> ZOHA Mode
              </span>
            </div>
            <span className="text-amber-400 font-cinzel">ZOHA 2.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
