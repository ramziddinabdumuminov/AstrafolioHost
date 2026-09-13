import React, { useState } from 'react';
import { 
  Layers, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Globe, 
  Send, 
  Eye, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface BuilderSection {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'contact';
  title: string;
  content: string;
  buttonText?: string;
  buttonLink?: string;
}

export const WebsiteBuilderView: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [siteTitle, setSiteTitle] = useState('Mening Zamonaviy Startapim');
  const [slug, setSlug] = useState('startap-sayt');
  const [sections, setSections] = useState<BuilderSection[]>([
    {
      id: 'sec_1',
      type: 'hero',
      title: 'Innovatsion Raqamli Yechimlar',
      content: 'Biz biznesingizni yangi bosqichga olib chiqadigan yuqori texnologiyali dasturiy ta\'minot va xizmatlarni taklif qilamiz.',
      buttonText: 'Hoziroq Bog\'laning',
      buttonLink: '#contact',
    },
    {
      id: 'sec_2',
      type: 'features',
      title: 'Bizning Asosiy Afzalliklarimiz',
      content: '24/7 uzluksiz qo\'llab-quvvatlash, 99.9% uptime kafolati va yuqori darajadagi kiberxavfsizlik himoyasi.',
      buttonText: 'Batafsil Ma\'lumot',
      buttonLink: '#',
    },
    {
      id: 'sec_3',
      type: 'cta',
      title: 'Keling, Birga Yaratamiz!',
      content: 'Loyihangiz bo\'yicha bepul konsultatsiya oling va 14 kunlik bepul sinov muddatidan foydalaning.',
      buttonText: 'Konsultatsiya Olish',
      buttonLink: '#',
    },
  ]);

  const [publishing, setPublishing] = useState(false);
  const [publishedDomain, setPublishedDomain] = useState<string | null>(null);

  const addSection = (type: 'hero' | 'features' | 'cta' | 'contact') => {
    const newSec: BuilderSection = {
      id: `sec_${Date.now()}`,
      type,
      title: type === 'contact' ? 'Biz Bilan Bog\'laning' : 'Yangi Bo\'lim Sarlavhasi',
      content: 'Ushbu bo\'lim matnini o\'zingizga moslab tahrirlashingiz mumkin.',
      buttonText: 'Batafsil',
      buttonLink: '#',
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, field: keyof BuilderSection, val: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/builder/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteTitle, slug, sections }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishedDomain(data.domain || `${slug}.astrafolio.uz`);
      }
    } catch (err) {
      alert('Nashr qilishda xatolik yuz berdi');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090e1a] border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">No-Code Vebsayt Konstruktori</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
              Live Preview
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Bo'limlarni tahrirlang, qurilma o'lchamida ko'ring va 1-bosish bilan hostingga publish qiling
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          
          {/* Device Toggles */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${device === 'desktop' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="Desktop ko'rinish"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg transition-colors ${device === 'tablet' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="Planshet ko'rinish"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${device === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title="Telefon ko'rinish"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{publishing ? 'Deploy qilinmoqda...' : 'Publish (Nashr Qilish)'}</span>
          </button>
        </div>
      </div>

      {/* Published Alert */}
      {publishedDomain && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Tabriklaymiz! Saytingiz muvaffaqiyatli publish qilindi va SSL bilan ishlamoqda:
            </span>
            <a
              href={`https://${publishedDomain}`}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline text-white hover:text-cyan-300 ml-1 flex items-center gap-1"
            >
              <span>https://{publishedDomain}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            onClick={() => setPublishedDomain(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Split: Left Editor / Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Section Editors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* General Metadata */}
          <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sayt Ma'lumotlari</h3>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sayt Sarlavhasi</label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Subdomen Nomi</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-l-lg text-xs text-white font-mono"
                />
                <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-r-lg text-slate-400 text-xs font-mono">
                  .astrafolio.uz
                </span>
              </div>
            </div>
          </div>

          {/* Section Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Bo'limlar Ro'yxati</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => addSection('features')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
                >
                  + Afzallik
                </button>
                <button
                  onClick={() => addSection('cta')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition-colors"
                >
                  + CTA
                </button>
              </div>
            </div>

            {sections.map((sec, idx) => (
              <div key={sec.id} className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase font-mono">
                    #{idx + 1} {sec.type}
                  </span>
                  <button
                    onClick={() => removeSection(sec.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSection(sec.id, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-white"
                    placeholder="Sarlavha"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={sec.content}
                    onChange={(e) => updateSection(sec.id, 'content', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300"
                    placeholder="Matn kontenti"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sec.buttonText || ''}
                    onChange={(e) => updateSection(sec.id, 'buttonText', e.target.value)}
                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-white"
                    placeholder="Tugma matni"
                  />
                  <input
                    type="text"
                    value={sec.buttonLink || ''}
                    onChange={(e) => updateSection(sec.id, 'buttonLink', e.target.value)}
                    className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-400 font-mono"
                    placeholder="#link"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Interactive Canvas / Live Preview Frame (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div
            className={`transition-all duration-300 rounded-2xl border border-slate-700 bg-[#070b14] overflow-hidden shadow-2xl shadow-cyan-500/10 ${
              device === 'mobile'
                ? 'w-[360px] min-h-[640px]'
                : device === 'tablet'
                ? 'w-[640px] min-h-[720px]'
                : 'w-full min-h-[720px]'
            }`}
          >
            {/* Fake Browser Toolbar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-3 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                <span>🔒 https://{slug}.astrafolio.uz</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase font-mono">{device}</span>
            </div>

            {/* Generated Page Canvas */}
            <div className="p-6 sm:p-8 space-y-12 bg-[#0a0f1d] min-h-[640px] text-slate-100">
              
              {/* Site Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <span className="text-base font-extrabold tracking-tight text-white">{siteTitle}</span>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Asosiy</span>
                  <span>Xizmatlar</span>
                  <span>Aloqa</span>
                </div>
              </div>

              {/* Rendered Sections */}
              {sections.map((sec) => (
                <div key={sec.id} className="py-4 border-b border-slate-800/40 last:border-b-0 space-y-3">
                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {sec.title}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                    {sec.content}
                  </p>
                  {sec.buttonText && (
                    <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20">
                      {sec.buttonText}
                    </button>
                  )}
                </div>
              ))}

              {/* Footer */}
              <div className="pt-8 text-center text-xs text-slate-600">
                © {new Date().getFullYear()} {siteTitle} • Hosted on Astrafolio Cloud
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
