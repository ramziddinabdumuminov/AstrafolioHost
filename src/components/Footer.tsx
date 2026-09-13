import React from 'react';
import { Cloud, ShieldCheck, Heart, Terminal, Globe, Server, Lock } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'refund' | 'cookies') => void;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05080f] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/20">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ASTRA<span className="text-cyan-400">FOLIO</span>
              </span>
            </div>
            
            <p className="text-slate-300 font-medium">
              “Kodingizdan — Cloudgacha.”
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              “Saytingiz. Joyingiz. Kelajagingiz.” — O'zbekiston va xalqaro dasturchilar uchun yuqori unumdorlikka ega xavfsiz Cloud Hosting, Git CI/CD va avtomatlashtirilgan DevOps infratuzilmasi.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Klaster: 99.98% Uptime Barqaror
              </div>
            </div>
          </div>

          {/* Mahsulotlar */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Xizmatlar</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#plans" className="hover:text-cyan-400 transition-colors">Veb & Cloud Hosting</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Domenlar va DNS</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Vebsayt Konstruktori</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">PostgreSQL & MySQL</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Avtomatik SSL</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Astra AI Yordamchi</a></li>
            </ul>
          </div>

          {/* Dasturchilar uchun */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Dasturchilar</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">GitHub & GitLab Deploy</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">CI/CD Quvurlari</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Xavfsiz Web Terminal</a></li>
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">WAF & OWASP Himoya</a></li>
              <li><a href="#infrastructure" className="hover:text-cyan-400 transition-colors">Tier-III Serverlar</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">API Hujjatlari</a></li>
            </ul>
          </div>

          {/* Huquqiy & Ma'lumot */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Huquqiy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-cyan-400 transition-colors text-left">
                  Maxfiylik siyosati
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-cyan-400 transition-colors text-left">
                  Foydalanish shartlari
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-cyan-400 transition-colors text-left">
                  Mablag'ni qaytarish (Refund)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('cookies')} className="hover:text-cyan-400 transition-colors text-left">
                  Cookie siyosati
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block pt-1">
                  Server joylashuvi: Toshkent (UZ-1), Samarqand (UZ-2), Frankfurt (EU-1)
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ASTRAFOLIO Cloud Platform. Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>To'lov turlari:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">Payme</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">Click</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">Uzcard / Humo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
