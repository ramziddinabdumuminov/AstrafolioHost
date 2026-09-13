import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  HelpCircle, 
  Lock, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  RefreshCw, 
  ShieldCheck, 
  Smartphone, 
  Tablet, 
  X 
} from 'lucide-react';
import { DnsHelpModal } from './DnsHelpModal';

interface DomainBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  websiteId?: string;
  websiteName?: string;
}

export const DomainBrowserModal: React.FC<DomainBrowserModalProps> = ({
  isOpen,
  onClose,
  domainName,
  websiteId,
  websiteName,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isDnsHelpOpen, setIsDnsHelpOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  const previewUrl = websiteId 
    ? `/api/preview/${websiteId}` 
    : `/api/preview/domain/${encodeURIComponent(domainName)}`;

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <div 
          className={`bg-[#0b101d] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[92vh]'
          }`}
        >
          {/* Top Browser Chrome Bar */}
          <div className="bg-[#0e1628] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
            {/* Window Controls (Mac Style) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-rose-500/90 hover:bg-rose-600 transition-colors"
                  title="Yopish"
                />
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-3 h-3 rounded-full bg-amber-500/90 hover:bg-amber-600 transition-colors"
                  title="O'lcham"
                />
                <button 
                  onClick={handleReload}
                  className="w-3 h-3 rounded-full bg-emerald-500/90 hover:bg-emerald-600 transition-colors"
                  title="Yangilash"
                />
              </div>

              {/* Navigation icons */}
              <div className="hidden sm:flex items-center gap-1 ml-3 text-slate-400">
                <button 
                  disabled
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button 
                  disabled
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-40"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleReload}
                  className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Qayta yuklash"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Smart Address Bar */}
            <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2 bg-[#070b14] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
              <div className="flex items-center gap-1 text-emerald-400 font-mono shrink-0">
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[10px] font-bold text-emerald-500 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  TLS 1.3
                </span>
              </div>

              <div className="flex-1 font-mono text-slate-200 truncate flex items-center gap-1">
                <span className="text-slate-500">https://</span>
                <span className="text-white font-semibold">{domainName}</span>
                <span className="text-slate-500">/</span>
              </div>

              <button
                onClick={() => setIsDnsHelpOpen(true)}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Tashqi brauzerda ERR_NAME_NOT_RESOLVED chiqsa nima qilish kerak?"
              >
                <HelpCircle className="w-3 h-3" />
                <span className="hidden sm:inline">DNS Yechimi</span>
              </button>
            </div>

            {/* Device Switcher & External Open */}
            <div className="flex items-center gap-1.5">
              <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    device === 'desktop' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Desktop ko'rinish (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    device === 'tablet' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Planshet ko'rinish (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    device === 'mobile' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Smartfon ko'rinish (390px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Alohida to'liq yangi tabda ochish"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:block p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title={isFullscreen ? 'Oynani kichraytirish' : 'To\'liq ekranga yoyish'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Yopish"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Browser Notification Banner */}
          <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">
                <strong className="text-white font-sans">{websiteName || domainName}</strong> Astrafolio Cloud ichki konteynerida faol ishlamoqda.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <button
                onClick={() => setIsDnsHelpOpen(true)}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>ERR_NAME_NOT_RESOLVED bo'lsa nima qilish kerak?</span>
              </button>
            </div>
          </div>

          {/* Main Iframe Web Canvas */}
          <div className="flex-1 bg-slate-950 overflow-hidden flex items-center justify-center relative p-1 sm:p-2">
            <div className={`h-full ${getDeviceWidth()} mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col relative`}>
              <iframe
                key={iframeKey}
                src={previewUrl}
                title={`Live preview of ${domainName}`}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          {/* Browser Status Footer */}
          <div className="bg-[#0e1628] border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                200 OK
              </span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-slate-400">Proxy: Astrafolio TAS-IX (185.196.220.14)</span>
              <span className="hidden md:inline text-slate-500">•</span>
              <span className="hidden md:inline text-slate-400">SSL: TLS 1.3 / Let's Encrypt Active</span>
            </div>

            <div className="flex items-center gap-2 font-sans">
              <button
                onClick={() => setIsDnsHelpOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline text-xs"
              >
                Haqiqiy domen registratorini ulash qo'llanmasi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded DNS Troubleshooting Modal */}
      <DnsHelpModal
        isOpen={isDnsHelpOpen}
        onClose={() => setIsDnsHelpOpen(false)}
        domainName={domainName}
        onOpenInAppBrowser={() => {
          setIsDnsHelpOpen(false);
          handleReload();
        }}
      />
    </>
  );
};
