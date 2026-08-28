import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminHeroEditor } from './AdminHeroEditor';
import { AdminAboutEditor } from './AdminAboutEditor';
import { AdminMusicManager } from './AdminMusicManager';
import { AdminVideoManager } from './AdminVideoManager';
import { AdminGalleryManager } from './AdminGalleryManager';
import { AdminStoriesManager } from './AdminStoriesManager';
import { AdminJourneyManager } from './AdminJourneyManager';
import { AdminEventsManager } from './AdminEventsManager';
import { AdminFeaturedManager } from './AdminFeaturedManager';
import { AdminGuestbookManager } from './AdminGuestbookManager';
import { AdminMessagesManager } from './AdminMessagesManager';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminSettingsEditor } from './AdminSettingsEditor';
import { AdminSocialManager } from './AdminSocialManager';
import {
  LayoutDashboard,
  Sparkles,
  User,
  Music,
  Video,
  Image,
  BookOpen,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Mail,
  TrendingUp,
  Settings,
  Share2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  onBackToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToSite }) => {
  const { data, logoutAdmin, showToast } = useData();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const pendingGuestbook = data?.guestbook.filter((g) => g.status === 'pending').length || 0;
  const unreadMessages = data?.messages.filter((m) => !m.read).length || 0;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'OVERVIEW' },
    { id: 'hero', label: 'Main Banner Change', icon: Sparkles, section: 'PAGES & IDENTITY' },
    { id: 'social', label: 'Social Media Links', icon: Share2, section: 'PAGES & IDENTITY' },
    { id: 'about', label: 'About & Bio', icon: User, section: 'PAGES & IDENTITY' },
    { id: 'music', label: 'Music Catalog', icon: Music, section: 'CREATIVE MEDIA' },
    { id: 'videos', label: 'YouTube Hub', icon: Video, section: 'CREATIVE MEDIA' },
    { id: 'gallery', label: 'Visual Gallery', icon: Image, section: 'CREATIVE MEDIA' },
    { id: 'stories', label: 'Autobiography', icon: BookOpen, section: 'CREATIVE MEDIA' },
    { id: 'journey', label: 'Journey Timeline', icon: MapPin, section: 'EVENTS & LORE' },
    { id: 'events', label: 'Tour Dates', icon: Calendar, section: 'EVENTS & LORE' },
    { id: 'featured', label: 'Spotlight Masterworks', icon: Star, section: 'EVENTS & LORE' },
    {
      id: 'guestbook',
      label: 'Fan Guestbook',
      icon: MessageSquare,
      section: 'COMMUNITY & INBOX',
      badge: pendingGuestbook > 0 ? pendingGuestbook : undefined,
    },
    {
      id: 'messages',
      label: 'Direct Inquiries',
      icon: Mail,
      section: 'COMMUNITY & INBOX',
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: 'analytics', label: 'Audience Insights', icon: TrendingUp, section: 'SYSTEM' },
    { id: 'settings', label: 'Settings & Themes', icon: Settings, section: 'SYSTEM' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    showToast('Logged out of Creative Control Center.');
    onBackToSite();
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={(t) => setActiveTab(t)} />;
      case 'hero':
        return <AdminHeroEditor />;
      case 'social':
        return <AdminSocialManager />;
      case 'about':
        return <AdminAboutEditor />;
      case 'music':
        return <AdminMusicManager />;
      case 'videos':
        return <AdminVideoManager />;
      case 'gallery':
        return <AdminGalleryManager />;
      case 'stories':
        return <AdminStoriesManager />;
      case 'journey':
        return <AdminJourneyManager />;
      case 'events':
        return <AdminEventsManager />;
      case 'featured':
        return <AdminFeaturedManager />;
      case 'guestbook':
        return <AdminGuestbookManager />;
      case 'messages':
        return <AdminMessagesManager />;
      case 'analytics':
        return <AdminAnalyticsView />;
      case 'settings':
        return <AdminSettingsEditor />;
      default:
        return <AdminDashboard onNavigate={(t) => setActiveTab(t)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#04040c] text-white flex flex-col md:flex-row font-outfit">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#060818] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center font-black font-cinzel text-xs text-black">
            Z
          </div>
          <span className="text-sm font-bold font-cinzel tracking-wider text-white">
            CONTROL CENTER
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 lg:w-72 bg-[#060818] border-r border-white/10 shrink-0 h-auto md:h-screen md:sticky md:top-0 flex flex-col justify-between overflow-y-auto z-30`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <div className="w-full h-full bg-[#050510] rounded-xl flex items-center justify-center">
                  <span className="text-base font-black font-cinzel text-amber-300">Z</span>
                </div>
              </div>
              <div>
                <h1 className="text-sm font-black font-cinzel text-white tracking-widest text-glow-gold">
                  ZOHA 2.0
                </h1>
                <span className="text-[10px] font-mono text-amber-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  CONTROL CENTER
                </span>
              </div>
            </div>
          </div>

          {/* Nav list grouped by section */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item, idx) => {
              const isSelected = activeTab === item.id;
              const Icon = item.icon;
              const isNewSection = idx === 0 || navItems[idx - 1].section !== item.section;

              return (
                <React.Fragment key={item.id}>
                  {isNewSection && (
                    <div className="px-3 pt-4 pb-1 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      {item.section}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                          isSelected ? 'bg-black text-amber-400' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        {renderActiveView()}
      </main>
    </div>
  );
};
