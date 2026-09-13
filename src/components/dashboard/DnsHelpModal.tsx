import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  HelpCircle, 
  Monitor, 
  Server, 
  ShieldCheck, 
  Terminal, 
  X,
  Zap
} from 'lucide-react';

interface DnsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainName: string;
  serverIp?: string;
  onOpenInAppBrowser?: () => void;
}

export const DnsHelpModal: React.FC<DnsHelpModalProps> = ({
  isOpen,
  onClose,
  domainName,
  serverIp = '185.196.220.14',
  onOpenInAppBrowser,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'cctld' | 'hosts' | 'direct'>('explanation');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const hostsLine = `${serverIp} ${domainName} www.${domainName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-[#0b101d] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative my-8 text-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold mb-4">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>ERR_NAME_NOT_RESOLVED TUSHUNTIRIShI VA YECHIMI</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
          Nega <span className="text-cyan-400 underline decoration-cyan-500/50">{domainName}</span> ochilmadi?
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
          Brauzeringizda <code className="text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded font-mono">ERR_NAME_NOT_RESOLVED</code> chiqishining asosiy sababi: 
          Domen Astrafolio platformasida yaratilgan, lekin global internet provayderlari (Uztelecom, Beeline va h.k.) ushbu domenni qaysi server IP-siga yo'naltirishni hali bilmaydi.
        </p>

        {/* Navigation tabs */}
        <div className="flex border-b border-slate-800 gap-1 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'explanation'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>1. Eng tezkor yechim</span>
          </button>
          <button
            onClick={() => setActiveTab('cctld')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'cctld'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. ccTLD.uz / Registrator DNS</span>
          </button>
          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hosts'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Kompyuterda ochish (Hosts)</span>
          </button>
        </div>

        {/* Tab 1: Instant Platform Solution */}
        {activeTab === 'explanation' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-900/60 text-cyan-300 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Ichki Jonli Brauzer Simulyatori (Tavsiya etiladi)
                  </h4>
                  <p className="text-slate-300 leading-relaxed mb-3">
                    Astrafolio platformasida siz saytingizni hech qanday DNS sozlamalarisiz hoziroq ko'rishingiz mumkin. 
                    Barcha HTML, CSS, JavaScript va API-lar to'liq ishlaydi.
                  </p>
                  {onOpenInAppBrowser && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenInAppBrowser();
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>{domainName} saytini Jonli Brauzerda Ko'rish</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>To'g'ridan-to'g'ri Cloud Preview havolasi:</span>
              </div>
              <p className="text-slate-400">
                Ushbu havolani brauzerning yangi tabida ochsangiz, sayt DNS xatoligisiz to'liq ishga tushadi:
              </p>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-cyan-400 text-[11px]">
                <span className="truncate mr-2">{`/api/preview/domain/${domainName}`}</span>
                <a
                  href={`/api/preview/domain/${domainName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-xs flex items-center gap-1 font-sans shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ochish</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: ccTLD.uz and Registrar DNS */}
        {activeTab === 'cctld' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <p className="text-slate-300 leading-relaxed">
              Agar <strong className="text-white">{domainName}</strong> domenini haqiqiy registrator 
              (Eskiz.uz, Billur.com, Arsenal-D, cctld.uz yoki boshqa) orqali sotib olgan bo'lsangiz, 
              butun dunyo bo'ylab ochilishi uchun quyidagi DNS yozuvlarni registratoringiz kabinetiga kiriting:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">A-Yozuv (A Record):</span>
                  <span className="font-mono text-cyan-300 font-bold">@ (yoki {domainName}) ➔ {serverIp}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(serverIp, 'ip')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px] transition-colors"
                >
                  {copiedType === 'ip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'ip' ? 'Nusxalandi' : 'IP nusxalash'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Nameserverlar (NS):</span>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded">
                    <span className="text-emerald-400">ns1.astrafolio.uz</span>
                    <button
                      onClick={() => copyToClipboard('ns1.astrafolio.uz', 'ns1')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedType === 'ns1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded">
                    <span className="text-emerald-400">ns2.astrafolio.uz</span>
                    <button
                      onClick={() => copyToClipboard('ns2.astrafolio.uz', 'ns2')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedType === 'ns2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span>
                <strong>Eslatma:</strong> DNS o'zgarishlari provayderlar bo'ylab yangilanishi (propagatsiya) 15 daqiqadan 2-4 soatgacha vaqt oladi.
              </span>
            </div>

            {/* Step-by-step for Uzbek Registrars */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-white mb-2">O'zbekiston registratorlarida sozlash bo'yicha ko'rsatma:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Eskiz.uz:</span>
                  <p className="text-slate-400 text-[10px]">
                    Kabinet ➔ Mening domenlarim ➔ DNS boshqaruvi ➔ A yozuviga <span className="font-mono text-white">185.196.220.14</span> kiriting.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-1">Billur.com:</span>
                  <p className="text-slate-400 text-[10px]">
                    Mijoz kabineti ➔ Domenlar ➔ DNS zonasi ➔ Host: <span className="font-mono text-white">@</span>, IP: <span className="font-mono text-white">185.196.220.14</span>.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">Arsenal-D / ccTLD:</span>
                  <p className="text-slate-400 text-[10px]">
                    DNS boshqaruvi ➔ NS serverlarga <span className="font-mono text-white">ns1.astrafolio.uz</span> va <span className="font-mono text-white">ns2.astrafolio.uz</span> ni yozing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Local Hosts file for developer testing */}
        {activeTab === 'hosts' && (
          <div className="space-y-4 text-xs animate-in fade-in">
            <p className="text-slate-300 leading-relaxed">
              Domen hali global ro'yxatdan o'tmagan bo'lsa ham, kompyuteringizdagi <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">hosts</code> fayliga ushbu qatorni qo'shib, o'z brauzeringizda to'g'ridan-to'g'ri <strong className="text-white">https://{domainName}</strong> ni ochishingiz mumkin:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-mono">Qo'shiladigan qator:</span>
                <button
                  onClick={() => copyToClipboard(hostsLine, 'hosts')}
                  className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 flex items-center gap-1 text-[11px]"
                >
                  {copiedType === 'hosts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'hosts' ? 'Nusxalandi!' : 'Qatorni nusxalash'}</span>
                </button>
              </div>
              <pre className="font-mono text-emerald-400 text-[11px] p-2 bg-black/50 rounded border border-slate-800 overflow-x-auto">
                {hostsLine}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="font-bold text-white block mb-1">Windows foydalanuvchilari:</span>
                <p className="text-slate-400 mb-1.5">Bloknotni administrator nomidan oching va ushbu faylni tahrirlang:</p>
                <code className="text-[10px] font-mono text-cyan-300 block bg-slate-950 p-1 rounded">
                  C:\Windows\System32\drivers\etc\hosts
                </code>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="font-bold text-white block mb-1">Mac va Linux:</span>
                <p className="text-slate-400 mb-1.5">Terminalda quyidagi buyruqni ishga tushiring:</p>
                <code className="text-[10px] font-mono text-cyan-300 block bg-slate-950 p-1 rounded">
                  sudo nano /etc/hosts
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Astrafolio TAS-IX Klasteri: <strong className="text-slate-200">{serverIp}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Tushundim
          </button>
        </div>

      </div>
    </div>
  );
};
