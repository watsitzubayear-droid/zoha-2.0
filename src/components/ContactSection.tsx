import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles, Phone, Share2 } from 'lucide-react';
import { SocialIcons } from './SocialIcons';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const { data, showToast } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Booking Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#F59E0B', '#06B6D4', '#10B981'],
          });
        } catch {}
        showToast('Your message has been delivered directly to ZOHA Management.');
      } else {
        showToast('Unable to send message. Please try again.', 'error');
      }
    } catch {
      showToast('Network error occurred.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Mail className="w-3.5 h-3.5" />
          Direct Inquiries
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-white tracking-wider">
          LET&apos;S CREATE SOMETHING
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl mx-auto">
          &ldquo;Have a question, want to collaborate, or just want to say hello?&rdquo;
        </p>
      </div>

      {/* Main Glass Form Card */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel-gold border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-cinzel text-white">Transmission Successful</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you for reaching out. Your inquiry has been forwarded to ZOHA & Management. We typically reply within 24–48 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Send Another Inquiry
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Inquiry Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="Booking Inquiry">Concert & Festival Booking</option>
                <option value="Music Collaboration">Music / Studio Collaboration</option>
                <option value="Press & Media">Press, Interview & Media</option>
                <option value="Film & Licensing">Sync & Film Score Licensing</option>
                <option value="General Greetings">General Fan Note / Greetings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details about dates, venue, project concept, or questions..."
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'SENDING INQUIRY...' : 'SEND INQUIRY'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Direct Social Media Channels Section */}
      <div className="mt-14 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-widest">
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFICIAL SOCIAL HUBS</span>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Tap any channel below to connect directly with ZOHA on YouTube, Instagram, Facebook, and TikTok.
        </p>
        <div className="pt-2">
          <SocialIcons variant="cards" />
        </div>
      </div>
    </section>
  );
};
