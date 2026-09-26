import React, { useState } from 'react';
import { AmazonProduct } from '../types';
import {
  Search,
  Plus,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Star,
  Zap,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface AmazonCatalogProps {
  products: AmazonProduct[];
  onSelectForPost: (product: AmazonProduct) => void;
  onImportASIN: (asinOrUrl: string) => Promise<void>;
  loadingImport: boolean;
}

export const AmazonCatalog: React.FC<AmazonCatalogProps> = ({
  products,
  onSelectForPost,
  onImportASIN,
  loadingImport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [importInput, setImportInput] = useState('');
  const [copiedAsin, setCopiedAsin] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'Elektronik & Audio', label: 'Elektronik & Audio' },
    { id: 'Wearable Tech', label: 'Wearable Tech' },
    { id: 'Dapur & Rumah Tangga', label: 'Dapur & Rumah' },
    { id: 'Komputer & Aksesoris', label: 'Komputer & Gaming' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.asin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (product: AmazonProduct) => {
    navigator.clipboard.writeText(product.affiliateUrl);
    setCopiedAsin(product.asin);
    setTimeout(() => setCopiedAsin(null), 2000);
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importInput.trim()) return;
    await onImportASIN(importInput.trim());
    setImportInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick ASIN Importer */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            Integrasi Amazon Product Advertising API
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Impor produk langsung via ASIN atau URL Amazon untuk membuat kampanye otomatis. Tag afiliasi ditambahkan secara instan.
          </p>
        </div>

        <form onSubmit={handleImportSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Masukkan ASIN (misal: B0CHX19W5K) atau URL..."
              value={importInput}
              onChange={e => setImportInput(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
            {importInput && (
              <span className="absolute right-3 top-2.5 text-[10px] text-amber-400 font-mono">
                PA-API
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loadingImport || !importInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loadingImport ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>{loadingImport ? 'Sinkronisasi...' : 'Impor Produk'}</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        {/* Interactive Segmented Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama produk, ASIN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40">
          <p className="text-sm text-slate-400">Tidak ada produk yang cocok dengan pencarian.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 px-3 py-1.5 text-xs text-amber-400 bg-amber-500/10 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredProducts.map(product => {
            const hasDiscount = product.originalPrice > product.price;
            const discountPct = hasDiscount
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.asin}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 relative">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.prime && (
                        <div className="absolute top-1 left-1 bg-sky-950/90 text-sky-300 text-[9px] font-mono px-1 py-0.5 rounded border border-sky-800/60">
                          Prime
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-400/90">{product.asin}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.category}</span>
                      </div>

                      <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {product.title}
                      </h3>

                      {/* Ratings and Reviews */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1 text-amber-400 font-mono font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums text-slate-400">
                          {product.reviewCount.toLocaleString('id-ID')} ulasan
                        </span>
                        {product.badge && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[10px] text-amber-400 font-medium truncate">
                              {product.badge}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-slate-100 font-mono tabular-nums">
                          ${product.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-500 line-through font-mono tabular-nums">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                            -{discountPct}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bullet features */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/70 text-xs text-slate-400 space-y-1">
                    {product.features.slice(0, 2).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 truncate">
                        <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyLink(product)}
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Salin Link Afiliasi Amazon"
                      aria-label="Salin Link Afiliasi"
                    >
                      {copiedAsin === product.asin ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Buka Halaman Amazon"
                      aria-label="Buka Halaman Amazon"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => onSelectForPost(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Jadwalkan Postingan</span>
                    <ArrowRight className="w-3 h-3" />
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
