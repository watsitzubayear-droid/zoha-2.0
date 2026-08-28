import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Download, Upload, Cloud, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react';

export const AdminBackupRestore: React.FC = () => {
  const { data, refreshData, showToast } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Download backup
  const handleDownloadBackup = () => {
    if (!data) {
      showToast('No data to backup', 'error');
      return;
    }

    try {
      const backupData = {
        ...data,
        settings: {
          ...data.settings,
          adminPasscode: undefined,
        }
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `zoha-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast('Backup downloaded successfully! ✅');
    } catch (error) {
      showToast('Failed to create backup', 'error');
    }
  };

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      showToast('Please select a backup file first', 'error');
      return;
    }

    setIsUploading(true);

    try {
      const text = await selectedFile.text();
      const backupData = JSON.parse(text);

      if (!backupData.songs || !backupData.videos || !backupData.gallery) {
        throw new Error('Invalid backup file format');
      }

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: backupData }),
      });

      if (response.ok) {
        await refreshData();
        showToast('Backup restored successfully! 🎉');
        setSelectedFile(null);
        const fileInput = document.getElementById('backup-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error('Failed to restore backup');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to restore backup', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
        showToast(`File loaded: ${file.name}`);
      } else {
        showToast('Please upload a JSON file', 'error');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const totalItems = data ? {
    songs: data.songs.length,
    videos: data.videos.length,
    gallery: data.gallery.length,
    stories: data.stories.length,
    journey: data.journey.length,
    events: data.events.length,
    guestbook: data.guestbook.length,
    messages: data.messages?.length || 0,
  } : null;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
          <Cloud className="w-3.5 h-3.5" />
          BACKUP & RESTORE
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white">
          DATA BACKUP & RESTORE
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Download all your content as a backup, or restore from a previous backup.
        </p>
      </div>

      {/* Stats Summary */}
      {totalItems && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl glass-panel border border-white/10">
          <div className="text-center">
            <span className="text-lg font-bold text-amber-400">{totalItems.songs}</span>
            <p className="text-[10px] text-slate-400">Songs</p>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-cyan-400">{totalItems.videos}</span>
            <p className="text-[10px] text-slate-400">Videos</p>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-purple-400">{totalItems.gallery}</span>
            <p className="text-[10px] text-slate-400">Photos</p>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-pink-400">{totalItems.stories}</span>
            <p className="text-[10px] text-slate-400">Stories</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Download Section */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-amber-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-cinzel text-white">Download Backup</h3>
              <p className="text-xs text-slate-400">Export all your content as JSON</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Download a complete backup of all your songs, videos, photos, stories, journey milestones, events, guestbook entries, and messages.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your data is exported securely</span>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-102 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD BACKUP
          </button>
        </div>

        {/* Restore Section */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-cinzel text-white">Restore Backup</h3>
              <p className="text-xs text-slate-400">Upload a backup JSON file</p>
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300
              ${dragOver 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]' 
                : selectedFile 
                  ? 'border-emerald-400 bg-emerald-500/10' 
                  : 'border-white/10 hover:border-cyan-400/50'
              }
            `}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready to restore
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300">
                  Drag & drop your backup JSON file here
                </p>
                <p className="text-[10px] text-slate-500 mt-1">or click to browse</p>
                <input
                  id="backup-file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('backup-file-input')?.click()}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {selectedFile && (
            <button
              onClick={handleRestoreBackup}
              disabled={isUploading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-102 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  RESTORING...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  RESTORE BACKUP
                </>
              )}
            </button>
          )}

          <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>⚠️ Restoring will replace ALL current content</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 rounded-xl glass-panel border border-white/5">
        <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">What's Included in Backup</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400">
          <div>✓ All Songs & Audio</div>
          <div>✓ YouTube Videos</div>
          <div>✓ Gallery Photos</div>
          <div>✓ Stories & Chapters</div>
          <div>✓ Journey Timeline</div>
          <div>✓ Events & Tours</div>
          <div>✓ Guestbook Entries</div>
          <div>✓ Contact Messages</div>
          <div>✓ About Section</div>
          <div>✓ Hero Banner</div>
          <div>✓ Social Links</div>
          <div>✓ Website Settings</div>
        </div>
      </div>
    </div>
  );
};
