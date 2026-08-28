import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ThemePreset } from '../types';
import {
  Settings,
  Save,
  Download,
  Upload,
  Palette,
  Key,
  Globe,
  Share2,
  RefreshCw,
} from 'lucide-react';

const THEME_PRESETS: { id: ThemePreset; name: string; desc: string; colors: string }[] = [
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    desc: 'Signature warm amber & deep midnight universe',
    colors: 'bg-[#050510] border-amber-500 text-amber-400',
  },
  {
    id: 'neon-dream',
    name: 'Neon Dream',
    desc: 'Vibrant cyberpunk magenta, pink & high-voltage glow',
    colors: 'bg-[#080214] border-pink-500 text-pink-400',
  },
  {
    id: 'purple-cosmos',
    name: 'Purple Cosmos',
    desc: 'Deep nebula ultraviolet & ethereal amethyst tones',
    colors: 'bg-[#060412] border-purple-500 text-purple-400',
  },
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    desc: 'Electric cyan, oceanic depth & futuristic glow',
    colors: 'bg-[#020a14] border-cyan-500 text-cyan-400',
  },
  {
    id: 'black-gold',
    name: 'Black & Gold',
    desc: 'Ultra luxury high-contrast pure black and metallic gold',
    colors: 'bg-[#000000] border-yellow-500 text-yellow-400',
  },
];

export const AdminSettingsEditor: React.FC = () => {
  const { data, updateSettings, showToast, refreshData } = useData();
  const settings = data?.settings;

  const [formData, setFormData] = useState({
    siteTitle: settings?.siteTitle || 'ZOHA 2.0 — Official Artist & Music Platform',
    artistName: settings?.artistName || 'ZOHA',
    tagline: settings?.tagline || 'Original Music, Stories & Visual Universe',
    metaDescription: settings?.metaDescription || 'The official creative platform of ZOHA.',
    themePreset: (settings?.themePreset || 'midnight-gold') as ThemePreset,
    contactEmail: settings?.contactEmail || 'zoharoza587@gmail.com',
    adminPasscode: settings?.adminPasscode || 'zoha2026',
    socialYoutube: settings?.socialLinks?.youtube || '',
    socialInstagram: settings?.socialLinks?.instagram || '',
    socialFacebook: settings?.socialLinks?.facebook || '',
    socialSpotify: settings?.socialLinks?.spotify || '',
    socialTiktok: settings?.socialLinks?.tiktok || '',
    socialSoundcloud: settings?.socialLinks?.soundcloud || '',
  });

  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      siteTitle: formData.siteTitle,
      artistName: formData.artistName,
      tagline: formData.tagline,
      metaDescription: formData.metaDescription,
      themePreset: formData.themePreset,
      contactEmail: formData.contactEmail,
      adminPasscode: formData.adminPasscode,
      socialLinks: {
        youtube: formData.socialYoutube,
        instagram: formData.socialInstagram,
        facebook: formData.socialFacebook,
        spotify: formData.socialSpotify,
        tiktok: formData.socialTiktok,
        soundcloud: formData.socialSoundcloud,
      },
    });
    showToast('Platform settings and theme saved successfully.');
  };

  const handleExportBackup = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zoha-platform-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full platform JSON backup downloaded.');
  };

  const handleImportBackup = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch('/api/data/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        await refreshData();
        setShowImportArea(false);
        setImportJsonText('');
        showToast('Platform data successfully restored from JSON backup!');
      } else {
        showToast('Failed to import database schema.', 'error');
      }
    } catch {
      showToast('Invalid JSON formatted data. Please check and try again.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>SITE SETTINGS, THEMES & DATA BACKUP</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Customize site themes, update social handles, manage passcode, and export full platform database backups.
        </p>
      </div>

      {/* Theme Presets Selector */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
        <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-400" />
          <span>VISUAL THEME PRESET</span>
        </h3>
        <p className="text-xs text-slate-400">
          Select an aesthetic mood palette for the entire platform interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {THEME_PRESETS.map((t) => {
            const isSelected = formData.themePreset === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFormData({ ...formData, themePreset: t.id })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold font-cinzel text-white">{t.name}</span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Site Brand Title
            </label>
            <input
              type="text"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Artist Display Name
            </label>
            <input
              type="text"
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Admin Passcode (Creative Control Access)
            </label>
            <input
              type="text"
              value={formData.adminPasscode}
              onChange={(e) => setFormData({ ...formData, adminPasscode: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>OFFICIAL SOCIAL & STREAMING LINKS</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={formData.socialYoutube}
                onChange={(e) => setFormData({ ...formData, socialYoutube: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialInstagram}
                onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialFacebook}
                onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Spotify Artist URL</label>
              <input
                type="text"
                value={formData.socialSpotify}
                onChange={(e) => setFormData({ ...formData, socialSpotify: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">TikTok Profile URL</label>
              <input
                type="text"
                value={formData.socialTiktok}
                onChange={(e) => setFormData({ ...formData, socialTiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">SoundCloud Artist URL</label>
              <input
                type="text"
                value={formData.socialSoundcloud}
                onChange={(e) => setFormData({ ...formData, socialSoundcloud: e.target.value })}
                placeholder="https://soundcloud.com/..."
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-101 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>SAVE SYSTEM SETTINGS & THEME</span>
        </button>
      </form>

      {/* Backup & Restore Panel */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
        <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          <span>DATABASE BACKUP & RESTORE</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Export your entire ZOHA 2.0 dataset (songs, videos, photos, stories, events, settings) into a portable JSON file, or restore from a previous backup snapshot.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT FULL JSON BACKUP</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>IMPORT / RESTORE BACKUP</span>
          </button>
        </div>

        {showImportArea && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Paste JSON Backup Content Below
            </label>
            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON data here..."
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleImportBackup}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all cursor-pointer shadow-lg"
            >
              Confirm Import & Replace Database
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
