import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  HardDrive, 
  FileCode, 
  KeyRound, 
  Clock, 
  Activity, 
  Bot, 
  CreditCard, 
  HelpCircle,
  FolderOpen,
  Mail,
  Server
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (viewId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // handled in parent or toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'overview', title: 'Bosh Sahifa (Dashboard Overview)', icon: Activity, group: 'Asosiy' },
    { id: 'websites', title: 'Saytlarim (Websites & Apps)', icon: Globe, group: 'Hosting' },
    { id: 'builder', title: 'Vebsayt Konstruktori (No-Code Builder)', icon: Layers, group: 'Hosting' },
    { id: 'domains', title: 'Domenlar va DNS Boshqaruvi', icon: Globe, group: 'Hosting' },
    { id: 'files', title: 'Fayl Menejeri & Kod Tahrirlagich', icon: FolderOpen, group: 'Fayllar' },
    { id: 'databases', title: 'Ma\'lumotlar Bazasi (PostgreSQL / MySQL)', icon: HardDrive, group: 'Baza' },
    { id: 'ssl', title: 'SSL Sertifikatlari (Let\'s Encrypt)', icon: KeyRound, group: 'Xavfsizlik' },
    { id: 'deployments', title: 'Git & CI/CD Avtomatlashtirilgan Deploy', icon: FileCode, group: 'DevOps' },
    { id: 'backups', title: 'Zaxira Nusxalari (Backups & S3)', icon: HardDrive, group: 'DevOps' },
    { id: 'cron', title: 'Cron Jobs (Vazifalar Rejalashtiruvchisi)', icon: Clock, group: 'DevOps' },
    { id: 'analytics', title: 'Analitika & Tashriflar Statistikasi', icon: Activity, group: 'Monitoring' },
    { id: 'security', title: 'Xavfsizlik Markazi & WAF (OWASP)', icon: ShieldCheck, group: 'Xavfsizlik' },
    { id: 'ai', title: 'Astra AI Yordamchi & Diagnostika', icon: Bot, group: 'AI & Yordam' },
    { id: 'email', title: 'Email Hosting & Pochta Qutilari', icon: Mail, group: 'Aloqa' },
    { id: 'billing', title: 'To\'lov & Obuna (Payme / Click)', icon: CreditCard, group: 'Moliyaviy' },
    { id: 'terminal', title: 'Astrafolio Web Terminal', icon: Terminal, group: 'Developer' },
    { id: 'support', title: 'Texnik Yordam & Tiketlar', icon: HelpCircle, group: 'AI & Yordam' },
    { id: 'admin', title: 'Admin & Server Klasteri (Node 01/02/03)', icon: Server, group: 'Admin' },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl shadow-cyan-500/15 overflow-hidden">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Bo'lim yoki buyruq nomini qidiring... (masalan: deploy, ssl, baza)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Hech qanday bo'lim topilmadi
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-300 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-500 font-mono">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>O'tish uchun bosing yoki Enter</span>
          <span className="font-mono">Ctrl + K</span>
        </div>

      </div>
    </div>
  );
};
