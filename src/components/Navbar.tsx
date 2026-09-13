import React from 'react';
import { 
  Cloud, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Server, 
  User as UserIcon, 
  LayoutDashboard, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-500 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#090d19] rounded-[11px] flex items-center justify-center">
              <Cloud className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                ASTRA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">FOLIO</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Cloud
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline -mt-0.5">
              Kodingizdan — Cloudgacha
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${currentView === 'landing' ? 'text-cyan-400 bg-cyan-950/30' : 'hover:text-white hover:bg-slate-800/50'}`}
          >
            Bosh sahifa
          </button>
          <a
            href="#domains"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors flex items-center gap-1 text-cyan-300"
          >
            <span>Domenlar (.UZ)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">25k</span>
          </a>
          <a
            href="#plans"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Tariflar
          </a>
          <a
            href="#features"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Xususiyatlar
          </a>
          <a
            href="#infrastructure"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('infrastructure')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Infratuzilma
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(currentView === 'dashboard' ? 'landing' : 'dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentView === 'dashboard' ? 'Saytni ko\'rish' : 'Dashboard'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  {user.firstName[0]}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-slate-200 leading-tight">{user.firstName} {user.lastName}</div>
                  <div className="text-[10px] text-cyan-400 uppercase font-mono">ASTRA PRO</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Chiqish"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Kirish
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <span>Boshlash</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
