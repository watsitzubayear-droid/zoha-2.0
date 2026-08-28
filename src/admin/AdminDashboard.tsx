import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Music,
  Video,
  Image,
  BookOpen,
  Calendar,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
  Play,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Share2,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { data } = useData();

  if (!data) return null;

  const totalSongs = data.songs.length;
  const totalVideos = data.videos.length;
  const totalPhotos = data.gallery.length;
  const totalStories = data.stories.length;
  const totalEvents = data.events.length;
  const pendingGuestbook = data.guestbook.filter((g) => g.status === 'pending').length;
  const unreadMessages = data.messages.filter((m) => !m.read).length;

  const totalPlays = data.songs.reduce((acc, s) => acc + (s.plays || 0), 0);
  const totalViews = data.videos.reduce((acc, v) => acc + (v.views || 0), 0);

  const stats = [
    {
      label: 'Songs & Audio',
      val: totalSongs,
      icon: Music,
      color: 'from-amber-500 to-amber-600',
      sub: `${totalPlays.toLocaleString()} total plays`,
      tab: 'music',
    },
    {
      label: 'YouTube Videos',
      val: totalVideos,
      icon: Video,
      color: 'from-cyan-500 to-cyan-600',
      sub: `${totalViews.toLocaleString()} total views`,
      tab: 'videos',
    },
    {
      label: 'Visual Photos',
      val: totalPhotos,
      icon: Image,
      color: 'from-purple-500 to-purple-600',
      sub: 'In visual gallery',
      tab: 'gallery',
    },
    {
      label: 'Stories & Lore',
      val: totalStories,
      icon: BookOpen,
      color: 'from-pink-500 to-pink-600',
      sub: 'Autobiography chapters',
      tab: 'stories',
    },
    {
      label: 'Tour Events',
      val: totalEvents,
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      sub: 'Concerts scheduled',
      tab: 'events',
    },
    {
      label: 'Guestbook Notes',
      val: data.guestbook.length,
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      sub: pendingGuestbook > 0 ? `${pendingGuestbook} pending approval` : 'All moderated',
      tab: 'guestbook',
      badge: pendingGuestbook > 0 ? `${pendingGuestbook} PENDING` : undefined,
    },
    {
      label: 'Direct Inquiries',
      val: data.messages.length,
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      sub: unreadMessages > 0 ? `${unreadMessages} unread inquiries` : 'Inbox up to date',
      tab: 'messages',
      badge: unreadMessages > 0 ? `${unreadMessages} NEW` : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel-gold border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ZOHA 2.0 SYSTEM STATUS: LIVE & ACTIVE
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
            CREATIVE COMMAND OVERVIEW
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Manage your artist presence across music releases, YouTube performances, photography, tour dates, and fan interactions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('hero')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Main Banner Change</span>
          </button>
          <button
            onClick={() => onNavigate('social')}
            className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-lg cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Social Media Links</span>
          </button>
          <button
            onClick={() => onNavigate('videos')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-colors shadow-lg cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Add YouTube Video</span>
          </button>
          <button
            onClick={() => onNavigate('music')}
            className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center gap-2 hover:bg-purple-400 transition-colors shadow-lg cursor-pointer"
          >
            <Music className="w-4 h-4" />
            <span>Upload New Song</span>
          </button>
        </div>
      </div>

      {/* Action Alerts if Pending Items */}
      {(pendingGuestbook > 0 || unreadMessages > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingGuestbook > 0 && (
            <div
              onClick={() => onNavigate('guestbook')}
              className="p-4 rounded-2xl bg-orange-500/15 border border-orange-500/40 flex items-center justify-between cursor-pointer hover:bg-orange-500/25 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {pendingGuestbook} Fan Messages Waiting for Moderation
                  </h4>
                  <p className="text-xs text-orange-200">Review & approve them to show on the wall.</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-orange-400" />
            </div>
          )}

          {unreadMessages > 0 && (
            <div
              onClick={() => onNavigate('messages')}
              className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-between cursor-pointer hover:bg-blue-500/25 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {unreadMessages} Unread Booking / Collab Inquiries
                  </h4>
                  <p className="text-xs text-blue-200">Respond directly to fans and promoters.</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-400" />
            </div>
          )}
        </div>
      )}

      {/* Grid of Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              onClick={() => onNavigate(item.tab)}
              className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${item.color} text-black shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-black uppercase">
                    {item.badge}
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                )}
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  {item.label}
                </span>
                <span className="text-3xl font-black font-cinzel text-white mt-1 block">
                  {item.val}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                  {item.sub}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Launch Control Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Shortcut Card 1 */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Theme & Branding</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch site theme presets (Midnight Gold, Neon Dream, Purple Cosmos, Cyber Blue), edit SEO meta tags, and artist biography.
          </p>
          <button
            onClick={() => onNavigate('settings')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Open Settings & Themes
          </button>
        </div>

        {/* Quick Shortcut Card 2 */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Analytics & Insights</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor real-time visitors, song play counts, video impressions, and audience mood preference breakdown.
          </p>
          <button
            onClick={() => onNavigate('analytics')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            View Live Analytics
          </button>
        </div>

        {/* Quick Shortcut Card 3 */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Tour & Spotlight</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Set the current homepage featured spotlight items and publish new upcoming concert tour stops.
          </p>
          <button
            onClick={() => onNavigate('featured')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Manage Featured Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
