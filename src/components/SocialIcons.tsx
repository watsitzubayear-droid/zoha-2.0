import React from 'react';
import { useData } from '../context/DataContext';
import { Youtube, Instagram, Facebook, Music } from 'lucide-react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.842 2.895 2.895 0 0 1-2.896-2.896 2.895 2.895 0 0 1 2.896-2.896c.387 0 .753.076 1.088.214V9.45a6.29 6.29 0 0 0-1.088-.095A6.34 6.34 0 0 0 3.15 15.696a6.34 6.34 0 0 0 6.342 6.342 6.34 6.34 0 0 0 6.342-6.342V8.981a8.17 8.17 0 0 0 4.887 1.597V7.133a4.834 4.834 0 0 1-1.132-.447z" />
  </svg>
);

interface SocialIconsProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'hero' | 'navbar' | 'footer' | 'cards';
  showLabels?: boolean;
  className?: string;
}

export const SocialIcons: React.FC<SocialIconsProps> = ({
  size = 'sm',
  variant = 'hero',
  showLabels = false,
  className = '',
}) => {
  const { data } = useData();
  const social = data?.settings?.socialLinks;

  const links = [
    {
      id: 'youtube',
      name: 'YouTube',
      url: social?.youtube || 'https://www.youtube.com',
      icon: Youtube,
      color: '#FF0000',
      hoverBg: 'hover:bg-red-500/20 hover:border-red-500/60 hover:text-red-400 hover:shadow-[0_0_18px_rgba(239,68,68,0.45)]',
      glow: 'rgba(239,68,68,0.4)',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: social?.instagram || 'https://www.instagram.com',
      icon: Instagram,
      color: '#E4405F',
      hoverBg: 'hover:bg-pink-500/20 hover:border-pink-500/60 hover:text-pink-400 hover:shadow-[0_0_18px_rgba(236,72,153,0.45)]',
      glow: 'rgba(236,72,153,0.4)',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: social?.facebook || 'https://www.facebook.com',
      icon: Facebook,
      color: '#1877F2',
      hoverBg: 'hover:bg-blue-500/20 hover:border-blue-500/60 hover:text-blue-400 hover:shadow-[0_0_18px_rgba(59,130,246,0.45)]',
      glow: 'rgba(59,130,246,0.4)',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: social?.tiktok || 'https://www.tiktok.com',
      icon: TikTokIcon,
      color: '#00F2FE',
      hoverBg: 'hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-[0_0_18px_rgba(6,182,212,0.45)]',
      glow: 'rgba(6,182,212,0.4)',
    },
    {
      id: 'spotify',
      name: 'Spotify',
      url: social?.spotify || 'https://open.spotify.com',
      icon: Music,
      color: '#1DB954',
      hoverBg: 'hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:text-emerald-400 hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]',
      glow: 'rgba(16,185,129,0.4)',
    },
  ];

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
        {links.slice(0, 4).map((item) => {
          const IconComp = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-2xl glass-panel border border-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-2.5 group cursor-pointer ${item.hoverBg}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                <IconComp className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-white tracking-wider block font-cinzel">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 group-hover:text-slate-200">
                  Follow & Watch
                </span>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {links.map((item) => {
        const IconComp = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Follow on ${item.name}`}
            className={`group relative rounded-full glass-panel border border-white/15 flex items-center justify-center text-slate-300 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer select-none ${sizeClasses[size]} ${item.hoverBg}`}
          >
            <IconComp className={`${iconSizes[size]} transition-transform duration-300`} />
            {showLabels && (
              <span className="ml-2 text-xs font-bold tracking-wider">{item.name}</span>
            )}
          </a>
        );
      })}
    </div>
  );
};
