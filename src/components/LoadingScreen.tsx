import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Line expands (0.2s)
    const t1 = setTimeout(() => setStage(1), 200);
    // Stage 2: ZOHA 2.0 text glows (0.6s)
    const t2 = setTimeout(() => setStage(2), 600);
    // Stage 3: Entering my world tagline (1.1s)
    const t3 = setTimeout(() => setStage(3), 1100);
    // Stage 4: Fade out and complete (1.6s)
    const t4 = setTimeout(() => {
      setStage(4);
      setTimeout(onComplete, 400);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#050510] flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Subtle cosmic glow center */}
          <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none animate-pulse-glow" />

          {/* Glowing horizontal laser line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: stage >= 1 ? '160px' : 0, opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6 shadow-[0_0_12px_#f59e0b]"
          />

          {/* ZOHA 2.0 Title */}
          <motion.div
            initial={{ opacity: 0, y: 15, letterSpacing: '0.2em' }}
            animate={{
              opacity: stage >= 2 ? 1 : 0,
              y: stage >= 2 ? 0 : 15,
              letterSpacing: stage >= 2 ? '0.35em' : '0.2em',
            }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-cinzel text-glow-gold tracking-widest text-center"
          >
            ZOHA 2.0
          </motion.div>

          {/* Subtitle reveal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="text-xs uppercase tracking-[0.4em] text-cyan-300/80 mt-4 font-display"
          >
            Entering My World...
          </motion.div>

          {/* Equalizer mini preview animation */}
          <div className="flex items-center gap-1.5 mt-8">
            {[40, 70, 100, 60, 85, 45, 90, 30].map((h, idx) => (
              <motion.div
                key={idx}
                animate={{ height: [4, h * 0.25, 4] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: idx * 0.08,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-amber-400/60 rounded-full"
                style={{ height: '8px' }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
