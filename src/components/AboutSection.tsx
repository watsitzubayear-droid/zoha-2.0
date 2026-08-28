import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Sparkles, Music, Video, Image, Mic2, Award, Heart, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data, triggerEasterEgg } = useData();
  const about = data?.about;

  const [activeTab, setActiveTab] = useState<'story' | 'philosophy' | 'inspiration' | 'instruments' | 'dreams'>('story');

  const stats = [
    { label: 'Songs Recorded', value: about?.stats.songs || '18+', icon: Music },
    { label: 'YouTube Videos', value: about?.stats.videos || '32+', icon: Video },
    { label: 'Photography', value: about?.stats.photos || '120+', icon: Image },
    { label: 'Live Concerts', value: about?.stats.performances || '45+', icon: Mic2 },
    { label: 'Creative Projects', value: about?.stats.projects || '12+', icon: Award },
  ];

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Decorative ambient orbs */}
      <div className="absolute -top-10 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Artist & The Soul
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          THIS IS {about?.name || 'ZOHA'}
        </h2>
        <p className="text-sm sm:text-base text-amber-400/80 font-display tracking-widest uppercase mt-2">
          {about?.artistTitle || 'Singer • Musician • Guitarist • Visual Artist'}
        </p>
      </div>

      {/* Main Grid: Portrait Image & Interactive About Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        {/* Left Column: Artist Portrait with Depth Frame */}
        <div className="lg:col-span-5 relative group">
          <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden glass-panel border border-amber-500/30 p-2 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-[#0d1024]">
              <img
                src={about?.portraitUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85'}
                alt={about?.name || 'ZOHA'}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80" />

              {/* Glowing Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

              {/* Signature floating overlay at bottom */}
              <div
                className="absolute bottom-4 left-6 right-6 flex items-end justify-between cursor-pointer"
                onMouseEnter={() => triggerEasterEgg('Hovered Artist Signature')}
                title="Artist Signature"
              >
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                    Authentic Signature
                  </span>
                  <span className="font-signature text-4xl sm:text-5xl text-amber-300 text-glow-gold">
                    {about?.signatureText || 'Zoha'}
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-black/60 border border-amber-500/30 text-[10px] text-amber-300 backdrop-blur-md">
                  Official 2.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Philosophy & Interactive Tabs */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Creative Philosophy Quote Card */}
          <div className="p-6 rounded-2xl glass-panel-gold border border-amber-500/30 relative">
            <span className="text-4xl font-serif text-amber-400/30 absolute top-2 left-4">&ldquo;</span>
            <p className="text-base sm:text-lg text-slate-200 italic font-display leading-relaxed pl-6">
              {about?.creativePhilosophy || 'Music is not merely sound—it is the architecture of memory and emotional light.'}
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {about?.shortBio || 'Exploring the intersection of raw acoustic strings, atmospheric vocals, and cinematic storytelling.'}
          </p>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-b border-white/10 pb-3">
            {[
              { key: 'story', label: 'MY STORY' },
              { key: 'philosophy', label: 'MY MUSIC' },
              { key: 'inspiration', label: 'INSPIRATION' },
              { key: 'instruments', label: 'INSTRUMENTS' },
              { key: 'dreams', label: 'DREAMS' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wider transition-all uppercase ${
                  activeTab === tab.key
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[140px] p-5 rounded-2xl glass-panel border border-white/10 text-slate-300 text-sm sm:text-base leading-relaxed">
            {activeTab === 'story' && (
              <p>{about?.story || 'From acoustic fingerpicking in late-night bedroom sessions to electrifying festival stages...'}</p>
            )}
            {activeTab === 'philosophy' && (
              <p>{about?.musicPhilosophy || 'Every chord carries a narrative. When acoustic guitars blend with modern synth textures...'}</p>
            )}
            {activeTab === 'inspiration' && (
              <p>{about?.inspiration || 'Inspired by nighttime cityscapes, timeless film scores, vintage analog guitars...'}</p>
            )}
            {activeTab === 'instruments' && (
              <div>
                <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block mb-3">
                  Key Instruments & Gear:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(about?.instruments || ['Fender Stratocaster', 'Taylor 814ce', 'Gibson Les Paul', 'Moog Sub 37']).map((inst, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'dreams' && (
              <p>{about?.dreams || 'To orchestrate world-class immersive audio-visual arena experiences that unite millions across the globe through music.'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Live Verified Statistics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-5 rounded-2xl glass-panel border border-white/10 text-center flex flex-col items-center justify-center hover:border-amber-500/40 transition-all shadow-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-4xl font-black font-cinzel text-white text-glow-gold tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                {stat.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
