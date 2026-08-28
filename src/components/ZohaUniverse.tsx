import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Music, Video, Image, BookOpen, MapPin, User, Sparkles, Compass } from 'lucide-react';
import { useData } from '../context/DataContext';

interface UniverseNode {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  angle: number; // in degrees
  distance: number; // distance from center (radius in px)
  color: string;
  glowColor: string;
}

export const ZohaUniverse: React.FC = () => {
  const { data, zohaMode } = useData();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // 6 evenly distributed satellite dimensions (60° apart around full circle)
  const nodes: UniverseNode[] = [
    {
      id: 'music',
      label: 'MUSIC',
      sublabel: 'Originals & Soundscapes',
      icon: Music,
      href: '#music',
      angle: 270, // Top
      distance: 215,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.45)',
    },
    {
      id: 'videos',
      label: 'VIDEOS',
      sublabel: 'YouTube Performances',
      icon: Video,
      href: '#videos',
      angle: 330, // Top-Right
      distance: 220,
      color: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.45)',
    },
    {
      id: 'gallery',
      label: 'GALLERY',
      sublabel: 'Visual World & Moments',
      icon: Image,
      href: '#gallery',
      angle: 30, // Bottom-Right
      distance: 220,
      color: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.45)',
    },
    {
      id: 'stories',
      label: 'STORIES',
      sublabel: 'Autobiography & Lore',
      icon: BookOpen,
      href: '#stories',
      angle: 90, // Bottom
      distance: 215,
      color: '#EC4899',
      glowColor: 'rgba(236, 72, 153, 0.45)',
    },
    {
      id: 'journey',
      label: 'JOURNEY',
      sublabel: 'The Milestone Timeline',
      icon: MapPin,
      href: '#journey',
      angle: 150, // Bottom-Left
      distance: 220,
      color: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.45)',
    },
    {
      id: 'about',
      label: 'ABOUT',
      sublabel: 'Philosophy & Craft',
      icon: User,
      href: '#about',
      angle: 210, // Top-Left
      distance: 220,
      color: '#FBBF24',
      glowColor: 'rgba(251, 191, 36, 0.45)',
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setMouseOffset({
      x: (e.clientX - centerX) * 0.04,
      y: (e.clientY - centerY) * 0.04,
    });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="universe"
      className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#04040c]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-900/15 via-amber-600/10 to-cyan-900/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Constellation
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          ZOHA UNIVERSE
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-2">
          An interactive digital installation. Hover and navigate the orbiting dimensions of my creative journey.
        </p>
      </div>

      {/* Interactive Orbit Installation Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-4xl mx-auto h-[540px] sm:h-[620px] flex items-center justify-center select-none"
      >
        {/* SVG Constellation Lines & Orbital Rings */}
        <svg
          viewBox="-450 -310 900 620"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          {/* Concentric orbital rings centered at (0,0) */}
          <circle
            cx={0}
            cy={0}
            r={isSmallScreen ? 110 : 150}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <circle
            cx={0}
            cy={0}
            r={isSmallScreen ? 145 : 220}
            fill="none"
            stroke="rgba(245, 158, 11, 0.15)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <circle
            cx={0}
            cy={0}
            r={isSmallScreen ? 180 : 275}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
          />

          {/* Lines connecting center (0,0) to each satellite coordinate */}
          {nodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const dist = isSmallScreen ? node.distance * 0.65 : node.distance;
            const targetX = Math.cos(rad) * dist;
            const targetY = Math.sin(rad) * dist;
            const isHovered = hoveredNode === node.id;

            return (
              <g key={node.id}>
                <line
                  x1={0}
                  y1={0}
                  x2={targetX}
                  y2={targetY}
                  stroke={isHovered ? node.color : 'rgba(255, 255, 255, 0.14)'}
                  strokeWidth={isHovered ? '2' : '1'}
                  strokeDasharray={isHovered ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
                <circle
                  cx={targetX}
                  cy={targetY}
                  r={isHovered ? 5 : 3}
                  fill={isHovered ? node.color : 'rgba(255, 255, 255, 0.3)'}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Core: ZOHA */}
        <motion.div
          animate={{
            x: mouseOffset.x * 0.4,
            y: mouseOffset.y * 0.4,
          }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative z-30 w-32 h-32 sm:w-44 sm:h-44 rounded-full glass-panel-gold border-2 border-amber-400/60 shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => scrollToSection('#about')}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/25 via-purple-600/20 to-transparent group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-mono">CORE</span>
          <span className="text-2xl sm:text-3xl font-black font-cinzel text-white text-glow-gold tracking-widest group-hover:scale-110 transition-transform">
            ZOHA
          </span>
          <span className="text-[9px] text-slate-300 font-display mt-0.5 tracking-wider">
            2.0 CREATIVE WORLD
          </span>
        </motion.div>

        {/* Orbiting Satellite Nodes */}
        {nodes.map((node, index) => {
          const rad = (node.angle * Math.PI) / 180;
          const dist = isSmallScreen ? node.distance * 0.65 : node.distance;
          const baseX = Math.cos(rad) * dist;
          const baseY = Math.sin(rad) * dist;
          const IconComponent = node.icon;
          const isHovered = hoveredNode === node.id;

          const animatedX = baseX + mouseOffset.x * (0.6 + index * 0.08);
          const animatedY = baseY + mouseOffset.y * (0.6 + index * 0.08);

          return (
            <motion.div
              key={node.id}
              initial={{ x: baseX, y: baseY, opacity: 0 }}
              animate={{
                x: animatedX,
                y: animatedY,
                opacity: 1,
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 140,
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
              }}
              className="z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => scrollToSection(node.href)}
              data-cursor="EXPLORE"
            >
              <div
                className={`p-3 sm:p-4 rounded-2xl glass-panel border transition-all duration-300 flex flex-col items-center text-center shadow-2xl ${
                  isHovered ? 'scale-110 -translate-y-1' : 'hover:scale-105'
                }`}
                style={{
                  borderColor: isHovered ? node.color : 'rgba(255, 255, 255, 0.15)',
                  boxShadow: isHovered
                    ? `0 0 30px ${node.glowColor}`
                    : '0 8px 25px rgba(0,0,0,0.6)',
                  backgroundColor: isHovered ? 'rgba(13, 16, 36, 0.92)' : 'rgba(13, 16, 36, 0.75)',
                  minWidth: isSmallScreen ? '85px' : '120px',
                }}
              >
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:rotate-6 shadow-inner"
                  style={{
                    backgroundColor: `${node.color}25`,
                    color: node.color,
                  }}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black tracking-wider text-white group-hover:text-amber-300 font-cinzel">
                  {node.label}
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 mt-0.5 max-w-[100px] leading-tight">
                  {node.sublabel}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
