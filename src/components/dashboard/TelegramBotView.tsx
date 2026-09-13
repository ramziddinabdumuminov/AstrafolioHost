import React, { useState, useEffect } from 'react';
import {
  Send,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  Zap,
  Key,
  Check,
  MessageSquare
} from 'lucide-react';
import { TelegramNotificationSetting } from '../../types';

export const TelegramBotView: React.FC = () => {
  const [settings, setSettings] = useState<TelegramNotificationSetting>({
    enabled: true,
    botToken: '712891823:AAH-astrafolio-secure-token',
    chatId: '@ramziddin_alerts',
    connectedUser: 'Ramziddin A. (@ramziddin)',
    notifyOnDown: true,
    notifyOnDeploy: true,
    notifyOnSslExpiry: true,
    notifyOnWebmail: true,
    notifyOnSecurityThreat: true,
    lastSentAt: '2026-09-12T21:15:00Z',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/telegram/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (key: keyof TelegramNotificationSetting, val: any) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);

    try {
      await fetch('/api/telegram/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: val }),
      });
      showToast('Sozlama saqlandi!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestAlert = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '🔔 Astrafolio Bot: Aloqa sinovi muvaffaqiyatli o\'tdi!' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Sinov xabarnomasi yuborildi!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTesting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Telegram Xabarnomalar Boti</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-500/30 text-[10px] font-bold font-mono">
              @AstraAlertsBot Faol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Saytingiz ishlamay qolganda, yangi deploy bo'lganda yoki xakerlik xavfi sezilganda shaxsiy Telegramingizga 1 soniyada xabar olish
          </p>
        </div>

        <button
          onClick={handleTestAlert}
          disabled={isTesting}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Send className={`w-3.5 h-3.5 ${isTesting ? 'animate-bounce' : ''}`} />
          <span>{isTesting ? 'Yuborilmoqda...' : 'Telegramga Sinov Xabari Yuborish'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Connection Details */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Telegram Bot Bog'lanmasi</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Telegram Chat ID yoki Kanal:</label>
              <input
                type="text"
                value={settings.chatId || ''}
                onChange={(e) => handleToggle('chatId', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Masalan: @ramziddin_alerts yoki shaxsiy Telegram ID (12345678)
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Uzluksiz Bot Tokeni:</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={settings.botToken || ''}
                  onChange={(e) => handleToggle('botToken', e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-blue-400 block">Qanday ulash mumkin?</span>
              <div>1. Telegramda <b>@AstraCloudAlerts_bot</b> ga kiring</div>
              <div>2. <code>/start</code> tugmasini bosing va olingan Chat ID ni shu yerga yozing</div>
            </div>
          </div>
        </div>

        {/* Right: Triggers and Checklist */}
        <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Qaysi hodisalarda Telegramga xabar kelsin?</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Sayt Ishlamay Qolganda (Downtime / 502)</span>
                <span className="text-[11px] text-slate-400">Server yoki port uzilsa darhol tezkor signal</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnDown}
                onChange={(e) => handleToggle('notifyOnDown', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Git Deploy & CI/CD Muvaffaqiyati</span>
                <span className="text-[11px] text-slate-400">GitHub push orqali yangi versiya chiqqanda</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnDeploy}
                onChange={(e) => handleToggle('notifyOnDeploy', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">SSL Sertifikat Muddati (7 kun qolganda)</span>
                <span className="text-[11px] text-slate-400">Avto-yangilanish holati haqida ogohlantirish</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnSslExpiry}
                onChange={(e) => handleToggle('notifyOnSslExpiry', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">DDoS Hujum & Xavfsizlik Bloki (WAF)</span>
                <span className="text-[11px] text-slate-400">Shubhali IP manzillar bloklanganda</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOnSecurityThreat}
                onChange={(e) => handleToggle('notifyOnSecurityThreat', e.target.checked)}
                className="w-4 h-4 accent-cyan-500"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
