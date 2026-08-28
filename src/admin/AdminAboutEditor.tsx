import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ImageDropzone } from './ImageDropzone';
import { Sparkles, Save, User } from 'lucide-react';

export const AdminAboutEditor: React.FC = () => {
  const { data, updateAbout, showToast } = useData();
  const about = data?.about;

  const [formData, setFormData] = useState({
    name: about?.name || 'ZOHA',
    bio: about?.bio || '',
    portraitUrl: about?.portraitUrl || '',
    signature: about?.signature || 'ZOHA — 2026',
    roles: (about?.roles || ['Music Artist', 'Singer', 'Guitarist']).join(', '),
    instruments: (about?.instruments || ['Acoustic Guitar', 'Electric Lead', 'Synthesizers', 'Vocals']).join(', '),
    inspiration: about?.inspiration || '',
    dreams: about?.dreams || '',
    story: about?.story || '',
    yearsActive: about?.stats?.yearsActive || 8,
    tracksReleased: about?.stats?.tracksReleased || 24,
    liveShows: about?.stats?.liveShows || 50,
    countriesReached: about?.stats?.countriesReached || 35,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAbout({
      name: formData.name,
      bio: formData.bio,
      portraitUrl: formData.portraitUrl,
      signature: formData.signature,
      roles: formData.roles.split(',').map((r) => r.trim()).filter(Boolean),
      instruments: formData.instruments.split(',').map((r) => r.trim()).filter(Boolean),
      inspiration: formData.inspiration,
      dreams: formData.dreams,
      story: formData.story,
      stats: {
        yearsActive: Number(formData.yearsActive),
        tracksReleased: Number(formData.tracksReleased),
        liveShows: Number(formData.liveShows),
        countriesReached: Number(formData.countriesReached),
      },
    });
    showToast('Artist biography & profile saved.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
          <User className="w-6 h-6 text-amber-400" />
          <span>ABOUT & ARTIST BIOGRAPHY EDITOR</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Update artist bio, official portrait photo, signature, instruments, and career milestone metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Artist Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <ImageDropzone
            label="Artist Official Portrait Photo"
            value={formData.portraitUrl}
            onChange={(url) => setFormData({ ...formData, portraitUrl: url })}
            description="Drag & drop high-resolution artist portrait or press photo"
            aspectRatio="portrait"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Roles / Creative Titles (comma-separated)
          </label>
          <input
            type="text"
            value={formData.roles}
            onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
            placeholder="Music Artist, Singer, Guitarist, Composer..."
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Instruments / Gear (comma-separated)
          </label>
          <input
            type="text"
            value={formData.instruments}
            onChange={(e) => setFormData({ ...formData, instruments: e.target.value })}
            placeholder="Acoustic Guitar, Electric Lead, Synthesizers..."
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Artist Biography (Main Overview)
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Philosophical Inspiration
            </label>
            <textarea
              rows={3}
              value={formData.inspiration}
              onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Artistic Dreams & Vision
            </label>
            <textarea
              rows={3}
              value={formData.dreams}
              onChange={(e) => setFormData({ ...formData, dreams: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Numeric Career Statistics */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-widest mb-4">
            CAREER BENCHMARK METRICS
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Years Active</label>
              <input
                type="number"
                value={formData.yearsActive}
                onChange={(e) => setFormData({ ...formData, yearsActive: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Tracks Released</label>
              <input
                type="number"
                value={formData.tracksReleased}
                onChange={(e) => setFormData({ ...formData, tracksReleased: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Live Concerts</label>
              <input
                type="number"
                value={formData.liveShows}
                onChange={(e) => setFormData({ ...formData, liveShows: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Countries Reached</label>
              <input
                type="number"
                value={formData.countriesReached}
                onChange={(e) => setFormData({ ...formData, countriesReached: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-101 transition-transform cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>SAVE ABOUT INFORMATION</span>
        </button>
      </form>
    </div>
  );
};
