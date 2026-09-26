import React, { useState } from 'react';
import { X, ShieldCheck, Check, Save } from 'lucide-react';
import { AmazonApiConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AmazonApiConfig;
  onSaveConfig: (config: AmazonApiConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSaveConfig
}) => {
  const [config, setConfig] = useState<AmazonApiConfig>(initialConfig);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(config);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Pengaturan API & Akun Amazon</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Amazon Associate Tracking ID / Tag
            </label>
            <input
              type="text"
              value={config.associateTag}
              onChange={e => setConfig({ ...config, associateTag: e.target.value })}
              placeholder="misal: yourbrand-20"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Tag ini otomatis ditambahkan ke setiap tautan produk yang diposting.
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Amazon PA-API Access Key ID
            </label>
            <input
              type="text"
              value={config.accessKey}
              onChange={e => setConfig({ ...config, accessKey: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-1">
              Marketplace Amazon Utama
            </label>
            <select
              value={config.marketplace}
              onChange={e => setConfig({ ...config, marketplace: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="US">Amazon United States (amazon.com)</option>
              <option value="UK">Amazon United Kingdom (amazon.co.uk)</option>
              <option value="DE">Amazon Germany (amazon.de)</option>
              <option value="JP">Amazon Japan (amazon.co.jp)</option>
              <option value="SG">Amazon Singapore (amazon.sg)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.autoPriceAlert}
                onChange={e => setConfig({ ...config, autoPriceAlert: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
              />
              <span>Aktifkan push notifikasi otomatis jika harga produk Amazon turun &gt;10%</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.autoScheduleBestTime}
                onChange={e => setConfig({ ...config, autoScheduleBestTime: e.target.checked })}
                className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
              />
              <span>Terapkan slot waktu terbaik AI secara otomatis saat membuat jadwal</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-sm transition-all"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saved ? 'Tersimpan!' : 'Simpan Konfigurasi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
