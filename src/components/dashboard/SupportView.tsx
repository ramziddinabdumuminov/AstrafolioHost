import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { TicketItem } from '../../types';

interface SupportViewProps {
  tickets: TicketItem[];
  onCreateTicket: (data: { subject: string; category: any; priority: any; message: string }) => void;
  onReplyTicket: (ticketId: string, text: string) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onCreateTicket,
  onReplyTicket,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem>(tickets[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'TECHNICAL' | 'BILLING' | 'DNS' | 'SERVER'>('TECHNICAL');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const activeTicket = tickets.find((t) => t.id === selectedTicket?.id) || tickets[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    onCreateTicket({
      subject,
      category,
      priority,
      message,
    });
    setSubject('');
    setMessage('');
    setIsCreateModalOpen(false);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;
    onReplyTicket(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Texnik Yordam & Tiketlar (24/7 Support)</h2>
          <p className="text-xs text-slate-400">
            DevOps mutaxassislaridan tezkor yordam va server muammolari yechimi
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Tiket Ochish</span>
        </button>
      </div>

      {/* Main Split: Ticket List (4 Cols) & Active Thread (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ticket List */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Mening Murojaatlarim ({tickets.length})
          </span>

          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeTicket?.id === t.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                    : 'bg-[#090e1a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{t.subject}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    t.status === 'ANSWERED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{t.category}</span>
                  <span className={`font-semibold ${
                    t.priority === 'CRITICAL' ? 'text-rose-400' : t.priority === 'HIGH' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Ticket Conversation Thread */}
        <div className="lg:col-span-8 rounded-2xl bg-[#090e1a] border border-slate-800 p-6 flex flex-col justify-between min-h-[500px]">
          {activeTicket ? (
            <>
              <div>
                <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{activeTicket.subject}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>ID: #{activeTicket.id}</span>
                      <span>•</span>
                      <span>Kategoriya: {activeTicket.category}</span>
                      <span>•</span>
                      <span>Prioritet: {activeTicket.priority}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(activeTicket.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {activeTicket.messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                        msg.senderRole === 'SUPPORT'
                          ? 'bg-cyan-950/40 border border-cyan-500/30 text-slate-200'
                          : 'bg-slate-900 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 text-[11px]">
                        <span className="font-bold text-white">
                          {msg.senderName} {msg.senderRole === 'SUPPORT' && '(Astrafolio Qo\'llab-quvvatlash)'}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReply} className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Javob yozing..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Javob</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Murojaat tanlanmagan
            </div>
          )}
        </div>

      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Murojaat Ochish</h3>
            <p className="text-slate-400 mb-5">
              Texnik yordam bo'limiga savol yoki server muammosini yo'llang
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Mavzu</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: Node.js ilovamda 502 xatoligi yuz beryapti"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Kategoriya</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="TECHNICAL">Texnik / Dasturiy</option>
                    <option value="BILLING">To'lov & Tarif</option>
                    <option value="DNS">Domen & DNS</option>
                    <option value="SERVER">Server / Infratuzilma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Muhimlik (Priority)</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="LOW">Past</option>
                    <option value="NORMAL">O'rtacha</option>
                    <option value="HIGH">Yuqori</option>
                    <option value="CRITICAL">Kritik (Sayt ishlamayapti)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Xabar Matni</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Muammoni batafsil tasvirlab bering..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
                >
                  Tiketni Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
