import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  Share2,
  Save,
  Youtube,
  Instagram,
  Facebook,
  Music,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { TikTokIcon, SocialIcons } from '../components/SocialIcons';

export const AdminSocialManager: React.FC = () => {
  const { data, updateSettings, showToast } = useData();
  const social = data?.settings?.socialLinks;

  const [formData, setFormData] = useState({
    youtube: social?.youtube || 'https://www.youtube.com',
    instagram: social?.instagram || 'https://www.instagram.com',
    facebook: social?.facebook || 'https://www.facebook.com',
    tiktok: social?.tiktok || 'https://www.tiktok.com',
    spotify: social?.spotify || 'https://open.spotify.com',
    soundcloud: social?.soundcloud || '',
  });

  const [saving, setSaving] = useState(false);

  const socialPlatforms = [
    {
      id: 'youtube',
      name: 'YouTube Channel',
      key: 'youtube' as const,
      placeholder: 'https://youtube.com/@zohamusic or channel URL',
      icon: Youtube,
      color: '#FF0000',
      description: 'Official YouTube channel for music videos, performances, and live sessions',
      bgGlow: 'from-red-500/20 to-transparent',
      badge: 'Video & Live Hub',
    },
    {
      id: 'instagram',
      name: 'Instagram Profile',
      key: 'instagram' as const,
      placeholder: 'https://instagram.com/zohaofficial',
      icon: Instagram,
      color: '#E4405F',
      description: 'Primary visual stories, lifestyle, backstage photos, and reels',
      bgGlow: 'from-pink-500/20 to-transparent',
      badge: 'Visuals & Stories',
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      key: 'facebook' as const,
      placeholder: 'https://facebook.com/zohamusicofficial',
      icon: Facebook,
      color: '#1877F2',
      description: 'Official fan community, announcements, tour news, and events',
      bgGlow: 'from-blue-500/20 to-transparent',
      badge: 'Community & Events',
    },
    {
      id: 'tiktok',
      name: 'TikTok Profile',
      key: 'tiktok' as const,
      placeholder: 'https://tiktok.com/@zohamusic',
      icon: TikTokIcon,
      color: '#00F2FE',
      description: 'Short acoustic clips, viral melodies, teasers, and trending audio',
      bgGlow: 'from-cyan-500/20 to-transparent',
      badge: 'Shorts & Trends',
    },
    {
      id: 'spotify',
      name: 'Spotify Artist Profile',
      key: 'spotify' as const,
      placeholder: 'https://open.spotify.com/artist/...',
      icon: Music,
      color: '#1DB954',
      description: 'Official verified Spotify artist profile for all studio singles & albums',
      bgGlow: 'from-emerald-500/20 to-transparent',
      badge: 'Digital Streaming',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        socialLinks: {
          youtube: formData.youtube.trim(),
          instagram: formData.instagram.trim(),
          facebook: formData.facebook.trim(),
          tiktok: formData.tiktok.trim(),
          spotify: formData.spotify.trim(),
          soundcloud: formData.soundcloud.trim(),
        },
      });
      showToast('Social media links updated and published to all main page icons!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
          <Share2 className="w-3.5 h-3.5" />
          SOCIAL CHANNELS & COMMUNITY HUBS
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white">
          SOCIAL MEDIA LINKS
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure your official links for Facebook, YouTube, Instagram, TikTok, and Spotify. These link directly from the small icons in the main hero banner, navigation bar, and footer.
        </p>
      </div>

      {/* Live Main Page Icon Preview */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-amber-500/30 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-cinzel">LIVE ICONS PREVIEW (MAIN PAGE HERO)</h3>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">CLICKABLE IN LIVE SITE</span>
        </div>

        <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center gap-4 text-center">
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
            CONNECT & FOLLOW ZOHA
          </span>
          <SocialIcons size="md" />
          <p className="text-[11px] text-slate-500 max-w-md">
            Visitors on the homepage can tap any icon to instantly navigate to your channel or profile in a new tab.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {socialPlatforms.map((platform) => {
            const IconComponent = platform.icon;
            const currentVal = formData[platform.key];

            return (
              <div
                key={platform.id}
                className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 space-y-3 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${platform.color}20`,
                        color: platform.color,
                        borderColor: `${platform.color}40`,
                        borderWidth: 1,
                      }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-cinzel">
                          {platform.name}
                        </h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                          {platform.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{platform.description}</p>
                    </div>
                  </div>

                  {currentVal && (
                    <a
                      href={currentVal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-xs transition-colors self-start sm:self-auto cursor-pointer"
                      title="Test current link in new tab"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>

                <div>
                  <input
                    type="url"
                    value={currentVal}
                    onChange={(e) =>
                      setFormData({ ...formData, [platform.key]: e.target.value })
                    }
                    placeholder={platform.placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'SAVING SOCIAL LINKS...' : 'SAVE & PUBLISH SOCIAL LINKS'}</span>
        </button>
      </form>
    </div>
  );
};
