import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Sparkles, Compass, Shuffle, Music, Video, Image, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MoodDiscoverSection: React.FC = () => {
  const {
    data,
    currentMood,
    setCurrentMood,
    playSong,
    openVideoModal,
    openLightbox,
    openStoryModal,
    showToast,
  } = useData();

  const moods = [
    { name: 'CALM', desc: 'Acoustic fingerstyle & gentle ambient tones', color: '#38BDF8' },
    { name: 'NOSTALGIC', desc: 'Warm vintage chords & memory lore', color: '#F59E0B' },
    { name: 'DREAMY', desc: 'Soaring reverb & ethereal twilight vocal lines', color: '#A855F7' },
    { name: 'ENERGETIC', desc: 'Heavy electric guitar solos & driving pulse', color: '#EC4899' },
    { name: 'MELANCHOLIC', desc: 'Rainy studio recordings & emotional ballads', color: '#818CF8' },
    { name: 'ACOUSTIC', desc: 'Pure 6-string and 12-string steel resonance', color: '#10B981' },
  ];

  const handleSurpriseMe = () => {
    if (!data) return;

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#06B6D4', '#A855F7', '#EC4899'],
      });
    } catch {}

    const choices: Array<() => void> = [];

    // Option 1: Random Song
    const publishedSongs = data.songs.filter((s) => s.published);
    if (publishedSongs.length > 0) {
      const randSong = publishedSongs[Math.floor(Math.random() * publishedSongs.length)];
      choices.push(() => {
        playSong(randSong);
        showToast(`🎲 Discovered Track: "${randSong.title}"!`);
      });
    }

    // Option 2: Random Video
    const publishedVideos = data.videos.filter((v) => v.published);
    if (publishedVideos.length > 0) {
      const randVideo = publishedVideos[Math.floor(Math.random() * publishedVideos.length)];
      choices.push(() => {
        openVideoModal(randVideo);
        showToast(`🎲 Discovered Video: "${randVideo.title}"!`);
      });
    }

    // Option 3: Random Photo
    const publishedPhotos = data.gallery.filter((g) => g.published);
    if (publishedPhotos.length > 0) {
      const randIdx = Math.floor(Math.random() * publishedPhotos.length);
      choices.push(() => {
        openLightbox(randIdx);
        showToast(`🎲 Discovered Photograph: "${publishedPhotos[randIdx].title}"!`);
      });
    }

    // Option 4: Random Story
    const publishedStories = data.stories.filter((s) => s.published);
    if (publishedStories.length > 0) {
      const randStory = publishedStories[Math.floor(Math.random() * publishedStories.length)];
      choices.push(() => {
        openStoryModal(randStory);
        showToast(`🎲 Discovered Story: "${randStory.title}"!`);
      });
    }

    if (choices.length > 0) {
      const picked = choices[Math.floor(Math.random() * choices.length)];
      picked();
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Mood Selector */}
        <div className="lg:col-span-8 p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Atmosphere
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white tracking-wide mb-2">
            CHOOSE YOUR MOOD
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-lg">
            Tune your sensory experience to match your emotional vibration.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {moods.map((m) => {
              const isSelected = currentMood === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => {
                    setCurrentMood(isSelected ? 'ALL' : m.name);
                    showToast(`Atmosphere set to ${m.name}`);
                  }}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-500/20 to-purple-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs sm:text-sm font-bold font-cinzel tracking-wider"
                      style={{ color: isSelected ? '#F59E0B' : m.color }}
                    >
                      {m.name}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </div>
                  <span className="text-[11px] text-slate-400 block line-clamp-2 leading-tight">
                    {m.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Discover Something (Surprise Me) */}
        <div className="lg:col-span-4 p-8 sm:p-10 rounded-3xl glass-panel-gold border border-amber-500/40 shadow-2xl flex flex-col justify-between text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

          <div>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform">
              <Shuffle className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white mb-2">
              DISCOVER SOMETHING
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Feeling adventurous? Let fate deliver a random unreleased guitar riff, hidden video, photograph, or untold autobiography chapter.
            </p>
          </div>

          <button
            onClick={handleSurpriseMe}
            data-cursor="SURPRISE"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>SURPRISE ME NOW</span>
          </button>
        </div>
      </div>
    </section>
  );
};
