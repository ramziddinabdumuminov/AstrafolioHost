import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  AlertCircle, 
  Copy, 
  Check, 
  RotateCw,
  Cpu
} from 'lucide-react';
import { Website } from '../../types';

interface AstraAiViewProps {
  websites: Website[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AstraAiView: React.FC<AstraAiViewProps> = ({ websites }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Salom! Men Astra AI — sizning shaxsiy Cloud DevOps va infratuzilma yordamchingizman. Server konfiguratsiyasi, Nginx sozlamalari, 502/500 xatolar diagnostikasi yoki PostgreSQL optimizatsiyasi bo'yicha har qanday savolingizga javob berishga tayyorman.",
      time: '21:00',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(websites[0]?.id || '');

  const quickPrompts = [
    'Nima uchun 502 Bad Gateway xatosi yuzaga keladi va uni qanday tuzataman?',
    'Nginx keshini sozlash va statik fayllarni tezlashtirish',
    'PostgreSQL ulanish hovuzi (PgBouncer) parametrlarini qanday hisoblash kerak?',
    'Node.js ilovasida xotira sizib chiqishini (Memory Leak) tekshirish',
  ];

  const handleSend = async (userQuestion?: string) => {
    const q = userQuestion || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          websiteId: selectedSiteId,
        }),
      });
      const data = await res.json();
      const aiReply: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.response || "Server bilan bog'lanishda xatolik yuz berdi.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          text: "Diagnostika so'rovida xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Astra AI Yordamchi & Diagnostika</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold uppercase">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Konteyner jurnallari, Nginx xatolari va tizim unumdorligini avtomatik tahlil qiluvchi AI
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Kontekst sayti:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-400 font-semibold focus:outline-none"
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-[#080c16] border border-slate-800 flex flex-col justify-between h-[620px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none'
                    : 'bg-[#0e1424] border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div>{m.text}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0e1424] border border-slate-800 text-xs text-purple-300 flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Astra AI loglarni tahlil qilmoqda...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#090d18] flex items-center gap-2">
          <input
            type="text"
            placeholder="Astra AI ga savol bering yoki xato xabarini kiriting..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yuborish</span>
          </button>
        </div>

      </div>

    </div>
  );
};
