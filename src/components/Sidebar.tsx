import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  CalendarDays,
  LineChart,
  BellRing,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  unreadNotificationsCount: number;
  scheduledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unreadNotificationsCount,
  scheduledCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Katalog Produk Amazon', icon: ShoppingBag },
    { id: 'composer', label: 'Buat & Auto-Post', icon: Sparkles, badge: 'AI' },
    { id: 'queue', label: 'Antrean & Kalender', icon: CalendarDays, count: scheduledCount },
    { id: 'analytics', label: 'Analitik Real-time', icon: LineChart },
    { id: 'notifications', label: 'Push Notifikasi', icon: BellRing, count: unreadNotificationsCount }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand logo area */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <span className="text-base tracking-tighter">A</span>
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1">
              AmzSync
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-semibold">Pro</span>
            </div>
            <div className="text-[11px] text-slate-500">Auto Social Media Hub</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Menu Utama
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Amazon API Status Card */}
      <div className="p-3 m-3 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Amazon PA-API
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Terhubung
          </span>
        </div>
        
        <div className="text-[11px] space-y-1 font-mono text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex justify-between">
            <span className="text-slate-500">Tag:</span>
            <span className="text-amber-400/90">amzsync-20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Region:</span>
            <span>US (amazon.com)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Auto-Alert:</span>
            <span className="text-emerald-400">Aktif</span>
          </div>
        </div>

        <a
          href="https://affiliate-program.amazon.com/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 mt-1 text-[11px] font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/60 transition-colors"
        >
          <span>Amazon Associates</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>
    </aside>
  );
};
