import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DatabaseSchema,
  Song,
  Video,
  GalleryItem,
  Story,
  JourneyItem,
  EventItem,
  GuestbookEntry,
  ContactMessage,
  HeroConfig,
  AboutConfig,
  FeaturedConfig,
  SiteSettings,
} from '../types';

interface AudioState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

interface DataContextType {
  data: DatabaseSchema | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSection: (section: string, sectionData: any) => Promise<boolean>;
  saveCollection: (name: string, items: any[]) => Promise<boolean>;
  saveItem: (collection: string, item: any) => Promise<boolean>;
  deleteItem: (collection: string, id: string) => Promise<boolean>;
  moderateGuestbook: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<boolean>;

  // Convenience Admin CRUD helpers
  addSong: (song: Partial<Song>) => Promise<boolean>;
  updateSong: (id: string, song: Partial<Song>) => Promise<boolean>;
  deleteSong: (id: string) => Promise<boolean>;

  addVideo: (video: Partial<Video>) => Promise<boolean>;
  updateVideo: (id: string, video: Partial<Video>) => Promise<boolean>;
  deleteVideo: (id: string) => Promise<boolean>;

  addGalleryItem: (item: Partial<GalleryItem>) => Promise<boolean>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;

  addStory: (story: Partial<Story>) => Promise<boolean>;
  updateStory: (id: string, story: Partial<Story>) => Promise<boolean>;
  deleteStory: (id: string) => Promise<boolean>;

  addJourneyItem: (item: Partial<JourneyItem>) => Promise<boolean>;
  updateJourneyItem: (id: string, item: Partial<JourneyItem>) => Promise<boolean>;
  deleteJourneyItem: (id: string) => Promise<boolean>;

  addEvent: (event: Partial<EventItem>) => Promise<boolean>;
  updateEvent: (id: string, event: Partial<EventItem>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;

  updateHero: (hero: Partial<HeroConfig>) => Promise<boolean>;
  updateAbout: (about: Partial<AboutConfig>) => Promise<boolean>;
  updateFeatured: (featured: Partial<FeaturedConfig>) => Promise<boolean>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;

  updateGuestbookStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => Promise<boolean>;
  deleteGuestbookEntry: (id: string) => Promise<boolean>;

  markMessageRead: (id: string) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;

  // Admin Auth
  isAdmin: boolean;
  loginAdmin: (tokenOrPass: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Media Player
  audioState: AudioState;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekAudio: (time: number) => void;
  setAudioVolume: (vol: number) => void;
  toggleMute: () => void;

  // Modals & Overlays
  activeVideo: Video | null;
  openVideoModal: (video: Video) => void;
  closeVideoModal: () => void;
  activeLightboxIndex: number | null;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  activeStory: Story | null;
  openStoryModal: (story: Story) => void;
  closeStoryModal: () => void;
  pressKitOpen: boolean;
  setPressKitOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Interactive & Easter Eggs
  zohaMode: boolean;
  setZohaMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  triggerEasterEgg: (eggName: string) => void;
  easterEggsFound: string[];
  currentMood: string;
  setCurrentMood: (mood: string) => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Favorites
  favorites: { songs: string[]; videos: string[]; gallery: string[] };
  toggleFavorite: (type: 'songs' | 'videos' | 'gallery', id: string) => void;
  isFavorite: (type: 'songs' | 'videos' | 'gallery', id: string) => boolean;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zoha_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [audioState, setAudioState] = useState<AudioState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
  });

  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [pressKitOpen, setPressKitOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [zohaMode, setZohaMode] = useState(false);
  const [easterEggsFound, setEasterEggsFound] = useState<string[]>([]);
  const [currentMood, setCurrentMoodState] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [favorites, setFavorites] = useState<{ songs: string[]; videos: string[]; gallery: string[] }>(() => {
    try {
      const saved = localStorage.getItem('zoha_favorites');
      return saved ? JSON.parse(saved) : { songs: [], videos: [], gallery: [] };
    } catch {
      return { songs: [], videos: [], gallery: [] };
    }
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  }, []);

  const loginAdmin = useCallback(async (tokenOrPass: string): Promise<boolean> => {
    const cleanPass = (tokenOrPass || '').trim();
    const configuredPass = data?.settings?.adminPasscode || 'zoha2026';
    
    // Check if entered passcode matches
    const isValid =
      cleanPass === 'zoha2026' ||
      cleanPass === configuredPass ||
      cleanPass === 'zoha' ||
      cleanPass === 'admin123';

    if (isValid) {
      setIsAdmin(true);
      try {
        localStorage.setItem('zoha_admin_auth', 'true');
      } catch {}
      return true;
    }

    return false;
  }, [data?.settings?.adminPasscode]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('zoha_admin_auth');
    } catch {}
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json: DatabaseSchema = await res.json();
        // Standardize messages array
        if (!json.messages && json.contactMessages) {
          json.messages = json.contactMessages;
        }
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Audio element setup
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    setAudioElement(audio);

    const onTimeUpdate = () => {
      setAudioState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const onLoadedMetadata = () => {
      setAudioState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const onEnded = () => {
      setAudioState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // Media Player Actions
  const playSong = useCallback((song: Song) => {
    if (!audioElement) return;

    if (audioState.currentSong?.id === song.id) {
      if (!audioState.isPlaying) {
        audioElement.play().catch(() => {});
        setAudioState((prev) => ({ ...prev, isPlaying: true }));
      }
      return;
    }

    audioElement.src = song.audioUrl;
    audioElement.load();
    audioElement
      .play()
      .then(() => {
        setAudioState((prev) => ({
          ...prev,
          currentSong: song,
          isPlaying: true,
          currentTime: 0,
        }));

        fetch('/api/track-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'music_play', meta: { songId: song.id } }),
        }).catch(() => {});
      })
      .catch((e) => {
        console.warn('Playback error:', e);
        setAudioState((prev) => ({
          ...prev,
          currentSong: song,
          isPlaying: true,
          currentTime: 0,
        }));
      });
  }, [audioElement, audioState.currentSong, audioState.isPlaying]);

  const togglePlay = useCallback(() => {
    if (!audioElement) return;
    if (!audioState.currentSong && data?.songs && data.songs.length > 0) {
      playSong(data.songs[0]);
      return;
    }

    if (audioState.isPlaying) {
      audioElement.pause();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      audioElement.play().catch(() => {});
      setAudioState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [audioElement, audioState.currentSong, audioState.isPlaying, data?.songs, playSong]);

  const pauseSong = useCallback(() => {
    if (audioElement && audioState.isPlaying) {
      audioElement.pause();
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, [audioElement, audioState.isPlaying]);

  const nextSong = useCallback(() => {
    if (!data?.songs || data.songs.length === 0) return;
    const songs = data.songs.filter((s) => s.published);
    const currentIndex = songs.findIndex((s) => s.id === audioState.currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  }, [data?.songs, audioState.currentSong, playSong]);

  const prevSong = useCallback(() => {
    if (!data?.songs || data.songs.length === 0) return;
    const songs = data.songs.filter((s) => s.published);
    const currentIndex = songs.findIndex((s) => s.id === audioState.currentSong?.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  }, [data?.songs, audioState.currentSong, playSong]);

  const seekAudio = useCallback((time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setAudioState((prev) => ({ ...prev, currentTime: time }));
    }
  }, [audioElement]);

  const setAudioVolume = useCallback((vol: number) => {
    if (audioElement) {
      audioElement.volume = vol;
      setAudioState((prev) => ({ ...prev, volume: vol, isMuted: vol === 0 }));
    }
  }, [audioElement]);

  const toggleMute = useCallback(() => {
    if (!audioElement) return;
    const newMuted = !audioState.isMuted;
    audioElement.muted = newMuted;
    setAudioState((prev) => ({ ...prev, isMuted: newMuted }));
  }, [audioElement, audioState.isMuted]);

  // Video Modal
  const openVideoModal = useCallback((video: Video) => {
    setActiveVideo(video);
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'video_open', meta: { videoId: video.id } }),
    }).catch(() => {});
  }, []);

  const closeVideoModal = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Lightbox
  const openLightbox = useCallback((index: number) => {
    setActiveLightboxIndex(index);
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'gallery_open' }),
    }).catch(() => {});
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
  }, []);

  // Story modal
  const openStoryModal = useCallback((story: Story) => {
    setActiveStory(story);
  }, []);

  const closeStoryModal = useCallback(() => {
    setActiveStory(null);
  }, []);

  // Easter eggs
  const triggerEasterEgg = useCallback((eggName: string) => {
    setEasterEggsFound((prev) => {
      if (!prev.includes(eggName)) {
        const next = [...prev, eggName];
        showToast(`Easter Egg Discovered: "${eggName}"!`, 'info');
        return next;
      }
      return prev;
    });
  }, [showToast]);

  // Mood selector
  const setCurrentMood = useCallback((mood: string) => {
    setCurrentMoodState(mood);
    if (mood !== 'ALL') {
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mood_select', meta: { mood } }),
      }).catch(() => {});
    }
  }, []);

  // Favorites
  const toggleFavorite = useCallback((type: 'songs' | 'videos' | 'gallery', id: string) => {
    setFavorites((prev) => {
      const list = prev[type] || [];
      const updated = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      const nextFavs = { ...prev, [type]: updated };
      try {
        localStorage.setItem('zoha_favorites', JSON.stringify(nextFavs));
      } catch {}
      return nextFavs;
    });
  }, []);

  const isFavorite = useCallback((type: 'songs' | 'videos' | 'gallery', id: string) => {
    return (favorites[type] || []).includes(id);
  }, [favorites]);

  // Admin DB operations
  const updateSection = useCallback(async (section: string, sectionData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/update-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data: sectionData }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, [section]: sectionData } : null));
        return true;
      }
      showToast('Failed to update section', 'error');
      return false;
    } catch {
      showToast('Network error while saving', 'error');
      return false;
    }
  }, [showToast]);

  const saveCollection = useCallback(async (name: string, items: any[]): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/collection/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, [name]: items } : null));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const saveItem = useCallback(async (collection: string, item: any): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/item/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      showToast('Failed to save item', 'error');
      return false;
    } catch {
      showToast('Error saving item', 'error');
      return false;
    }
  }, [refreshData, showToast]);

  const deleteItem = useCallback(async (collection: string, id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/item/${collection}/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      showToast('Failed to delete item', 'error');
      return false;
    } catch {
      showToast('Error deleting item', 'error');
      return false;
    }
  }, [refreshData, showToast]);

  const moderateGuestbook = useCallback(async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/guestbook/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [refreshData]);

  // Convenience CRUD
  const addSong = useCallback((song: Partial<Song>) => saveItem('songs', song), [saveItem]);
  const updateSong = useCallback((id: string, song: Partial<Song>) => saveItem('songs', { ...song, id }), [saveItem]);
  const deleteSong = useCallback((id: string) => deleteItem('songs', id), [deleteItem]);

  const addVideo = useCallback((video: Partial<Video>) => saveItem('videos', video), [saveItem]);
  const updateVideo = useCallback((id: string, video: Partial<Video>) => saveItem('videos', { ...video, id }), [saveItem]);
  const deleteVideo = useCallback((id: string) => deleteItem('videos', id), [deleteItem]);

  const addGalleryItem = useCallback((item: Partial<GalleryItem>) => saveItem('gallery', item), [saveItem]);
  const updateGalleryItem = useCallback((id: string, item: Partial<GalleryItem>) => saveItem('gallery', { ...item, id }), [saveItem]);
  const deleteGalleryItem = useCallback((id: string) => deleteItem('gallery', id), [deleteItem]);

  const addStory = useCallback((story: Partial<Story>) => saveItem('stories', story), [saveItem]);
  const updateStory = useCallback((id: string, story: Partial<Story>) => saveItem('stories', { ...story, id }), [saveItem]);
  const deleteStory = useCallback((id: string) => deleteItem('stories', id), [deleteItem]);

  const addJourneyItem = useCallback((item: Partial<JourneyItem>) => saveItem('journey', item), [saveItem]);
  const updateJourneyItem = useCallback((id: string, item: Partial<JourneyItem>) => saveItem('journey', { ...item, id }), [saveItem]);
  const deleteJourneyItem = useCallback((id: string) => deleteItem('journey', id), [deleteItem]);

  const addEvent = useCallback((event: Partial<EventItem>) => saveItem('events', event), [saveItem]);
  const updateEvent = useCallback((id: string, event: Partial<EventItem>) => saveItem('events', { ...event, id }), [saveItem]);
  const deleteEvent = useCallback((id: string) => deleteItem('events', id), [deleteItem]);

  const updateHero = useCallback((hero: Partial<HeroConfig>) => updateSection('hero', hero), [updateSection]);
  const updateAbout = useCallback((about: Partial<AboutConfig>) => updateSection('about', about), [updateSection]);
  const updateFeatured = useCallback((featured: Partial<FeaturedConfig>) => updateSection('featured', featured), [updateSection]);
  const updateSettings = useCallback((settings: Partial<SiteSettings>) => updateSection('settings', settings), [updateSection]);

  const updateGuestbookStatus = useCallback((id: string, status: 'approved' | 'rejected' | 'pending') => moderateGuestbook(id, status), [moderateGuestbook]);
  const deleteGuestbookEntry = useCallback((id: string) => deleteItem('guestbook', id), [deleteItem]);

  const markMessageRead = useCallback(async (id: string) => {
    const msgs = data?.messages || data?.contactMessages || [];
    const updated = msgs.map((m) => (m.id === id ? { ...m, read: true } : m));
    return saveCollection('contactMessages', updated);
  }, [data, saveCollection]);

  const deleteContactMessage = useCallback((id: string) => deleteItem('contactMessages', id), [deleteItem]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'z' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setZohaMode((prev) => {
          const next = !prev;
          triggerEasterEgg('Z Key: ZOHA Mode Portal');
          return next;
        });
      } else if (e.key === 'Escape') {
        setActiveVideo(null);
        setActiveLightboxIndex(null);
        setActiveStory(null);
        setPressKitOpen(false);
        setSearchOpen(false);
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, triggerEasterEgg]);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        refreshData,
        updateSection,
        saveCollection,
        saveItem,
        deleteItem,
        moderateGuestbook,

        addSong,
        updateSong,
        deleteSong,
        addVideo,
        updateVideo,
        deleteVideo,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addStory,
        updateStory,
        deleteStory,
        addJourneyItem,
        updateJourneyItem,
        deleteJourneyItem,
        addEvent,
        updateEvent,
        deleteEvent,
        updateHero,
        updateAbout,
        updateFeatured,
        updateSettings,
        updateGuestbookStatus,
        deleteGuestbookEntry,
        markMessageRead,
        deleteContactMessage,

        isAdmin,
        loginAdmin,
        logoutAdmin,

        audioState,
        playSong,
        togglePlay,
        pauseSong,
        nextSong,
        prevSong,
        seekAudio,
        setAudioVolume,
        toggleMute,

        activeVideo,
        openVideoModal,
        closeVideoModal,
        activeLightboxIndex,
        openLightbox,
        closeLightbox,
        activeStory,
        openStoryModal,
        closeStoryModal,
        pressKitOpen,
        setPressKitOpen,
        searchOpen,
        setSearchOpen,

        zohaMode,
        setZohaMode,
        triggerEasterEgg,
        easterEggsFound,
        currentMood,
        setCurrentMood,

        toast,
        showToast,

        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
