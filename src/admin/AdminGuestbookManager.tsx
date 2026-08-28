import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GuestbookEntry } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { MessageSquare, Check, X, Trash2, Heart, ShieldAlert } from 'lucide-react';

export const AdminGuestbookManager: React.FC = () => {
  const { data, updateGuestbookStatus, deleteGuestbookEntry, showToast } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const guestbook = data?.guestbook || [];

  const filteredEntries = guestbook.filter((entry) => {
    if (filter === 'all') return true;
    return entry.status === filter;
  });

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    await updateGuestbookStatus(id, status);
    showToast(`Guestbook message marked as ${status}.`);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteGuestbookEntry(deleteTargetId);
      showToast('Guestbook entry permanently deleted.');
      setDeleteTargetId(null);
    }
  };

  const pendingCount = guestbook.filter((g) => g.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-400" />
            <span>FAN GUESTBOOK MODERATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Review community messages and approve them before they appear on the public fan wall.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                filter === tab
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab} {tab === 'pending' && pendingCount > 0 && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-white/10">
          <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-300 font-bold">No messages matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg ${
                entry.status === 'pending'
                  ? 'border-orange-500/50 bg-orange-950/20'
                  : 'border-white/10'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-sm font-bold font-cinzel text-white">{entry.name}</span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                      entry.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : entry.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {entry.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  &ldquo;{entry.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {entry.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(entry.id, 'approved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>APPROVE</span>
                  </button>
                )}

                {entry.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(entry.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>REJECT</span>
                  </button>
                )}

                <button
                  onClick={() => setDeleteTargetId(entry.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Guestbook Message"
        message="Are you sure you want to permanently delete this fan reflection?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
