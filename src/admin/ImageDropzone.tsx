import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Link as LinkIcon,
  Check,
  Eye,
  AlertCircle,
  FileImage,
  Sparkles,
} from 'lucide-react';

interface ImageDropzoneProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'auto';
  placeholder?: string;
  required?: boolean;
}

const PRESET_SAMPLE_IMAGES = [
  {
    name: 'Concert Stage Gold',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Acoustic Guitar Moody',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Studio Neon Violet',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Artist Silhouette Fog',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Atmospheric Glow',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
  },
];

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  label = 'Image Asset',
  value,
  onChange,
  description = 'Drag & drop high-res image here, or browse from files',
  aspectRatio = 'auto',
  placeholder = 'https://...',
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<'drop' | 'url'>('drop');
  const [urlInput, setUrlInput] = useState(value || '');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
    });
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        setUrlInput(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        processFile(file);
      }
    },
    [onChange]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPreviewError(false);
      setFileInfo(null);
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setFileInfo(null);
    setPreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url: string, name: string) => {
    onChange(url);
    setUrlInput(url);
    setFileInfo({ name, size: 'Cloud Preset' });
    setPreviewError(false);
    setShowPresets(false);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[240px]';
      case 'video':
        return 'aspect-video max-w-[360px]';
      case 'portrait':
        return 'aspect-[3/4] max-w-[220px]';
      case 'wide':
        return 'aspect-[21/9] max-w-[420px]';
      default:
        return 'max-h-56 max-w-sm';
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Label and mode switchers */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputMode('drop')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
              inputMode === 'drop'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Drag & Drop File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
              inputMode === 'url'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Image Link / URL
          </button>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/30 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Preset Picker Dropdown */}
      {showPresets && (
        <div className="p-3 rounded-2xl bg-[#090b1c] border border-purple-500/30 shadow-xl grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in fade-in zoom-in-95">
          {PRESET_SAMPLE_IMAGES.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleSelectPreset(p.url, p.name)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 hover:bg-purple-950/50 border border-white/5 hover:border-purple-400/40 text-left transition-all group cursor-pointer"
            >
              <img
                src={p.url}
                alt={p.name}
                className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <p className="text-[11px] font-medium text-slate-200 truncate">{p.name}</p>
                <span className="text-[9px] text-amber-400 font-mono">Use Preset</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* URL input tab */}
      {inputMode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                onChange(e.target.value);
                setPreviewError(false);
              }}
              placeholder={placeholder}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply</span>
          </button>
        </div>
      )}

      {/* Drag and Drop Zone Container */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10 scale-[1.01] shadow-[0_0_30px_rgba(245,158,11,0.25)]'
              : 'border-white/15 bg-black/30 hover:border-amber-400/50 hover:bg-white/[0.03]'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
              isDragging
                ? 'bg-amber-400 text-black animate-bounce'
                : 'bg-white/5 text-amber-400 group-hover:bg-amber-400 group-hover:text-black'
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-bold text-white mb-1 font-outfit">
            {isDragging ? 'Drop Image Here to Upload' : 'Drag and Drop Image Here'}
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">{description}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono group-hover:bg-amber-400 group-hover:text-black transition-colors">
              or Browse Files
            </span>
            <span className="text-[10px] text-slate-500 font-mono">PNG, JPG, WEBP, SVG</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border p-3 bg-black/50 overflow-hidden transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/50'
              : 'border-white/15'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Thumbnail Preview */}
            <div
              className={`relative rounded-xl overflow-hidden bg-black/80 border border-white/10 shrink-0 ${getAspectClass()}`}
            >
              {!previewError ? (
                <img
                  src={value}
                  alt="Uploaded Asset"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-28 flex flex-col items-center justify-center p-3 text-rose-400">
                  <AlertCircle className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-mono text-center">Invalid Image Source</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-amber-400 transition-colors"
                  title="View Full Size"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Asset Metadata & Controls */}
            <div className="flex-1 min-w-0 space-y-2 w-full">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileImage className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-xs font-semibold text-white truncate">
                    {fileInfo?.name || (value.startsWith('data:') ? 'Uploaded Image File' : 'Linked Image Asset')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {fileInfo?.size && (
                <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400">
                  Size: {fileInfo.size}
                </span>
              )}

              <p className="text-[11px] text-slate-400 line-clamp-1 font-mono break-all opacity-70">
                {value.startsWith('data:') ? 'Base64 Encoded Asset' : value}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                  <span>Replace (Drop or Click)</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Drag Overlay Hint */}
          {isDragging && (
            <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-xs flex items-center justify-center text-amber-300 font-bold text-xs font-mono uppercase tracking-wider">
              Drop new image to replace
            </div>
          )}
        </div>
      )}
    </div>
  );
};
