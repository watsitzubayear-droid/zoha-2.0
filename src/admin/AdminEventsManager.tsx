import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { TourEvent } from '../types';
import { ConfirmModal } from './ConfirmModal';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Ticket,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

export const AdminEventsManager: React.FC = () => {
  const { data, addEvent, updateEvent, deleteEvent, showToast } = useData();

  const [editingEvent, setEditingEvent] = useState<TourEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    date: '2026-10-15',
    time: '8:00 PM',
    venue: '',
    location: '',
    ticketUrl: 'https://tickets.example.com',
    status: 'UPCOMING' as 'UPCOMING' | 'SOLD_OUT' | 'COMPLETED',
    description: '',
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      date: '2026-10-15',
      time: '8:00 PM',
      venue: '',
      location: '',
      ticketUrl: 'https://tickets.example.com',
      status: 'UPCOMING',
      description: '',
      published: true,
    });
    setEditingEvent(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (e: TourEvent) => {
    setFormData({
      title: e.title,
      date: e.date,
      time: e.time || '8:00 PM',
      venue: e.venue,
      location: e.location,
      ticketUrl: e.ticketUrl,
      status: e.status,
      description: e.description,
      published: e.published,
    });
    setEditingEvent(e);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      showToast('Please provide a title, date, and venue', 'error');
      return;
    }

    if (editingEvent) {
      await updateEvent(editingEvent.id, formData);
      showToast(`Concert "${formData.title}" updated.`);
    } else {
      await addEvent({
        ...formData,
        order: (data?.events.length || 0) + 1,
      });
      showToast(`Concert "${formData.title}" scheduled.`);
    }

    setIsCreating(false);
    setEditingEvent(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteEvent(deleteTargetId);
      showToast('Event removed.');
      setDeleteTargetId(null);
    }
  };

  const events = data?.events || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>TOUR DATES & EVENTS MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Schedule live performances, acoustic intimate gigs, ticket links, and venue status.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>SCHEDULE NEW TOUR DATE</span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center shrink-0 text-center font-mono">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">
                  {new Date(event.date).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-xl font-bold text-white leading-none">
                  {new Date(event.date).getDate()}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      event.status === 'SOLD_OUT'
                        ? 'bg-rose-500/20 text-rose-300'
                        : event.status === 'COMPLETED'
                        ? 'bg-slate-500/20 text-slate-400'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {event.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• {event.time}</span>
                </div>
                <h3 className="text-base font-bold font-cinzel text-white">{event.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {event.venue}, {event.location}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  event.published ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              <button
                onClick={() => handleOpenEdit(event)}
                className="p-2 text-slate-400 hover:text-emerald-300 hover:bg-white/5 rounded-lg transition-colors"
                title="Edit Event"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTargetId(event.id)}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editor */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#090c1f] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingEvent ? 'EDIT TOUR DATE' : 'SCHEDULE NEW TOUR DATE'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Concert / Festival Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. ZOHA Live at Symphony Hall"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Time (e.g. 8:00 PM)
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Ticket Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'UPCOMING' | 'SOLD_OUT' | 'COMPLETED',
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#0d1024] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  >
                    <option value="UPCOMING">Upcoming / On Sale</option>
                    <option value="SOLD_OUT">Sold Out</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Royal Albert Hall"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    City & Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. London, UK"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Ticket Purchase URL
                </label>
                <input
                  type="text"
                  value={formData.ticketUrl}
                  onChange={(e) => setFormData({ ...formData, ticketUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Concert Description / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Special acoustic sets, guest artists, VIP passes..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Published (Visible on Tour Dates page)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingEvent ? 'SAVE EVENT' : 'SCHEDULE EVENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Tour Date"
        message="Are you sure you want to remove this concert from the tour schedule?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
