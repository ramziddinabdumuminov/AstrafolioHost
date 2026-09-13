import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Server,
  Trash2,
  X,
  Inbox,
  Send,
  FileText,
  AlertOctagon,
  Star,
  RefreshCw,
  Search,
  ArrowLeft,
  Paperclip,
  Check,
  Reply,
  Forward,
  UserCheck,
  Copy,
  Settings,
  Sparkles,
  Download
} from 'lucide-react';
import { DomainItem, EmailAccount, WebmailMessage } from '../../types';

interface EmailViewProps {
  domains: DomainItem[];
}

export const EmailView: React.FC<EmailViewProps> = ({ domains }) => {
  // Accounts list
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);

  // Active Webmail state
  const [activeWebmailAccount, setActiveWebmailAccount] = useState<EmailAccount | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'drafts' | 'spam' | 'trash'>('inbox');
  const [messages, setMessages] = useState<WebmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<WebmailMessage | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // New Email Account Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDomain, setNewDomain] = useState(domains[0]?.name || 'astrafolio.uz');
  const [newStorageQuota, setNewStorageQuota] = useState(5120);
  const [newPassword, setNewPassword] = useState('');

  // Load emails list from backend
  const loadEmails = async () => {
    setIsEmailsLoading(true);
    try {
      const res = await fetch('/api/emails');
      if (res.ok) {
        const data = await res.json();
        const list: EmailAccount[] = data.emails || [];
        setEmails(list);

        // Auto select firdavs@astrafolio.uz or first
        if (!activeWebmailAccount) {
          const firdavs = list.find((e) => e.email === 'firdavs@astrafolio.uz');
          if (firdavs) {
            setActiveWebmailAccount(firdavs);
          } else if (list.length > 0) {
            setActiveWebmailAccount(list[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load emails:', err);
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const setIsEmailsLoading = setIsLoadingEmails;

  useEffect(() => {
    loadEmails();
  }, []);

  // Fetch messages when active account or folder changes
  useEffect(() => {
    if (!activeWebmailAccount) return;

    const fetchMessages = async () => {
      setIsMessagesLoading(true);
      try {
        const res = await fetch(`/api/webmail/${activeWebmailAccount.email}/messages?folder=${selectedFolder}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          if (selectedMessage && !data.messages.some((m: WebmailMessage) => m.id === selectedMessage.id)) {
            setSelectedMessage(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [activeWebmailAccount, selectedFolder]);

  // Create new account
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername) return;

    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          domain: newDomain,
          storageMaxMb: newStorageQuota,
          password: newPassword || 'AstraPass2026!',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Pochta qutisi ochildi!');
        setIsCreateModalOpen(false);
        setNewUsername('');
        await loadEmails();
        if (data.account) {
          setActiveWebmailAccount(data.account);
        }
      } else {
        alert(data.error || 'Xatolik yuz berdi');
      }
    } catch (err: any) {
      alert(err?.message || 'Server bilan bog\'lanishda xato');
    }
  };

  // Delete account
  const handleDeleteAccount = async (id: string, email: string) => {
    if (!window.confirm(`Haqiqatan ham "${email}" pochta qutisini o'chirmoqchimisiz?`)) return;

    try {
      const res = await fetch(`/api/emails/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`"${email}" pochtasi o'chirildi`);
        await loadEmails();
        if (activeWebmailAccount?.id === id) {
          setActiveWebmailAccount(null);
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWebmailAccount || !composeTo || !composeSubject) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/webmail/${activeWebmailAccount.email}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Xat ${composeTo} manziliga yuborildi!`);
        setIsComposeOpen(false);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        // Refresh folder
        if (selectedFolder === 'sent') {
          setMessages([data.sentMessage, ...messages]);
        }
      } else {
        alert(data.error || 'Xat yuborishda xatolik');
      }
    } catch (err: any) {
      alert(err?.message || 'Server xatosi');
    } finally {
      setIsSending(false);
    }
  };

  // Toggle Star / Mark Read
  const handleToggleStar = async (msg: WebmailMessage) => {
    if (!activeWebmailAccount) return;
    const newStar = !msg.starred;
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, starred: newStar } : m)));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, starred: newStar });
    }

    try {
      await fetch(`/api/webmail/${activeWebmailAccount.email}/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: newStar }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMessage = async (msg: WebmailMessage) => {
    setSelectedMessage(msg);
    if (msg.unread && activeWebmailAccount) {
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, unread: false } : m)));
      try {
        await fetch(`/api/webmail/${activeWebmailAccount.email}/messages/${msg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unread: false }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const showToast = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.subject.toLowerCase().includes(q) ||
      m.from.toLowerCase().includes(q) ||
      m.snippet.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Status toast */}
      {statusNotification && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Astrafolio Webmail & Korporativ Pochta</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold font-mono">
              TAS-IX Anycast v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Domen nomingiz ostida shaxsiy biznes pochta qutilari oching, real vaqtda xatlar yuboring va qabul qiling
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Xat Yozish</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yangi Quti Ochish</span>
          </button>
        </div>
      </div>

      {/* Account Switcher Bar */}
      <div className="p-3.5 rounded-2xl bg-[#090e1a] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Faol Pochta:</span>
          {emails.map((acc) => {
            const isCurrent = activeWebmailAccount?.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => {
                  setActiveWebmailAccount(acc);
                  setSelectedMessage(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${acc.email === 'firdavs@astrafolio.uz' ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                <span>{acc.email}</span>
                {acc.email === 'firdavs@astrafolio.uz' && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200 font-sans uppercase font-bold">
                    Sizning hisobingiz
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeWebmailAccount && (
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>
              Xotira: <strong className="text-white">{activeWebmailAccount.storageUsedMb} MB</strong> / {activeWebmailAccount.storageMaxMb} MB ({(activeWebmailAccount.storageMaxMb / 1024).toFixed(0)} GB)
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans">
              <ShieldCheck className="w-3.5 h-3.5" /> DKIM & TLS 1.3 Aktiv
            </span>
          </div>
        )}
      </div>

      {/* ========================================================
          WEBMAIL INTERFACE (GMAIL / OUTLOOK STYLE)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden min-h-[580px] shadow-2xl">
        
        {/* Left Folder Nav (Col 3) */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col justify-between bg-[#060913]">
          <div className="space-y-4">
            <div className="px-2 pt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Papkalarni Tanlang
              </span>
            </div>

            <nav className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedFolder('inbox');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedFolder === 'inbox'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <span>Kirim (Inbox)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {messages.filter((m) => m.folder === 'inbox' && m.unread).length || messages.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedFolder('sent');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedFolder === 'sent'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span>Yuborilganlar (Sent)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedFolder('drafts');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedFolder === 'drafts'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Qoralamalar (Drafts)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedFolder('spam');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedFolder === 'spam'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>Spam / Bloklangan</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedFolder('trash');
                  setSelectedMessage(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  selectedFolder === 'trash'
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                  <span>Chiqindilar (Trash)</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Mail Server Details summary card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] space-y-2 mt-6">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pochta Server Sozlamalari</span>
            </span>
            <div className="text-slate-400 font-mono space-y-1 text-[10px]">
              <div>IMAP: mail.astrafolio.uz:993</div>
              <div>SMTP: mail.astrafolio.uz:465</div>
              <div>SSL: TLS 1.3 Avtomatik</div>
            </div>
          </div>
        </div>

        {/* Middle / Right Content (Col 9) */}
        <div className="lg:col-span-9 flex flex-col h-full">
          
          {/* Action & Search Bar */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#080d1a]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Xatlardan qidirish (mavzu, jo'natuvchi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (activeWebmailAccount) {
                    setIsMessagesLoading(true);
                    fetch(`/api/webmail/${activeWebmailAccount.email}/messages?folder=${selectedFolder}`)
                      .then((r) => r.json())
                      .then((d) => setMessages(d.messages || []))
                      .finally(() => setIsMessagesLoading(false));
                  }
                }}
                title="Yangilash"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMessagesLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Split Pane: Message List or Message Detail */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            
            {/* List of Messages */}
            <div className={`flex-1 overflow-y-auto divide-y divide-slate-800/60 ${selectedMessage ? 'hidden sm:block sm:max-w-xs md:max-w-sm lg:max-w-md border-r border-slate-800' : 'w-full'}`}>
              {isMessagesLoading ? (
                <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>Xabarlar yuklanmoqda...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                  <Mail className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                  <p>Ushbu papkada xatlar mavjud emas</p>
                  <button
                    onClick={() => setIsComposeOpen(true)}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Birinchi xatni yozish
                  </button>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`p-3.5 hover:bg-slate-900/80 cursor-pointer transition-colors relative flex items-start gap-3 ${
                        isSelected ? 'bg-cyan-950/30 border-l-2 border-cyan-400' : ''
                      } ${msg.unread ? 'font-semibold text-white' : 'text-slate-300'}`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(msg);
                        }}
                        className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${msg.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-xs truncate font-medium text-slate-200">
                            {msg.folder === 'sent' ? `Kimgadir: ${msg.to}` : msg.from}
                          </span>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono">
                            {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-xs truncate text-slate-100 font-medium mb-0.5">
                          {msg.subject}
                        </div>
                        <div className="text-[11px] truncate text-slate-400 font-normal">
                          {msg.snippet}
                        </div>
                      </div>

                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2"></span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Detail View */}
            {selectedMessage ? (
              <div className="flex-1 flex flex-col h-full bg-[#0a0f1d] overflow-y-auto p-5 sm:p-6 animate-in fade-in">
                {/* Back button for mobile */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="sm:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                      {selectedMessage.subject}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStar(selectedMessage)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400"
                    >
                      <Star className={`w-4 h-4 ${selectedMessage.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        setComposeTo(selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from);
                        setComposeSubject(`Re: ${selectedMessage.subject}`);
                        setComposeBody(`\n\n--- Asl xat ---\n${selectedMessage.body}`);
                        setIsComposeOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
                      title="Javob qaytarish"
                    >
                      <Reply className="w-4 h-4" />
                      <span className="hidden md:inline">Javob</span>
                    </button>
                  </div>
                </div>

                {/* Sender & Meta details */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {selectedMessage.from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {selectedMessage.from}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Kimga: <span className="text-cyan-400">{selectedMessage.to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(selectedMessage.date).toLocaleString('uz-UZ')}
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-5 rounded-2xl bg-slate-950/80 border border-slate-800/60 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.body}
                </div>

                {/* Quick Reply Box */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setComposeTo(selectedMessage.from.match(/<(.+)>/)?.[1] || selectedMessage.from);
                      setComposeSubject(`Re: ${selectedMessage.subject}`);
                      setIsComposeOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Tezkor Javob Yozish</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center p-12 text-center text-xs text-slate-500 bg-[#0a0f1d]">
                <div className="space-y-3 max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-cyan-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-300 text-sm">Xatni tanlang</h4>
                  <p className="text-slate-500">
                    Chap tomondagi ro'yxatdan xatni tanlang yoki yangi xat yuborish uchun tugmani bosing
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ========================================================
          MODAL: YANGI XAT YOZISH (COMPOSE MODAL)
         ======================================================== */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b101e] border border-cyan-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setIsComposeOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Yangi Xat Yuborish</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Kimdan: <strong className="text-cyan-400">{activeWebmailAccount?.email}</strong>
                </span>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kimga (Qabul qiluvchi email):</label>
                <input
                  type="email"
                  required
                  placeholder="masalan: sherik@gmail.com yoki info@astrafolio.uz"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Mavzu:</label>
                <input
                  type="text"
                  required
                  placeholder="Xat mavzusini kiriting..."
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Xat matni:</label>
                <textarea
                  rows={7}
                  required
                  placeholder="Salom, ushbu xat Astrafolio Webmail tizimi orqali yuborilmoqda..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TLS 1.3 shifrlash orqali jo'natiladi</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? "Yuborilmoqda..." : "Xatni Jo'natish"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: YANGI POCHTA QUTISI OCHISH
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Korporativ Pochta Qutisi</h3>
            <p className="text-xs text-slate-400 mb-5">
              O'z domeningizda xavfsiz va shaxsiy email manzil oching
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Foydalanuvchi Nomi</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="masalan: firdavs, ceo, info"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-l-xl text-white font-mono focus:outline-none"
                  />
                  <span className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-r-xl text-cyan-400 font-mono font-bold">
                    @{newDomain}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Domenni Tanlang</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="astrafolio.uz">astrafolio.uz (Asosiy Domen)</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Pochta Paroli</label>
                <input
                  type="password"
                  placeholder="Kamida 8 ta belgi (yoki avtomatik generatsiya)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Xotira Kvotasi (MB)</label>
                <select
                  value={newStorageQuota}
                  onChange={(e) => setNewStorageQuota(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                >
                  <option value={2048}>2 048 MB (2 GB)</option>
                  <option value={5120}>5 120 MB (5 GB - Standart)</option>
                  <option value={10240}>10 240 MB (10 GB - Pro)</option>
                  <option value={25600}>25 600 MB (25 GB - Korporativ)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  Pochta Qutisini Ochish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounts Management Table at Bottom */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Barcha Korporativ Pochta Qutilari ({emails.length})</h3>
            <p className="text-[11px] text-slate-400">DNS va DKIM yozuvlari har bir quti uchun avtomatik faol qilingan</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Yangi Quti
          </button>
        </div>

        <div className="divide-y divide-slate-800/60">
          {emails.map((acc) => (
            <div
              key={acc.id}
              className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-mono">{acc.email}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                      {acc.status}
                    </span>
                    {acc.email === 'firdavs@astrafolio.uz' && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                        Asosiy Shaxsiy Pochta
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Band qilingan: {acc.storageUsedMb} MB / {acc.storageMaxMb} MB ({(acc.storageMaxMb / 1024).toFixed(0)} GB) • DKIM: 100% Ok
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setActiveWebmailAccount(acc);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors cursor-pointer"
                >
                  Webmail'da Ochish
                </button>

                {acc.email !== 'firdavs@astrafolio.uz' && (
                  <button
                    onClick={() => handleDeleteAccount(acc.id, acc.email)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
