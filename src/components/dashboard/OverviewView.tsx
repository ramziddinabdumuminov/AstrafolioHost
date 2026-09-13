import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Globe, 
  HardDrive, 
  Cpu, 
  Database, 
  ShieldCheck, 
  RefreshCw, 
  Play, 
  Square, 
  RotateCw, 
  ExternalLink, 
  ArrowUpRight, 
  FolderOpen, 
  Terminal,
  Zap,
  Server,
  Monitor,
  HelpCircle,
  Mail,
  Store,
  Gauge
} from 'lucide-react';
import { User, Website, DatabaseInstance, DomainItem, Deployment, ServerNode } from '../../types';
import { DomainBrowserModal } from './DomainBrowserModal';
import { DnsHelpModal } from './DnsHelpModal';

interface OverviewViewProps {
  user: User;
  websites: Website[];
  databases: DatabaseInstance[];
  domains: DomainItem[];
  deployments: Deployment[];
  servers: ServerNode[];
  onNavigate: (viewId: string) => void;
  onRestartSite: (siteId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  websites,
  databases,
  domains,
  deployments,
  servers,
  onNavigate,
  onRestartSite,
}) => {
  const runningSites = websites.filter((w) => w.status === 'RUNNING').length;
  const totalStorageMb = websites.reduce((acc, w) => acc + w.storageMb, 0);

  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isDnsHelpOpen, setIsDnsHelpOpen] = useState(false);
  const [activePreviewSite, setActivePreviewSite] = useState<Website | null>(null);

  const [telemetry, setTelemetry] = useState({
    cpuPercent: 12.4,
    ramUsedMb: 436,
    ramTotalMb: 4096,
    requestsPerSec: 48,
    networkInKbps: '142.5',
    networkOutKbps: '580.2',
    latencyMs: 2,
    activeConnections: 128,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/telemetry/live');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setTelemetry((prev) => ({
              ...prev,
              ...data,
            }));
          }
        }
      } catch {}
    };

    fetchTelemetry();
    const timer = setInterval(fetchTelemetry, 2500);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Welcome & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-[#0b1224] border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl font-black text-white">
              Xush kelibsiz, {user.firstName} {user.lastName}!
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase font-mono">
              ASTRA ENTERPRISE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Toshkent Tier-III Master klasteri normal rejimda ishlamoqda. Latensiya: {telemetry.latencyMs}ms • Real-vaqt monitoringi faol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px]">Klaster Holati</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              99.99% Jonli Uptime
            </span>
          </div>
          <button
            onClick={() => onNavigate('websites')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Yangi Sayt Yaratish</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid (Section 6: CPU, RAM, Storage, Bandwidth, Websites, Domains, Databases, Backups) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CPU */}
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>CPU Yuklamasi</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mb-2">{telemetry.cpuPercent}% <span className="text-[11px] text-slate-400 font-normal">/ 4 Core</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(5, telemetry.cpuPercent))}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">Real-vaqt: {telemetry.requestsPerSec} so'rov/soniya</span>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>RAM Xotira</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mb-2">{telemetry.ramUsedMb} MB <span className="text-[11px] text-slate-400 font-normal">/ {telemetry.ramTotalMb} MB</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(telemetry.ramUsedMb / telemetry.ramTotalMb) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">{((telemetry.ramTotalMb - telemetry.ramUsedMb) / 1024).toFixed(2)} GB erkin xotira</span>
        </div>

        {/* Storage (NVMe) */}
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>NVMe Disk Bandligi</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mb-2">{totalStorageMb} MB <span className="text-[11px] text-slate-400 font-normal">/ 25 GB</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full rounded-full" style={{ width: `${(totalStorageMb / 25600) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">Gen4 SSD: 7000 MB/s o'qish/yozish</span>
        </div>

        {/* Bandwidth */}
        <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tarmoq Kirish/Chiqish</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mb-2">{telemetry.networkOutKbps} <span className="text-[11px] text-slate-400 font-normal">Kb/s</span></div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: '22%' }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">In: {telemetry.networkInKbps} Kb/s • TAS-IX: 1 Gbit/s</span>
        </div>

      </div>

      {/* Secondary Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          onClick={() => onNavigate('websites')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-slate-400 block mb-1">Vebsaytlar</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {runningSites} / {websites.length} faol
            </span>
            <Globe className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('marketplace')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-blue-500/30 hover:border-blue-500/60 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-blue-400 block mb-1 font-medium">Marketplace</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Bot & CMS
            </span>
            <Store className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('domains')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-slate-400 block mb-1">Domen & DNS</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {domains.length} ta domen
            </span>
            <Globe className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('email')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all group cursor-pointer shadow-sm shadow-cyan-500/10"
        >
          <span className="text-[11px] text-cyan-400 block mb-1 font-medium">Webmail</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              firdavs@...
            </span>
            <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('speed')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-emerald-400 block mb-1 font-medium">Tezlik & SEO</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 font-mono">
              98 / 100
            </span>
            <Gauge className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('databases')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-slate-400 block mb-1">Ma'lumotlar</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {databases.length} ta baza
            </span>
            <Database className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('security')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer"
        >
          <span className="text-[11px] text-slate-400 block mb-1">Xavfsizlik</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-emerald-400 font-mono">
              96 / 100
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('admin')}
          className="p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/40 hover:border-rose-500/80 text-left transition-all group cursor-pointer shadow-sm shadow-rose-500/10"
        >
          <span className="text-[11px] text-rose-400 block mb-1 font-bold">SuperAdmin</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white group-hover:text-rose-300 transition-colors">
              Root Klaster
            </span>
            <Server className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>

      {/* Active Websites Table / List */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Faol Vebsaytlar va Ilovalar</h3>
            <p className="text-[11px] text-slate-400">Ajratilgan konteynerlar holati va tashriflar</p>
          </div>
          <button
            onClick={() => onNavigate('websites')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Barchasini ko'rish</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {websites.map((site) => (
            <div key={site.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors">
              
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 sm:mt-0 ${site.status === 'RUNNING' ? 'bg-emerald-400 shadow-sm shadow-emerald-500' : 'bg-amber-400'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{site.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {site.runtimeVersion}
                    </span>
                    {site.sslActive && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        HTTPS 🔒
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreviewSite(site);
                      setIsBrowserOpen(true);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5 mt-0.5 cursor-pointer font-mono"
                    title="Jonli brauzerda ochish"
                  >
                    <Monitor className="w-3 h-3 text-cyan-400" />
                    <span>https://{site.domain}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="hidden md:block">
                  <span className="text-slate-500 block text-[10px]">Resurs</span>
                  <span className="text-slate-200 font-mono">CPU {site.cpuPercent}% • {site.ramMb}MB</span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-slate-500 block text-[10px]">Tashriflar (Oy)</span>
                  <span className="text-slate-200 font-mono">{site.visitsMonth.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRestartSite(site.id)}
                    title="Konteynerni qayta yuklash"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('files')}
                    title="Fayl menejeri"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('terminal')}
                    title="Terminal"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Recent Deployments Section */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">So'nggi CI/CD Deploy Tarixi</h3>
            <p className="text-[11px] text-slate-400">Avtomatlashtirilgan yig'ilish va xavfsizlik tekshiruvlari</p>
          </div>
          <button
            onClick={() => onNavigate('deployments')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {deployments.slice(0, 2).map((dep) => (
            <div key={dep.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-[10px]">
                  {dep.status}
                </span>
                <div>
                  <div className="font-semibold text-white">
                    {dep.websiteName} <span className="text-slate-500 font-normal">({dep.commitHash})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{dep.commitMessage}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                <span>Vaqt: {dep.duration}</span>
                <span>Branch: {dep.branch}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-App Live Browser Modal */}
      <DomainBrowserModal
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        domainName={activePreviewSite?.domain || 'astrafolio.uz'}
        websiteId={activePreviewSite?.id}
        websiteName={activePreviewSite?.name}
      />

      {/* DNS Troubleshooting Modal for ERR_NAME_NOT_RESOLVED */}
      <DnsHelpModal
        isOpen={isDnsHelpOpen}
        onClose={() => setIsDnsHelpOpen(false)}
        domainName={activePreviewSite?.domain || 'astrafolio.uz'}
        onOpenInAppBrowser={() => {
          setIsDnsHelpOpen(false);
          setIsBrowserOpen(true);
        }}
      />

    </div>
  );
};
