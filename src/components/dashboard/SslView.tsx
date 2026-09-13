import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  KeyRound, 
  AlertTriangle, 
  ExternalLink,
  Cpu,
  Globe
} from 'lucide-react';
import { DomainItem } from '../../types';

interface SslViewProps {
  domains: DomainItem[];
  onIssueSsl: (domainId: string) => void;
}

export const SslView: React.FC<SslViewProps> = ({ domains, onIssueSsl }) => {
  const [issuing, setIssuing] = useState<string | null>(null);
  const [forceHttps, setForceHttps] = useState<Record<string, boolean>>({
    dom_01: true,
    dom_02: true,
  });

  const handleIssue = async (domainId: string) => {
    setIssuing(domainId);
    setTimeout(() => {
      onIssueSsl(domainId);
      setIssuing(null);
    }, 1200);
  };

  const toggleForceHttps = (id: string) => {
    setForceHttps({ ...forceHttps, [id]: !forceHttps[id] });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">SSL Sertifikatlari & HTTPS Xavfsizligi</h2>
        <p className="text-xs text-slate-400 mt-1">
          Barcha domenlar Let's Encrypt TLS 1.3 avtomatik yangilanuvchi shifrlash sertifikatlari bilan himoyalanadi
        </p>
      </div>

      {/* SSL Standards Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
            <Lock className="w-4 h-4" />
            <span>Let's Encrypt ACME v2</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Har 60 kunda avtomatik ravishda nol uzilish bilan sertifikatlar yangilanadi.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>TLS 1.3 & HTTP/3 (QUIC)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            0-RTT tezkor qo'l siqish va xavfsiz ECDSA P-256 shifrlash protokoli yoqilgan.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
            <KeyRound className="w-4 h-4" />
            <span>HSTS & OCSP Stapling</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Brauzer darajasida majburiy HTTPS va sertifikat holatini keshlovchi OCSP mexanizmi.
          </p>
        </div>
      </div>

      {/* Domains SSL List */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Domenlar Bo'yicha SSL Sertifikatlar Holati</h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {domains.map((dom) => (
            <div key={dom.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  dom.sslActive ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{dom.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      dom.sslActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}>
                      {dom.sslActive ? 'Faol & Himoyalangan' : 'SSL Faollashtirilmagan'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    Emitent: Let's Encrypt Authority X3 • Amal qilish muddati: 2026-11-20 gacha
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                {/* Force HTTPS Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Force HTTPS:</span>
                  <button
                    onClick={() => toggleForceHttps(dom.id)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      forceHttps[dom.id] ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        forceHttps[dom.id] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Renew / Issue Button */}
                <button
                  onClick={() => handleIssue(dom.id)}
                  disabled={issuing === dom.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${issuing === dom.id ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{issuing === dom.id ? 'Generatsiya...' : 'Qayta Yangilash'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
