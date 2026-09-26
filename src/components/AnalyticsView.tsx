import React, { useState, useEffect } from 'react';
import { AnalyticsSummary, ScheduledPost, PlatformStat } from '../types';
import {
  TrendingUp,
  MousePointerClick,
  Eye,
  DollarSign,
  Percent,
  Play,
  Pause,
  RefreshCw,
  Share2,
  Calendar,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface AnalyticsViewProps {
  summary: AnalyticsSummary;
  posts: ScheduledPost[];
  platformStats: Record<string, PlatformStat>;
  onRefresh: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary: initialSummary,
  posts,
  platformStats,
  onRefresh
}) => {
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary>(initialSummary);

  useEffect(() => {
    setSummary(initialSummary);
  }, [initialSummary]);

  // Real-time live simulation ticker
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      // randomly tick impressions or clicks
      setSummary(prev => {
        const addImp = Math.random() > 0.4 ? Math.floor(1 + Math.random() * 5) : 0;
        const addClick = Math.random() > 0.7 ? 1 : 0;
        const addRev = addClick ? parseFloat((Math.random() * 4.5).toFixed(2)) : 0;
        const newImp = prev.totalImpressions + addImp;
        const newClick = prev.totalClicks + addClick;
        const newCtr = newImp > 0 ? parseFloat(((newClick / newImp) * 100).toFixed(2)) : prev.avgCtr;

        return {
          ...prev,
          totalImpressions: newImp,
          totalClicks: newClick,
          totalConversions: prev.totalConversions + (addClick && Math.random() > 0.85 ? 1 : 0),
          totalRevenue: parseFloat((prev.totalRevenue + addRev).toFixed(2)),
          avgCtr: newCtr
        };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  const kpis = [
    {
      title: 'Total Tayangan (Impressions)',
      value: summary.totalImpressions.toLocaleString('id-ID'),
      change: '+18.4% vs minggu lalu',
      icon: Eye,
      color: 'text-sky-400'
    },
    {
      title: 'Total Klik Afiliasi (Clicks)',
      value: summary.totalClicks.toLocaleString('id-ID'),
      change: '+24.1% vs minggu lalu',
      icon: MousePointerClick,
      color: 'text-amber-400'
    },
    {
      title: 'Rata-rata CTR',
      value: `${summary.avgCtr}%`,
      change: '+2.8% di atas standar e-commerce',
      icon: Percent,
      color: 'text-emerald-400'
    },
    {
      title: 'Estimasi Komisi Amazon',
      value: `$${summary.totalRevenue.toFixed(2)}`,
      change: `${summary.totalConversions} transaksi terkonfirmasi`,
      icon: DollarSign,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Telemetri & Analitik Kampanye Real-Time
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelacakan interaksi media sosial dan konversi klik link afiliasi Amazon secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              liveStreamActive
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {liveStreamActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Stream Aktif</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3" />
                <span>Live Stream Jeda</span>
              </>
            )}
          </button>

          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            title="Sinkronkan data terbaru"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{kpi.title}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-100">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  {kpi.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Breakdown & Peak Hours Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Share (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span>Performa per Platform Media Sosial</span>
            <span className="text-[11px] text-slate-500 font-mono">Berdasarkan Klik</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(platformStats).map(([plat, stat]) => {
              const names: Record<string, string> = {
                twitter: 'X (Twitter)',
                instagram: 'Instagram',
                facebook: 'Facebook',
                pinterest: 'Pinterest',
                tiktok: 'TikTok',
                linkedin: 'LinkedIn'
              };
              const pct = summary.totalClicks > 0
                ? Math.min(100, Math.round((stat.clicks / summary.totalClicks) * 100))
                : 0;

              return (
                <div key={plat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize font-medium text-slate-300">
                      {names[plat] || plat}
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {stat.clicks} klik ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-amber-300">Rekomendasi Distribusi AI:</span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Instagram Reels & X (Twitter) menghasilkan CTR 2.3x lebih tinggi untuk kategori Elektronik & Audio.
            </p>
          </div>
        </div>

        {/* Top Performing Posts Table (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200">
              Postingan Performa Tertinggi
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">
              Urutan berdasarkan CTR
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <th className="pb-2 font-medium">Kampanye & Produk</th>
                  <th className="pb-2 font-medium text-right">Tayangan</th>
                  <th className="pb-2 font-medium text-right">Klik</th>
                  <th className="pb-2 font-medium text-right">CTR</th>
                  <th className="pb-2 font-medium text-right">Komisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 pr-2">
                      <div className="font-sans font-medium text-slate-200 truncate max-w-[200px]">
                        {post.campaignName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {post.productTitle}
                      </div>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-300">
                      {post.metrics.impressions.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-amber-400 font-semibold">
                      {post.metrics.clicks}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-emerald-400">
                      {post.metrics.ctr}%
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-200">
                      ${post.metrics.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
