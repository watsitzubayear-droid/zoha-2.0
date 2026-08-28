import React from 'react';
import { useData } from '../context/DataContext';
import {
  Youtube,
  Instagram,
  Facebook,
  Music,
  ArrowUp,
  Heart,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SocialIcons } from './SocialIcons';

export const Footer: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const { data, setPressKitOpen, zohaMode } = useData();
  const settings = data?.settings;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#03030a] border-t border-white/10 pt-20 pb-28 sm:pb-20 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <div className="w-full h-full bg-[#050510] rounded-full flex items-center justify-center">
                  <span className="text-sm font-black font-cinzel text-amber-300">Z</span>
                </div>
              </div>
              <span className="text-2xl font-black font-cinzel text-white tracking-widest text-glow-gold">
                {settings?.artistName || 'ZOHA'} 2.0
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">
              Official artist, music, and cinematic creative platform. An intimate realm of acoustic guitar resonance, atmospheric electronica, and visual storytelling.
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <SocialIcons size="sm" variant="footer" />
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase">
              EXPLORE WORLD
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="#universe" className="hover:text-white transition-colors">
                  ZOHA Universe
                </a>
              </li>
              <li>
                <a href="#music" className="hover:text-white transition-colors">
                  Music & Singles
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-white transition-colors">
                  YouTube Performances
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Visual Gallery
                </a>
              </li>
              <li>
                <a href="#stories" className="hover:text-white transition-colors">
                  Autobiography Stories
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-white transition-colors">
                  The Journey Timeline
                </a>
              </li>
            </ul>
          </div>

          {/* Industry & Media Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold font-mono tracking-widest text-amber-400 uppercase">
              INDUSTRY & DIRECT
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              For global booking inquiries, festival invitations, sync licensing, and interviews:
            </p>
            <div className="text-xs font-mono text-white">
              {settings?.contactEmail || 'zoharoza587@gmail.com'}
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setPressKitOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-amber-300 border border-white/10 transition-colors"
              >
                Press / Media Kit
              </button>
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-300 border border-amber-500/40 transition-colors"
              >
                Control Center (Admin)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} ZOHA. All Rights Reserved. ZOHA 2.0 Official Creative Platform.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
