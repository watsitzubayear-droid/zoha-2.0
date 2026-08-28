import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Play, Sparkles, Video, ArrowDown, Disc3, Share2 } from 'lucide-react';
import { SocialIcons } from './SocialIcons';

export const Hero: React.FC = () => {
  const { data, playSong, audioState } = useData();
  const hero = data?.hero;

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || window.innerWidth < 768) {
      setIsMobile(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleListenNow = () => {
    if (data?.songs && data.songs.length > 0) {
      const featuredSong = data.songs.find((s) => s.featured) || data.songs[0];
      playSong(featuredSong);
    }
    const el = document.getElementById('music');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWatchVideos = () => {
    const el = document.getElementById('videos');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnterWorld = () => {
    const el = document.getElementById('universe');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Cover Image with subtle parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out transform scale-105"
        style={{
          backgroundImage: `url("${hero?.coverImageUrl || hero?.portraitUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85'}")`,
          transform: isMobile
            ? 'scale(1)'
            : `scale(1.05) translate(${(mousePos.x - 50) * -0.02}%, ${(mousePos.y - 50) * -0.02}%)`,
        }}
      />

      {/* Multi-layered cinematic gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent"
        style={{ opacity: hero?.darkOverlayOpacity ?? hero?.overlayStrength ?? 0.7 }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/90 via-[#050510]/40 to-[#050510]/90" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#050510]/50 to-[#050510]" />

      {/* Subtle radial mouse light on desktop */}
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(245, 158, 11, 0.08), transparent 70%)`,
          }}
        />
      )}

      {/* Hero Content Box */}
      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center justify-center">
        {/* Subtle glowing eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-500/30 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase">
            {hero?.subtitle || 'MUSIC • STORIES • VISUALS'}
          </span>
        </motion.div>

        {/* Large Dramatic Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 text-glow-gold select-none leading-none mb-6"
        >
          {hero?.title || 'ZOHA 2.0'}
        </motion.h1>

        {/* Tagline / Invitation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-lg sm:text-2xl text-slate-200 font-light tracking-wide max-w-2xl mx-auto font-display italic mb-4"
        >
          &ldquo;{hero?.taglines || 'Where melody meets cinematic dimension'}&rdquo;
        </motion.p>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-normal leading-relaxed mb-10"
        >
          {hero?.description || 'Welcome to my world. An intimate realm of acoustic resonance, electric dreams, visual poetry, and live soundscapes.'}
        </motion.p>

        {/* Interactive CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* LISTEN NOW: Gold Glowing Button */}
          <button
            onClick={handleListenNow}
            data-cursor="PLAY"
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 transform hover:scale-105 glow-gold flex items-center gap-3 cursor-pointer overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Disc3 className={`w-5 h-5 text-black ${audioState.isPlaying ? 'animate-spin' : 'group-hover:rotate-45'} transition-transform`} />
            <span className="relative z-10">{hero?.ctaPrimaryText || 'LISTEN NOW'}</span>
          </button>

          {/* WATCH VIDEOS: Transparent Glass Button */}
          <button
            onClick={handleWatchVideos}
            data-cursor="WATCH"
            className="px-8 py-4 rounded-full glass-panel border border-white/20 hover:border-amber-400/60 text-white hover:text-amber-300 font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 transform hover:scale-105 flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Video className="w-5 h-5 text-cyan-400" />
            <span>{hero?.ctaSecondaryText || 'WATCH VIDEOS'}</span>
          </button>

          {/* ENTER MY WORLD: Optional Cinematic Button */}
          <button
            onClick={handleEnterWorld}
            data-cursor="ENTER"
            className="px-6 py-4 rounded-full bg-purple-900/40 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white font-semibold text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105 flex items-center gap-2.5 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{hero?.ctaTertiaryText || 'ENTER MY WORLD'}</span>
          </button>
        </motion.div>

        {/* Small Social Media Icons Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-10 flex flex-col items-center justify-center gap-3"
        >
          <span className="text-[11px] font-mono tracking-[0.25em] text-slate-400 uppercase">
            Official Channels & Socials
          </span>
          <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
            <SocialIcons size="sm" variant="hero" />
          </div>
        </motion.div>
      </div>

      {/* Down arrow scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleEnterWorld}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-mono">Scroll to Explore</span>
        <ArrowDown className="w-4 h-4 text-amber-400" />
      </motion.div>
    </section>
  );
};
