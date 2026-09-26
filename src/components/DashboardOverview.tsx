import React from 'react';
import { AmazonProduct, ScheduledPost, AnalyticsSummary } from '../types';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Send,
  ShoppingBag,
  MousePointerClick,
  CheckCircle2,
  Zap,
  ExternalLink
} from 'lucide-react';

interface DashboardOverviewProps {
  products: AmazonProduct[];
  posts: ScheduledPost[];
  summary: AnalyticsSummary;
  onNavigateTab: (tab: string) => void;
  onSelectProductForPost: (product: AmazonProduct) => void;
  onPublishNow: (id: string) => Promise<void>;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  products,
  posts,
  summary,
  onNavigateTab,
  onSelectProductForPost,
  onPublishNow
}) => {
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="space-y-6">
      {/* Hero Smart Automation Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>AI Automated Social Media Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Posting Produk Amazon ke Media Sosial Secara Otomatis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Integrasi langsung katalog Amazon, optimasi waktu posting terbaik berbasis AI, penjadwalan multi-kanal (X, Instagram, Facebook, Pinterest), dan pelacakan analitik real-time.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('composer')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buat Postingan Otomatis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('catalog')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Jelajahi Produk Amazon</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Produk Tersinkron</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-100 mt-1">
            {products.length}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Amazon PA-API Active</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Jadwal Antrean</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
            {scheduledPosts.length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Siap Terbit Otomatis</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Total Klik Afiliasi</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-100 mt-1">
            {summary.totalClicks.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">CTR {summary.avgCtr}%</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Estimasi Komisi</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
            ${summary.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {summary.totalConversions} Konversi
          </div>
        </div>
      </div>

      {/* Main Split Section: Next Scheduled & Featured Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Next Up in Queue (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Antrean Postingan Berikutnya
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Kampanye yang akan diposting sesuai jadwal terbaik.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('queue')}
              className="text-xs text-amber-400 hover:underline font-medium flex items-center gap-1"
            >
              <span>Lihat Semua ({posts.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {scheduledPosts.length === 0 ? (
              <div className="py-8 text-center rounded-lg border border-dashed border-slate-800 bg-slate-950/40">
                <p className="text-xs text-slate-400">Tidak ada postingan dalam antrean saat ini.</p>
                <button
                  onClick={() => onNavigateTab('composer')}
                  className="mt-2 text-xs text-amber-400 hover:underline font-medium"
                >
                  + Jadwalkan Postingan Baru
                </button>
              </div>
            ) : (
              scheduledPosts.slice(0, 3).map(post => {
                const date = new Date(post.scheduledTime);
                return (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.productImageUrl}
                        alt={post.productTitle}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-200 truncate">
                          {post.campaignName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {post.productTitle}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                          <span className="text-amber-400">
                            {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                          <span>·</span>
                          <span className="uppercase">{post.platforms.join(', ')}</span>
                          {post.aiOptimized && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400">AI Slot</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onPublishNow(post.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3 text-amber-400" />
                      <span>Kirim Sekarang</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Featured Products for Quick Post (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              Produk Siap Diposting
            </h2>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Lihat Katalog
            </button>
          </div>

          <div className="space-y-2.5">
            {products.slice(0, 3).map(prod => (
              <div
                key={prod.asin}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-xs text-slate-200 truncate">{prod.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span className="text-amber-400 font-bold">${prod.price.toFixed(2)}</span>
                      <span>·</span>
                      <span className="text-emerald-400">Komisi {Math.round(prod.commissionRate * 100)}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProductForPost(prod)}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Post</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
