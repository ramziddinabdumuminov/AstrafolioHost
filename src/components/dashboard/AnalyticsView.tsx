import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Globe, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  Monitor, 
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header & Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Analitika & Tashriflar Statistikasi</h2>
          <p className="text-xs text-slate-400">
            Real-vaqtdagi server so'rovlari, trafigi va foydalanuvchilar demografiyasi
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {[
            { id: '24h', label: '24 Soat' },
            { id: '7d', label: '7 Kun' },
            { id: '30d', label: '30 Kun' },
            { id: '90d', label: '90 Kun' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                period === t.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Jami Tashriflar', val: '142,580', change: '+18.4%', icon: Users, color: 'text-cyan-400' },
          { label: 'Noyob Tashriflar', val: '89,210', change: '+12.1%', icon: Users, color: 'text-blue-400' },
          { label: 'HTTP So\'rovlar', val: '1.24M', change: '+24.0%', icon: Activity, color: 'text-purple-400' },
          { label: 'Trafik (Bandwidth)', val: '42.8 GB', change: '+8.3%', icon: Globe, color: 'text-emerald-400' },
          { label: 'O\'rtacha Latency', val: '48 ms', change: '-4 ms', icon: Clock, color: 'text-amber-400' },
          { label: 'Xatolar (5xx)', val: '0.04%', change: 'Optimal', icon: ShieldCheck, color: 'text-emerald-400' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="text-[11px] truncate">{kpi.label}</span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
              <div className="text-xl font-black text-white mb-1">{kpi.val}</div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                {kpi.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Traffic Visual Chart (Simplified Bar/Timeline SVG) */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">So'rovlar Dinamikasi (Kunlik Grafika)</h3>
            <span className="text-[11px] text-slate-400">Oxirgi 7 kunda olingan so'rovlar hajmi</span>
          </div>
          <span className="text-xs text-cyan-400 font-mono">1,240,500 Jami So'rovlar</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800">
          {[
            { day: 'Dush', val: 65, reqs: '142k' },
            { day: 'Sesh', val: 78, reqs: '168k' },
            { day: 'Chor', val: 92, reqs: '194k' },
            { day: 'Pay', val: 85, reqs: '180k' },
            { day: 'Juma', val: 98, reqs: '210k' },
            { day: 'Shan', val: 70, reqs: '150k' },
            { day: 'Yak', val: 88, reqs: '196k' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {bar.reqs}
              </span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/10"
                style={{ height: `${bar.val}%` }}
              />
              <span className="text-[10px] text-slate-400 font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Details: Top Pages, Status Codes, Devices, Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Top URLs */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Sahifalar</h4>
          <div className="space-y-2 text-xs font-mono">
            {[
              { path: '/', views: '48.2%' },
              { path: '/api/v1/products', views: '22.6%' },
              { path: '/checkout', views: '14.1%' },
              { path: '/blog/new-release', views: '8.4%' },
              { path: '/contact', views: '6.7%' },
            ].map((p, i) => (
              <div key={i} className="flex justify-between text-slate-300">
                <span className="truncate mr-2 text-cyan-300">{p.path}</span>
                <span className="text-slate-400">{p.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HTTP Status Codes */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">HTTP Javob Kodlari</h4>
          <div className="space-y-2 text-xs">
            {[
              { code: '200 OK', pct: 94.2, color: 'bg-emerald-400' },
              { code: '304 Not Modified', pct: 4.1, color: 'bg-cyan-400' },
              { code: '404 Not Found', pct: 1.6, color: 'bg-amber-400' },
              { code: '500 Server Error', pct: 0.1, color: 'bg-rose-400' },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white font-mono">{s.code}</span>
                  <span className="text-slate-400">{s.pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Geografik Hududlar</h4>
          <div className="space-y-2 text-xs">
            {[
              { country: "O'zbekiston 🇺🇿", pct: '78.4%' },
              { country: "Qozog'iston 🇰🇿", pct: '11.2%' },
              { country: 'Rossiya 🇷🇺', pct: '5.1%' },
              { country: 'Germaniya 🇩🇪', pct: '3.2%' },
              { country: 'Boshqa davlatlar 🌐', pct: '2.1%' },
            ].map((c, i) => (
              <div key={i} className="flex justify-between text-slate-300">
                <span>{c.country}</span>
                <span className="font-mono text-slate-400">{c.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Qurilmalar Turi</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Smartfon</span>
              </span>
              <span className="font-mono font-bold text-white">74%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                <span>Desktop (Kompyuter)</span>
              </span>
              <span className="font-mono font-bold text-white">24%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Planshet</span>
              </span>
              <span className="font-mono font-bold text-white">2%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
