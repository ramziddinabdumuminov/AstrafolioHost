import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Play, 
  Square, 
  RotateCw, 
  Trash2, 
  FolderOpen, 
  ExternalLink, 
  Cpu, 
  Server, 
  ShieldCheck, 
  GitBranch, 
  Terminal,
  Settings,
  X,
  Monitor,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Website, RuntimeType } from '../../types';
import { DomainBrowserModal } from './DomainBrowserModal';
import { DnsHelpModal } from './DnsHelpModal';

interface WebsitesViewProps {
  websites: Website[];
  onCreateWebsite: (data: any) => void;
  onToggleSite: (siteId: string) => void;
  onRestartSite: (siteId: string) => void;
  onDeleteSite: (siteId: string) => void;
  onNavigate: (viewId: string) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  websites,
  onCreateWebsite,
  onToggleSite,
  onRestartSite,
  onDeleteSite,
  onNavigate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isDnsHelpOpen, setIsDnsHelpOpen] = useState(false);
  const [activePreviewSite, setActivePreviewSite] = useState<Website | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    customDomain: '',
    runtime: 'nodejs' as RuntimeType,
    region: 'Tashkent (UZ-1)',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    envKey: 'DATABASE_URL',
    envVal: 'postgresql://user:pass@localhost:5432/mydb',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWebsite({
      name: formData.name,
      customDomain: formData.customDomain,
      runtime: formData.runtime,
      region: formData.region,
      buildCommand: formData.buildCommand,
      startCommand: formData.startCommand,
      envVars: {
        [formData.envKey]: formData.envVal,
        NODE_ENV: 'production',
      },
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      customDomain: '',
      runtime: 'nodejs',
      region: 'Tashkent (UZ-1)',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
      envKey: 'DATABASE_URL',
      envVal: 'postgresql://user:pass@localhost:5432/mydb',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Vebsaytlar va Ilovalar Boshqaruvi</h2>
          <p className="text-xs text-slate-400">
            Har bir vebsayt xavfsiz ajratilgan (isolated) konteynerda ishlaydi
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Sayt Yaratish</span>
        </button>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {websites.map((site) => (
          <div
            key={site.id}
            className="rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${site.status === 'RUNNING' ? 'bg-emerald-400 shadow-sm shadow-emerald-500' : 'bg-amber-400'}`} />
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                      {site.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Port: {site.port} • {site.region}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                  site.status === 'RUNNING' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                }`}>
                  {site.status}
                </span>
              </div>

              {/* Link */}
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 mb-4 flex items-center justify-between text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setActivePreviewSite(site);
                    setIsBrowserOpen(true);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1.5 truncate cursor-pointer text-left font-mono"
                  title="Saytni jonli ichki brauzerda ochish"
                >
                  <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">https://{site.domain}</span>
                </button>
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {site.sslActive && (
                    <span className="text-[10px] text-emerald-400 font-sans">SSL 🔒</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreviewSite(site);
                      setIsDnsHelpOpen(true);
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    title="ERR_NAME_NOT_RESOLVED sababi va DNS yechimi"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] mb-4">
                <div>
                  <span className="text-slate-500 block">Runtime</span>
                  <span className="font-semibold text-slate-300">{site.runtime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CPU / RAM</span>
                  <span className="font-semibold text-slate-300">{site.cpuPercent}% / {site.ramMb}M</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Disk</span>
                  <span className="font-semibold text-slate-300">{site.storageMb} MB</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActivePreviewSite(site);
                    setIsBrowserOpen(true);
                  }}
                  title="Saytni Jonli Brauzerda Ochish"
                  className="px-2.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-600/20"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Jonli</span>
                </button>

                <button
                  onClick={() => onToggleSite(site.id)}
                  title={site.status === 'RUNNING' ? 'To\'xtatish' : 'Ishga tushirish'}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    site.status === 'RUNNING'
                      ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                      : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {site.status === 'RUNNING' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onRestartSite(site.id)}
                  title="Qayta yuklash (Restart)"
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

              <button
                onClick={() => {
                  if (confirm(`${site.name} saytini o'chirishni tasdiqlaysizmi?`)) {
                    onDeleteSite(site.id);
                  }
                }}
                title="Saytni o'chirish"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Create Website Modal (Section 7) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-cyan-500/10 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Vebsayt Yaratish</h3>
            <p className="text-xs text-slate-400 mb-5">
              Parametrlarni kiriting, konteyner avtomatik sozlanadi va ishga tushadi
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Sayt Nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Mening Do'konim"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Domen (ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="customdomain.uz yoki bo'sh qoldiring (.astrafolio.uz)"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Bo'sh qoldirilsa avtomatik tekin .astrafolio.uz subdomeni beriladi
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dasturlash Muhiti (Runtime)</label>
                  <select
                    value={formData.runtime}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value as RuntimeType })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="nodejs">Node.js 20 LTS</option>
                    <option value="python">Python 3.12 (FastAPI)</option>
                    <option value="php">PHP 8.3 FPM</option>
                    <option value="static">Static HTML5 / CSS</option>
                    <option value="docker">Docker (Dockerfile)</option>
                    <option value="git">Git Repository</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Server Mintaqasi (Region)</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Tashkent (UZ-1)">Toshkent (UZ-1) — 2ms</option>
                    <option value="Samarkand (UZ-2)">Samarqand (UZ-2) — 8ms</option>
                    <option value="Frankfurt (EU-1)">Frankfurt (EU-1) — 42ms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Build Command</label>
                  <input
                    type="text"
                    value={formData.buildCommand}
                    onChange={(e) => setFormData({ ...formData, buildCommand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Command</label>
                  <input
                    type="text"
                    value={formData.startCommand}
                    onChange={(e) => setFormData({ ...formData, startCommand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Muhit O'zgaruvchisi (.env)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="KEY"
                    value={formData.envKey}
                    onChange={(e) => setFormData({ ...formData, envKey: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
                  />
                  <input
                    type="text"
                    placeholder="VALUE"
                    value={formData.envVal}
                    onChange={(e) => setFormData({ ...formData, envVal: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-lg hover:opacity-95 shadow-lg shadow-cyan-500/20"
                >
                  Saytni Yaratish & Deploy Qilish
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

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
