import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Disc3,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const FloatingMusicPlayer: React.FC = () => {
  const {
    audioState,
    togglePlay,
    nextSong,
    prevSong,
    seekAudio,
    setAudioVolume,
    toggleMute,
  } = useData();

  const [isMinimized, setIsMinimized] = useState(false);
  const song = audioState.currentSong;

  if (!song) return null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = audioState.duration
    ? (audioState.currentTime / audioState.duration) * 100
    : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-40">
      <motion.div
        layout
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-gold rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-amber-500/40 p-3 sm:p-4 backdrop-blur-2xl"
      >
        {isMinimized ? (
          /* Minimized Compact Bar */
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-black">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{song.title}</div>
                <div className="text-[10px] text-amber-400 truncate">{song.artist || 'ZOHA'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Equalizer animation */}
              <div className="flex items-center gap-0.5 h-4 px-1">
                {[4, 12, 8, 16, 6].map((h, i) => (
                  <div
                    key={i}
                    className={`w-0.5 bg-amber-400 rounded-full transition-all ${
                      audioState.isPlaying ? 'animate-pulse' : ''
                    }`}
                    style={{
                      height: audioState.isPlaying ? `${h}px` : '3px',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                {audioState.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(false)}
                className="p-1 text-slate-400 hover:text-white"
                title="Expand Player"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Full Expanded Player */
          <div className="space-y-3">
            {/* Top Row: Track details & controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md bg-black">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {audioState.isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Disc3 className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase">
                    NOW PLAYING
                  </span>
                  <h4 className="text-sm font-bold font-cinzel text-white truncate">
                    {song.title}
                  </h4>
                  <p className="text-xs text-slate-300 truncate">{song.artist || 'ZOHA'}</p>
                </div>
              </div>

              {/* Player Navigation Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={prevSong}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                  title="Previous Song"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                  title={audioState.isPlaying ? 'Pause' : 'Play'}
                >
                  {audioState.isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={nextSong}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                  title="Next Song"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-full ml-1"
                  title="Minimize Player"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Row: Live Audio Visualizer Equalizer */}
            <div className="flex items-center justify-center gap-1 py-1 px-4 bg-black/40 rounded-lg">
              {[6, 14, 22, 10, 18, 26, 12, 20, 8, 16, 24, 12, 18, 10, 22, 14, 8].map(
                (maxH, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      height: audioState.isPlaying
                        ? [4, maxH * 0.8, 4]
                        : '4px',
                    }}
                    transition={{
                      duration: 0.6 + (idx % 4) * 0.15,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: idx * 0.04,
                    }}
                    className="w-1 rounded-full bg-gradient-to-t from-amber-500 to-amber-300"
                    style={{ height: '4px' }}
                  />
                )
              )}
            </div>

            {/* Bottom Row: Seek Bar & Volume */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>{formatTime(audioState.currentTime)}</span>

              {/* Progress Slider */}
              <div
                className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  if (audioState.duration) {
                    seekAudio(ratio * audioState.duration);
                  }
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span>{formatTime(audioState.duration)}</span>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-400 hover:text-white"
                  title={audioState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {audioState.isMuted || audioState.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioState.isMuted ? 0 : audioState.volume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-14 h-1 accent-amber-400 bg-white/20 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
