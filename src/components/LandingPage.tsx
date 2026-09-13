import React, { useState } from 'react';
import { 
  Cloud, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Cpu, 
  HardDrive, 
  Lock, 
  RefreshCw, 
  Bot, 
  GitBranch, 
  Layers, 
  Globe, 
  Database,
  HelpCircle,
  Activity,
  Award
} from 'lucide-react';
import { HOSTING_PLANS, FAQ_ITEMS } from '../data/plans';
import { User } from '../types';
import { DomainRegistrarSection } from './DomainRegistrarSection';

interface LandingPageProps {
  user: User | null;
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onSelectPlan: (planId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  user,
  onNavigate,
  onOpenAuth,
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden">
      
      {/* Background Futuristic Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-[200px] w-[500px] h-[500px] bg-purple-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] -right-[200px] w-[500px] h-[500px] bg-cyan-600/10 blur-[140px] pointer-events-none -z-10" />

      {/* =======================================================
          1. HERO SECTION
         ======================================================= */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>O'zbekistonda Yangi Avlod Cloud Hosting & DevOps Ekotizimi</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          ASTRAFOLIO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            “Kodingizdan — Cloudgacha.”
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Saytingizni ishga tushiring, domeningizni ulang va loyihangizni xavfsiz cloud infratuzilmasida boshqaring.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16">
          <button
            onClick={() => onOpenAuth('register')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white hover:opacity-95 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Boshlash</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#plans"
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900/90 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Tariflarni ko‘rish
          </a>

          <button
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-1.5 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Kirish</span>
          </button>
        </div>

        {/* Sub-hero Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto pt-6 border-t border-slate-800/80 text-left">
          {[
            { label: '99.9% Uptime', sub: 'Kafolatlangan SLA', icon: Activity, color: 'text-emerald-400' },
            { label: 'NVMe Storage', sub: 'Gen4 Ultra Tezlik', icon: HardDrive, color: 'text-cyan-400' },
            { label: 'Free SSL', sub: 'Let\'s Encrypt Auto', icon: Lock, color: 'text-blue-400' },
            { label: 'Automatic Backup', sub: 'S3 Shifrlangan', icon: RefreshCw, color: 'text-purple-400' },
            { label: 'DDoS Protection', sub: 'WAF & Anti-Bot', icon: ShieldCheck, color: 'text-emerald-400' },
            { label: '24/7 Monitoring', sub: 'Tier-III Serverlar', icon: Server, color: 'text-cyan-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="font-bold text-xs text-white">{item.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 block">{item.sub}</span>
              </div>
            );
          })}
        </div>

      </section>

      {/* =======================================================
          DOMAINS & REGISTRAR (ESKIZ / BILLUR / ccTLD.UZ STYLE)
         ======================================================= */}
      <DomainRegistrarSection
        user={user}
        onOpenAuth={onOpenAuth}
        onNavigate={onNavigate}
      />

      {/* =======================================================
          2. HOW IT WORKS (3 QADAM)
         ======================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Qulay & Tezkor</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Qanday ishlaydi?</p>
          <p className="text-slate-400 text-sm mt-2">Loyihangizni internetga chiqarish hech qachon bunchalik oson bo'lmagan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: '01',
              title: '1. Saytingizni yuklang',
              desc: 'Git repository (GitHub/GitLab) ulang, ZIP fayl tashlang yoki Vebsayt Konstruktorida tayyorlang.',
              icon: Layers,
            },
            {
              step: '02',
              title: '2. Domeningizni ulang',
              desc: 'O\'zingizning (.uz, .com) domeningizni yoki bepul .astrafolio.uz subdomeningizni tanlang.',
              icon: Globe,
            },
            {
              step: '03',
              title: '3. Publish bosing',
              desc: 'Avtomatik SSL o\'rnatiladi, CI/CD quvurlari ishga tushadi va saytingiz global tarmoqda online bo\'ladi.',
              icon: Zap,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-[#0c1222]/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group"
              >
                <div className="text-4xl font-black text-slate-800 group-hover:text-cyan-500/20 transition-colors absolute top-4 right-5 select-none font-mono">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-500/10">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Natija: “Saytingiz online va 24/7 xavfsiz himoyalangan.”
          </span>
        </div>
      </section>

      {/* =======================================================
          3. HOSTING PLANS (DATABASE-READY)
         ======================================================= */}
      <section id="plans" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Hamyonbop & Moslashuvchan</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Hosting Tariflari</p>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Barcha tariflar avtomatik SSL, NVMe disk va to'liq izolyatsiyalangan muhit bilan ta'minlangan.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${billingCycle === 'monthly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
            >
              Oylik to'lov
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'}`}
            >
              <span>Yillik (2 oy bepul)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">-17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {HOSTING_PLANS.map((plan) => {
            const price = billingCycle === 'yearly' ? Math.floor(plan.priceUzs * 10) : plan.priceUzs;
            const periodLabel = billingCycle === 'yearly' ? 'yil' : 'oy';

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-[#0c152e] via-[#090f20] to-[#070b14] border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/15 scale-100 lg:-translate-y-2'
                    : 'bg-[#090e1a] border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    Eng Ommabop
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.tagline}</p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {price.toLocaleString()} UZS
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/{periodLabel}</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 text-xs text-slate-300 mb-8">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>{plan.storageGb} GB</strong> NVMe Tezkor Disk</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>{plan.websitesLimit} ta</strong> Vebsayt joylashtirish</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>{plan.databasesLimit} ta</strong> PostgreSQL / MySQL baza</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{plan.sslType}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{plan.backupType}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 ${plan.gitDeploy ? 'text-cyan-400' : 'text-slate-600'} shrink-0`} />
                      <span className={plan.gitDeploy ? '' : 'text-slate-500'}>
                        {plan.gitDeploy ? 'Git Avtomatik Deploy & CI/CD' : 'Git Deploy mavjud emas'}
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{plan.bandwidth}</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectPlan(plan.id);
                    if (user) {
                      onNavigate('dashboard');
                    } else {
                      onOpenAuth('register');
                    }
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Tanlash & Boshlash
                </button>
              </div>
            );
          })}
        </div>

      </section>

      {/* =======================================================
          4. DEVELOPER TOOLS & ARCHITECTURE (FEATURES)
         ======================================================= */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">DevOps & Texnologiyalar</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Dasturchilar Uchun Yaratilgan Platforma</p>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Ortiqcha murakkabliklarsiz, terminaldan to'g'ridan-to'g'ri ishlab chiqarish (production) muhitiga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Multi-Runtime Qo\'llab-quvvatlash',
              desc: 'Node.js, Python FastAPI/Django, PHP 8.3 FPM, Dockerfile va statik HTML5 loyihalarini bir xil qulaylikda boshqaring.',
              icon: Cpu,
            },
            {
              title: 'Avtomatlashtirilgan Git CI/CD',
              desc: 'Har bir git push hodisasida testlarni o\'tkazadi, Docker konteynerini yig\'adi va nol uzilish bilan deploy qiladi.',
              icon: GitBranch,
            },
            {
              title: 'Boshqariladigan PostgreSQL & MySQL',
              desc: 'Aloqada izolyatsiya qilingan klasterlar, PgBouncer connection pooling va avtomatik tungi S3 zaxiralash.',
              icon: Database,
            },
            {
              title: 'Astrafolio Safe Terminal',
              desc: 'Brauzer ichidagi xavfsiz veb-terminal. ps, logs, status, storage buyruqlari orqali konteynerlarni nazorat qiling.',
              icon: Terminal,
            },
            {
              title: 'WAF & OWASP Top 10 Himoyasi',
              desc: 'SQL Injection, XSS, Path Traversal va DDoS so\'rovlarini millisekundlarda filtrlovchi aqlli xavfsizlik devori.',
              icon: ShieldCheck,
            },
            {
              title: 'Astra AI Aqlli Yordamchi',
              desc: 'Server xatolarini tahlil qiluvchi, Nginx sozlamalarini tuzatuvchi va 502/500 xatolar sababini topuvchi sun\'iy intellekt.',
              icon: Bot,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =======================================================
          5. CLOUD INFRASTRUCTURE (NODES IN TASHKENT & EU)
         ======================================================= */}
      <section id="infrastructure" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-4">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Mahalliy & Global Klaster</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              O'zbekiston Bo'ylab Minimal Kechikish: <span className="text-cyan-400">2ms Latency</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Astrafolio serverlari Toshkentdagi Tier-III ma'lumotlar markazida (Uztelecom magistral tarmog'iga to'g'ridan-to'g'ri ulangan) joylashgan. Bu esa saytlaringiz O'zbekiston foydalanuvchilariga bir zumda yuklanishini kafolatlaydi.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Server 01 (Master Node)', loc: 'Toshkent, UZ-1 (Tier-III Datacenter)', ping: '2 ms', uptime: '99.98%' },
                { name: 'Server 02 (Worker Node)', loc: 'Samarqand, UZ-2 (Cloud Hub)', ping: '8 ms', uptime: '99.95%' },
                { name: 'Server 03 (EU Edge Node)', loc: 'Frankfurt, Germaniya (Equinix FR-2)', ping: '42 ms', uptime: '99.99%' },
              ].map((srv, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{srv.name}</div>
                    <div className="text-[11px] text-slate-400">{srv.loc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-mono font-bold">{srv.ping}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">{srv.uptime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / Code Graphic */}
          <div className="rounded-2xl bg-[#060912] border border-slate-700/80 p-4 font-mono text-xs shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] ml-2 text-slate-300 font-sans font-medium">astra-cli / cluster-status</span>
              </div>
              <span className="text-[10px] text-cyan-400">LIVE WEBSOCKET</span>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <p className="text-slate-500"># Cluster health and ingress inspection</p>
              <p><span className="text-cyan-400">astrafolio</span> <span className="text-blue-400">deploy</span> --env production --region uz-tashkent</p>
              <p className="text-emerald-400">✔ Git repository cloned (commit: 7b4f2c1)</p>
              <p className="text-emerald-400">✔ Docker container built in 14.2s (zero-downtime)</p>
              <p className="text-emerald-400">✔ Let's Encrypt TLS 1.3 cert configured (ECDSA 256)</p>
              <p className="text-emerald-400">✔ WAF OWASP Level A+ activated</p>
              <p className="text-cyan-300">➜ Vebsayt online: https://ebozor.astrafolio.uz</p>
              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800">
                Resurslar: CPU 1.8% | RAM 156MB | Uptime: 42 kun 14 soat
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          6. FAQ SECTION
         ======================================================= */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Savol va Javoblar</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">Ko'p Beriladigan Savollar</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#090e1a] border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-90 text-cyan-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          7. CALL TO ACTION (CTA)
         ======================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-950/60 via-[#0c1630] to-cyan-950/60 border border-cyan-500/40 shadow-2xl shadow-cyan-500/15 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Kodingizni Bugunoq Cloudga Olib Chiqing
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
              1 daqiqada hisob yarating, 14 kunlik to'liq sinovdan foydalaning va O'zbekistonning eng tezkor bulutli infratuzilmasiga ega bo'ling.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-8 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/30 transition-all cursor-pointer"
              >
                Bepul Boshlash
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 transition-all cursor-pointer"
              >
                Hisobga Kirish
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
