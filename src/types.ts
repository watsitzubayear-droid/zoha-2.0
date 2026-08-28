export interface HeroConfig {
  title: string;
  subtitle: string;
  tagline?: string;
  taglines?: string;
  quote?: string;
  description: string;
  coverImageUrl?: string;
  portraitUrl?: string;
  backgroundVideoUrl?: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  ctaTertiaryText?: string;
  ctaTertiaryLink?: string;
  badgeText?: string;
  darkOverlayOpacity?: number;
  overlayStrength?: number;
  alignment?: 'center' | 'left';
}

export interface AboutStats {
  songs?: string;
  videos?: string;
  photos?: string;
  performances?: string;
  projects?: string;
  yearsActive?: number;
  tracksReleased?: number;
  liveShows?: number;
  countriesReached?: number;
}

export interface AboutConfig {
  name: string;
  artistTitle?: string;
  shortBio?: string;
  bio?: string;
  creativePhilosophy?: string;
  portraitUrl: string;
  signatureText?: string;
  signature?: string;
  roles?: string[];
  instruments?: string[];
  stats: AboutStats;
  story?: string;
  musicPhilosophy?: string;
  inspiration?: string;
  dreams?: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  genre: string;
  releaseDate?: string;
  releaseYear?: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  description: string;
  lyrics?: string;
  featured?: boolean;
  published: boolean;
  plays?: number;
  order?: number;
}

export type VideoCategory =
  | 'MUSIC'
  | 'COVER'
  | 'LIVE'
  | 'ACOUSTIC'
  | 'SHORTS'
  | 'VLOG'
  | 'BEHIND THE SCENES'
  | 'Original Song'
  | 'Live Performance'
  | 'Guitar Session'
  | 'Studio Session'
  | 'Acoustic Solo'
  | 'OTHER';

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId?: string;
  category: VideoCategory | string;
  thumbnail: string;
  description: string;
  featured?: boolean;
  published: boolean;
  duration?: string;
  views?: number;
  order?: number;
}

export type GalleryCategory =
  | 'Portraits'
  | 'Performances'
  | 'Studio'
  | 'Travel'
  | 'Behind the Scenes'
  | 'Artwork'
  | 'Memories';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  imageUrl: string;
  highResUrl?: string;
  featured?: boolean;
  published: boolean;
  likes?: number;
  order?: number;
  createdAt?: string;
}

export interface Story {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage: string;
  youtubeUrl?: string;
  audioTrackId?: string;
  published: boolean;
  readTime: string;
  order?: number;
  createdAt?: string;
}

export interface JourneyItem {
  id: string;
  year: string;
  date?: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  published: boolean;
  order?: number;
}

export type EventStatus = 'UPCOMING' | 'SOLD_OUT' | 'COMPLETED';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  venue: string;
  description: string;
  ticketUrl: string;
  status: EventStatus;
  published: boolean;
  image?: string;
  order?: number;
}

export type TourEvent = EventItem;

export interface FeaturedConfig {
  songId: string;
  videoId: string;
  photoId: string;
  storyId: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived?: boolean;
}

export interface PressKitConfig {
  biography: string;
  downloadableProfileUrl: string;
  hiResPhotos: string[];
  stageRiderUrl: string;
  contactEmail: string;
  bookingPhone: string;
  pressQuotes: { quote: string; source: string }[];
}

export type ThemePreset =
  | 'midnight-gold'
  | 'neon-dream'
  | 'purple-cosmos'
  | 'cyber-blue'
  | 'black-gold'
  | 'MIDNIGHT_GOLD'
  | 'NEON_DREAM'
  | 'PURPLE_COSMOS'
  | 'CYBER_BLUE'
  | 'BLACK_GOLD';

export interface SiteSettings {
  siteTitle: string;
  artistName: string;
  tagline: string;
  metaDescription?: string;
  themePreset: ThemePreset;
  accentColor?: string;
  contactEmail: string;
  adminPasscode?: string;
  socialLinks: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    spotify?: string;
    soundcloud?: string;
  };
  customCursorEnabled?: boolean;
  ambientSoundEnabled?: boolean;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
}

export interface AnalyticsData {
  totalViews?: number;
  pageViews?: number;
  videoOpens: number;
  galleryOpens: number;
  musicPlays: number;
  storyReads?: number;
  guestbookEntries?: number;
  moodsSelected?: Record<string, number>;
  moodSelections?: Record<string, number>;
  recentActivities?: { id: string; action: string; timestamp: string }[];
}

export interface DatabaseSchema {
  hero: HeroConfig;
  about: AboutConfig;
  songs: Song[];
  videos: Video[];
  gallery: GalleryItem[];
  stories: Story[];
  journey: JourneyItem[];
  events: EventItem[];
  featured: FeaturedConfig;
  guestbook: GuestbookEntry[];
  contactMessages?: ContactMessage[];
  messages?: ContactMessage[];
  pressKit: PressKitConfig;
  settings: SiteSettings;
  analytics: AnalyticsData;
}
