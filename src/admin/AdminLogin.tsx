import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  KeyRound,
} from 'lucide-react';

export const AdminLogin: React.FC<{
  onLoginSuccess?: () => void;
  onBackToSite: () => void;
}> = ({ onLoginSuccess, onBackToSite }) => {
  const { loginAdmin, showToast } = useData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setAccessDenied(false);

    // Call loginAdmin verification
    const success = await loginAdmin(password.trim());
    setIsSubmitting(false);

    if (success) {
      setAccessGranted(true);
      setAccessDenied(false);
      showToast('Access Granted. Welcome back to the Creative Control Center, ZOHA.');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setAccessDenied(true);
      setAttemptCount((prev) => prev + 1);
      showToast('ACCESS DENIED: Invalid administrative passcode.', 'error');
    }
  };

  const handleQuickDemoAccess = () => {
    setPassword('zoha2026');
    setAccessDenied(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative bg-[#04040c] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[160px] pointer-events-none" />

      {/* Red ambient strobe when access is denied */}
      {accessDenied && (
        <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-xs transition-opacity pointer-events-none" />
      )}

      <motion.div
        animate={
          accessDenied
            ? {
                x: [-14, 14, -12, 12, -6, 6, 0],
                transition: { duration: 0.5, ease: 'easeInOut' },
              }
            : {}
        }
        className={`relative w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel text-left transition-all duration-300 ${
          accessDenied
            ? 'border-2 border-rose-500/80 shadow-[0_0_70px_rgba(244,63,94,0.35)] bg-[#0c0408]/90'
            : accessGranted
            ? 'border-2 border-emerald-500/80 shadow-[0_0_70px_rgba(16,185,129,0.35)] bg-[#040c08]/90'
            : 'border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.2)] bg-[#070919]/90'
        }`}
      >
        {/* Brand header */}
        <div className="text-center mb-7">
          <div
            className={`w-16 h-16 rounded-2xl p-[1px] mx-auto mb-4 transition-all ${
              accessDenied
                ? 'bg-gradient-to-tr from-rose-500 to-red-600 shadow-[0_0_35px_rgba(244,63,94,0.4)]'
                : accessGranted
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-[0_0_35px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-tr from-amber-500 to-purple-600 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
            }`}
          >
            <div className="w-full h-full bg-[#070919] rounded-2xl flex items-center justify-center">
              {accessDenied ? (
                <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
              ) : accessGranted ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              ) : (
                <Lock className="w-8 h-8 text-amber-400" />
              )}
            </div>
          </div>

          <span
            className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
              accessDenied
                ? 'text-rose-400'
                : accessGranted
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {accessDenied
              ? 'AUTHENTICATION FAILED'
              : accessGranted
              ? 'ACCESS GRANTED'
              : 'RESTRICTED ARTIST ACCESS'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white mt-1">
            CREATIVE CONTROL CENTER
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter administrative master passcode to manage music, releases, and site configuration.
          </p>
        </div>

        {/* ACCESS DENIED ALERT BANNER */}
        <AnimatePresence>
          {accessDenied && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/60 shadow-lg flex items-start gap-3"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black font-mono uppercase tracking-wider text-rose-200">
                  ACCESS DENIED
                </h4>
                <p className="text-xs text-rose-300/90 leading-relaxed">
                  Invalid passcode entered. Access to the creative control center is strictly restricted to authorized artist credentials.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-rose-400/80">
                    Required Pass: <strong className="text-rose-200 font-bold">zoha2026</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickDemoAccess}
                    className="text-[10px] text-amber-300 hover:text-amber-200 underline font-mono cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Administrative Passcode
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Master Key: zoha2026</span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound
                  className={`w-4 h-4 ${
                    accessDenied ? 'text-rose-400' : 'text-slate-400'
                  }`}
                />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (accessDenied) setAccessDenied(false);
                }}
                placeholder="Enter passcode (e.g. zoha2026)..."
                className={`w-full pl-10 pr-10 py-3.5 rounded-xl bg-black/60 text-white placeholder-slate-500 text-sm font-mono focus:outline-none transition-all ${
                  accessDenied
                    ? 'border-2 border-rose-500 focus:border-rose-400 ring-2 ring-rose-500/20'
                    : 'border border-white/10 focus:border-amber-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {attemptCount > 0 && accessDenied && (
              <p className="text-[11px] font-mono text-rose-400 mt-1.5 flex items-center gap-1">
                <span>Attempt #{attemptCount} failed. Default master passcode is</span>
                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="font-bold text-amber-300 underline cursor-pointer"
                >
                  zoha2026
                </button>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || accessGranted}
            className={`w-full py-4 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              accessDenied
                ? 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-600 text-white shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                : accessGranted
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-102'
            }`}
          >
            <span>
              {isSubmitting
                ? 'VERIFYING PASSCODE...'
                : accessGranted
                ? 'ACCESS GRANTED'
                : accessDenied
                ? 'RETRY AUTHENTICATION'
                : 'ENTER CONTROL CENTER'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick helper / Return button */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="hover:text-amber-300 flex items-center gap-1.5 cursor-pointer font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Use Default Passcode (zoha2026)</span>
          </button>

          <button
            type="button"
            onClick={onBackToSite}
            className="hover:text-white underline cursor-pointer transition-colors"
          >
            Return to Public Site
          </button>
        </div>
      </motion.div>
    </div>
  );
};
