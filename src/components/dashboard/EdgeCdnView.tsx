import React, { useState, useEffect } from 'react';
import {
  Zap,
  Shield,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Globe,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Trash2,
  Lock
} from 'lucide-react';
import { EdgeCdnConfig, Website } from '../../types';

interface EdgeCdnViewProps {
  websites: Website[];
}

export const EdgeCdnView: React.FC<EdgeCdnViewProps> = ({ websites }) => {
  const [config, setConfig] = useState<EdgeCdnConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [purgeUrl, setPurgeUrl] = useState('/*');
  const [isPurging, setIsPurging] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/edge/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.edgeCdn);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleToggle = async (key: keyof EdgeCdnConfig, value: any) => {
    if (!config) return;
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);

    try {
      const res = await fetch('/api/edge/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      if (res.ok) {
        showToast('Sozlama yangilandi');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurgeCache = async () => {
    setIsPurging(true);
    try {
      const res = await fetch('/api/edge/purge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: purgeUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Kesh tozalandi!');
        await fetchConfig();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPurging(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (isLoading || !config) {
    return <div className="p-16 text-center text-xs text-slate-500">Edge CDN sozlamalari yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Edge CDN & TAS-IX Tezlatgich</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
              Anycast 10 Gb/s Faol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloudflare-darajasidagi statik fayllar keshlash, Brotli siqish va "Under Attack" DDoS himoyasi
          </p>
        </div>

        {/* Quick Under Attack Button */}
        <button
          onClick={() => handleToggle('underAttackMode', !config.underAttackMode)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
            config.underAttackMode
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
              : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-rose-500/50'
          }`}
        >
          <Flame className={`w-4 h-4 ${config.underAttackMode ? 'text-white' : 'text-rose-400'}`} />
          <span>{config.underAttackMode ? "Hujum Rejimi Faol (DDoS Shield)" : "Under Attack Rejimini Yoqish"}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Kesh Hit Nisbati (Hit Ratio)</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">{config.cacheHitRatio}%</div>
          <span className="text-[11px] text-slate-500">So'rovlar serverga bormasdan keshedan javob oldi</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Tejalgan Trafik</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {(config.bandwidthSavedMb / 1024).toFixed(1)} GB
          </div>
          <span className="text-[11px] text-slate-500">Brotli va kesh hisobiga tejaldi</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Keshlangan So'rovlar</span>
          <div className="text-2xl font-black text-white font-mono">
            {config.totalCachedRequests.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Toshkent Edge markazidan</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">TAS-IX Latensiyasi</span>
          <div className="text-2xl font-black text-blue-400 font-mono">1.8 ms</div>
          <span className="text-[11px] text-slate-500">O'zbekiston ichidagi o'rtacha tezlik</span>
        </div>
      </div>

      {/* Control Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left: Caching Controls */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Kesh va Tezlashtirish Parametrlari</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div>
              <span className="text-xs font-bold text-white block">Edge Anycast Keshlash</span>
              <span className="text-[11px] text-slate-400">Statik fayllarni (js, css, png, woff2) keshda saqlash</span>
            </div>
            <input
              type="checkbox"
              checked={config.cachingEnabled}
              onChange={(e) => handleToggle('cachingEnabled', e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div>
              <span className="text-xs font-bold text-white block">TAS-IX Anycast Marshrutlash</span>
              <span className="text-[11px] text-slate-400">O'zbekistonlik foydalanuvchilarni to'g'ridan-to'g'ri Uztelecom kanaliga ulash</span>
            </div>
            <input
              type="checkbox"
              checked={config.tasIxOptimization}
              onChange={(e) => handleToggle('tasIxOptimization', e.target.checked)}
              className="w-4 h-4 accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Siqish Algoritmi (Compression)</span>
              <span className="text-[11px] text-slate-400">Fayl hajmini qisqartirish</span>
            </div>
            <select
              value={config.compression}
              onChange={(e) => handleToggle('compression', e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            >
              <option value="brotli">Brotli (Maksimal siqish - 70%)</option>
              <option value="gzip">Gzip (Klassik - 55%)</option>
              <option value="off">O'chirilgan</option>
            </select>
          </div>
        </div>

        {/* Right: Cache Purge and Security */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <RotateCw className="w-4 h-4 text-emerald-400" />
            <span>Keshni Tozalash (Purge Cache)</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="text-slate-300 font-medium block">
              Tozalanadigan URL yo'li (Path):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={purgeUrl}
                onChange={(e) => setPurgeUrl(e.target.value)}
                placeholder="/* yoki /static/app.js"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none"
              />
              <button
                onClick={handlePurgeCache}
                disabled={isPurging}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin' : ''}`} />
                <span>Tozalash</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Saytingizdagi yangi o'zgarishlar darhol ko'rinishi uchun keshni yangilang
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">Oxirgi kesh tozalashlar:</span>
            <div className="space-y-1.5">
              {(config.cachePurgeHistory || []).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-[11px] p-2 rounded bg-slate-950 border border-slate-800/80 font-mono">
                  <span className="text-slate-300 truncate max-w-xs">{h.url}</span>
                  <span className="text-emerald-400 font-sans text-[10px]">100% Tozalandi</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
