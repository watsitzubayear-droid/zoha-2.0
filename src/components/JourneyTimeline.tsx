import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { MapPin, Sparkles, Calendar, ChevronRight } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  const { data } = useData();

  const journey = data?.journey.filter((j) => j.published) || [];

  return (
    <section id="journey" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full bg-cyan-600/5 blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5" />
          The Evolution
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          THE JOURNEY
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          From first acoustic chords to international performances and the genesis of ZOHA 2.0.
        </p>
      </div>

      {/* Timeline Tree */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central glowing vertical timeline line */}
        <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-400 via-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]" />

        <div className="space-y-12 sm:space-y-16">
          {journey.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } pl-10 sm:pl-0`}
              >
                {/* Center Node Marker */}
                <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-20 w-8 h-8 rounded-full bg-[#050510] border-2 border-cyan-400 shadow-[0_0_20px_#06b6d4] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                </div>

                {/* Content Card (Takes half width on desktop) */}
                <div className={`w-full sm:w-[calc(50%-40px)] ${isEven ? 'sm:text-left' : 'sm:text-right'}`}>
                  <div className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-xl group">
                    {/* Year / Era Pill */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 mb-3 ${isEven ? '' : 'sm:ml-auto'}`}>
                      <Calendar className="w-3 h-3" />
                      <span>{item.date || item.year}</span>
                    </div>

                    {/* Image if available */}
                    {item.imageUrl && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 bg-black">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}

                    <h3 className="text-xl font-bold font-cinzel text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
