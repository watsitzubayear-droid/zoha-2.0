import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDatabase, saveDatabase } from './server/db';
import { DatabaseSchema, Song, Video, GalleryItem, Story, JourneyItem, EventItem, GuestbookEntry, ContactMessage } from './src/types';

const ADMIN_TOKEN = 'zoha_admin_auth_token_2026_secured';

function parseYoutubeVideoId(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();
  // Standard watch URL: youtube.com/watch?v=ID
  const matchWatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (matchWatch && matchWatch[1]) {
    return matchWatch[1];
  }
  // Shorts URL: youtube.com/shorts/ID
  const matchShorts = cleanUrl.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/i);
  if (matchShorts && matchShorts[1]) {
    return matchShorts[1];
  }
  // Direct 11 char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }
  return '';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get full database (Public returns all, or client filters published)
  app.get('/api/data', (req: Request, res: Response) => {
    try {
      const db = getDatabase();
      res.json(db);
    } catch (err) {
      console.error('Error fetching database:', err);
      res.status(500).json({ error: 'Failed to read database' });
    }
  });

  // YouTube Extract helper
  app.post('/api/youtube-extract', (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return;
    }
    const videoId = parseYoutubeVideoId(url);
    if (!videoId) {
      res.status(400).json({ error: 'Invalid YouTube URL or ID' });
      return;
    }

    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    res.json({
      videoId,
      thumbnail,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
    });
  });

  // Admin login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Default credentials: admin@zoha.com or zoharoza587@gmail.com, password: zoha or zoha2026
    const validEmails = ['admin@zoha.com', 'zoharoza587@gmail.com', 'zoha', 'admin'];
    const validPasswords = ['zoha2026', 'zoha', 'password', 'admin123'];

    if (
      validEmails.includes(String(email).trim().toLowerCase()) &&
      validPasswords.includes(String(password).trim())
    ) {
      res.json({
        success: true,
        token: ADMIN_TOKEN,
        user: { name: 'ZOHA', email: email || 'zoharoza587@gmail.com', role: 'admin' },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials. Use admin@zoha.com / zoha2026' });
    }
  });

  // Admin verify token
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes(ADMIN_TOKEN)) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  // Update a single section (hero, about, settings, featured, pressKit)
  app.post('/api/admin/update-section', (req: Request, res: Response) => {
    const { section, data } = req.body;
    if (!section || !data) {
      res.status(400).json({ error: 'Section name and data are required' });
      return;
    }

    const db = getDatabase();
    (db as any)[section] = data;
    const ok = saveDatabase(db);
    if (ok) {
      res.json({ success: true, section, data: (db as any)[section] });
    } else {
      res.status(500).json({ error: 'Failed to save section data' });
    }
  });

  // Save whole collection (reorder / batch update)
  app.post('/api/admin/collection/:name', (req: Request, res: Response) => {
    const { name } = req.params;
    const { items } = req.body;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Items must be an array' });
      return;
    }

    const db = getDatabase();
    if ((db as any)[name] !== undefined) {
      (db as any)[name] = items;
      saveDatabase(db);
      res.json({ success: true, items: (db as any)[name] });
    } else {
      res.status(404).json({ error: `Collection ${name} not found` });
    }
  });

  // Generic Item CRUD: Add / Update / Delete
  app.post('/api/admin/item/:collection', (req: Request, res: Response) => {
    const { collection } = req.params;
    const item = req.body;
    if (!item) {
      res.status(400).json({ error: 'Item data is required' });
      return;
    }

    const db = getDatabase();
    const list = (db as any)[collection];
    if (!Array.isArray(list)) {
      res.status(404).json({ error: `Collection ${collection} not found` });
      return;
    }

    if (!item.id) {
      item.id = `${collection.slice(0, 3)}-${Date.now()}`;
    }

    const existingIndex = list.findIndex((i: any) => i.id === item.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...item };
    } else {
      list.unshift(item);
    }

    saveDatabase(db);
    res.json({ success: true, item });
  });

  app.delete('/api/admin/item/:collection/:id', (req: Request, res: Response) => {
    const { collection, id } = req.params;
    const db = getDatabase();
    const list = (db as any)[collection];
    if (!Array.isArray(list)) {
      res.status(404).json({ error: `Collection ${collection} not found` });
      return;
    }

    (db as any)[collection] = list.filter((i: any) => i.id !== id);
    saveDatabase(db);
    res.json({ success: true, deletedId: id });
  });

  // Public Contact form submit
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    const db = getDatabase();
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject || 'General Inquiry').trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false,
      archived: false,
    };

    db.contactMessages.unshift(newMessage);
    saveDatabase(db);
    res.json({ success: true, message: 'Message sent successfully!' });
  });

  // Public Guestbook submit
  app.post('/api/guestbook', (req: Request, res: Response) => {
    const { name, message } = req.body;
    if (!name || !message) {
      res.status(400).json({ error: 'Name and message are required' });
      return;
    }

    const db = getDatabase();
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: String(name).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      status: 'pending', // Requires admin moderation
    };

    db.guestbook.unshift(newEntry);
    db.analytics.guestbookEntries = (db.analytics.guestbookEntries || 0) + 1;
    saveDatabase(db);
    res.json({ success: true, message: 'Message submitted for artist moderation! Thank you for the love.' });
  });

  // Admin Guestbook moderation
  app.post('/api/admin/guestbook/moderate', (req: Request, res: Response) => {
    const { id, status } = req.body;
    if (!id || !status) {
      res.status(400).json({ error: 'ID and status required' });
      return;
    }

    const db = getDatabase();
    const entry = db.guestbook.find((g) => g.id === id);
    if (entry) {
      entry.status = status;
      saveDatabase(db);
      res.json({ success: true, entry });
    } else {
      res.status(404).json({ error: 'Guestbook entry not found' });
    }
  });

  // Public Analytics event tracking
  app.post('/api/track-event', (req: Request, res: Response) => {
    const { type, meta } = req.body;
    const db = getDatabase();

    if (type === 'pageview') {
      db.analytics.pageViews = (db.analytics.pageViews || 0) + 1;
    } else if (type === 'video_open') {
      db.analytics.videoOpens = (db.analytics.videoOpens || 0) + 1;
      if (meta?.videoId) {
        const vid = db.videos.find((v) => v.id === meta.videoId || v.videoId === meta.videoId);
        if (vid) vid.views = (vid.views || 0) + 1;
      }
    } else if (type === 'music_play') {
      db.analytics.musicPlays = (db.analytics.musicPlays || 0) + 1;
      if (meta?.songId) {
        const song = db.songs.find((s) => s.id === meta.songId);
        if (song) song.plays = (song.plays || 0) + 1;
      }
    } else if (type === 'gallery_open') {
      db.analytics.galleryOpens = (db.analytics.galleryOpens || 0) + 1;
    } else if (type === 'mood_select') {
      const mood = String(meta?.mood || 'ACOUSTIC').toUpperCase();
      if (!db.analytics.moodSelections) db.analytics.moodSelections = {};
      db.analytics.moodSelections[mood] = (db.analytics.moodSelections[mood] || 0) + 1;
    }

    saveDatabase(db);
    res.json({ success: true });
  });

  // Admin Export / Backup
  app.get('/api/admin/export', (req: Request, res: Response) => {
    const db = getDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="zoha-platform-backup.json"');
    res.send(JSON.stringify(db, null, 2));
  });

  // Admin Import / Restore
  app.post('/api/admin/import', (req: Request, res: Response) => {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Invalid database payload' });
      return;
    }
    const ok = saveDatabase(data as DatabaseSchema);
    if (ok) {
      res.json({ success: true, message: 'Database restored successfully' });
    } else {
      res.status(500).json({ error: 'Failed to write restored database' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZOHA 2.0 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
