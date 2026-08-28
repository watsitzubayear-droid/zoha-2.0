import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Story } from '../types';
import { BookOpen, Calendar, Clock, Play, Video, X, Sparkles, ArrowRight } from 'lucide-react';

export const StoriesSection: React.FC = () => {
  const { data, activeStory, openStoryModal, closeStoryModal, playSong, openVideoModal } = useData();

  const stories = data?.stories.filter((s) => s.published) || [];

  return (
    <section id="stories" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Visual Autobiography & Lore
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          STORIES
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          Intimate essays, the origins behind the songs, and moments of breakthrough on the creative path.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-panel border border-white/10 hover:border-pink-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-xl"
          >
            <div>
              {/* Cover Image */}
              <div
                className="relative aspect-[16/9] w-full bg-[#0d1024] overflow-hidden cursor-pointer"
                onClick={() => openStoryModal(story)}
                data-cursor="READ"
              >
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090c1f] via-transparent to-transparent opacity-90" />

                {/* Read time badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-pink-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {story.readTime}
                </div>
              </div>

              {/* Story Header & Excerpt */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{story.date}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white group-hover:text-pink-300 transition-colors">
                  {story.title}
                </h3>

                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {story.excerpt}
                </p>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex items-center justify-between border-t border-white/5">
              <button
                onClick={() => openStoryModal(story)}
                className="text-xs sm:text-sm font-bold text-pink-400 hover:text-pink-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>READ FULL STORY</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2">
                {story.youtubeUrl && (
                  <span className="p-2 rounded-full bg-white/5 text-slate-400" title="Includes YouTube performance">
                    <Video className="w-4 h-4" />
                  </span>
                )}
                {story.audioTrackId && (
                  <span className="p-2 rounded-full bg-white/5 text-slate-400" title="Includes Soundtrack Track">
                    <Play className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Full Modal Reader */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeStoryModal}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-[#090c1f] border border-pink-500/30 rounded-3xl shadow-2xl overflow-y-auto z-10 p-6 sm:p-10 text-left"
            >
              <button
                onClick={closeStoryModal}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
                <img
                  src={activeStory.coverImage}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-pink-400 font-mono mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activeStory.date}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{activeStory.readTime}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white mb-6 leading-tight">
                {activeStory.title}
              </h2>

              <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 whitespace-pre-line font-light">
                {activeStory.content}
              </div>

              {/* Linked Sound & Video Media Actions */}
              {(activeStory.audioTrackId || activeStory.youtubeUrl) && (
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Related Media:
                  </span>
                  {activeStory.audioTrackId && (
                    <button
                      onClick={() => {
                        const s = data?.songs.find((song) => song.id === activeStory.audioTrackId);
                        if (s) playSong(s);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>Play Companion Track</span>
                    </button>
                  )}
                  {activeStory.youtubeUrl && (
                    <button
                      onClick={() => {
                        const vid = data?.videos.find((v) => v.youtubeUrl === activeStory.youtubeUrl);
                        if (vid) {
                          openVideoModal(vid);
                        } else {
                          window.open(activeStory.youtubeUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Watch Story Video</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
