import React, { useState, useEffect } from 'react';
import {
  Store,
  Download,
  Star,
  CheckCircle2,
  Sparkles,
  Zap,
  Server,
  Layers,
  Search,
  Filter,
  ExternalLink,
  Bot,
  Globe,
  Database,
  Terminal,
  ShieldCheck,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { MarketplaceApp, Website, DomainItem } from '../../types';

interface MarketplaceViewProps {
  websites: Website[];
  domains: DomainItem[];
  onNavigate: (viewId: string) => void;
  onRefreshWebsites?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  websites,
  domains,
  onNavigate,
  onRefreshWebsites,
}) => {
  const [apps, setApps] = useState<MarketplaceApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Install Modal
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);
  const [installSiteName, setInstallSiteName] = useState('');
  const [installDomain, setInstallDomain] = useState('');
  const [adminPassword, setAdminPassword] = useState('AstraPass2026!');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState<string | null>(null);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/marketplace/apps');
      if (res.ok) {
        const data = await res.json();
        setApps(data.apps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleOpenInstall = (app: MarketplaceApp) => {
    setSelectedApp(app);
    const defaultSlug = app.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    setInstallSiteName(app.name);
    setInstallDomain(`${defaultSlug}.astrafolio.uz`);
    setInstallSuccessMessage(null);
  };

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsInstalling(true);
    try {
      const res = await fetch('/api/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: selectedApp.id,
          siteName: installSiteName,
          domainName: installDomain,
          adminPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInstallSuccessMessage(data.message || 'Muvaffaqiyatli ishga tushirildi!');
        if (onRefreshWebsites) onRefreshWebsites();
        setTimeout(() => {
          setSelectedApp(null);
          onNavigate('websites');
        }, 2200);
      } else {
        alert(data.error || 'O\'rnatishda xatolik');
      }
    } catch (err: any) {
      alert(err?.message || 'Server xatosi');
    } finally {
      setIsInstalling(false);
    }
  };

  const filteredApps = apps.filter((a) => {
    const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const categories = [
    { id: 'ALL', label: 'Barchasi' },
    { id: 'CMS', label: 'CMS & Do\'konlar' },
    { id: 'BOTS', label: 'Telegram Botlar' },
    { id: 'DEVTOOLS', label: 'Dasturchi Qurollari' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#091022] to-[#060b18] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-Click Avto-O'rnatuvchi & Shablonlar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Ilovalar va Botlar Bozori (Marketplace)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            WordPress, Python & Node.js Telegram botlari, Ghost CMS va avtomatizatsiya qurollarini bitta tugma orqali o'z shaxsiy serveringizda lahzada ishga tushiring.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090e1a] border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Shablon yoki bot qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#090e1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Grid of Apps */}
      {isLoading ? (
        <div className="p-16 text-center text-xs text-slate-500">Ilovalar yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={app.icon}
                      alt={app.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // fallback icon
                        (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg';
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                      v{app.version}
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{app.rating}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {app.description}
                </p>

                {/* Features Pill */}
                <div className="mt-4 space-y-1">
                  {app.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {app.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {app.installsCount.toLocaleString()} ta o'rnatilgan
                </span>

                <button
                  onClick={() => handleOpenInstall(app)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>O'rnatish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Install Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b101e] border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {installSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Muvaffaqiyatli O'rnatildi!</h3>
                <p className="text-xs text-slate-300">{installSuccessMessage}</p>
                <span className="text-[11px] text-cyan-400 block animate-pulse">
                  Vebsaytlar bo'limiga yo'naltirilmoqda...
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={selectedApp.icon}
                    alt={selectedApp.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain p-1 rounded-xl bg-slate-900 border border-slate-800"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedApp.name} o'rnatish</h3>
                    <span className="text-xs text-slate-400">
                      Avtomatik server konteyneri va domen konfiguratsiyasi
                    </span>
                  </div>
                </div>

                <form onSubmit={handleInstall} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Loyiha Nomi:</label>
                    <input
                      type="text"
                      required
                      value={installSiteName}
                      onChange={(e) => setInstallSiteName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Biriktiriladigan Domen:</label>
                    <div className="flex">
                      <input
                        type="text"
                        required
                        value={installDomain}
                        onChange={(e) => setInstallDomain(e.target.value.toLowerCase())}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Agar .uz xarid qilgan bo'lsangiz, domeningizni kiriting
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Admin Paroli:</label>
                    <input
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1 text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Avtomatik qo'shiladigan imkoniyatlar:</span>
                    </div>
                    <div>• TAS-IX Anycast CDN (1-2 ms latensiya)</div>
                    <div>• Let's Encrypt Wildcard SSL sertifikati</div>
                    <div>• Avtomatik Docker ajratilgan konteyneri</div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={isInstalling}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isInstalling ? "O'rnatilmoqda..." : "Ishga Tushirish (1-Click)"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
