import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ImageDropzone } from './ImageDropzone';
import { Sparkles, Save, Eye, Image as ImageIcon, Sliders, CheckCircle2 } from 'lucide-react';

const HERO_PRESET_WALLPAPERS = [
  {
    name: 'Vintage Studio Mic (Default)',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Concert Stage & Spotlight Gold',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Moody Neon Synth Studio',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Silhouette in Stage Fog',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Deep Cosmic Resonance',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=85',
  },
  {
    name: 'Acoustic Warm Glow Strings',
    url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1920&q=85',
  },
];

export const AdminHeroEditor: React.FC = () => {
  const { data, updateHero, showToast } = useData();
  const hero = data?.hero;

  const [formData, setFormData] = useState({
    title: hero?.title || 'ZOHA 2.0',
    tagline: hero?.tagline || 'Where melody meets cinematic dimension',
    quote: hero?.quote || 'Creating worlds where strings whisper and shadows sing.',
    description: hero?.description || 'Welcome to my world. An intimate realm of acoustic resonance, electric dreams, visual poetry, and live soundscapes.',
    coverImageUrl: hero?.coverImageUrl || hero?.portraitUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85',
    portraitUrl: hero?.portraitUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85',
    ctaPrimaryText: hero?.ctaPrimaryText || 'LISTEN NOW',
    ctaPrimaryLink: hero?.ctaPrimaryLink || '#music',
    ctaSecondaryText: hero?.ctaSecondaryText || 'WATCH VIDEOS',
    ctaSecondaryLink: hero?.ctaSecondaryLink || '#videos',
    badgeText: hero?.badgeText || hero?.subtitle || 'MUSIC • STORIES • VISUALS',
    darkOverlayOpacity: hero?.darkOverlayOpacity ?? hero?.overlayStrength ?? 0.7,
  });

  const [saving, setSaving] = useState(false);

  const handleBannerChange = (newUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImageUrl: newUrl,
      portraitUrl: newUrl,
    }));
  };

  const handleApplyPreset = (url: string) => {
    handleBannerChange(url);
    showToast('Applied curated background wallpaper');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateHero(formData);
      showToast('Main Banner & Hero settings saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            HERO COVER & BACKGROUND STUDIO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white">
            MAIN BANNER CHANGE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drag & drop your custom background image, choose atmospheric presets, and customize the main hero presentation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Main Banner Drag & Drop Uploader */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-cinzel">
                  DRAG & DROP MAIN BANNER IMAGE
                </h3>
                <p className="text-xs text-slate-400">
                  Accepts PNG, JPG, WEBP, GIF, or direct URLs. Optimized for 16:9 / widescreen displays.
                </p>
              </div>
            </div>
          </div>

          <ImageDropzone
            label="Main Banner Background Image"
            value={formData.coverImageUrl}
            onChange={handleBannerChange}
            description="Drag & drop high-resolution main banner background image here, or browse files"
            aspectRatio="wide"
            placeholder="https://images.unsplash.com/..."
            required
          />

          {/* Curated Preset Backgrounds */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Or Select a Curated Atmospheric Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HERO_PRESET_WALLPAPERS.map((preset) => {
                const isSelected = formData.coverImageUrl === preset.url;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden text-left border p-1 group transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-500/10'
                        : 'border-white/10 hover:border-white/30 bg-black/40'
                    }`}
                  >
                    <div className="aspect-[16/9] w-full rounded-lg overflow-hidden relative">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <span className="px-2 py-0.5 rounded bg-black/80 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-amber-400" /> Active
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="block text-[11px] font-medium text-slate-300 truncate mt-1.5 px-1">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Live Banner Preview */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-white">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold font-cinzel">LIVE HERO BANNER PREVIEW</h3>
          </div>

          <div className="relative w-full aspect-[21/9] min-h-[220px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center text-center p-6 select-none shadow-2xl">
            {/* Background Image Preview */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url("${formData.coverImageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=85'}")`,
              }}
            />

            {/* Live Scrim Opacity Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/80 to-transparent"
              style={{ opacity: formData.darkOverlayOpacity }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050510]/80 via-[#050510]/30 to-[#050510]/80" />

            {/* Overlay Content Mockup */}
            <div className="relative z-10 space-y-2 max-w-lg">
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 border border-amber-500/30 text-amber-300 text-[9px] font-mono uppercase tracking-widest">
                {formData.badgeText || 'MUSIC • STORIES • VISUALS'}
              </div>
              <h2 className="text-xl sm:text-3xl font-black font-cinzel text-white text-glow-gold tracking-widest">
                {formData.title || 'ZOHA 2.0'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic">
                “{formData.tagline || 'Where melody meets cinematic dimension'}”
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black">
                  {formData.ctaPrimaryText || 'LISTEN NOW'}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white text-[10px] font-semibold">
                  {formData.ctaSecondaryText || 'WATCH VIDEOS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Overlay Lighting & Text Settings */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-cinzel">DARK OVERLAY & TEXT PARAMETERS</h3>
          </div>

          {/* Dark Overlay Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Background Dark Scrim Opacity: {Math.round(formData.darkOverlayOpacity * 100)}%
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {formData.darkOverlayOpacity > 0.8
                  ? 'High Contrast'
                  : formData.darkOverlayOpacity < 0.5
                  ? 'Bright Image'
                  : 'Balanced Cinematic'}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.95"
              step="0.05"
              value={formData.darkOverlayOpacity}
              onChange={(e) =>
                setFormData({ ...formData, darkOverlayOpacity: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Artist Title / Heading
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Badge Eyebrow Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Hero Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Hero Description Paragraph
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Button Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Primary Button Label
              </label>
              <input
                type="text"
                value={formData.ctaPrimaryText}
                onChange={(e) => setFormData({ ...formData, ctaPrimaryText: e.target.value })}
                placeholder="LISTEN NOW"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={formData.ctaSecondaryText}
                onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
                placeholder="WATCH VIDEOS"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'SAVING MAIN BANNER...' : 'SAVE & APPLY MAIN BANNER'}</span>
        </button>
      </form>
    </div>
  );
};
