import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { MessageSquare, Send, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuestbookSection: React.FC = () => {
  const { data, showToast } = useData();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const approvedEntries = data?.guestbook.filter((g) => g.status === 'approved') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        setName('');
        setMessage('');
        setSubmittedSuccess(true);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#F59E0B', '#EC4899'],
          });
        } catch {}
        showToast('Message submitted for artist review! Thank you for the love.');
      } else {
        showToast('Failed to submit message. Please try again.', 'error');
      }
    } catch {
      showToast('Network error while sending.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          Community & Fan Reflections
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          FAN GUESTBOOK
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          Leave a thought, a memory from a concert, or words of encouragement for ZOHA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Submit Form */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl glass-panel-gold border border-pink-500/30 shadow-2xl">
          <h3 className="text-xl font-bold font-cinzel text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pink-400" />
            <span>LEAVE A MESSAGE</span>
          </h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            All messages are warmly received and reviewed before publishing on the public wall.
          </p>

          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-center space-y-3"
            >
              <CheckCircle2 className="w-10 h-10 text-pink-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Thank You for Your Words!</h4>
              <p className="text-xs text-slate-300">
                Your message has been received by ZOHA and will appear on the wall once moderated.
              </p>
              <button
                onClick={() => setSubmittedSuccess(false)}
                className="mt-2 text-xs font-bold text-pink-300 hover:text-white underline cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Note to ZOHA
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share how a song impacted you, or your concert memories..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-102 transition-transform cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'SENDING NOTE...' : 'SUBMIT NOTE'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Approved Messages Wall */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Community Wall ({approvedEntries.length} messages)
            </span>
          </div>

          {approvedEntries.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
              <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-slate-300 font-semibold">Be the first to sign the guestbook!</p>
              <p className="text-xs text-slate-500 mt-1">Submit your note using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
              {approvedEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-pink-500/30 transition-all flex flex-col justify-between shadow-lg"
                >
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed mb-4">
                    &ldquo;{entry.message}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                    <span className="font-bold font-cinzel text-pink-300 truncate">
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
