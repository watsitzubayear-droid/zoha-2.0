import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { ParticlesBackground } from './components/ParticlesBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ZohaUniverse } from './components/ZohaUniverse';
import { FeaturedSection } from './components/FeaturedSection';
import { AboutSection } from './components/AboutSection';
import { MusicSection } from './components/MusicSection';
import { YouTubeHub } from './components/YouTubeHub';
import { VisualWorld } from './components/VisualWorld';
import { StoriesSection } from './components/StoriesSection';
import { JourneyTimeline } from './components/JourneyTimeline';
import { MoodDiscoverSection } from './components/MoodDiscoverSection';
import { GuestbookSection } from './components/GuestbookSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { VideoModal } from './components/VideoModal';
import { GalleryLightbox } from './components/GalleryLightbox';
import { PressKitModal } from './components/PressKitModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ZohaModeOverlay } from './components/ZohaModeOverlay';

// Admin Components
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';

// Toast Notification Component
const ToastNotification: React.FC = () => {
  const { toast } = useData();
  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-subtle pointer-events-none">
      <div
        className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-bold font-mono tracking-wide ${
          toast.type === 'error'
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            : toast.type === 'info'
            ? 'bg-purple-950/80 border-purple-500/50 text-purple-200'
            : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}
      >
        {toast.message}
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { data, loading, isAdmin, loginAdmin } = useData();
  const [initialLoading, setInitialLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'site' | 'admin'>('site');

  // Handle URL hash routing (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      } else if (viewMode === 'admin' && window.location.hash !== '#admin') {
        setViewMode('site');
      }
    };

    if (window.location.hash === '#admin') {
      setViewMode('admin');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [viewMode]);

  // Track initial page view
  useEffect(() => {
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview' }),
    }).catch(() => {});
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setViewMode('admin');
  };

  const handleBackToSite = () => {
    window.location.hash = '';
    setViewMode('site');
  };

  if (initialLoading) {
    return <LoadingScreen onComplete={() => setInitialLoading(false)} />;
  }

  // Admin View
  if (viewMode === 'admin') {
    if (!isAdmin) {
      return (
        <div className="relative min-h-screen bg-[#050510]">
          <CustomCursor />
          <AdminLogin onBackToSite={handleBackToSite} />
          <ToastNotification />
        </div>
      );
    }

    return (
      <div className="relative min-h-screen bg-[#04040c]">
        <AdminLayout onBackToSite={handleBackToSite} />
        <ToastNotification />
      </div>
    );
  }

  // Public Artist Website
  return (
    <div className="relative min-h-screen bg-[#050510] text-slate-100 selection:bg-amber-400 selection:text-black font-outfit overflow-x-hidden">
      {/* Dynamic Cursor & Particles Atmosphere */}
      <CustomCursor />
      <ParticlesBackground />
      <ZohaModeOverlay />

      {/* Navigation Bar */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Cinematic Sections */}
      <main className="relative z-10">
        <Hero />
        <ZohaUniverse />
        <FeaturedSection />
        <AboutSection />
        <MusicSection />
        <YouTubeHub />
        <VisualWorld />
        <StoriesSection />
        <JourneyTimeline />
        <MoodDiscoverSection />
        <GuestbookSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Sticky Global Media & Modals */}
      <FloatingMusicPlayer />
      <VideoModal />
      <GalleryLightbox />
      <PressKitModal />
      <SearchOverlay />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
