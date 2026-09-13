import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Server, 
  RefreshCw, 
  Lock, 
  Award, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Building2,
  FileCheck
} from 'lucide-react';
import { User } from '../types';

interface DomainRegistrarSectionProps {
  user: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate: (view: 'landing' | 'dashboard') => void;
}

interface DomainZone {
  tld: string;
  price: string;
  oldPrice?: string;
  renewalPrice: string;
  popular?: boolean;
  tag?: string;
}

const DOMAIN_ZONES: DomainZone[] = [
  { tld: '.uz', price: '25 000', oldPrice: '35 000', renewalPrice: '25 000', popular: true, tag: 'Aksiya! Rasmiy narx' },
  { tld: '.com', price: '145 000', renewalPrice: '155 000', popular: true, tag: 'Xalqaro' },
  { tld: '.ru', price: '45 000', renewalPrice: '55 000', tag: 'MDH' },
  { tld: '.org', price: '155 000', renewalPrice: '165 000', tag: 'Tashkilotlar' },
  { tld: '.net', price: '160 000', renewalPrice: '170 000', tag: 'Tarmoq' },
  { tld: '.co.uz', price: '20 000', renewalPrice: '20 000', tag: 'Biznes' },
  { tld: '.uzb', price: '110 000', renewalPrice: '110 000', tag: 'Yangi TLD' },
  { tld: '.online', price: '35 000', oldPrice: '80 000', renewalPrice: '75 000', tag: 'Chegirma' },
];

export const DomainRegistrarSection: React.FC<DomainRegistrarSectionProps> = ({
  user,
  onOpenAuth,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'transfer' | 'whois'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTld, setSelectedTld] = useState('.uz');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    domain: string;
    available: boolean;
    price: string;
    registrar?: string;
    expiryDate?: string;
    details?: string;
  } | null>(null);

  // WHOIS specific state
  const [whoisQuery, setWhoisQuery] = useState('astrafolio.uz');
  const [whoisData, setWhoisData] = useState<{
    domain: string;
    registrar: string;
    status: string;
    creationDate: string;
    expirationDate: string;
    nameservers: string[];
    registrant: string;
    dnssec: string;
  } | null>({
    domain: 'astrafolio.uz',
    registrar: 'Astrafolio / ccTLD.uz Rasmiy Registratori',
    status: 'ACTIVE / REGISTERED',
    creationDate: '2024-01-15',
    expirationDate: '2027-01-15',
    nameservers: ['ns1.astrafolio.uz', 'ns2.astrafolio.uz'],
    registrant: 'Astrafolio Cloud Infrastructure LLC (Toshkent)',
    dnssec: 'Faol (ECDSA Curve25519)',
  });

  // Handle Domain Search
  const handleCheckDomain = (overrideQuery?: string, overrideTld?: string) => {
    const raw = (overrideQuery ?? searchQuery).trim().toLowerCase();
    const tld = overrideTld ?? selectedTld;
    if (!raw) return;

    // Clean up domain query
    let nameOnly = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (nameOnly.endsWith(tld)) {
      nameOnly = nameOnly.slice(0, -tld.length);
    }
    nameOnly = nameOnly.replace(/[^a-z0-9-]/g, '');

    if (!nameOnly) return;

    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const fullDomain = `${nameOnly}${tld}`;
      
      // Recognized registered domains list
      const takenDomains = [
        'astrafolio.uz',
        'eskiz.uz',
        'billur.com',
        'arsenal-d.uz',
        'cctld.uz',
        'uztelecom.uz',
        'gov.uz',
        'google.com',
        'yandex.ru',
        'click.uz',
        'payme.uz'
      ];

      const isTaken = takenDomains.includes(fullDomain) || (nameOnly.length <= 3 && Math.random() > 0.3);

      const zoneInfo = DOMAIN_ZONES.find(z => z.tld === tld) || DOMAIN_ZONES[0];

      setSearchResult({
        domain: fullDomain,
        available: !isTaken,
        price: zoneInfo.price,
        registrar: isTaken ? (fullDomain === 'astrafolio.uz' ? 'Astrafolio Registrator' : 'ccTLD.uz Registrator') : undefined,
        expiryDate: isTaken ? '2027-01-15' : undefined,
        details: isTaken 
          ? 'Ushbu domen allaqachon ro\'yxatdan o\'tkazilgan.' 
          : 'Tabriklaymiz! Domen ro\'yxatdan o\'tkazish uchun mutlaqo bo\'sh.',
      });
    }, 400);
  };

  // Handle WHOIS Check
  const handleCheckWhois = (domainToCheck?: string) => {
    const target = (domainToCheck || whoisQuery).trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!target) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (target === 'astrafolio.uz') {
        setWhoisData({
          domain: 'astrafolio.uz',
          registrar: 'Astrafolio / ccTLD.uz Rasmiy Registratori',
          status: 'ACTIVE / REGISTERED',
          creationDate: '2024-01-15',
          expirationDate: '2027-01-15',
          nameservers: ['ns1.astrafolio.uz', 'ns2.astrafolio.uz'],
          registrant: 'Astrafolio Cloud Infrastructure LLC (Toshkent)',
          dnssec: 'Faol (ECDSA Curve25519)',
        });
      } else {
        setWhoisData({
          domain: target,
          registrar: target.endsWith('.uz') ? 'ccTLD.uz Registrator (O\'zbekiston)' : 'ICANN Accredited Registrar',
          status: 'ACTIVE / DELEGATED',
          creationDate: '2023-04-10',
          expirationDate: '2026-10-25',
          nameservers: [`ns1.${target}`, `ns2.${target}`],
          registrant: 'Maxfiy / Xususiy shaxs (O\'zbekiston)',
          dnssec: 'Nofaol',
        });
      }
    }, 450);
  };

  return (
    <section id="domains" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Official ccTLD.UZ Accreditation Badge */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-cyan-950/60 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-white text-sm sm:text-base">
                ccTLD.UZ Rasmiy Akkreditatsiyalangan Domen Registratori
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Litsenziya № AA 0007124
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              O'zbekiston Respublikasi Raqamli texnologiyalar vazirligi va UZINFOCOM Yagona Ma'muriyati hamkori.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>TAS-IX Ma'lumotlar Markazi</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>60 Soniyada Aktivatsiya</span>
          </div>
        </div>
      </div>

      {/* Section Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Milliy & Xalqaro Domenlar Markazi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          O'zbekistonda Domenni <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Tez & Ishonchli</span> Ro'yxatdan O'tkazing
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Eskiz.uz, Billur.com va Arsenal-D kabi milliy registratorlar standartida eng qulay narxlar va 24/7 O'zbek tilidagi texnik ko'mak.
        </p>
      </div>

      {/* Main Console Box (Tabs + Input) */}
      <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-5 sm:p-8 shadow-2xl shadow-cyan-950/20 mb-10">
        
        {/* Navigation Subtabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Domen Qidirish & Narxlar</span>
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'transfer'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Domen Transferi (Ko'chirish)</span>
          </button>

          <button
            onClick={() => setActiveTab('whois')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'whois'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>ccTLD.UZ WHOIS Tekshiruv</span>
          </button>
        </div>

        {/* TAB 1: DOMAIN SEARCH */}
        {activeTab === 'search' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckDomain()}
                  placeholder="Loyihangiz nomini kiriting (masalan: mening-kompaniyam)"
                  className="w-full pl-4 pr-24 py-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-cyan-500 focus:border-cyan-400 focus:outline-none text-white text-base placeholder-slate-500 font-mono transition-colors"
                />
                
                {/* TLD Selector Dropdown inside input */}
                <div className="absolute right-2 top-2 bottom-2 flex items-center">
                  <select
                    value={selectedTld}
                    onChange={(e) => setSelectedTld(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-sm rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {DOMAIN_ZONES.map((z) => (
                      <option key={z.tld} value={z.tld}>
                        {z.tld} ({z.price} UZS)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleCheckDomain()}
                disabled={isSearching}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
              >
                {isSearching ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>Qidirish / Tekshirish</span>
              </button>
            </div>

            {/* Live Search Result Banner */}
            {searchResult && (
              <div
                className={`mt-5 p-5 rounded-2xl border transition-all animate-in fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  searchResult.available
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-amber-950/40 border-amber-500/40'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  {searchResult.available ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-black text-white font-mono">
                        {searchResult.domain}
                      </span>
                      {searchResult.available ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                          BO'SH (Mavjud)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                          BAND (Ro'yxatdan o'tgan)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {searchResult.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {searchResult.available ? (
                    <>
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-400">
                          {searchResult.price} UZS
                        </div>
                        <div className="text-[10px] text-slate-400">/ 1 yilga</div>
                      </div>
                      <button
                        onClick={() => {
                          if (user) {
                            onNavigate('dashboard');
                          } else {
                            onOpenAuth('register');
                          }
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        Rasmiylashtirish
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab('whois');
                        setWhoisQuery(searchResult.domain);
                        handleCheckWhois(searchResult.domain);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer transition-colors"
                    >
                      WHOIS ma'lumotlari
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DOMAIN TRANSFER */}
        {activeTab === 'transfer' && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              <span>Domenni Astrafolio.uz-ga bepul ko'chiring</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
              Domenlaringizni Eskiz.uz, Billur.com, Arsenal-D yoki boshqa registratorlardan Astrafolio infratuzilmasiga uzilishlarsiz ko'chiring. Domen transfer qilinganda muddati yana 1 yilga avtomatik uzaytiriladi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">1. Auth-Code oling</div>
                <div className="text-slate-400 text-[11px]">Eski registratoringizdan domen transfer kodini so'rang</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">2. Buyurtma bering</div>
                <div className="text-slate-400 text-[11px]">Domen nomini va Auth-Codeni Astrafolio-ga kiriting</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">3. Avtomatik aktiv</div>
                <div className="text-slate-400 text-[11px]">ccTLD.uz orqali 1-2 soatda to'liq ko'chiriladi</div>
              </div>
            </div>

            <button
              onClick={() => (user ? onNavigate('dashboard') : onOpenAuth('register'))}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-cyan-600/25"
            >
              Transfer Buyurtma Berish
            </button>
          </div>
        )}

        {/* TAB 3: ccTLD.UZ WHOIS CHECK */}
        {activeTab === 'whois' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={whoisQuery}
                onChange={(e) => setWhoisQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckWhois()}
                placeholder="Domen nomini kiriting (masalan: astrafolio.uz)"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleCheckWhois()}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>WHOIS Tekshirish</span>
              </button>
            </div>

            {whoisData && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <span className="font-bold text-cyan-400 text-sm">{whoisData.domain}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    {whoisData.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Rasmiy Registrator:</span>
                      <span className="font-semibold text-white">{whoisData.registrar}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Yaratilgan sana:</span>
                      <span className="text-slate-200">{whoisData.creationDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Muddati tugash sanasi:</span>
                      <span className="text-emerald-400 font-bold">{whoisData.expirationDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Egasi (Registrant):</span>
                      <span className="text-slate-200">{whoisData.registrant}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">DNSSEC Xavfsizlik:</span>
                      <span className="text-cyan-300">{whoisData.dnssec}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Name Serverlar (NS):</span>
                      <span className="text-slate-300 font-mono text-[11px]">
                        {whoisData.nameservers.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* POPULAR DOMAIN ZONES PRICING CARDS (ESKIZ / BILLUR STYLE) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Eng Ommabop Domen Zonalarining Narxlari
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Barcha domenlar uchun bepul DNS boshqaruvi va SSL sertifikati qo'shilgan
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {DOMAIN_ZONES.map((zone) => (
            <div
              key={zone.tld}
              onClick={() => {
                setSelectedTld(zone.tld);
                setSearchQuery(searchQuery || 'mening-brendim');
                handleCheckDomain(searchQuery || 'mening-brendim', zone.tld);
              }}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer group hover:scale-[1.03] ${
                zone.popular
                  ? 'bg-gradient-to-b from-blue-950/60 to-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {zone.tag && (
                <div className="text-[10px] font-bold text-cyan-400 mb-1 truncate">
                  {zone.tag}
                </div>
              )}
              <div className="text-xl font-black text-white font-mono group-hover:text-cyan-400 transition-colors">
                {zone.tld}
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-2">
                {zone.price}
              </div>
              <div className="text-[10px] text-slate-500">
                so'm / yil
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 REASONS TO CHOOSE ASTRAFOLIO FOR DOMAINS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
        {[
          {
            title: '60 Soniyada Ro\'yxatdan O\'tish',
            desc: 'ccTLD.uz bilan to\'g\'ridan-to\'g\'ri integratsiya orqali domenlar bir zumda faollashadi.',
            icon: Zap,
          },
          {
            title: 'Bepul DNS Boshqaruvi',
            desc: 'A, CNAME, MX, TXT, SPF, DKIM yozuvlarini qulay va xavfsiz boshqaring.',
            icon: Server,
          },
          {
            title: 'Bepul Let\'s Encrypt SSL',
            desc: 'Barcha bog\'langan domenlarga avtomatik tarzda 90 kunlik yangilanuvchi SSL sertifikati.',
            icon: Lock,
          },
          {
            title: 'O\'zbekiston To\'lov Tizimlari',
            desc: 'Payme, Click, Uzum Bank, Apelsin hamda yuridik shaxslar uchun elektron shartnoma (Didox).',
            icon: ShieldCheck,
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/70">
              <Icon className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-bold text-white text-xs mb-1">{item.title}</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
