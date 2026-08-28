import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ContactMessage } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { Mail, Trash2, CheckCircle, MailOpen, Phone, Calendar, Search } from 'lucide-react';

export const AdminMessagesManager: React.FC = () => {
  const { data, markMessageRead, deleteContactMessage, showToast } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const messages = data?.messages || [];

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteContactMessage(deleteTargetId);
      showToast('Direct message deleted.');
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-400" />
            <span>DIRECT INQUIRIES & BOOKING INBOX</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Messages sent from promoters, fans, and collaborators via the contact form.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by sender name, email, or subject..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Message Cards */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
          <Mail className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-300 font-bold">No inquiries in your inbox.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl glass-panel border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
                !msg.read ? 'border-blue-500/60 bg-blue-950/20' : 'border-white/10'
              }`}
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-bold font-cinzel text-white">{msg.name}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono uppercase font-bold">
                    {msg.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  {!msg.read && (
                    <span className="px-2 py-0.2 rounded bg-blue-500 text-black text-[9px] font-black uppercase">
                      NEW UNREAD
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-cyan-300">
                  <a href={`mailto:${msg.email}`} className="hover:underline">
                    {msg.email}
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {!msg.read && (
                  <button
                    onClick={() => {
                      markMessageRead(msg.id);
                      showToast('Marked as read.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-black text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <MailOpen className="w-3.5 h-3.5" />
                    <span>MARK READ</span>
                  </button>
                )}

                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  REPLY VIA EMAIL
                </a>

                <button
                  onClick={() => setDeleteTargetId(msg.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Direct Message"
        message="Are you sure you want to remove this inquiry from your inbox?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
