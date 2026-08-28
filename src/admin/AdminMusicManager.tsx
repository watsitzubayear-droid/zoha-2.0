import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Song } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { ImageDropzone } from './ImageDropzone';
import {
  Music,
  Plus,
  Trash2,
  Edit2,
  Play,
  Pause,
  Search,
  Disc3,
  Sparkles,
  X,
  FileText,
} from 'lucide-react';

export const AdminMusicManager: React.FC = () => {
  const { data, addSong, updateSong, deleteSong, playSong, audioState, showToast } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    artist: 'ZOHA',
    coverUrl: '',
    audioUrl: '',
    genre: 'Cinematic Ambient',
    releaseDate: '2026',
    duration: '3:45',
    description: '',
    lyrics: '',
    plays: 0,
    featured: false,
    published: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      artist: 'ZOHA',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      audioUrl: 'https://cdn.freesound.org/previews/568/568393_11861866-lq.mp3',
      genre: 'Cinematic Ambient',
      releaseDate: '2026',
      duration: '3:45',
      description: '',
      lyrics: '',
      plays: 0,
      featured: false,
      published: true,
    });
    setEditingSong(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (s: Song) => {
    setFormData({
      title: s.title,
      artist: s.artist || 'ZOHA',
      coverUrl: s.coverUrl,
      audioUrl: s.audioUrl,
      genre: s.genre,
      releaseDate: s.releaseDate,
      duration: s.duration,
      description: s.description,
      lyrics: s.lyrics || '',
      plays: s.plays || 0,
      featured: s.featured || false,
      published: s.published,
    });
    setEditingSong(s);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audioUrl) {
      showToast('Please provide a song title and audio URL', 'error');
      return;
    }

    if (editingSong) {
      await updateSong(editingSong.id, formData);
      showToast(`Track "${formData.title}" updated.`);
    } else {
      await addSong({
        ...formData,
        order: (data?.songs.length || 0) + 1,
        createdAt: new Date().toISOString(),
      });
      showToast(`Track "${formData.title}" added to Music Catalog.`);
    }

    setIsCreating(false);
    setEditingSong(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteSong(deleteTargetId);
      showToast('Track deleted.');
      setDeleteTargetId(null);
    }
  };

  const songs = data?.songs || [];
  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
            <Music className="w-6 h-6 text-amber-400" />
            <span>MUSIC & AUDIO MANAGER</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage audio tracks, cover artwork, acoustic fingerstyle sessions, and song lyrics.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>UPLOAD / ADD NEW TRACK</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tracks by title, genre..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Songs Table / Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSongs.map((song) => {
          const isCurrent = audioState.currentSong?.id === song.id;
          const isPlaying = isCurrent && audioState.isPlaying;

          return (
            <div
              key={song.id}
              className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between shadow-lg ${
                isCurrent ? 'border-amber-500/80 bg-amber-950/20' : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  {/* Cover */}
                  <div
                    className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-black cursor-pointer group"
                    onClick={() => playSong(song)}
                  >
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                      {song.genre}
                    </span>
                    <h3 className="text-base font-bold font-cinzel text-white truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-slate-400">{song.duration} • {song.releaseDate}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{song.description}</p>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      song.published ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-[11px] text-slate-400">
                    {song.published ? 'Published' : 'Hidden'}
                  </span>
                  {song.featured && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black text-[9px] font-black uppercase">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => playSong(song)}
                    className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors"
                    title={isPlaying ? 'Pause' : 'Play Track'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(song)}
                    className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit Song"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(song.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                    title="Delete Song"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal Form */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsCreating(false)}
          />

          <div className="relative w-full max-w-2xl bg-[#090c1f] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h3 className="text-xl font-bold font-cinzel text-white">
                {editingSong ? 'EDIT MUSIC TRACK' : 'ADD NEW AUDIO TRACK'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Whispers of the Horizon"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Genre / Style *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Acoustic Ambient, Cinematic, Fingerstyle..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Audio Stream URL (.mp3 / CDN link) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <ImageDropzone
                  label="Track Album Artwork / Cover"
                  value={formData.coverUrl}
                  onChange={(url) => setFormData({ ...formData, coverUrl: url })}
                  description="Drag & drop high-res album cover or single artwork"
                  aspectRatio="square"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Duration (e.g. 3:45)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Release Year / Date
                  </label>
                  <input
                    type="text"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Track Description & Creative Context
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Inspiration behind chords, tuning, or atmosphere..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Song Lyrics
                </label>
                <textarea
                  rows={4}
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  placeholder="Paste lyrical verses and choruses..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Mark as Homepage Featured Track</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Published (Visible to Visitors)</span>
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
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {editingSong ? 'SAVE TRACK' : 'CREATE TRACK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Audio Track"
        message="Are you sure you want to delete this track from the music catalog?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
