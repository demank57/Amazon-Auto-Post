import React, { useState, useEffect } from 'react';
import { AmazonProduct, Platform, ScheduledPost } from '../types';
import { SocialPreview } from './SocialPreview';
import {
  Sparkles,
  Calendar,
  Clock,
  Send,
  Wand2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  TrendingUp,
  Radio
} from 'lucide-react';

interface PostComposerProps {
  products: AmazonProduct[];
  selectedProduct?: AmazonProduct | null;
  onSchedulePost: (postData: Partial<ScheduledPost>) => Promise<void>;
  onPublishNow: (postData: Partial<ScheduledPost>) => Promise<void>;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  products,
  selectedProduct: initialProduct,
  onSchedulePost,
  onPublishNow
}) => {
  const [selectedAsin, setSelectedAsin] = useState<string>(
    initialProduct?.asin || (products[0] ? products[0].asin : '')
  );
  const [campaignName, setCampaignName] = useState('Kampanye Flash Deal ' + new Date().toLocaleDateString('id-ID'));
  const [targetAudience, setTargetAudience] = useState('Audiens Gadget & Tech Shoppers Indonesia (Usia 20-38)');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter', 'instagram', 'facebook']);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>('twitter');
  const [copyPerPlatform, setCopyPerPlatform] = useState<Record<string, string>>({});
  const [copyTone, setCopyTone] = useState('engaging_deal');

  // Scheduling state
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 3600000 * 3);
    return d.toISOString().slice(0, 16);
  });

  // AI state
  const [loadingAiCopy, setLoadingAiCopy] = useState(false);
  const [loadingAiTime, setLoadingAiTime] = useState(false);
  const [aiTimeRecommendation, setAiTimeRecommendation] = useState<{
    bestTimeString?: string;
    bestTimeISO?: string;
    expectedCtrBoost?: string;
    peakHourReasoning?: string;
    dayOfWeek?: string;
    platformTiming?: Record<string, string>;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const currentProduct = products.find(p => p.asin === selectedAsin) || products[0];

  // Auto-generate AI copy or optimize time on product change if empty
  useEffect(() => {
    if (currentProduct && Object.keys(copyPerPlatform).length === 0) {
      handleGenerateCopy();
    }
  }, [selectedAsin]);

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return; // keep at least one
      setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateCopy = async () => {
    if (!currentProduct) return;
    setLoadingAiCopy(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: currentProduct,
          tone: copyTone,
          platforms: selectedPlatforms
        })
      });
      const data = await res.json();
      if (data.success && data.copy) {
        setCopyPerPlatform(prev => ({ ...prev, ...data.copy }));
      }
    } catch (err) {
      console.error('Error generating copy:', err);
    } finally {
      setLoadingAiCopy(false);
    }
  };

  const handleOptimizeTimeWithAi = async () => {
    if (!currentProduct) return;
    setLoadingAiTime(true);
    try {
      const res = await fetch('/api/ai/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: currentProduct,
          targetAudience,
          platforms: selectedPlatforms
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiTimeRecommendation(data);
        if (data.bestTimeISO) {
          setScheduledDateTime(new Date(data.bestTimeISO).toISOString().slice(0, 16));
        }
      }
    } catch (err) {
      console.error('Error optimizing schedule with AI:', err);
    } finally {
      setLoadingAiTime(false);
    }
  };

  const handleSchedule = async (immediate = false) => {
    if (!currentProduct) return;
    setSubmitting(true);
    setStatusMessage(null);

    const postPayload: Partial<ScheduledPost> = {
      asin: currentProduct.asin,
      productTitle: currentProduct.title,
      productPrice: currentProduct.price,
      productImageUrl: currentProduct.imageUrl,
      affiliateUrl: currentProduct.affiliateUrl,
      platforms: selectedPlatforms,
      copy: copyPerPlatform,
      scheduledTime: immediate ? new Date().toISOString() : new Date(scheduledDateTime).toISOString(),
      campaignName,
      aiOptimized: Boolean(aiTimeRecommendation),
      aiReasoning: aiTimeRecommendation?.peakHourReasoning,
      targetAudience
    };

    try {
      if (immediate) {
        await onPublishNow(postPayload);
        setStatusMessage('Postingan berhasil dipublikasikan sekarang ke channel terpilih!');
      } else {
        await onSchedulePost(postPayload);
        setStatusMessage('Jadwal kampanye berhasil ditambahkan ke antrean otomatis!');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Terjadi kesalahan saat memproses postingan.');
    } finally {
      setSubmitting(false);
    }
  };

  const platformList: { id: Platform; label: string }[] = [
    { id: 'twitter', label: 'X (Twitter)' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'pinterest', label: 'Pinterest' },
    { id: 'tiktok', label: 'TikTok / Threads' },
    { id: 'linkedin', label: 'LinkedIn' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert for AI Status */}
      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-[11px] text-emerald-400 hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Product Selection */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Pilih Produk Amazon
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {products.length} produk tersinkronisasi
              </span>
            </div>

            <select
              value={selectedAsin}
              onChange={e => setSelectedAsin(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {products.map(p => (
                <option key={p.asin} value={p.asin}>
                  [{p.asin}] {p.title} (${p.price.toFixed(2)})
                </option>
              ))}
            </select>

            {currentProduct && (
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-200 truncate">{currentProduct.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono text-amber-400 font-bold">${currentProduct.price.toFixed(2)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{currentProduct.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono">Komisi {Math.round(currentProduct.commissionRate * 100)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Platform Selection & Tone */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Target Platform Media Sosial</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {selectedPlatforms.length} platform dipilih
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platformList.map(item => {
                const isSelected = selectedPlatforms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePlatform(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {/* Campaign Name & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Nama Kampanye
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Gaya Copywriting (Tone)
                </label>
                <select
                  value={copyTone}
                  onChange={e => setCopyTone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="engaging_deal">Urgent Flash Deal (Diskon & Promo Cepat)</option>
                  <option value="honest_review">Review & Analisis Fitur Mendalam</option>
                  <option value="lifestyle_story">Storytelling Gaya Hidup & Setup Harian</option>
                  <option value="minimalist_hook">Minimalis & Call-To-Action Tajam</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. AI Smart Content Generator */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  Konten Otomatis per Platform (Gemini AI)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Setiap platform menerima variasi copy yang diadaptasi khusus.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateCopy}
                disabled={loadingAiCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{loadingAiCopy ? 'Membuat Copy...' : 'Regenerate AI Copy'}</span>
              </button>
            </div>

            {/* Platform tab switcher for copy editing */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 pb-1 scrollbar-none">
              {selectedPlatforms.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreviewPlatform(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-colors ${
                    previewPlatform === p
                      ? 'bg-slate-800 text-amber-300 font-semibold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Active copy textarea */}
            <div>
              <textarea
                rows={4}
                value={copyPerPlatform[previewPlatform] || ''}
                onChange={e =>
                  setCopyPerPlatform({
                    ...copyPerPlatform,
                    [previewPlatform]: e.target.value
                  })
                }
                placeholder={`Masukkan atau sesuaikan copy untuk ${previewPlatform}...`}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans leading-relaxed resize-y"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>Link afiliasi otomatis tersisip</span>
                <span>{(copyPerPlatform[previewPlatform] || '').length} karakter</span>
              </div>
            </div>
          </div>

          {/* 4. AI Best Time to Post Optimizer & Scheduler */}
          <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/20 space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Optimasi Waktu Posting Terbaik Berbasis AI
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Analisis machine learning terhadap jam aktif audiens e-commerce & algoritma feed.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOptimizeTimeWithAi}
                disabled={loadingAiTime}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>{loadingAiTime ? 'Menganalisis...' : 'Hitung Slot Terbaik'}</span>
              </button>
            </div>

            {/* Target Audience Input */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Target Demografi Audiens
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* AI Recommendation Result Card */}
            {aiTimeRecommendation && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-amber-300">
                      Rekomendasi Puncak: {aiTimeRecommendation.bestTimeString} ({aiTimeRecommendation.dayOfWeek})
                    </span>
                  </div>
                  {aiTimeRecommendation.expectedCtrBoost && (
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 text-[11px]">
                      Est. CTR {aiTimeRecommendation.expectedCtrBoost}
                    </span>
                  )}
                </div>

                {aiTimeRecommendation.peakHourReasoning && (
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {aiTimeRecommendation.peakHourReasoning}
                  </p>
                )}

                {aiTimeRecommendation.platformTiming && (
                  <div className="pt-2 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    {Object.entries(aiTimeRecommendation.platformTiming).map(([plat, time]) => (
                      <div key={plat} className="flex justify-between">
                        <span className="capitalize">{plat}:</span>
                        <span className="text-amber-200">{time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Date & Time Picker */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={e => setScheduledDateTime(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSchedule(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Jadwalkan ke Antrean'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSchedule(true)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Posting Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Social Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-200">Pratinjau Feed Media Sosial</span>
            <div className="flex items-center gap-1">
              {selectedPlatforms.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPreviewPlatform(p)}
                  className={`px-2 py-0.5 text-[10px] rounded capitalize font-medium ${
                    previewPlatform === p
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <SocialPreview
            platform={previewPlatform}
            product={currentProduct}
            copy={copyPerPlatform[previewPlatform] || ''}
          />
        </div>
      </div>
    </div>
  );
};
