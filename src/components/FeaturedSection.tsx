import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Sparkles, Play, Video, Image, BookOpen, ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  const {
    data,
    playSong,
    openVideoModal,
    openLightbox,
    openStoryModal,
  } = useData();

  const featured = data?.featured;
  const song = data?.songs.find((s) => s.id === featured?.songId) || data?.songs[0];
  const video = data?.videos.find((v) => v.id === featured?.videoId) || data?.videos[0];
  const photo = data?.gallery.find((g) => g.id === featured?.photoId) || data?.gallery[0];
  const story = data?.stories.find((st) => st.id === featured?.storyId) || data?.stories[0];

  if (!song && !video && !photo && !story) return null;

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Spotlight Selection
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          FEATURED MASTERWORKS
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          Hand-picked highlights of the current season across audio, visual, and story dimensions.
        </p>
      </div>

      {/* Grid of 4 Key Spotlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Spotlight 1: Song */}
        {song && (
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-panel border border-amber-500/30 overflow-hidden flex flex-col justify-between p-5 shadow-xl group cursor-pointer"
            onClick={() => playSong(song)}
          >
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase">
                  FEATURED AUDIO
                </span>
              </div>

              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                {song.genre}
              </span>
              <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-amber-300 transition-colors truncate">
                {song.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{song.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>PLAY TRACK</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Spotlight 2: Video */}
        {video && (
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-panel border border-cyan-500/30 overflow-hidden flex flex-col justify-between p-5 shadow-xl group cursor-pointer"
            onClick={() => openVideoModal(video)}
          >
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-2xl">
                    <Video className="w-6 h-6" />
                  </div>
                </div>
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-cyan-500 text-black text-[9px] font-black uppercase">
                  FEATURED VIDEO
                </span>
              </div>

              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                {video.category}
              </span>
              <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-cyan-300 transition-colors truncate">
                {video.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{video.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-bold">
              <span>WATCH VIDEO</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Spotlight 3: Photo */}
        {photo && (
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-panel border border-purple-500/30 overflow-hidden flex flex-col justify-between p-5 shadow-xl group cursor-pointer"
            onClick={() => {
              const idx = data?.gallery.findIndex((g) => g.id === photo.id) ?? 0;
              openLightbox(idx);
            }}
          >
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-purple-500 text-white text-[9px] font-black uppercase">
                  FEATURED VISUAL
                </span>
              </div>

              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
                {photo.category}
              </span>
              <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-purple-300 transition-colors truncate">
                {photo.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{photo.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>VIEW IN LIGHTBOX</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Spotlight 4: Story */}
        {story && (
          <motion.div
            whileHover={{ y: -6 }}
            className="rounded-3xl glass-panel border border-pink-500/30 overflow-hidden flex flex-col justify-between p-5 shadow-xl group cursor-pointer"
            onClick={() => openStoryModal(story)}
          >
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-pink-500 text-white text-[9px] font-black uppercase">
                  FEATURED STORY
                </span>
              </div>

              <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest">
                {story.readTime}
              </span>
              <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-pink-300 transition-colors truncate">
                {story.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">{story.excerpt}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-pink-400 font-bold">
              <span>READ AUTOBIOGRAPHY</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
