import React, { useState } from 'react';
import { Platform, AmazonProduct } from '../types';
import { ExternalLink, Heart, MessageCircle, Repeat2, Send, Bookmark, ThumbsUp, Share2, Check } from 'lucide-react';

interface SocialPreviewProps {
  platform: Platform;
  product?: AmazonProduct | null;
  copy: string;
}

export const SocialPreview: React.FC<SocialPreviewProps> = ({
  platform,
  product,
  copy
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copy || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackImg = '/src/assets/images/amazon_product_anc_headphones_1790382436963.jpg';
  const imgUrl = product?.imageUrl || fallbackImg;

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-300 capitalize">Preview {platform}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {copy ? `${copy.length} karakter` : 'Belum ada copy'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
          <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center items-center bg-slate-950/60">
        {/* Twitter / X Preview */}
        {platform === 'twitter' && (
          <div className="w-full max-w-md bg-black border border-neutral-800 rounded-xl p-3.5 text-neutral-100 text-xs shadow-lg font-sans">
            <div className="flex items-start gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-amber-500/30">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-bold text-neutral-200">Deals Radar ID</span>
                  <span className="text-neutral-500">@dealsradar · Baru saja</span>
                </div>
                <p className="mt-1.5 text-neutral-200 whitespace-pre-line leading-relaxed text-xs">
                  {copy || 'Menunggu pembuatan konten otomatis via AI...'}
                </p>
              </div>
            </div>

            {/* Attached Amazon Card */}
            {product && (
              <div className="mt-2.5 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/60">
                <div className="h-44 w-full bg-neutral-900 relative overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-2.5 bg-neutral-950 border-t border-neutral-800">
                  <div className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">amazon.com</div>
                  <div className="font-semibold text-neutral-200 truncate mt-0.5 text-xs">{product.title}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-mono tabular-nums font-bold text-amber-400">
                      ${product.price.toFixed(2)}
                      {product.originalPrice > product.price && (
                        <span className="ml-1.5 text-neutral-500 line-through font-normal">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </span>
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-medium">
                      ✓ Prime Eligible
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-neutral-500 mt-3 pt-2 border-t border-neutral-900 px-1">
              <span className="flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" /> 14
              </span>
              <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer">
                <Repeat2 className="w-3.5 h-3.5" /> 48
              </span>
              <span className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer">
                <Heart className="w-3.5 h-3.5" /> 182
              </span>
              <span className="flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}

        {/* Instagram Preview */}
        {platform === 'instagram' && (
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl text-neutral-100 text-xs">
            <div className="px-3 py-2.5 flex items-center justify-between border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center font-bold text-[10px] text-amber-300">
                    A
                  </div>
                </div>
                <span className="font-semibold text-xs">amz.trendfinder</span>
              </div>
              <span className="text-[10px] text-neutral-500">Sponsored</span>
            </div>

            <div className="aspect-square w-full bg-neutral-950 relative overflow-hidden">
              <img
                src={imgUrl}
                alt={product?.title || 'Produk'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product && (
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-neutral-900/90 backdrop-blur-md rounded-lg p-2 border border-neutral-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-amber-400 font-mono tabular-nums">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate max-w-[170px]">{product.title}</div>
                  </div>
                  <span className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]">
                    Cek di Bio
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-neutral-950">
              <div className="flex items-center justify-between mb-2 text-neutral-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 cursor-pointer hover:text-pink-500" />
                  <MessageCircle className="w-4 h-4 cursor-pointer hover:text-neutral-100" />
                  <Send className="w-4 h-4 cursor-pointer hover:text-neutral-100" />
                </div>
                <Bookmark className="w-4 h-4 cursor-pointer hover:text-neutral-100" />
              </div>
              <div className="font-bold text-[11px] mb-1">428 suka</div>
              <p className="text-neutral-300 text-[11px] leading-relaxed whitespace-pre-line">
                <span className="font-bold mr-1.5 text-neutral-100">amz.trendfinder</span>
                {copy || 'Belum ada copy yang dibuat...'}
              </p>
            </div>
          </div>
        )}

        {/* Facebook Preview */}
        {platform === 'facebook' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-slate-100 text-xs shadow-lg">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 font-bold text-white flex items-center justify-center text-xs">
                f
              </div>
              <div>
                <div className="font-semibold text-slate-200">Rekomendasi Belanja Online</div>
                <div className="text-[10px] text-slate-400 font-mono">Diposting secara otomatis · Publik</div>
              </div>
            </div>

            <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-line mb-3">
              {copy || 'Konten otomatis Facebook...'}
            </p>

            {product && (
              <div className="rounded-lg border border-slate-700/80 overflow-hidden bg-slate-950">
                <img
                  src={imgUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-mono">amazon.com</div>
                    <div className="font-bold text-slate-100 text-xs truncate max-w-[240px]">{product.title}</div>
                    <div className="text-[11px] text-amber-400 font-mono font-bold mt-0.5">${product.price.toFixed(2)}</div>
                  </div>
                  <span className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded font-semibold text-[11px] border border-slate-700">
                    Beli Sekarang
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-around border-t border-slate-800 mt-3 pt-2 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> Suka
              </span>
              <span className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" /> Komentar
              </span>
              <span className="flex items-center gap-1.5 hover:text-slate-200 cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> Bagikan
              </span>
            </div>
          </div>
        )}

        {/* Pinterest Preview */}
        {platform === 'pinterest' && (
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-xs">
            <div className="relative">
              <img
                src={imgUrl}
                alt={product?.title || 'Pin image'}
                referrerPolicy="no-referrer"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-3 right-3 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
                Simpan
              </div>
            </div>
            <div className="p-3 bg-slate-950">
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mb-1">
                <ExternalLink className="w-2.5 h-2.5" /> amazon.com
              </div>
              <h4 className="font-bold text-slate-100 text-xs line-clamp-2">{product?.title || 'Pin Idea'}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                {copy || 'Pin description otomatis...'}
              </p>
              {product && (
                <div className="mt-2 text-xs font-mono font-bold text-amber-400">
                  ${product.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TikTok / LinkedIn generic */}
        {(platform === 'tiktok' || platform === 'linkedin') && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
            <div className="font-bold text-slate-200 mb-2 capitalize">{platform} Post Format</div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px]">
              {copy || 'Menunggu generate copy...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
