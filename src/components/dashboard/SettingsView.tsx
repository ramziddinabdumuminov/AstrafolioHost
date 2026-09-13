import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  KeyRound, 
  Bell, 
  Smartphone, 
  Check, 
  Copy, 
  Save,
  Globe
} from 'lucide-react';
import { User as UserType } from '../../types';

interface SettingsViewProps {
  user: UserType;
  onUpdateUser: (updated: Partial<UserType>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState('astra_live_sec_994bfa28104cc9e71');
  const [copied, setCopied] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ firstName, lastName, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Hisob Sozlamalari</h2>
        <p className="text-xs text-slate-400 mt-1">
          Shaxsiy profil, xavfsizlik va API integratsiyalari
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Shaxsiy Ma'lumotlar</h3>
        
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Ism</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Familiya</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Manzili</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Telefon Raqam</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? 'Saqlandi!' : 'O\'zgarishlarni Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* API Access Token */}
      <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">API Kaliti & CLI Autentifikatsiya</h3>
        <p className="text-xs text-slate-400">
          Ushbu kalitdan Astrafolio CLI yoki CI/CD avtomatizatsiyasida foydalanishingiz mumkin.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 font-mono"
          />
          <button
            onClick={copyKey}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Nusxalandi' : 'Nusxa'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
