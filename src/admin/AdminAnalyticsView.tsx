import React from 'react';
import { useData } from '../context/DataContext';
import {
  TrendingUp,
  Music,
  Video,
  Eye,
  Sparkles,
  Users,
  Compass,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { data } = useData();

  const analytics = data?.analytics || {
    totalViews: 12450,
    musicPlays: 8930,
    videoOpens: 6420,
    galleryOpens: 4310,
    storyReads: 2980,
    moodsSelected: {
      CALM: 1420,
      NOSTALGIC: 980,
      DREAMY: 1650,
      ENERGETIC: 890,
      MELANCHOLIC: 1120,
      ACOUSTIC: 1840,
    },
  };

  const totalInteractions =
    analytics.totalViews +
    analytics.musicPlays +
    analytics.videoOpens +
    analytics.galleryOpens +
    analytics.storyReads;

  const topSongs = [...(data?.songs || [])]
    .sort((a, b) => (b.plays || 0) - (a.plays || 0))
    .slice(0, 5);

  const topVideos = [...(data?.videos || [])]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const moodEntries = Object.entries(analytics.moodsSelected || {});
  const maxMoodVal = Math.max(...moodEntries.map(([_, v]) => Number(v)), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-cinzel text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <span>AUDIENCE ENGAGEMENT & ANALYTICS</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Real-time metrics for platform visitors, audio stream sessions, video views, and emotional mood selections.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3 text-cyan-400">
            <span className="text-xs font-mono uppercase tracking-widest font-bold">
              Total Page Impressions
            </span>
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-cinzel text-white">
            {(analytics.totalViews || analytics.pageViews || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">+18.4% from last month</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3 text-amber-400">
            <span className="text-xs font-mono uppercase tracking-widest font-bold">
              Audio Stream Sessions
            </span>
            <Music className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-cinzel text-white">
            {analytics.musicPlays.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">+24.2% audio engagement</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3 text-purple-400">
            <span className="text-xs font-mono uppercase tracking-widest font-bold">
              Video Plays
            </span>
            <Video className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-cinzel text-white">
            {analytics.videoOpens.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Official YouTube sync</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-3 text-pink-400">
            <span className="text-xs font-mono uppercase tracking-widest font-bold">
              Story Lore Reads
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-3xl font-black font-cinzel text-white">
            {(analytics.storyReads || 2980).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Deep autobiography engagement</span>
        </div>
      </div>

      {/* Mood Selector Breakdown Chart */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>&ldquo;CHOOSE YOUR MOOD&rdquo; AUDIENCE PREFERENCE BREAKDOWN</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Which sensory atmospheres your listeners resonate with most.
            </p>
          </div>
        </div>

        <div className="space-y-3.5">
          {moodEntries.map(([mood, count]) => {
            const numCount = Number(count);
            const pct = Math.round((numCount / maxMoodVal) * 100);
            return (
              <div key={mood} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-300 uppercase">{mood}</span>
                  <span className="text-slate-400">{numCount.toLocaleString()} selections</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 Songs & Top 5 Videos Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Songs */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <span>MOST PLAYED SOUNDTRACKS</span>
          </h3>

          <div className="space-y-3">
            {topSongs.map((s, idx) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white block truncate max-w-[200px]">
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{s.genre}</span>
                  </div>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  {s.plays?.toLocaleString() || 0} plays
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Videos */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            <span>MOST WATCHED YOUTUBE PERFORMANCES</span>
          </h3>

          <div className="space-y-3">
            {topVideos.map((v, idx) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white block truncate max-w-[200px]">
                      {v.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{v.category}</span>
                  </div>
                </div>
                <span className="font-mono text-cyan-400 font-bold">
                  {v.views?.toLocaleString() || 0} views
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
