import React, { useState } from 'react';
import { ScheduledPost, Platform } from '../types';
import {
  Calendar,
  Clock,
  Send,
  Trash2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Filter,
  Eye,
  ArrowUpRight
} from 'lucide-react';

interface ScheduleQueueProps {
  posts: ScheduledPost[];
  onPublishNow: (id: string) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
}

export const ScheduleQueue: React.FC<ScheduleQueueProps> = ({
  posts,
  onPublishNow,
  onDeletePost
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || post.platforms.includes(filterPlatform as Platform);
    return matchesStatus && matchesPlatform;
  });

  const handlePublishClick = async (id: string) => {
    setPublishingId(id);
    try {
      await onPublishNow(id);
    } finally {
      setPublishingId(null);
    }
  };

  const statusBadges: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Terjadwal', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    published: { label: 'Dipublikasikan', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    publishing: { label: 'Memproses...', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    draft: { label: 'Draft', color: 'text-slate-400 bg-slate-800 border-slate-700' }
  };

  return (
    <div className="space-y-5">
      {/* Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-200">Filter Antrean:</span>
          
          <div className="flex items-center gap-1">
            {['all', 'scheduled', 'published'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'Semua' : st === 'scheduled' ? 'Terjadwal' : 'Dipublikasikan'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Platform:</span>
          <select
            value={filterPlatform}
            onChange={e => setFilterPlatform(e.target.value)}
            className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-amber-500 text-xs"
          >
            <option value="all">Semua Platform</option>
            <option value="twitter">X (Twitter)</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="pinterest">Pinterest</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
      </div>

      {/* Queue List */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
          <p className="text-sm text-slate-400">Tidak ada postingan dalam antrean.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map(post => {
            const scheduledDate = new Date(post.scheduledTime);
            const isPast = scheduledDate.getTime() < Date.now();
            const badge = statusBadges[post.status] || statusBadges.scheduled;

            return (
              <div
                key={post.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Product & Campaign Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <img
                    src={post.productImageUrl}
                    alt={post.productTitle}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="font-semibold text-xs text-slate-200 truncate">
                        {post.campaignName}
                      </span>
                      {post.aiOptimized && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          <Sparkles className="w-2.5 h-2.5" /> AI Slot
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs text-slate-300 font-medium truncate">
                      {post.productTitle}
                    </h4>

                    {/* Platforms and scheduled time */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1.5 font-mono">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span className="tabular-nums">
                          {scheduledDate.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })} · {scheduledDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </span>

                      <span aria-hidden="true">·</span>

                      <div className="flex items-center gap-1">
                        {post.platforms.map(p => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase text-[9px] font-bold"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      {post.status === 'published' && post.metrics.clicks > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-400">
                            {post.metrics.clicks} Klik · CTR {post.metrics.ctr}%
                          </span>
                        </>
                      )}
                    </div>

                    {post.aiReasoning && (
                      <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-1 italic">
                        "{post.aiReasoning}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {post.status === 'scheduled' && (
                    <button
                      onClick={() => handlePublishClick(post.id)}
                      disabled={publishingId === post.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
                      title="Kirim ke media sosial sekarang"
                    >
                      <Send className="w-3 h-3 fill-slate-950" />
                      <span>{publishingId === post.id ? 'Memproses...' : 'Posting Sekarang'}</span>
                    </button>
                  )}

                  {post.status === 'published' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terbit
                    </span>
                  )}

                  <a
                    href={post.affiliateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Buka Link Produk Amazon"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onDeletePost(post.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Hapus Postingan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
