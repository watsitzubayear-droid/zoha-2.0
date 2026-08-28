import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Sparkles, X, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ZohaModeOverlay: React.FC = () => {
  const { zohaMode, setZohaMode } = useData();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (zohaMode) {
      setShowBanner(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#06B6D4', '#A855F7'],
        });
      } catch {}

      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [zohaMode]);

  return (
    <>
      <AnimatePresence>
        {zohaMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10 bg-radial from-purple-950/20 via-cyan-950/15 to-transparent mix-blend-screen"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zohaMode && showBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
          >
            <div className="glass-panel-gold px-6 py-3 rounded-full border border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-purple-300 font-bold">
                  ZOHA MODE ACTIVE
                </span>
                <span className="text-[11px] text-cyan-200">
                  Welcome to my intimate dimension • Press <kbd className="bg-white/10 px-1 rounded text-[10px]">Z</kbd> to toggle
                </span>
              </div>
              <button
                onClick={() => setZohaMode(false)}
                className="ml-2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Exit Zoha Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating persistent badge when Zoha Mode is active */}
      {zohaMode && !showBanner && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setZohaMode(false)}
          className="fixed bottom-24 right-6 z-40 glass-panel px-3.5 py-1.5 rounded-full border border-purple-400/40 text-[11px] text-purple-300 flex items-center gap-2 hover:border-purple-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer group"
          title="Click to exit ZOHA Mode (Shortcut: Z)"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:animate-pulse" />
          <span>ZOHA MODE (Z)</span>
          <X className="w-3 h-3 text-slate-400 group-hover:text-white" />
        </motion.button>
      )}
    </>
  );
};
