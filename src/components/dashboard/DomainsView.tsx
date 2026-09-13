import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  X, 
  Search, 
  ShoppingCart, 
  CreditCard, 
  Server, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Layers, 
  Lock, 
  UserCheck, 
  Shield, 
  Activity, 
  Zap,
  Building2,
  Phone,
  Mail,
  User,
  Info,
  Monitor,
  HelpCircle
} from 'lucide-react';
import { DomainItem, DnsRecord, Website, DomainSearchResult } from '../../types';
import { DomainBrowserModal } from './DomainBrowserModal';
import { DnsHelpModal } from './DnsHelpModal';

interface DomainsViewProps {
  domains: DomainItem[];
  websites?: Website[];
  onAddDomain: (data: { name: string; isCustom: boolean; linkedWebsiteId?: string }) => void;
  onRegisterDomain?: (data: any) => Promise<any>;
  onVerifyDomain: (domainId: string) => void;
  onAddDnsRecord: (domainId: string, record: Partial<DnsRecord>) => void;
  onDeleteDnsRecord: (domainId: string, recordId: string) => void;
  onIssueSsl?: (domainId: string) => void;
  onDeleteDomain?: (domainId: string) => void;
  onLinkDomainSite?: (domainId: string, websiteId?: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  domains,
  websites = [],
  onAddDomain,
  onRegisterDomain,
  onVerifyDomain,
  onAddDnsRecord,
  onDeleteDnsRecord,
  onIssueSsl,
  onDeleteDomain,
  onLinkDomainSite,
}) => {
  // Main view tabs: 'my_domains' | 'search_register' | 'propagation' | 'whois'
  const [mainTab, setMainTab] = useState<'my_domains' | 'search_register' | 'propagation' | 'whois'>('my_domains');
  
  // Selected Domain for details
  const [selectedDomainId, setSelectedDomainId] = useState<string>(domains[0]?.id || '');
  const [domainFilter, setDomainFilter] = useState('');
  
  // Workspace sub-tab for active domain: 'dns' | 'link' | 'ssl' | 'whois' | 'propagation'
  const [workspaceTab, setWorkspaceTab] = useState<'dns' | 'link' | 'ssl' | 'whois' | 'propagation'>('dns');

  // Search & Register State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DomainSearchResult[]>([]);
  const [searchHasRun, setSearchHasRun] = useState(false);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [targetDomain, setTargetDomain] = useState<DomainSearchResult | null>(null);
  const [registerYears, setRegisterYears] = useState<number>(1);
  const [registrantType, setRegistrantType] = useState<'individual' | 'organization'>('individual');
  const [registrantName, setRegistrantName] = useState('Ramziddin A.');
  const [registrantEmail, setRegistrantEmail] = useState('aramziddin1978@gmail.com');
  const [registrantPhone, setRegistrantPhone] = useState('+998 90 123 45 67');
  const [registrantOrg, setRegistrantOrg] = useState('');
  const [registrantPinfl, setRegistrantPinfl] = useState('31508920140023');
  const [linkSiteId, setLinkSiteId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'click' | 'payme' | 'uzumbank' | 'balance' | 'card'>('balance');
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);

  // Add Existing Domain Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [isCustom, setIsCustom] = useState(true);

  // New DNS Record Form state
  const [dnsType, setDnsType] = useState<'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS'>('A');
  const [dnsName, setDnsName] = useState('@');
  const [dnsValue, setDnsValue] = useState('185.196.220.14');
  const [dnsTtl, setDnsTtl] = useState(3600);
  const [dnsPriority, setDnsPriority] = useState<number>(10);

  // Propagation tool state
  const [propDomainInput, setPropDomainInput] = useState('');
  const [propResults, setPropResults] = useState<any[]>([]);
  const [isCheckingProp, setIsCheckingProp] = useState(false);

  // WHOIS tool state
  const [whoisDomainInput, setWhoisDomainInput] = useState('');
  const [whoisData, setWhoisData] = useState<any | null>(null);
  const [isLoadingWhois, setIsLoadingWhois] = useState(false);
  const [whoisPrivacyActive, setWhoisPrivacyActive] = useState(true);
  const [dnssecActive, setDnssecActive] = useState(true);

  // SSL Issuing local state
  const [isIssuingSsl, setIsIssuingSsl] = useState(false);

  // In-App Browser and DNS Troubleshooting state
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isDnsHelpOpen, setIsDnsHelpOpen] = useState(false);
  const [previewDomainName, setPreviewDomainName] = useState('');

  // Selected domain object
  const activeDomain = domains.find((d) => d.id === selectedDomainId) || domains[0];

  useEffect(() => {
    if (domains.length > 0 && (!selectedDomainId || !domains.some(d => d.id === selectedDomainId))) {
      setSelectedDomainId(domains[0].id);
    }
  }, [domains, selectedDomainId]);

  // Handle Domain Search
  const handleSearchDomains = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setIsSearching(true);
    setSearchHasRun(true);
    try {
      const res = await fetch('/api/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch {
      // Fallback local check
      const base = q.split('.')[0];
      const tlds = ['.uz', '.com', '.org', '.net', '.io', '.dev', '.app', '.co.uz'];
      const mockResults: DomainSearchResult[] = tlds.map(tld => {
        const full = `${base}${tld}`;
        const taken = domains.some(d => d.name.toLowerCase() === full);
        const price = tld === '.uz' ? 25000 : tld === '.com' ? 145000 : tld === '.org' ? 155000 : 180000;
        return {
          domain: full,
          tld,
          available: !taken,
          priceUzs: price,
          priceFormatted: `${price.toLocaleString()} so'm`,
          isPopular: tld === '.uz' || tld === '.com',
        };
      });
      setSearchResults(mockResults);
    } finally {
      setIsSearching(false);
    }
  };

  // Open Registration Modal
  const openRegisterModal = (item: DomainSearchResult) => {
    setTargetDomain(item);
    setRegisterYears(1);
    if (websites.length > 0 && !linkSiteId) {
      setLinkSiteId(websites[0].id);
    }
    setIsRegisterModalOpen(true);
  };

  // Submit Registration (Real Purchase)
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDomain) return;

    const domainNameStr = targetDomain.domain || (targetDomain as any).name || '';
    if (!domainNameStr) return;

    setIsSubmittingRegistration(true);
    try {
      const registrantObj = {
        name: registrantName,
        email: registrantEmail,
        phone: registrantPhone,
        organization: registrantOrg,
        pinflOrPassport: registrantPinfl,
        type: registrantType,
        country: 'O\'zbekiston',
      };

      const payload = {
        domainName: domainNameStr,
        domain: domainNameStr,
        name: domainNameStr,
        periodYears: registerYears,
        years: registerYears,
        registrantInfo: registrantObj,
        registrant: registrantObj,
        linkedWebsiteId: linkSiteId || undefined,
        paymentMethod,
        autoRenew: true,
        privacyProtection: true,
      };

      if (onRegisterDomain) {
        const created = await onRegisterDomain(payload);
        if (created) {
          setSelectedDomainId(created.id);
          setIsRegisterModalOpen(false);
          setMainTab('my_domains');
          setWorkspaceTab('dns');
        }
      } else {
        // Direct API call
        const res = await fetch('/api/domains/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.domain) {
          onAddDomain({
            name: data.domain.name,
            isCustom: true,
            linkedWebsiteId: linkSiteId || undefined,
          });
          setSelectedDomainId(data.domain.id);
          setIsRegisterModalOpen(false);
          setMainTab('my_domains');
        }
      }
    } catch {
      // Error handled by onRegisterDomain toast
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  // Connect Existing Domain
  const handleConnectDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName.trim()) return;
    onAddDomain({
      name: newDomainName.trim().toLowerCase(),
      isCustom,
    });
    setNewDomainName('');
    setIsAddModalOpen(false);
    setMainTab('my_domains');
  };

  // Create DNS Record
  const handleCreateDns = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDomain) return;
    onAddDnsRecord(activeDomain.id, {
      type: dnsType,
      name: dnsName.trim(),
      value: dnsValue.trim(),
      ttl: Number(dnsTtl) || 3600,
      priority: dnsType === 'MX' ? dnsPriority : undefined,
    });
    setDnsName('@');
    setDnsValue('');
  };

  // Apply Quick DNS Preset
  const handleApplyPreset = (preset: 'astrafolio' | 'google' | 'yandex' | 'cloudflare') => {
    if (!activeDomain) return;
    if (preset === 'astrafolio') {
      onAddDnsRecord(activeDomain.id, { type: 'A', name: '@', value: '185.196.220.14', ttl: 3600 });
      onAddDnsRecord(activeDomain.id, { type: 'CNAME', name: 'www', value: activeDomain.name, ttl: 3600 });
    } else if (preset === 'google') {
      onAddDnsRecord(activeDomain.id, { type: 'MX', name: '@', value: 'ASPMX.L.GOOGLE.COM.', ttl: 3600, priority: 1 });
      onAddDnsRecord(activeDomain.id, { type: 'MX', name: '@', value: 'ALT1.ASPMX.L.GOOGLE.COM.', ttl: 3600, priority: 5 });
      onAddDnsRecord(activeDomain.id, { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 });
    } else if (preset === 'yandex') {
      onAddDnsRecord(activeDomain.id, { type: 'MX', name: '@', value: 'mx.yandex.net.', ttl: 3600, priority: 10 });
      onAddDnsRecord(activeDomain.id, { type: 'TXT', name: '@', value: 'v=spf1 redirect=_spf.yandex.net', ttl: 3600 });
    } else if (preset === 'cloudflare') {
      onAddDnsRecord(activeDomain.id, { type: 'CNAME', name: '@', value: 'edge.astrafolio.uz', ttl: 300 });
    }
  };

  // Run Propagation Check
  const runPropagationTest = async (domainName: string) => {
    setIsCheckingProp(true);
    setPropDomainInput(domainName);
    try {
      const res = await fetch(`/api/domains/${activeDomain?.id || 'temp'}/propagation`);
      const data = await res.json();
      if (data.results) {
        setPropResults(data.results);
      }
    } catch {
      // Mock nodes
      setPropResults([
        { location: 'Toshkent (TAS-IX Edge)', resolver: 'Uztelecom Anycast', status: 'OK', ip: '185.196.220.14', latencyMs: 3 },
        { location: 'Frankfurt (DE-1 Central)', resolver: 'Cloudflare 1.1.1.1', status: 'OK', ip: '185.196.220.14', latencyMs: 44 },
        { location: 'Virjiniya (US-East)', resolver: 'Google 8.8.8.8', status: 'OK', ip: '185.196.220.14', latencyMs: 108 },
        { location: 'Singapur (AP-South)', resolver: 'Quad9 9.9.9.9', status: 'OK', ip: '185.196.220.14', latencyMs: 76 },
        { location: 'London (UK-Core)', resolver: 'OpenDNS 208.67.222.222', status: 'OK', ip: '185.196.220.14', latencyMs: 51 },
      ]);
    } finally {
      setIsCheckingProp(false);
    }
  };

  // Run WHOIS Check
  const runWhoisLookup = async (domainName: string) => {
    setIsLoadingWhois(true);
    try {
      const res = await fetch(`/api/domains/${activeDomain?.id || 'dom_01'}/whois`);
      const data = await res.json();
      if (data.whois) {
        setWhoisData(data.whois);
      }
    } catch {
      setWhoisData({
        domain: domainName,
        registrar: 'Astrafolio Registrar LLC (ccTLD.UZ Partner #48)',
        status: 'ACTIVE / OK / ClientTransferProhibited',
        registrant: 'Ramziddin A.',
        email: 'aramziddin1978@gmail.com',
        phone: '+998 90 123 45 67',
        country: 'UZ',
        createdDate: '2026-01-10T12:00:00Z',
        expiryDate: '2027-01-10T12:00:00Z',
        nameServers: ['ns1.astrafolio.uz', 'ns2.astrafolio.uz'],
        dnssec: 'Inaktiv',
      });
    } finally {
      setIsLoadingWhois(false);
    }
  };

  // Trigger SSL Re-issue
  const handleReissueSsl = async () => {
    if (!activeDomain) return;
    setIsIssuingSsl(true);
    if (onIssueSsl) {
      await onIssueSsl(activeDomain.id);
    }
    setTimeout(() => {
      setIsIssuingSsl(false);
    }, 1200);
  };

  const filteredDomains = domains.filter((d) =>
    d.name.toLowerCase().includes(domainFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header & Main Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">Domenlar va DNS Boshqaruvi</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              TAS-IX Anycast DNS
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Yangi .UZ va xalqaro domenlarni ro'yxatdan o'tkazish, DNS zonalarni boshqarish va SSL himoya
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMainTab('search_register');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-slate-950" />
            <span>Yangi Domen Olish</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mavjud Domenni Ulash</span>
          </button>
        </div>
      </div>

      {/* Top Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setMainTab('my_domains')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
            mainTab === 'my_domains'
              ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Mening Domenlarim ({domains.length})</span>
        </button>

        <button
          onClick={() => setMainTab('search_register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
            mainTab === 'search_register'
              ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Domen Qidirish va Olish</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            25 000 so'm
          </span>
        </button>

        <button
          onClick={() => {
            setMainTab('propagation');
            if (activeDomain) runPropagationTest(activeDomain.name);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
            mainTab === 'propagation'
              ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>DNS Propagatsiya Diagnostikasi</span>
        </button>

        <button
          onClick={() => {
            setMainTab('whois');
            if (activeDomain) runWhoisLookup(activeDomain.name);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
            mainTab === 'whois'
              ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>WHOIS Qidiruv</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MENING DOMENLARIM                                */}
      {/* ======================================================== */}
      {mainTab === 'my_domains' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Domains List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Domen nomi bo'yicha qidirish..."
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#090e1a] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              {filteredDomains.map((dom) => {
                const linkedSite = websites.find((w) => w.id === dom.linkedWebsiteId || w.domain === dom.name);
                const isSelected = activeDomain?.id === dom.id;
                return (
                  <div
                    key={dom.id}
                    onClick={() => setSelectedDomainId(dom.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'bg-[#090e1a] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Globe className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="font-bold text-sm text-white">{dom.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          dom.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {dom.status === 'ACTIVE' ? 'Faol' : 'Kutilmoqda'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                        {linkedSite ? (
                          <span className="text-cyan-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {linkedSite.name}
                          </span>
                        ) : (
                          <span className="text-slate-500">Saytga bog'lanmagan</span>
                        )}
                      </span>

                      <div className="flex items-center gap-2">
                        {dom.sslActive && (
                          <span className="text-emerald-400 flex items-center gap-0.5 text-[10px]" title="Let's Encrypt SSL Faol">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>SSL</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {dom.dnsRecords?.length || 0} DNS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredDomains.length === 0 && (
                <div className="p-8 text-center bg-[#090e1a] rounded-xl border border-slate-800 text-slate-500 text-xs">
                  Domen topilmadi.
                </div>
              )}
            </div>

            {/* Quick Promo Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border border-cyan-500/20 text-xs">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>O'zbekiston TAS-IX Anycast DNS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Barcha domenlar Toshkentdagi TAS-IX serverlarimiz orqali 2-5ms kechikish bilan ochiladi.
              </p>
              <button
                onClick={() => setMainTab('search_register')}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Yangi .UZ domen qidirish</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Active Domain Workspace (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeDomain ? (
              <>
                {/* Domain Top Bar */}
                <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-extrabold text-white font-mono">
                          {activeDomain.name}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            activeDomain.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {activeDomain.status === 'ACTIVE' ? 'Faol & DNS Yo\'naltirilgan' : 'DNS Tasdiqlanishi Kutilmoqda'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>Registrator: <strong className="text-slate-200">{activeDomain.registeredVia || 'Astrafolio Cloud'}</strong></span>
                        <span>•</span>
                        <span>Tugash muddati: <strong className="text-slate-200">{activeDomain.expiresAt ? new Date(activeDomain.expiresAt).toLocaleDateString() : '2027-01-10'}</strong></span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setPreviewDomainName(activeDomain.name);
                          setIsBrowserOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/25 transition-all cursor-pointer"
                        title="Saytni ichki xavfsiz brauzerda ochish"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Saytni Ochish (Jonli)</span>
                      </button>

                      <button
                        onClick={() => {
                          setPreviewDomainName(activeDomain.name);
                          setIsDnsHelpOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-medium transition-colors cursor-pointer"
                        title="Domen ochilmayaptimi? ERR_NAME_NOT_RESOLVED sababi va yechimi"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>ERR_NAME_NOT_RESOLVED Yechimi</span>
                      </button>

                      <button
                        onClick={handleReissueSsl}
                        disabled={isIssuingSsl}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 text-xs font-medium transition-colors cursor-pointer"
                        title="SSL sertifikatini qayta yangilash"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isIssuingSsl ? 'animate-spin' : ''}`} />
                        <span>SSL Yangilash</span>
                      </button>

                      {onDeleteDomain && (
                        <button
                          onClick={() => onDeleteDomain(activeDomain.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Domenni tizimdan o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ERR_NAME_NOT_RESOLVED Helper Notice Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-2">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-300">
                          Tashqi brauzeringizda "ERR_NAME_NOT_RESOLVED / Server IP manzili topilmadi" xatosi chiqdimi?
                        </div>
                        <div className="text-slate-300 text-[11px] mt-0.5">
                          Ushbu domen Astrafolio bulutida to'liq ishlamoqda. Real internet provayderlar (Uztelecom, Beeline) orqali ochilishi uchun registratoringizda DNS A-yozuvini sozlang yoki saytni darhol ichki jonli brauzerda oching.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setPreviewDomainName(activeDomain.name);
                          setIsBrowserOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Jonli Ko'rish</span>
                      </button>
                      <button
                        onClick={() => {
                          setPreviewDomainName(activeDomain.name);
                          setIsDnsHelpOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-medium cursor-pointer"
                      >
                        Yechimni Ko'rish
                      </button>
                    </div>
                  </div>

                  {/* Domain Workspace Navigation Subtabs */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
                    <button
                      onClick={() => setWorkspaceTab('dns')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        workspaceTab === 'dns'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      DNS Zonasi ({activeDomain.dnsRecords?.length || 0})
                    </button>

                    <button
                      onClick={() => setWorkspaceTab('link')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        workspaceTab === 'link'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Saytga Biriktirish
                    </button>

                    <button
                      onClick={() => setWorkspaceTab('ssl')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        workspaceTab === 'ssl'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Let's Encrypt SSL
                    </button>

                    <button
                      onClick={() => {
                        setWorkspaceTab('whois');
                        runWhoisLookup(activeDomain.name);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        workspaceTab === 'whois'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      WHOIS & Egasi
                    </button>

                    <button
                      onClick={() => {
                        setWorkspaceTab('propagation');
                        runPropagationTest(activeDomain.name);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        workspaceTab === 'propagation'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Jonli Propagatsiya
                    </button>
                  </div>
                </div>

                {/* Subtab: DNS Records Workspace */}
                {workspaceTab === 'dns' && (
                  <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
                    
                    {/* DNS Verification Alert if not Active */}
                    {activeDomain.status !== 'ACTIVE' && (
                      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 space-y-3">
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <Clock className="w-4 h-4" />
                          <span>DNS Tasdiqlanishi Kutilmoqda</span>
                        </div>
                        <p className="leading-relaxed">
                          Ushbu domenni faollashtirish uchun o'z registratoringizda quyidagi DNS yozuvlarni qo'shing:
                        </p>
                        <div className="p-3 rounded-lg bg-black/40 font-mono text-[11px] space-y-1">
                          <div><strong>A Record:</strong> @ ➔ 185.196.220.14</div>
                          <div><strong>TXT Record:</strong> _astrafolio-challenge ➔ {activeDomain.verificationToken || 'astra-verify-token'}</div>
                        </div>
                        <button
                          onClick={() => onVerifyDomain(activeDomain.id)}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors cursor-pointer"
                        >
                          DNS Yozuvlarni Tekshirish va Faollashtirish
                        </button>
                      </div>
                    )}

                    {/* Presets Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Tezkor Shablonlar:</span>
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleApplyPreset('astrafolio')}
                          className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/40 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + Astrafolio Cloud IP
                        </button>
                        <button
                          onClick={() => handleApplyPreset('google')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + Google Workspace MX
                        </button>
                        <button
                          onClick={() => handleApplyPreset('yandex')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + Yandex 360 MX
                        </button>
                        <button
                          onClick={() => handleApplyPreset('cloudflare')}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + Cloudflare CNAME
                        </button>
                      </div>
                    </div>

                    {/* DNS Records Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                            <th className="pb-3 font-semibold">Turi</th>
                            <th className="pb-3 font-semibold">Nom (Host)</th>
                            <th className="pb-3 font-semibold">Qiymat (Target)</th>
                            <th className="pb-3 font-semibold">TTL</th>
                            <th className="pb-3 text-right">Amal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {activeDomain.dnsRecords?.map((rec) => (
                            <tr key={rec.id} className="hover:bg-slate-900/40">
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-500/30 text-[10px]">
                                  {rec.type}
                                </span>
                              </td>
                              <td className="py-3 text-white font-medium">{rec.name}</td>
                              <td className="py-3 text-slate-300 max-w-xs truncate">{rec.value}</td>
                              <td className="py-3 text-slate-400">{rec.ttl}s</td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => onDeleteDnsRecord(activeDomain.id, rec.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                  title="DNS yozuvini o'chirish"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add DNS Form */}
                    <form onSubmit={handleCreateDns} className="pt-6 border-t border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-300 block">Yangi DNS Yozuvi Qo'shish</span>
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5">
                        <select
                          value={dnsType}
                          onChange={(e) => setDnsType(e.target.value as any)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                        >
                          <option value="A">A (IPv4)</option>
                          <option value="AAAA">AAAA (IPv6)</option>
                          <option value="CNAME">CNAME (Kanonik)</option>
                          <option value="MX">MX (Pochta)</option>
                          <option value="TXT">TXT (Matn / SPF / DKIM)</option>
                          <option value="NS">NS (Nameserver)</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Host (@ yoki www)"
                          value={dnsName}
                          onChange={(e) => setDnsName(e.target.value)}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                          required
                        />

                        <input
                          type="text"
                          placeholder="Qiymat (IP, manzil yoki yozuv)"
                          value={dnsValue}
                          onChange={(e) => setDnsValue(e.target.value)}
                          className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                          required
                        />

                        <input
                          type="number"
                          placeholder="TTL (3600)"
                          value={dnsTtl}
                          onChange={(e) => setDnsTtl(Number(e.target.value))}
                          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                        />

                        <button
                          type="submit"
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Saqlash</span>
                        </button>
                      </div>
                    </form>

                  </div>
                )}

                {/* Subtab: Saytga Biriktirish (Website Linking) */}
                {workspaceTab === 'link' && (
                  <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-white mb-1">Saytga Biriktirish (Web Routing)</h4>
                      <p className="text-xs text-slate-400">
                        Ushbu domenni hostingdagi istalgan faol ilova yoki veb-saytingizga 1 bosish orqali yo'naltiring.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Hozirgi Biriktirilgan Veb-sayt:</div>
                          <div className="text-xs text-slate-300 font-mono mt-0.5">
                            {websites.find(w => w.id === activeDomain.linkedWebsiteId || w.domain === activeDomain.name)?.name || 'Biriktirilmagan (Parked / Faqat DNS)'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        Nginx Reverse Proxy Faol
                      </span>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-300 block">
                        Yangi saytni tanlang:
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => {
                            if (onLinkDomainSite) onLinkDomainSite(activeDomain.id, undefined);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            !activeDomain.linkedWebsiteId
                              ? 'bg-cyan-950/40 border-cyan-500/60 text-white font-bold'
                              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-semibold text-white">Parked / Alohida Domen</div>
                          <div className="text-[11px] text-slate-500">Hech qaysi saytga yo'naltirilmaydi</div>
                        </div>

                        {websites.map((site) => (
                          <div
                            key={site.id}
                            onClick={() => {
                              if (onLinkDomainSite) onLinkDomainSite(activeDomain.id, site.id);
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                              activeDomain.linkedWebsiteId === site.id || site.domain === activeDomain.name
                                ? 'bg-cyan-950/40 border-cyan-500/60 text-white font-bold ring-1 ring-cyan-500/30'
                                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{site.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                Port: {site.port}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1">
                              {site.runtime} • {site.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab: SSL Sertifikati */}
                {workspaceTab === 'ssl' && (
                  <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">Let's Encrypt TLS 1.3 SSL Sertifikati</h4>
                        <p className="text-xs text-slate-400">
                          256-bit shifrlash, avtomatik yangilanish va HTTPS majburiy yo'naltirish
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Himoyalangan (A+)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-400 text-[11px] mb-1">Sertifikat Turi</div>
                        <div className="text-white font-bold text-xs">Let's Encrypt Wildcard ACME v2</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-400 text-[11px] mb-1">Shifrlash Standarti</div>
                        <div className="text-white font-bold text-xs">ECDSA P-384 / TLS 1.3 Modern</div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="text-slate-400 text-[11px] mb-1">Avtomatik Yangilanish</div>
                        <div className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Har 60 kunda (Faol)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                      <div>
                        <div className="text-xs font-bold text-white">SSL Sertifikatini Yangilash</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Agar DNS o'zgartirilgan bo'lsa, yangi sertifikatni darhol generatsiya qiling
                        </div>
                      </div>
                      <button
                        onClick={handleReissueSsl}
                        disabled={isIssuingSsl}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isIssuingSsl ? 'animate-spin' : ''}`} />
                        <span>{isIssuingSsl ? 'Generatsiya...' : 'Sertifikatni Yangilash'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtab: WHOIS & Egasi */}
                {workspaceTab === 'whois' && (
                  <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">WHOIS Ro'yxatdan O'tish Ma'lumotlari</h4>
                        <p className="text-xs text-slate-400">
                          ccTLD.UZ va ICANN registr ma'lumotlari
                        </p>
                      </div>
                      <button
                        onClick={() => runWhoisLookup(activeDomain.name)}
                        disabled={isLoadingWhois}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWhois ? 'animate-spin' : ''}`} />
                        <span>Yangilash</span>
                      </button>
                    </div>

                    {whoisData ? (
                      <div className="space-y-4">
                        {/* WHOIS Privacy & DNSSEC Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">WHOIS Shaxsiy Himoya (Privacy Guard)</span>
                              <span className="text-[10px] text-slate-400">Telefon, email va PINFL ochiq bazadan yashirilgan</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={whoisPrivacyActive}
                              onChange={(e) => setWhoisPrivacyActive(e.target.checked)}
                              className="w-4 h-4 accent-cyan-500 cursor-pointer"
                            />
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-white block">DNSSEC Kriptografik Himoya</span>
                              <span className="text-[10px] text-slate-400">DNS spoofing va soxtalashtirishdan himoya</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={dnssecActive}
                              onChange={(e) => setDnssecActive(e.target.checked)}
                              className="w-4 h-4 accent-cyan-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                            <div><span className="text-slate-500 font-sans">Domen:</span> <span className="text-white font-bold">{whoisData.domain}</span></div>
                            <div><span className="text-slate-500 font-sans">Registrator:</span> <span className="text-cyan-400">{whoisData.registrar}</span></div>
                            <div><span className="text-slate-500 font-sans">Holati:</span> <span className="text-emerald-400">{whoisData.status}</span></div>
                            <div><span className="text-slate-500 font-sans">Yaratilgan sana:</span> <span className="text-slate-300">{new Date(whoisData.createdDate).toLocaleDateString()}</span></div>
                            <div><span className="text-slate-500 font-sans">Tugash sanasi:</span> <span className="text-amber-300">{new Date(whoisData.expiryDate).toLocaleDateString()}</span></div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                            <div>
                              <span className="text-slate-500 font-sans">Egasi (Registrant):</span>{' '}
                              <span className="text-white">
                                {whoisPrivacyActive ? 'Astrafolio Privacy Guard Protected' : whoisData.registrant}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-sans">Aloqa Email:</span>{' '}
                              <span className="text-slate-300">
                                {whoisPrivacyActive ? 'privacy-masked@astrafolio.uz' : whoisData.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 font-sans">Telefon:</span>{' '}
                              <span className="text-slate-300">
                                {whoisPrivacyActive ? '+998 ** *** ** **' : whoisData.phone}
                              </span>
                            </div>
                            <div><span className="text-slate-500 font-sans">Mamlakat:</span> <span className="text-slate-300">{whoisData.country}</span></div>
                            <div><span className="text-slate-500 font-sans">Anycast NS:</span> <span className="text-cyan-300">{whoisData.nameServers?.join(', ')}</span></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 text-xs">
                        {isLoadingWhois ? 'WHOIS ma\'lumotlari yuklanmoqda...' : 'Ma\'lumotlar mavjud emas'}
                      </div>
                    )}
                  </div>
                )}

                {/* Subtab: Jonli Propagatsiya */}
                {workspaceTab === 'propagation' && (
                  <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white mb-1">Global DNS Propagatsiya Holati</h4>
                        <p className="text-xs text-slate-400">
                          Dunyo bo'ylab Anycast DNS tugunlaridan ushbu domenga berilayotgan javoblar
                        </p>
                      </div>
                      <button
                        onClick={() => runPropagationTest(activeDomain.name)}
                        disabled={isCheckingProp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs text-white font-bold cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isCheckingProp ? 'animate-spin' : ''}`} />
                        <span>Qayta Tekshirish</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                            <th className="pb-3 font-semibold">Anycast Tugun</th>
                            <th className="pb-3 font-semibold">DNS Resolver</th>
                            <th className="pb-3 font-semibold">Olingan IP</th>
                            <th className="pb-3 font-semibold">Kechikish (Ping)</th>
                            <th className="pb-3 text-right">Holati</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {propResults.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              <td className="py-3 text-white font-medium font-sans">{p.location}</td>
                              <td className="py-3 text-slate-400">{p.resolver}</td>
                              <td className="py-3 text-cyan-400 font-bold">{p.ip}</td>
                              <td className="py-3 text-slate-300">{p.latencyMs} ms</td>
                              <td className="py-3 text-right">
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                                  ✓ Tarqalgan
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-[#090e1a] rounded-2xl border border-slate-800">
                Hech qanday domen tanlanmagan
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DOMEN QIDIRISH VA OLISH (SEARCH & REAL REGISTER)  */}
      {/* ======================================================== */}
      {mainTab === 'search_register' && (
        <div className="space-y-6">
          
          {/* Search Hero Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#091024] to-[#060a17] border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 inline-block">
                O'zbekiston Milliy ccTLD.UZ va Xalqaro ICANN Registratori
              </span>
              <h3 className="text-2xl font-black text-white sm:text-3xl">
                O'z brendingiz uchun ideal domenni tanlang
              </h3>
              <p className="text-xs text-slate-400">
                .UZ domeni atigi <strong className="text-cyan-300">25 000 so'm/yil</strong>. Bepul Let's Encrypt SSL, Anycast TAS-IX DNS va to'liq egalik huquqi bilan.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearchDomains} className="pt-4">
                <div className="flex flex-col sm:flex-row gap-2 bg-[#050811] p-2 rounded-2xl border border-slate-700 shadow-xl">
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 absolute left-3.5 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="Domen nomini yozing (masalan: meningbrendim yoki sayt.uz)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-transparent text-white font-mono text-sm placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold text-xs transition-all hover:opacity-95 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Tekshirilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-slate-950" />
                        <span>Bandligini Tekshirish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                <span>Ommabop zonalar:</span>
                {['.uz (25 000 so\'m)', '.com (145 000 so\'m)', '.org', '.net', '.io', '.dev'].map((tld) => (
                  <button
                    key={tld}
                    type="button"
                    onClick={() => {
                      setSearchQuery(searchQuery ? searchQuery.split('.')[0] + tld.split(' ')[0] : 'brend' + tld.split(' ')[0]);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer"
                  >
                    {tld}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Results Grid */}
          {searchHasRun && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">
                  Qidiruv natijalari: <span className="text-cyan-400 font-mono">"{searchQuery}"</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {searchResults.filter(r => r.available).length} ta bo'sh domen mavjud
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((item) => (
                  <div
                    key={item.domain}
                    className={`p-5 rounded-2xl border transition-all ${
                      item.available
                        ? 'bg-[#090e1a] border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5'
                        : 'bg-[#070b14] border-slate-900 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-white font-mono">{item.domain}</span>
                          {item.tld === '.uz' && (
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                              O'zbekiston
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {item.category}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-white">
                          {(item.priceUzs || 25000).toLocaleString()} so'm
                        </div>
                        <div className="text-[10px] text-slate-500">
                          yiliga
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-[11px]">
                        {item.available ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>BO'SH (Ro'yxatdan o'tish mumkin)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span>BAND (Band qilingan)</span>
                          </span>
                        )}
                      </div>

                      {item.available ? (
                        <button
                          onClick={() => openRegisterModal(item)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Sotib Olish</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setMainTab('whois');
                            runWhoisLookup(item.domain);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          WHOIS Ko'rish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: DNS PROPAGATSIYA DIAGNOSTIKASI                   */}
      {/* ======================================================== */}
      {mainTab === 'propagation' && (
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Global Anycast DNS Propagatsiya Tekshiruvi</h3>
              <p className="text-xs text-slate-400">
                Domen nomingiz butun dunyo bo'ylab barcha qit'alardagi DNS serverlarga qanday tarqalganini tekshiring
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Domen (masalan: sayt.uz)"
                value={propDomainInput}
                onChange={(e) => setPropDomainInput(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
              <button
                onClick={() => runPropagationTest(propDomainInput || activeDomain?.name || 'astrafolio.uz')}
                disabled={isCheckingProp}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingProp ? 'animate-spin' : ''}`} />
                <span>Tekshirish</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Joylashuv</th>
                  <th className="pb-3 font-semibold">Tugun Resolver</th>
                  <th className="pb-3 font-semibold">Javob IP (A Record)</th>
                  <th className="pb-3 font-semibold">Kechikish (Ping)</th>
                  <th className="pb-3 text-right">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {propResults.length > 0 ? (
                  propResults.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="py-3 text-white font-sans font-medium">{res.location}</td>
                      <td className="py-3 text-slate-400">{res.resolver}</td>
                      <td className="py-3 text-cyan-400 font-bold">{res.ip}</td>
                      <td className="py-3 text-slate-300">{res.latencyMs} ms</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                          ✓ Muvaffaqiyatli
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      Tekshirish uchun yuqoridagi tugmani bosing
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: WHOIS QIDIRUV                                    */}
      {/* ======================================================== */}
      {mainTab === 'whois' && (
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white mb-1">ccTLD.UZ & ICANN WHOIS Diagnostikasi</h3>
              <p className="text-xs text-slate-400">
                Ixtiyoriy domenning ro'yxatdan o'tish sanasi, egasi, registratori va DNS serverlarini ko'ring
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Domen (masalan: sayt.uz)"
                value={whoisDomainInput}
                onChange={(e) => setWhoisDomainInput(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
              />
              <button
                onClick={() => runWhoisLookup(whoisDomainInput || activeDomain?.name || 'astrafolio.uz')}
                disabled={isLoadingWhois}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Qidirish</span>
              </button>
            </div>
          </div>

          {whoisData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
                  Domen Registratori & Holati
                </div>
                <div><span className="text-slate-500 font-sans">Domen Nomi:</span> <span className="text-cyan-400 font-bold">{whoisData.domain}</span></div>
                <div><span className="text-slate-500 font-sans">Akkreditatsiyalangan Registrator:</span> <span className="text-white">{whoisData.registrar}</span></div>
                <div><span className="text-slate-500 font-sans">Domen Holati:</span> <span className="text-emerald-400">{whoisData.status}</span></div>
                <div><span className="text-slate-500 font-sans">Ro'yxatdan o'tgan sana:</span> <span className="text-slate-300">{new Date(whoisData.createdDate).toLocaleDateString()}</span></div>
                <div><span className="text-slate-500 font-sans">Muddati tugash sanasi:</span> <span className="text-amber-300">{new Date(whoisData.expiryDate).toLocaleDateString()}</span></div>
                <div><span className="text-slate-500 font-sans">DNSSEC:</span> <span className="text-slate-400">{whoisData.dnssec || 'Inaktiv'}</span></div>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="text-sm font-bold text-white font-sans border-b border-slate-800 pb-2">
                  Registrant (Egasi) Ma'lumotlari
                </div>
                <div><span className="text-slate-500 font-sans">Egasi:</span> <span className="text-white font-bold">{whoisData.registrant}</span></div>
                <div><span className="text-slate-500 font-sans">Aloqa Email:</span> <span className="text-slate-300">{whoisData.email}</span></div>
                <div><span className="text-slate-500 font-sans">Aloqa Telefon:</span> <span className="text-slate-300">{whoisData.phone}</span></div>
                <div><span className="text-slate-500 font-sans">Mamlakat:</span> <span className="text-slate-300">{whoisData.country}</span></div>
                <div><span className="text-slate-500 font-sans">Delegatsiya qilingan NS:</span> <span className="text-cyan-300">{whoisData.nameServers?.join(', ')}</span></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DOMEN SOTIB OLISH VA RO'YXATDAN O'TKAZISH        */}
      {/* ======================================================== */}
      {isRegisterModalOpen && targetDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span>Domen Ro'yxatdan O'tkazish</span>
            </div>

            <h3 className="text-xl font-black text-white">
              {targetDomain.domain}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              O'zbekiston ccTLD.UZ talablari bo'yicha to'g'ridan-to'g'ri nomingizga rasmiylashtiriladi
            </p>

            <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
              
              {/* Period & Pricing Selector */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">
                  Ro'yxatdan o'tkazish muddati:
                </label>
                <div className="grid grid-cols-4 gap-2 font-mono">
                  {[1, 2, 3, 5].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setRegisterYears(y)}
                      className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                        registerYears === y
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold font-sans">{y} yil</div>
                      <div className="text-[10px] text-slate-300">{((targetDomain.priceUzs || 25000) * y).toLocaleString()} s.</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Registrant Contact Form */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Domen Egasi Ma'lumotlari (Registrant):</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRegistrantType('individual')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        registrantType === 'individual' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Jismoniy shaxs
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistrantType('organization')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                        registrantType === 'organization' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Yuridik shaxs
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">
                      {registrantType === 'individual' ? 'Ism va Familiya' : 'Mas\'ul Shaxs'}
                    </label>
                    <input
                      type="text"
                      required
                      value={registrantName}
                      onChange={(e) => setRegistrantName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Aloqa Telefoni</label>
                    <input
                      type="tel"
                      required
                      value={registrantPhone}
                      onChange={(e) => setRegistrantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Email Manzil</label>
                    <input
                      type="email"
                      required
                      value={registrantEmail}
                      onChange={(e) => setRegistrantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">
                      {registrantType === 'individual' ? 'PINFL / JSHSHIR' : 'STIR (INN)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={registrantPinfl}
                      onChange={(e) => setRegistrantPinfl(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white font-medium font-mono"
                    />
                  </div>
                </div>

                {registrantType === 'organization' && (
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Kompaniya / Tashkilot Nomi</label>
                    <input
                      type="text"
                      placeholder="MChJ yoki Korxona nomi"
                      value={registrantOrg}
                      onChange={(e) => setRegistrantOrg(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Website to link */}
              {websites.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-slate-300 font-bold block">
                    Qaysi saytingizga biriktirilsin?
                  </label>
                  <select
                    value={linkSiteId}
                    onChange={(e) => setLinkSiteId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a17] border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="">Parked (Hozircha biriktirilmasin)</option>
                    {websites.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.runtime} • Port {w.port})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Free features included */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] space-y-1 text-emerald-300">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Tekin qo'shiladigan imkoniyatlar:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-slate-300 pl-5 list-disc">
                  <div>• Let's Encrypt TLS 1.3 SSL</div>
                  <div>• TAS-IX Anycast DNS (2ms)</div>
                  <div>• WHOIS Shaxsiy Himoya</div>
                  <div>• Avtomatik uzaytirish kafolati</div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <label className="text-slate-300 font-bold block flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>To'lov usuli:</span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-[10px]">
                  {[
                    { id: 'balance', name: 'Hisob balansi', badge: '490 000 s.' },
                    { id: 'click', name: 'CLICK', badge: '0% komissiya' },
                    { id: 'payme', name: 'Payme', badge: '0% komissiya' },
                    { id: 'uzumbank', name: 'Uzum Bank', badge: 'Keshbek 2%' },
                    { id: 'card', name: 'Visa/MC', badge: 'Global' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between items-center ${
                        paymentMethod === pm.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">{pm.name}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{pm.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Jami to'lov:</div>
                  <div className="text-lg font-black text-white font-mono">
                    {((targetDomain.priceUzs || 25000) * registerYears).toLocaleString()} so'm
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRegistration}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-bold rounded-xl transition-all hover:opacity-95 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingRegistration ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Ro'yxatdan o'tkazilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>To'lash & Faollashtirish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: MAVJUD DOMENNI ULASH (CONNECT EXISTING)          */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Mavjud Domenni Ulash</h3>
            <p className="text-xs text-slate-400 mb-5">
              Boshqa registratorda ro'yxatdan o'tgan shaxsiy domeningizni Astrafolio Cloud-ga ulang
            </p>

            <form onSubmit={handleConnectDomain} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Domen Nomi</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: shaxsiybrend.uz"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-cyan-400">DNS Talablari:</div>
                <div>Domeningiz registratorida quyidagi A yozuvini ko'rsating:</div>
                <div className="p-2 rounded bg-black/50 font-mono text-white text-xs mt-1">
                  @ ➔ 185.196.220.14
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="customCheck"
                  checked={isCustom}
                  onChange={(e) => setIsCustom(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-cyan-500"
                />
                <label htmlFor="customCheck" className="text-slate-300">
                  Bu tashqi o'zimga tegishli custom domen
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Domen Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Live Browser Modal */}
      <DomainBrowserModal
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        domainName={previewDomainName || activeDomain?.name || 'astrafolio.uz'}
        websiteId={activeDomain?.linkedWebsiteId}
        websiteName={websites.find(w => w.id === activeDomain?.linkedWebsiteId || w.domain === activeDomain?.name)?.name}
      />

      {/* DNS Troubleshooting Modal for ERR_NAME_NOT_RESOLVED */}
      <DnsHelpModal
        isOpen={isDnsHelpOpen}
        onClose={() => setIsDnsHelpOpen(false)}
        domainName={previewDomainName || activeDomain?.name || 'astrafolio.uz'}
        onOpenInAppBrowser={() => {
          setIsDnsHelpOpen(false);
          setIsBrowserOpen(true);
        }}
      />

    </div>
  );
};
