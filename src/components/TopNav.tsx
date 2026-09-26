import React from 'react';
import { Bell, Plus, Settings, ShoppingBag, Radio } from 'lucide-react';
import { AppNotification } from '../types';

interface TopNavProps {
  currentTab: string;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenComposer: () => void;
  onOpenSettings: () => void;
  activeCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  notifications,
  onOpenNotifications,
  onOpenComposer,
  onOpenSettings,
  activeCount
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const tabLabels: Record<string, string> = {
    dashboard: 'Dashboard Ikhtisar',
    catalog: 'Katalog Produk Amazon',
    composer: 'Buat & Jadwalkan Postingan',
    queue: 'Antrean & Kalender Penjadwalan',
    analytics: 'Analitik Performa Real-time',
    notifications: 'Pusat Notifikasi Push'
  };

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Breadcrumb and title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            AmzSync
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">{tabLabels[currentTab] || 'Dashboard'}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>Sistem Auto-Poster Aktif</span>
          <span className="text-slate-500">·</span>
          <span className="font-mono tabular-nums text-emerald-400">{activeCount} kampanye berjalan</span>
        </div>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Notifikasi Push"
          aria-label="Notifikasi Push"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 px-1 min-w-[16px] h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Konfigurasi API Amazon"
          aria-label="Konfigurasi API Amazon"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenComposer}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Jadwalkan Postingan</span>
        </button>
      </div>
    </header>
  );
};
