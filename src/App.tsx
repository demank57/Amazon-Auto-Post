import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardOverview } from './components/DashboardOverview';
import { AmazonCatalog } from './components/AmazonCatalog';
import { PostComposer } from './components/PostComposer';
import { ScheduleQueue } from './components/ScheduleQueue';
import { AnalyticsView } from './components/AnalyticsView';
import { NotificationCenter } from './components/NotificationCenter';
import { SettingsModal } from './components/SettingsModal';
import {
  AmazonProduct,
  ScheduledPost,
  AppNotification,
  AnalyticsSummary,
  PlatformStat,
  AmazonApiConfig
} from './types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedProductForComposer, setSelectedProductForComposer] = useState<AmazonProduct | null>(null);
  const [loadingImport, setLoadingImport] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Active toast banner for push notifications
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalPosts: 3,
    publishedPosts: 1,
    scheduledPosts: 2,
    totalImpressions: 4850,
    totalClicks: 342,
    totalConversions: 18,
    totalRevenue: 236.16,
    avgCtr: 7.05
  });

  const [platformStats, setPlatformStats] = useState<Record<string, PlatformStat>>({
    twitter: { posts: 2, clicks: 178, share: '52%' },
    instagram: { posts: 2, clicks: 124, share: '36%' },
    facebook: { posts: 2, clicks: 40, share: '12%' },
    pinterest: { posts: 1, clicks: 18, share: '5%' }
  });

  const [apiConfig, setApiConfig] = useState<AmazonApiConfig>(() => {
    const saved = localStorage.getItem('amzsync_api_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      associateTag: 'amzsync-20',
      accessKey: 'AKIAIOSFODNN7EXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      marketplace: 'US',
      autoPriceAlert: true,
      autoScheduleBestTime: true
    };
  });

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [resProd, resPosts, resNotif, resAnalytics] = await Promise.all([
        fetch('/api/amazon/products').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
      ]);

      if (resProd.success) setProducts(resProd.products);
      if (resPosts.success) setPosts(resPosts.posts);
      if (resNotif.success) setNotifications(resNotif.notifications);
      if (resAnalytics.success) {
        setSummary(resAnalytics.summary);
        setPlatformStats(resAnalytics.platformStats);
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerToast = (notif: AppNotification) => {
    setActiveToast(notif);
    // Also trigger native browser notification if granted
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(`AmzSync: ${notif.title}`, {
        body: notif.message,
        icon: '/favicon.ico'
      });
    }
    setTimeout(() => {
      setActiveToast(prev => (prev?.id === notif.id ? null : prev));
    }, 5500);
  };

  const handleSelectProductForPost = (product: AmazonProduct) => {
    setSelectedProductForComposer(product);
    setCurrentTab('composer');
  };

  const handleImportASIN = async (asinOrUrl: string) => {
    setLoadingImport(true);
    try {
      const res = await fetch('/api/amazon/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asinOrUrl,
          affiliateTag: apiConfig.associateTag
        })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => {
          const exists = prev.some(p => p.asin === data.product.asin);
          return exists ? prev : [data.product, ...prev];
        });
        triggerToast({
          id: `notif-${Date.now()}`,
          title: 'Produk Amazon Berhasil Diimpor',
          message: `${data.product.title.slice(0, 50)}... berhasil disinkronkan dari Amazon PA-API.`,
          timestamp: new Date().toISOString(),
          type: 'success',
          read: false
        });
      }
    } catch (err) {
      console.error('Import error:', err);
    } finally {
      setLoadingImport(false);
    }
  };

  const handleSchedulePost = async (postData: Partial<ScheduledPost>) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    const data = await res.json();
    if (data.success && data.post) {
      setPosts(prev => [data.post, ...prev]);
      if (data.notification) {
        setNotifications(prev => [data.notification, ...prev]);
        triggerToast(data.notification);
      }
      fetchData();
    }
  };

  const handlePublishNow = async (idOrData: string | Partial<ScheduledPost>) => {
    if (typeof idOrData === 'string') {
      // Direct ID
      const res = await fetch(`/api/posts/${idOrData}/publish-now`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => prev.map(p => (p.id === idOrData ? data.post : p)));
        if (data.notification) {
          setNotifications(prev => [data.notification, ...prev]);
          triggerToast(data.notification);
        }
        fetchData();
      }
    } else {
      // From composer directly
      const createRes = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idOrData)
      });
      const createData = await createRes.json();
      if (createData.success && createData.post) {
        await handlePublishNow(createData.post.id);
      }
    }
  };

  const handleDeletePost = async (id: string) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleMarkAllRead = async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSendTestNotification = async (title?: string, message?: string) => {
    const res = await fetch('/api/notifications/test-push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message })
    });
    const data = await res.json();
    if (data.success && data.notification) {
      setNotifications(prev => [data.notification, ...prev]);
      triggerToast(data.notification);
    }
  };

  const handleSaveConfig = (newConfig: AmazonApiConfig) => {
    setApiConfig(newConfig);
    localStorage.setItem('amzsync_api_config', JSON.stringify(newConfig));
    triggerToast({
      id: `notif-${Date.now()}`,
      title: 'Konfigurasi Tersimpan',
      message: 'Pengaturan API Amazon dan Tag Afiliasi berhasil diperbarui.',
      timestamp: new Date().toISOString(),
      type: 'info',
      read: false
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          unreadNotificationsCount={unreadCount}
          scheduledCount={scheduledCount}
        />

        {/* Main Workspace Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            currentTab={currentTab}
            notifications={notifications}
            onOpenNotifications={() => setCurrentTab('notifications')}
            onOpenComposer={() => setCurrentTab('composer')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            activeCount={scheduledCount}
          />

          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardOverview
                products={products}
                posts={posts}
                summary={summary}
                onNavigateTab={setCurrentTab}
                onSelectProductForPost={handleSelectProductForPost}
                onPublishNow={handlePublishNow}
              />
            )}

            {currentTab === 'catalog' && (
              <AmazonCatalog
                products={products}
                onSelectForPost={handleSelectProductForPost}
                onImportASIN={handleImportASIN}
                loadingImport={loadingImport}
              />
            )}

            {currentTab === 'composer' && (
              <PostComposer
                products={products}
                selectedProduct={selectedProductForComposer}
                onSchedulePost={handleSchedulePost}
                onPublishNow={handlePublishNow}
              />
            )}

            {currentTab === 'queue' && (
              <ScheduleQueue
                posts={posts}
                onPublishNow={handlePublishNow}
                onDeletePost={handleDeletePost}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                summary={summary}
                posts={posts}
                platformStats={platformStats}
                onRefresh={fetchData}
              />
            )}

            {currentTab === 'notifications' && (
              <NotificationCenter
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onSendTestNotification={handleSendTestNotification}
                onNavigateToCampaign={id => {
                  if (id) setCurrentTab('queue');
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Real-time Push Notification Floating Toast */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-short">
          <div className="p-4 rounded-xl bg-slate-900/95 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-start gap-3 text-xs">
            <div className="mt-0.5 shrink-0">
              {activeToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : activeToast.type === 'alert' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-sky-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-100 flex items-center justify-between">
                <span>{activeToast.title}</span>
                <span className="text-[10px] text-amber-400 font-mono">Push Alert</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
