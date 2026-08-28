import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Song } from '../types';
import {
  Play,
  Pause,
  Music,
  Disc3,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Clock,
} from 'lucide-react';

export const MusicSection: React.FC = () => {
  const {
    data,
    audioState,
    playSong,
    togglePlay,
    favorites,
    toggleFavorite,
    isFavorite,
    showToast,
    currentMood,
  } = useData();

  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');

  const songs = data?.songs.filter((s) => s.published) || [];

  const genres = ['ALL', ...Array.from(new Set(songs.map((s) => s.genre)))];

  const filteredSongs = songs.filter((song) => {
    if (selectedGenre !== 'ALL' && song.genre !== selectedGenre) return false;
    return true;
  });

  const handleShare = async (song: Song) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} — ZOHA`,
          text: `Listen to "${song.title}" by ZOHA on ZOHA 2.0`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#music`);
      showToast(`Link to "${song.title}" copied to clipboard!`);
    }
  };

  return (
    <section id="music" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Music className="w-3.5 h-3.5" />
            Original Audio & Soundscapes
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
            MY MUSIC
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Stream studio recordings, acoustic fingerstyle sessions, and cinematic ambient orchestrations.
          </p>
        </div>

        {/* Genre filter chips */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                selectedGenre === genre
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid */}
      {filteredSongs.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10">
          <Disc3 className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-spin opacity-50" />
          <p className="text-base text-slate-300 font-semibold">No tracks found in this category.</p>
          <p className="text-xs text-slate-500 mt-1">Check back soon for new studio releases.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSongs.map((song) => {
            const isCurrentPlaying = audioState.currentSong?.id === song.id && audioState.isPlaying;
            const isCurrentSelected = audioState.currentSong?.id === song.id;
            const isFav = isFavorite('songs', song.id);

            return (
              <motion.div
                key={song.id}
                layout
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between ${
                  isCurrentSelected
                    ? 'border-amber-400/80 bg-[#11142d]/80 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                    : 'border-white/10 hover:border-amber-500/30'
                }`}
              >
                <div>
                  {/* Top card row: Cover art & Title/Meta */}
                  <div className="flex gap-4 items-start">
                    {/* Album Cover with Play Overlay */}
                    <div
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 group cursor-pointer shadow-lg bg-[#0d1024]"
                      onClick={() => playSong(song)}
                      data-cursor={isCurrentPlaying ? 'PAUSE' : 'PLAY'}
                    >
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrentPlaying ? 'opacity-100 bg-amber-950/60' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          {isCurrentPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {song.featured && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-black font-black text-[9px] uppercase tracking-wider">
                          FEATURED
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                          {song.genre}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite('songs', song.id)}
                            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                              isFav ? 'text-rose-500' : 'text-slate-400 hover:text-white'
                            }`}
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleShare(song)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Share track"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white truncate mt-0.5">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{song.artist || 'ZOHA'}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {song.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {song.releaseDate}
                        </span>
                        <span className="text-[11px] text-amber-300/80 font-mono">
                          {song.plays ? `${song.plays.toLocaleString()} plays` : 'New Release'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Song Description */}
                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed line-clamp-2">
                    {song.description}
                  </p>
                </div>

                {/* Lyrics / Details Toggle Footer */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => playSong(song)}
                    className="px-4 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isCurrentPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isCurrentPlaying ? 'PAUSE TRACK' : 'PLAY NOW'}</span>
                  </button>

                  {song.lyrics && (
                    <button
                      onClick={() =>
                        setExpandedLyricsId(expandedLyricsId === song.id ? null : song.id)
                      }
                      className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Lyrics</span>
                      {expandedLyricsId === song.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Collapsible Lyrics Panel */}
                <AnimatePresence>
                  {expandedLyricsId === song.id && song.lyrics && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/5 overflow-hidden"
                    >
                      <div className="p-3 bg-black/40 rounded-xl text-xs text-slate-300 italic font-mono whitespace-pre-line leading-relaxed">
                        {song.lyrics}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
};
