import React, { useState } from 'react';
import { AppNotification } from '../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Send,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onSendTestNotification: (title?: string, message?: string) => Promise<void>;
  onNavigateToCampaign?: (campaignId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllRead,
  onSendTestNotification,
  onNavigateToCampaign
}) => {
  const [browserPermission, setBrowserPermission] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [sendingTest, setSendingTest] = useState(false);

  const requestBrowserPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        new Notification('AmzSync Push Notification Aktif!', {
          body: 'Anda akan menerima pembaruan instan saat postingan media sosial Anda terbit atau harga produk berubah.',
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestClick = async () => {
    setSendingTest(true);
    try {
      await onSendTestNotification(
        'Kampanye Terbit Otomatis!',
        'Postingan Amazon Flash Deal Anda baru saja berhasil di-publish ke X dan Instagram.'
      );
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification('AmzSync: Kampanye Terbit Otomatis!', {
          body: 'Postingan Amazon Flash Deal Anda baru saja berhasil di-publish ke X dan Instagram.'
        });
      }
    } finally {
      setSendingTest(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Web Push Permission & Test Trigger */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-100">
              Sistem Notifikasi Push Kampanye
            </h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              browserPermission === 'granted'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              Browser Push: {browserPermission === 'granted' ? 'Diizinkan' : 'Belum Diaktifkan'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Terima notifikasi real-time saat status kampanye berubah, postingan berhasil terbit, atau terjadi lonjakan interaksi.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {browserPermission !== 'granted' && (
            <button
              onClick={requestBrowserPermission}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Izinkan Push Browser</span>
            </button>
          )}

          <button
            onClick={handleTestClick}
            disabled={sendingTest}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            <span>{sendingTest ? 'Mengirim...' : 'Uji Coba Push'}</span>
          </button>
        </div>
      </div>

      {/* Header controls for notification list */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
          <span>Riwayat Aktivitas & Push Alert</span>
          {unreadCount > 0 && (
            <span className="font-mono text-amber-400 font-bold">
              ({unreadCount} belum dibaca)
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tandai Semua Sudah Dibaca</span>
          </button>
        )}
      </div>

      {/* Notification items */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-16 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
            <p className="text-sm text-slate-400">Belum ada riwayat notifikasi.</p>
          </div>
        ) : (
          notifications.map(n => {
            const date = new Date(n.timestamp);

            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  n.read
                    ? 'bg-slate-900/70 border-slate-800 text-slate-300'
                    : 'bg-slate-900 border-amber-500/30 text-slate-100 shadow-sm'
                }`}
              >
                {/* Icon */}
                <div className="mt-0.5 shrink-0">
                  {n.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {n.type === 'alert' && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {n.type === 'info' && (
                    <Info className="w-4 h-4 text-sky-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold">{n.title}</h4>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} ·{' '}
                      {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
