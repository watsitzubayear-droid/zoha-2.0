import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { X, Download, FileText, Mail, Phone, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const PressKitModal: React.FC = () => {
  const { data, pressKitOpen, setPressKitOpen } = useData();

  if (!pressKitOpen) return null;

  const press = data?.pressKit;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPressKitOpen(false)}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#090c1f] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-y-auto z-10 p-6 sm:p-10 text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Official Press & Media Kit
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
                ZOHA 2.0 MEDIA SUITE
              </h2>
            </div>
            <button
              onClick={() => setPressKitOpen(false)}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Biography */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-2">
                Official Biography
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {press?.biography ||
                  'ZOHA is a genre-defying music artist, singer, and guitarist known for fusing cinematic strings with atmospheric electronica.'}
              </p>
            </div>

            {/* Press Quotes */}
            {press?.pressQuotes && press.pressQuotes.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-3">
                  Critical Acclaim & Quotes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {press.pressQuotes.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-xs sm:text-sm italic text-slate-200 mb-2">&ldquo;{q.quote}&rdquo;</p>
                      <span className="text-[11px] font-bold text-amber-400 font-mono block">
                        — {q.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hi-Res Press Photography */}
            {press?.hiResPhotos && press.hiResPhotos.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>High-Resolution Press Stills</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {press.hiResPhotos.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-video rounded-xl overflow-hidden group border border-white/10 bg-black"
                    >
                      <img
                        src={url}
                        alt={`Press photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-bold uppercase">Download Hi-Res</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable Assets and Contact */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Management: {press?.contactEmail || 'contact@zoha.com'}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Booking Hotline: {press?.bookingPhone || '+1 (555) 019-ZOHA'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={press?.downloadableProfileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD ONE-SHEET (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
