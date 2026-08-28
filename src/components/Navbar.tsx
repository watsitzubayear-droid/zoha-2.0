import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Music,
  Video,
  Image,
  BookOpen,
  Calendar,
  Compass,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  Sliders,
  Menu,
  X,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { SocialIcons } from './SocialIcons';

export const Navbar: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const {
    data,
    audioState,
    toggleMute,
    setSearchOpen,
    zohaMode,
    setZohaMode,
    triggerEasterEgg,
    setPressKitOpen,
    currentMood,
    setCurrentMood,
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const count = logoClickCount + 1;
    setLogoClickCount(count);
    if (count >= 5) {
      setZohaMode((prev) => !prev);
      triggerEasterEgg('Logo 5x Secret Click');
      setLogoClickCount(0);
    }
  };

  const navLinks = [
    { label: 'UNIVERSE', href: '#universe' },
    { label: 'ABOUT', href: '#about' },
    { label: 'MUSIC', href: '#music' },
    { label: 'VIDEOS', href: '#videos' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'STORIES', href: '#stories' },
    { label: 'JOURNEY', href: '#journey' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const moods = ['ALL', 'CALM', 'NOSTALGIC', 'DREAMY', 'ENERGETIC', 'MELANCHOLIC', 'ACOUSTIC'];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto glass-panel px-4 sm:px-6 py-2.5 rounded-full flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/10">
        {/* Brand Logo with 5x Click Easter Egg */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="flex items-center gap-2 group cursor-pointer select-none"
          title="Click 5 times for ZOHA Mode!"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#050510] rounded-full flex items-center justify-center">
              <span className="text-xs font-black font-cinzel text-amber-300">Z</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-widest font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 group-hover:text-glow-gold transition-all">
              {data?.settings?.artistName || 'ZOHA'} 2.0
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold tracking-wider text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-300 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Header Social Icons */}
          <div className="hidden lg:flex items-center mr-1">
            <SocialIcons size="xs" variant="navbar" />
          </div>

          {/* Mood Selector Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setMoodDropdownOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                currentMood !== 'ALL'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/40 hover:text-white'
              }`}
              title="Filter experience by mood"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MOOD: {currentMood}</span>
            </button>

            {moodDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-44 bg-[#0d1024] border border-amber-500/30 rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-xl">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1 border-b border-white/5 font-semibold">
                  Choose Vibe
                </div>
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setCurrentMood(m);
                      setMoodDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentMood === m
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{m}</span>
                    {currentMood === m && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 transition-colors flex items-center gap-1.5 text-xs"
            title="Search website (Ctrl + K)"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-slate-400 font-mono text-[10px]">⌘K</span>
          </button>

          {/* Audio Mute/Unmute toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-full border transition-all ${
              audioState.isPlaying && !audioState.isMuted
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
            }`}
            title={audioState.isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {audioState.isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Press Kit Trigger */}
          <button
            onClick={() => setPressKitOpen(true)}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-amber-300 hover:border-amber-400/40 text-xs font-medium transition-colors"
            title="Artist Press & Media Kit"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>PRESS</span>
          </button>

          {/* Admin Studio Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105"
            title="ZOHA Creative Control Center (Admin)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CONTROL CENTER</span>
            <span className="sm:hidden">ADMIN</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden mt-3 bg-[#080b18]/95 backdrop-blur-2xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-3 text-sm font-semibold mb-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 transition-colors border border-white/5 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Social Links */}
            <div className="mb-6 pb-4 border-b border-white/10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                Connect on Social Media
              </span>
              <SocialIcons size="sm" />
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPressKitOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 flex items-center gap-1.5 border border-white/5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Press Kit
                </button>
                <button
                  onClick={() => {
                    setZohaMode((prev) => !prev);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-xs text-purple-300 flex items-center gap-1.5 border border-purple-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  ZOHA Mode
                </button>
              </div>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Shield className="w-4 h-4" />
                Creative Control Center
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
