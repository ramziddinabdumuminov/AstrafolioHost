import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Smartphone, 
  Eye, 
  FileText,
  KeyRound
} from 'lucide-react';
import { AuditLogItem } from '../../types';

interface SecurityViewProps {
  auditLogs: AuditLogItem[];
}

export const SecurityView: React.FC<SecurityViewProps> = ({ auditLogs }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [wafRules, setWafRules] = useState([
    { id: 'sqli', name: 'SQL Injection Prevention (OWASP Top 10)', enabled: true, blocked: 1420 },
    { id: 'xss', name: 'Cross-Site Scripting (XSS) Sanitizer', enabled: true, blocked: 890 },
    { id: 'path_traversal', name: 'Path Traversal & Directory Climbing Shield', enabled: true, blocked: 310 },
    { id: 'rate_limit', name: 'IP Rate Limiting (120 req/min Anti-DDoS)', enabled: true, blocked: 2150 },
    { id: 'rce', name: 'Remote Code Execution (RCE) Guard', enabled: true, blocked: 65 },
    { id: 'anti_bot', name: 'Avtomatlashtirilgan Bot & Scraper Filtrlash', enabled: true, blocked: 4800 },
  ]);

  const toggleWaf = (id: string) => {
    setWafRules(
      wafRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const totalBlocked = wafRules.reduce((acc, r) => acc + r.blocked, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Xavfsizlik Markazi & WAF Himoyasi</h2>
        <p className="text-xs text-slate-400 mt-1">
          OWASP Top 10 kiberxavfsizlik qoidalari, Web Application Firewall va hisob xavfsizligi
        </p>
      </div>

      {/* Security Score Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1420] to-[#090e1a] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/10">
            <span className="text-2xl font-black font-mono">96</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Xavfsizlik Reytingi: A+ (A'lo)</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase font-mono">
                Himoyalangan
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Barcha vebsaytlar TLS 1.3 shifrlangan, 2FA yoqilgan, WAF qoidalari faol va jami <strong>{totalBlocked.toLocaleString()} ta</strong> xavfli so'rov to'xtatilgan.
            </p>
          </div>
        </div>

        {/* 2FA Toggle Switch */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <div className="text-xs">
            <span className="font-bold text-white block">2FA Autentifikatsiya</span>
            <span className="text-[11px] text-slate-400">{twoFactorEnabled ? 'Faol (Google Auth)' : 'O\'chiq'}</span>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* WAF Rules Table */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">WAF (Web Application Firewall) Qoidalari</h3>
            <p className="text-[11px] text-slate-400">Har bir kiruvchi HTTP paket real-vaqtda tekshiriladi</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">OWASP v3.3 Qoidalari</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {wafRules.map((rule) => (
            <div key={rule.id} className="p-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  rule.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs">{rule.name}</span>
                  <span className="text-[11px] text-slate-400 block">
                    To'xtatilgan xavfli so'rovlar: <strong className="text-rose-400 font-mono">{rule.blocked.toLocaleString()} ta</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleWaf(rule.id)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  rule.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    rule.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Xavfsizlik va Audit Loglari</h3>
            <p className="text-[11px] text-slate-400">Tizimdagi barcha muhim operatsiyalar jurnali</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Immutable Audit Store</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Vaqt</th>
                <th className="pb-3 font-semibold">Foydalanuvchi</th>
                <th className="pb-3 font-semibold">Amal (Action)</th>
                <th className="pb-3 font-semibold">Resurs</th>
                <th className="pb-3 font-semibold">IP Manzil</th>
                <th className="pb-3 text-right font-semibold">Natija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2.5 text-white font-sans font-medium">{log.userName}</td>
                  <td className="py-2.5 text-cyan-300">{log.action}</td>
                  <td className="py-2.5 text-slate-300">{log.resource}</td>
                  <td className="py-2.5 text-slate-400">{log.ipAddress}</td>
                  <td className="py-2.5 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
