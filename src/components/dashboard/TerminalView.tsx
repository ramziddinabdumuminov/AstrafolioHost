import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ShieldCheck, Play, RotateCw } from 'lucide-react';
import { Website } from '../../types';

interface TerminalViewProps {
  websites: Website[];
}

export const TerminalView: React.FC<TerminalViewProps> = ({ websites }) => {
  const [history, setHistory] = useState<string[]>([
    'Astrafolio Real-Time Web Terminal v2.4 (x86_64-cloud-tashkent)',
    'Node.js 20.x / Linux 6.8.0-cloud / RAM 4GB / NVMe Gen4 / Tashkent DC-1',
    'Yordam uchun "help" deb yozing. Haqiqiy ping, curl, dns, status va ps buyruqlari mavjud.',
    '--------------------------------------------------------------------------------',
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const promptLine = `ramziddin@astrafolio-cloud:~$ ${cmdStr}`;
    setCmdHistory((prev) => [...prev, cmdStr]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdStr }),
      });
      const data = await res.json();
      if (data.output === '__CLEAR__') {
        setHistory([]);
      } else {
        setHistory((prev) => [...prev, promptLine, data.output || '']);
      }
    } catch {
      setHistory((prev) => [...prev, promptLine, 'Xato: Terminal serveri bilan real-vaqt aloqasi o\'rnatilmadi.']);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIndex(nextIdx);
          setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Astrafolio Jonli Web Terminal</h2>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REAL-TIME
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="text-cyan-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Toshkent UZ-1 Klaster Gateway
            </span>
            <span>•</span>
            <span>Haqiqiy tarmoq tahlili (ping, dns, curl) va server diagnostikasi</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleCommand('status')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
          >
            status
          </button>
          <button
            onClick={() => handleCommand('ps')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
          >
            ps
          </button>
          <button
            onClick={() => handleCommand('ping google.com')}
            className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 hover:bg-cyan-900/50 text-xs text-cyan-300 font-mono transition-colors cursor-pointer"
          >
            ping
          </button>
          <button
            onClick={() => handleCommand('curl https://astrafolio.uz')}
            className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-500/30 hover:bg-blue-900/50 text-xs text-blue-300 font-mono transition-colors cursor-pointer"
          >
            curl
          </button>
          <button
            onClick={() => handleCommand('dns astrafolio.uz')}
            className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/30 hover:bg-purple-900/50 text-xs text-purple-300 font-mono transition-colors cursor-pointer"
          >
            dns
          </button>
          <button
            onClick={() => handleCommand('clear')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 font-mono transition-colors cursor-pointer"
          >
            clear
          </button>
        </div>
      </div>

      {/* Terminal Canvas */}
      <div className="rounded-2xl bg-[#060912] border border-slate-700/80 p-5 font-mono text-xs flex flex-col justify-between min-h-[520px] shadow-2xl shadow-cyan-500/5">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-sans text-xs text-slate-300 font-bold">astra-live-console (TTY1)</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">TLS 1.3 • Toshkent DC-1 (Active)</span>
        </div>

        {/* Output Stream */}
        <div className="flex-1 overflow-y-auto space-y-1 text-slate-300 max-h-[420px]">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${
                line.startsWith('ramziddin@astrafolio-cloud')
                  ? 'text-cyan-400 font-bold'
                  : line.includes('[OK]') || line.includes('ONLINE')
                  ? 'text-emerald-400'
                  : line.includes('Xato:') || line.includes('Error:')
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          ))}
          {loading && (
            <div className="text-amber-400 animate-pulse">
              Bajarilmoqda...
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-cyan-400 font-mono">
          <span className="shrink-0 font-bold">ramziddin@astrafolio-cloud:~$</span>
          <input
            autoFocus
            disabled={loading}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='buyruqni yozing (masalan: ping google.com, dns astrafolio.uz, ps, status)...'
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs disabled:opacity-50"
          />
        </div>

      </div>

    </div>
  );
};
