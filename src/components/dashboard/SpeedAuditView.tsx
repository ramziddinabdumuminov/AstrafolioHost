import React, { useState } from 'react';
import {
  Gauge,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Globe,
  Search,
  Check,
  ShieldCheck,
  Smartphone,
  Monitor
} from 'lucide-react';
import { SpeedAuditResult, Website } from '../../types';

interface SpeedAuditViewProps {
  websites: Website[];
}

export const SpeedAuditView: React.FC<SpeedAuditViewProps> = ({ websites }) => {
  const [urlToTest, setUrlToTest] = useState(
    websites.length > 0 ? `https://${websites[0].domain}` : 'https://ebozor.astrafolio.uz'
  );
  const [audit, setAudit] = useState<SpeedAuditResult | null>({
    url: 'https://ebozor.astrafolio.uz',
    testedAt: new Date().toISOString(),
    performanceScore: 98,
    seoScore: 100,
    accessibilityScore: 95,
    bestPracticesScore: 100,
    loadTimeMs: 240,
    ttfbMs: 18,
    pageSizeKb: 142,
    recommendations: [
      { type: 'success', title: 'TAS-IX Anycast CDN Faol', description: 'Barcha resurslar Toshkentdagi 10Gb/s ma\'lumotlar markazidan uzatilmoqda' },
      { type: 'success', title: 'Brotli Siqish Faol', description: 'Statik aktivlar hajmi 68% ga kamaytirilgan' },
      { type: 'success', title: 'TLS 1.3 0-RTT', description: 'Shifrlangan sessiya 1ms ichida o\'rnatiladi' },
      { type: 'warning', title: 'Browser Cache TTL', description: 'Statik rasmlar uchun kesh muddatini 1 yilga uzaytirish tavsiya etiladi' }
    ]
  });
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlToTest) return;

    setIsRunning(true);
    try {
      const res = await fetch('/api/speed-audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });
      const data = await res.json();
      if (res.ok && data.audit) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Veb-sayt Tezlik & SEO Auditi</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold font-mono">
              Lighthouse 12.0 Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Core Web Vitals, TAS-IX latensiyasi va Google qidiruv reytingi (SEO) parametrlarini tahlil qilish
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={runAudit} className="p-4 sm:p-5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={urlToTest}
            onChange={(e) => setUrlToTest(e.target.value)}
            placeholder="https://sizningsaytingiz.uz"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Auditi o\'tkazilmoqda...' : 'Auditni Ishga Tushirish'}</span>
        </button>
      </form>

      {audit && (
        <div className="space-y-6">
          {/* Main 4 Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(audit.performanceScore)}`}>
              <div className="text-4xl font-black font-mono tracking-tight">{audit.performanceScore}</div>
              <span className="text-xs font-bold text-white mt-1">Tezlik (Performance)</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Yuklanish: {audit.loadTimeMs} ms</span>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(audit.seoScore)}`}>
              <div className="text-4xl font-black font-mono tracking-tight">{audit.seoScore}</div>
              <span className="text-xs font-bold text-white mt-1">SEO Reytingi</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Google indekslashga tayyor</span>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(audit.accessibilityScore)}`}>
              <div className="text-4xl font-black font-mono tracking-tight">{audit.accessibilityScore}</div>
              <span className="text-xs font-bold text-white mt-1">Qulaylik (Accessibility)</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Mobil & Ekran qulayligi</span>
            </div>

            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(audit.bestPracticesScore)}`}>
              <div className="text-4xl font-black font-mono tracking-tight">{audit.bestPracticesScore}</div>
              <span className="text-xs font-bold text-white mt-1">Xavfsizlik & Standartlar</span>
              <span className="text-[10px] text-slate-400 mt-0.5">HTTPS & CSP 100%</span>
            </div>
          </div>

          {/* Timing metrics breakdown */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Core Web Vitals & Latensiya Taqsimoti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Birinchi Bayt Vaqti (TTFB)</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{audit.ttfbMs} ms</span>
                <span className="text-[10px] text-slate-500 block mt-1">TAS-IX Anycast orqali ultra-tez</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">To'liq Yuklanish Vaqti</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{audit.loadTimeMs} ms</span>
                <span className="text-[10px] text-slate-500 block mt-1">Standart me'yordan 3 barobar tez</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Sahifa Umumiy Hajmi</span>
                <span className="text-xl font-bold font-mono text-purple-400">{audit.pageSizeKb} KB</span>
                <span className="text-[10px] text-slate-500 block mt-1">Brotli siqish hisobiga optimallashgan</span>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Tavsiyalar & Optimallashtirish Tahlili</h3>
            <div className="space-y-2.5">
              {audit.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    rec.type === 'success'
                      ? 'bg-emerald-950/15 border-emerald-500/30 text-slate-300'
                      : 'bg-amber-950/15 border-amber-500/30 text-slate-300'
                  }`}
                >
                  {rec.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-white block">{rec.title}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{rec.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
