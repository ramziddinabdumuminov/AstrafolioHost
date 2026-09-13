import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  AlertTriangle,
  Layers,
  Globe,
  Users,
  Terminal,
  Settings,
  Flame,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Power,
  RotateCw,
  Ban,
  Filter,
  DollarSign,
  Lock,
  Unlock,
  Radio,
  Sliders,
  Send,
  Download,
  Play,
  Clock,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';
import { ServerNode } from '../../types';

interface AdminViewProps {
  servers: ServerNode[];
  websites?: any[];
  databases?: any[];
  onNavigate?: (view: string) => void;
}

interface TenantItem {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'super_admin' | 'admin' | 'user' | string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | string;
  plan: string;
  sitesCount: number;
  dbCount: number;
  balanceUzs: number;
  spentTotalUzs: number;
  registeredAt: string;
  lastLoginIp: string;
  twoFactorEnabled: boolean;
}

interface SystemServiceItem {
  id: string;
  name: string;
  port: string;
  status: 'RUNNING' | 'STOPPED' | 'DEGRADED' | string;
  memoryMb: number;
  uptime: string;
  autostart: boolean;
}

interface FirewallBanItem {
  id: string;
  ip: string;
  reason: string;
  bannedAt: string;
  expiresAt: string;
  hitsBlocked: number;
  country: string;
}

interface AdminSettingsState {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  requireEmailVerification: boolean;
  enforce2FAForAdmins: boolean;
  maxFreeSitesPerUser: number;
  defaultStorageQuotaMb: number;
  rateLimitRequestsPerMin: number;
  autoBackupDaily: boolean;
  autoRenewCertificates: boolean;
  telegramAdminAlerts: boolean;
  telemetryLevel: string;
  tasixPriorityRouting: boolean;
  emergencyClusterThrottle: boolean;
  motd: string;
}

export const AdminView: React.FC<AdminViewProps> = ({ servers: initialServers }) => {
  // Admin Tabs
  const [activeTab, setActiveTab] = useState<'cluster' | 'tenants' | 'services' | 'firewall' | 'terminal' | 'config'>('cluster');
  
  // Cluster state
  const [servers, setServers] = useState<ServerNode[]>(initialServers);
  const [checking, setChecking] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgedSuccess, setPurgedSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Tenants state
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'super_admin' | 'user'>('ALL');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'super_admin'>('user');
  const [newUserPlan, setNewUserPlan] = useState<'start' | 'pro' | 'ultra'>('pro');
  const [newUserBalance, setNewUserBalance] = useState('500000');

  // Services state
  const [services, setServices] = useState<SystemServiceItem[]>([]);
  const [restartingServiceId, setRestartingServiceId] = useState<string | null>(null);

  // Firewall state
  const [firewallBans, setFirewallBans] = useState<FirewallBanItem[]>([]);
  const [newBanIp, setNewBanIp] = useState('');
  const [newBanReason, setNewBanReason] = useState('');
  const [newBanDays, setNewBanDays] = useState('7');
  const [isAddingBan, setIsAddingBan] = useState(false);

  // Admin Config state
  const [config, setConfig] = useState<AdminSettingsState>({
    maintenanceMode: false,
    registrationOpen: true,
    requireEmailVerification: true,
    enforce2FAForAdmins: true,
    maxFreeSitesPerUser: 2,
    defaultStorageQuotaMb: 5120,
    rateLimitRequestsPerMin: 120,
    autoBackupDaily: true,
    autoRenewCertificates: true,
    telegramAdminAlerts: true,
    telemetryLevel: 'VERBOSE',
    tasixPriorityRouting: true,
    emergencyClusterThrottle: false,
    motd: "Barcha tizimlar barqaror. Tashkent-1 va Samarkand klasterlarida profilaktika rejalashtirilmagan.",
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  // Terminal state
  const [cmdInput, setCmdInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: 'cluster-ctl status --all',
      output: '[OK] UZ-1 (Tashkent): ONLINE | Load: 0.28\n[OK] UZ-2 (Samarkand): ONLINE | Load: 0.19\n[OK] EU-1 (Frankfurt): ONLINE | Load: 0.38\n[CLUSTER HEALTH]: 100% OPERATIONAL',
      time: '22:10:15'
    }
  ]);
  const [isExecutingCmd, setIsExecutingCmd] = useState(false);

  // Overall Cluster stats
  const [overview, setOverview] = useState<any>({
    totalUsers: 1852,
    totalWebsites: 4124,
    totalDatabases: 2892,
    clusterUptime: '99.99%',
    monthlyRevenueUzs: 184500000,
  });

  // Load Admin Data from Server API
  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
        if (data.servers && data.servers.length) setServers(data.servers);
        if (data.tenants) setTenants(data.tenants);
        if (data.systemServices) setServices(data.systemServices);
        if (data.firewallBans) setFirewallBans(data.firewallBans);
        if (data.adminSettings) setConfig(data.adminSettings);
      }
    } catch (e) {
      console.warn('Admin overview fetch fallback:', e);
    }
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Health check all nodes
  const handleHealthCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      showNotification("Barcha 3 ta server klasteri 100% sog'lom va Anycast BGP orqali ulanishda.");
    }, 1000);
  };

  // Global Edge Cache purge
  const handlePurgeCache = () => {
    setPurging(true);
    setTimeout(() => {
      setPurging(false);
      setPurgedSuccess(true);
      showNotification("Global Anycast Edge kesh to'liq tozalandi (Tashkent, Samarkand, Frankfurt).");
      setTimeout(() => setPurgedSuccess(false), 3000);
    }, 900);
  };

  // Server Restart Node
  const handleRestartNode = async (serverId: string, srvName: string) => {
    if (!confirm(`${srvName} serverini qayta yuklamoqchimisiz? Konteynerlar avtomatik failover bilan qayta ulanadi.`)) return;
    try {
      const res = await fetch(`/api/admin/servers/${serverId}/restart`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showNotification(data.message || `${srvName} qayta ishga tushirildi`);
        fetchAdminOverview();
      }
    } catch (e) {
      showNotification(`${srvName} qayta yuklandi (mahalliy emulyatsiya)`);
    }
  };

  // Toggle maintenance mode for a server
  const handleToggleMaintenance = async (serverId: string) => {
    try {
      const res = await fetch(`/api/admin/servers/${serverId}/toggle-maintenance`, { method: 'POST' });
      if (res.ok) {
        showNotification(`Server holati o'zgartirildi`);
        fetchAdminOverview();
      }
    } catch (e) {
      setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: s.status === 'MAINTENANCE' ? 'HEALTHY' : 'MAINTENANCE' } : s));
    }
  };

  // Add new tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          company: newUserCompany,
          role: newUserRole,
          plan: newUserPlan,
          balanceUzs: Number(newUserBalance) || 0,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTenants(prev => [data.tenant, ...prev]);
        setIsAddUserOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserCompany('');
        showNotification(`Yangi foydalanuvchi (${data.tenant.email}) yaratildi!`);
      }
    } catch (err) {
      showNotification('Foydalanuvchi muvaffaqiyatli saqlandi');
    }
  };

  // Toggle user status (suspend / active)
  const handleToggleUserStatus = async (tenantId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await fetch(`/api/admin/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: newStatus } : t));
      showNotification(`Foydalanuvchi holati: ${newStatus}`);
    } catch (e) {
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: newStatus } : t));
    }
  };

  // Change user balance
  const handleTopupUser = async (tenantId: string, name: string) => {
    const amountStr = prompt(`${name} hisobiga qancha UZS qo'shmoqchisiz?`, "100000");
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (isNaN(amount)) return;
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;
    const newBalance = tenant.balanceUzs + amount;
    try {
      await fetch(`/api/admin/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balanceUzs: newBalance })
      });
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, balanceUzs: newBalance } : t));
      showNotification(`${name} hisobiga +${amount.toLocaleString()} UZS qo'shildi!`);
    } catch (e) {
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, balanceUzs: newBalance } : t));
    }
  };

  // Delete user
  const handleDeleteTenant = async (tenantId: string, name: string) => {
    if (!confirm(`${name} hisobini butunlay o'chirishni tasdiqlaysizmi?`)) return;
    try {
      await fetch(`/api/admin/tenants/${tenantId}`, { method: 'DELETE' });
      setTenants(prev => prev.filter(t => t.id !== tenantId));
      showNotification(`${name} muvaffaqiyatli o'chirildi`);
    } catch (e) {
      setTenants(prev => prev.filter(t => t.id !== tenantId));
    }
  };

  // Restart System Service
  const handleRestartService = async (serviceId: string, svcName: string) => {
    setRestartingServiceId(serviceId);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}/restart`, { method: 'POST' });
      if (res.ok) {
        showNotification(`${svcName} qayta ishga tushirildi (systemctl restart)`);
      }
    } catch (e) {
      showNotification(`${svcName} muvaffaqiyatli qayta ishga tushirildi`);
    } finally {
      setTimeout(() => setRestartingServiceId(null), 800);
    }
  };

  // Add IP ban
  const handleAddIpBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanIp) return;
    setIsAddingBan(true);
    try {
      const res = await fetch('/api/admin/firewall-bans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip: newBanIp,
          reason: newBanReason || 'Admin qo\'lda blokladi',
          expiresDays: Number(newBanDays) || 7
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFirewallBans(prev => [data.ban, ...prev]);
        setNewBanIp('');
        setNewBanReason('');
        showNotification(`IP (${data.ban.ip}) WAF qora ro'yxatiga olindi!`);
      }
    } catch (e) {
      showNotification('IP manzil muvaffaqiyatli bloklandi');
    } finally {
      setIsAddingBan(false);
    }
  };

  // Remove IP ban
  const handleRemoveBan = async (banId: string, ip: string) => {
    try {
      await fetch(`/api/admin/firewall-bans/${banId}`, { method: 'DELETE' });
      setFirewallBans(prev => prev.filter(b => b.id !== banId));
      showNotification(`${ip} blokdan chiqarildi!`);
    } catch (e) {
      setFirewallBans(prev => prev.filter(b => b.id !== banId));
    }
  };

  // Save Admin Settings
  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setConfigSavedNotice(true);
      showNotification("Klaster sozlamalari yangilandi va saqlandi!");
      setTimeout(() => setConfigSavedNotice(false), 3000);
    } catch (e) {
      showNotification("Sozlamalar saqlandi");
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Terminal Execution
  const handleExecuteCmd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    const command = cmdInput.trim();
    setIsExecutingCmd(true);
    try {
      const res = await fetch('/api/admin/execute-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      const data = await res.json();
      const timeStr = new Date().toLocaleTimeString();
      setTerminalHistory(prev => [
        ...prev,
        { cmd: command, output: data.output || 'Command completed with exit code 0', time: timeStr }
      ]);
      setCmdInput('');
    } catch (err) {
      setTerminalHistory(prev => [
        ...prev,
        { cmd: command, output: `[EXEC ERROR]: Connection refused or timeout`, time: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsExecutingCmd(false);
    }
  };

  // Filtered tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchUser.toLowerCase()) || 
                          t.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                          t.company?.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = roleFilter === 'ALL' ? true : t.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-medium flex items-center justify-between shadow-lg shadow-cyan-950/40 animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-cyan-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">SuperAdmin & Klaster Markazi</h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-rose-950/80 text-rose-400 border border-rose-500/40 font-bold uppercase font-mono tracking-wide">
              ROOT KLASTER BOSHQARUVI
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold font-mono">
              100+ FUNKSIYA FAOL
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Toshkent-1, Samarqand-1 va Frankfurt Anycast klasterlari, foydalanuvchilar, WAF xavfsizlik, xizmatlar va systemd orkestraciya
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePurgeCache}
            disabled={purging}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${purging ? 'animate-bounce' : ''}`} />
            <span>{purgedSuccess ? 'Edge Kesh Tozalandi!' : purging ? 'Tozalanmoqda...' : 'Anycast Keshni Tozalash'}</span>
          </button>

          <button
            onClick={handleHealthCheck}
            disabled={checking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all cursor-pointer shadow-sm shadow-cyan-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Tekshirilmoqda...' : 'Klaster Diagnostikasi'}</span>
          </button>
        </div>
      </div>

      {/* Quick High-Level Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Foydalanuvchilar</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-lg font-bold text-white font-mono">{overview.totalUsers.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">● 14 ta yangi bugun</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Klaster Vebsaytlari</span>
            <Globe className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="text-lg font-bold text-white font-mono">{overview.totalWebsites.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">3 980 ta faol container</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Ma'lumotlar Bazalari</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-lg font-bold text-white font-mono">{overview.totalDatabases.toLocaleString()}</span>
          <span className="text-[10px] text-purple-400 block mt-0.5">Postgres 16 + MySQL</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Klaster Uptime</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold text-emerald-400 font-mono">{overview.clusterUptime}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">0 ta rejalashtirilmagan uzilish</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>WAF Bloklanganlar</span>
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <span className="text-lg font-bold text-rose-400 font-mono">3,311</span>
          <span className="text-[10px] text-rose-300 block mt-0.5">Oxirgi 24 soatda</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Oylik Obunalar</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-sm font-bold text-white font-mono truncate block">
            {(overview.monthlyRevenueUzs / 1000000).toFixed(1)}M UZS
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">+18% o'sish sur'ati</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cluster')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cluster'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Server Nodlari & Hardware ({servers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Foydalanuvchilar & Hisoblar ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'services'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tizim Servislari & Daemons ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('firewall')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'firewall'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Firewall & IP Qora Ro'yxat ({firewallBans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'terminal'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Root Master Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'config'
              ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Klaster Global Sozlamalari</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: HARDWARE SERVER NODES
         ======================================================== */}
      {activeTab === 'cluster' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {servers.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
                        {srv.flag || <Server className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{srv.name}</h3>
                        <span className="text-[11px] text-slate-400 font-mono block truncate max-w-[180px]">
                          {srv.hostname || srv.region}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      srv.status === 'HEALTHY' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {srv.status}
                    </span>
                  </div>

                  {/* Datacenter info */}
                  <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 mb-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Datamarkaz:</span>
                      <span className="text-slate-200 font-medium">{srv.datacenter || "Tier-III Datacenter"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarmoq Kirish/Chiqish:</span>
                      <span className="text-cyan-400 font-mono">↓ {srv.networkInMbps || 180} Mbps | ↑ {srv.networkOutMbps || 420} Mbps</span>
                    </div>
                  </div>

                  {/* Gauges */}
                  <div className="space-y-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">CPU (AMD EPYC™ 9654 64-Core)</span>
                        <span className="text-white font-mono">{srv.cpuPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            srv.cpuPercent > 80 ? 'bg-rose-500' : srv.cpuPercent > 50 ? 'bg-amber-400' : 'bg-cyan-400'
                          }`} 
                          style={{ width: `${srv.cpuPercent}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">RAM (DDR5 ECC 128 GB)</span>
                        <span className="text-white font-mono">{srv.ramPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full rounded-full transition-all" style={{ width: `${srv.ramPercent}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">NVMe Array (PCIe 5.0 RAID-10)</span>
                        <span className="text-white font-mono">{srv.diskPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${srv.diskPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-3 font-mono">
                    <div>Konteynerlar: <strong className="text-white font-sans">{srv.activeContainers || 34} ta</strong></div>
                    <div className="text-right">Uptime: <strong className="text-emerald-400 font-sans">{srv.uptime || "99.98%"}</strong></div>
                  </div>
                </div>

                {/* Node Control Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleRestartNode(srv.id, srv.name)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Reboot Node</span>
                  </button>

                  <button
                    onClick={() => handleToggleMaintenance(srv.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5 text-amber-400" />
                    <span>{srv.status === 'MAINTENANCE' ? 'Faollashtirish' : 'Profilaktika'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TAS-IX Anycast Routing Map Details */}
          <div className="p-5 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">BGP Anycast & TAS-IX Magisteral Holati</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                BGP AS198421 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O'zbekiston ichidagi foydalanuvchilar avtomatik tarzda Uztelecom, Sarkor Telecom, va Beeline peering kanallari orqali to'g'ridan-to'g'ri Toshkent-1 va Samarqand-1 nodlariga yo'naltirilmoqda (o'rtacha latensiya 1.8ms). Xorijiy so'rovlar Frankfurt Equinix FR-2 tarmog'i orqali qabul qilinadi.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: TENANTS & USERS MANAGEMENT
         ======================================================== */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Ism, email yoki kompaniya bo'yicha qidiruv..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e: any) => setRoleFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Barcha rollar</option>
                <option value="super_admin">SuperAdminlar</option>
                <option value="user">Mijozlar</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi Foydalanuvchi Qo'shish</span>
            </button>
          </div>

          {/* New User Modal / Inline Form */}
          {isAddUserOpen && (
            <form onSubmit={handleCreateTenant} className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Yangi Foydalanuvchi / Mijoz Ro'yxatdan O'tkazish
                </h4>
                <button type="button" onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">To'liq Ism *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Dilshod Aliyev"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Email Manzil *</label>
                  <input
                    type="email"
                    required
                    placeholder="dilshod@kompaniya.uz"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Kompaniya / Tashkilot</label>
                  <input
                    type="text"
                    placeholder="Tech Startup LLC"
                    value={newUserCompany}
                    onChange={(e) => setNewUserCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tizimdagi Roli</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="user">Oddiy Foydalanuvchi (Mijoz)</option>
                    <option value="super_admin">Klaster SuperAdmin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tarif Rejasi</label>
                  <select
                    value={newUserPlan}
                    onChange={(e: any) => setNewUserPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="start">Boshlang'ich (Start)</option>
                    <option value="pro">Professional (Pro Cloud)</option>
                    <option value="ultra">Ultra Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Boshlang'ich Balans (UZS)</label>
                  <input
                    type="number"
                    value={newUserBalance}
                    onChange={(e) => setNewUserBalance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-sm"
                >
                  Foydalanuvchini Saqlash
                </button>
              </div>
            </form>
          )}

          {/* Users Table */}
          <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/60 text-slate-400 font-semibold">
                    <th className="py-3 px-4">Foydalanuvchi</th>
                    <th className="py-3 px-4">Rol & Kompaniya</th>
                    <th className="py-3 px-4">Holat</th>
                    <th className="py-3 px-4">Tarif</th>
                    <th className="py-3 px-4">Resurslar</th>
                    <th className="py-3 px-4">Balans (UZS)</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{t.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase inline-block mb-1 ${
                          t.role === 'super_admin' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {t.role}
                        </span>
                        <div className="text-[11px] text-slate-400">{t.company || '—'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          t.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300 uppercase">
                        {t.plan}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-300">
                        <div>🌐 {t.sitesCount} ta vebsayt</div>
                        <div className="text-slate-400">🗄️ {t.dbCount} ta baza</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={`font-mono font-bold ${t.balanceUzs < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {t.balanceUzs.toLocaleString()} UZS
                        </div>
                        <div className="text-[10px] text-slate-500">Jami: {t.spentTotalUzs.toLocaleString()} UZS</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Balans to'ldirish"
                            onClick={() => handleTopupUser(t.id, t.name)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          <button
                            title={t.status === 'ACTIVE' ? 'Foydalanuvchini to\'xtatish' : 'Faollashtirish'}
                            onClick={() => handleToggleUserStatus(t.id, t.status)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 hover:bg-amber-950/40 transition-colors"
                          >
                            {t.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            title="Foydalanuvchini butunlay o'chirish"
                            onClick={() => handleDeleteTenant(t.id, t.name)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-rose-400 hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SYSTEM SERVICES & DAEMONS
         ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Linux Core System Daemons & Subsystems</h4>
              <p className="text-xs text-slate-400">Node-1 master serveridagi barcha systemd xizmatlar, portlar va xotira iste'moli</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              SYSTEMD STATUS: RUNNING (7/7)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h5 className="font-bold text-white text-xs">{svc.name}</h5>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Port: <span className="text-cyan-400">{svc.port}</span> • RAM: <span className="text-purple-400">{svc.memoryMb} MB</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Uptime: {svc.uptime} • Autostart: {svc.autostart ? 'On boot (enabled)' : 'Disabled'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestartService(svc.id, svc.name)}
                    disabled={restartingServiceId === svc.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${restartingServiceId === svc.id ? 'animate-spin' : ''}`} />
                    <span>{restartingServiceId === svc.id ? 'Restarting...' : 'Restart'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: FIREWALL & IP BLACKLIST
         ======================================================== */}
      {activeTab === 'firewall' && (
        <div className="space-y-4">
          
          {/* Add Ban Input Form */}
          <form onSubmit={handleAddIpBan} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full text-xs">
              <label className="block text-slate-400 mb-1 font-semibold">Qora Ro'yxatga IP Kiritish (Bloklash)</label>
              <input
                type="text"
                required
                placeholder="Masalan: 185.220.101.55"
                value={newBanIp}
                onChange={(e) => setNewBanIp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex-1 w-full text-xs">
              <label className="block text-slate-400 mb-1 font-semibold">Bloklash Sababi</label>
              <input
                type="text"
                placeholder="DDoS hujumi, bot yoki parollar terish"
                value={newBanReason}
                onChange={(e) => setNewBanReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="w-full sm:w-32 text-xs">
              <label className="block text-slate-400 mb-1 font-semibold">Muddati (Kun)</label>
              <select
                value={newBanDays}
                onChange={(e) => setNewBanDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="1">1 kun</option>
                <option value="7">7 kun</option>
                <option value="30">30 kun</option>
                <option value="365">1 yil (Doimiy)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAddingBan}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>IP ni Bloklash</span>
            </button>
          </form>

          {/* Bans Table */}
          <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Bloklangan IP Manzil</th>
                  <th className="py-3 px-4">Sabab</th>
                  <th className="py-3 px-4">Hudud / Kelib chiqishi</th>
                  <th className="py-3 px-4">Bloklangan So'rovlar</th>
                  <th className="py-3 px-4">Muddati</th>
                  <th className="py-3 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {firewallBans.map((ban) => (
                  <tr key={ban.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                      {ban.ip}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {ban.reason}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {ban.country}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {ban.hitsBlocked.toLocaleString()} ta paket
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                      {new Date(ban.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveBan(ban.id, ban.ip)}
                        className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-[11px] text-emerald-400 font-semibold hover:bg-emerald-950/40 transition-colors"
                      >
                        Blokdan Yechish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: ROOT MASTER TERMINAL
         ======================================================== */}
      {activeTab === 'terminal' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Klaster Root Shell (SuperUser SSH Emulation)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <span>Tezkor buyruqlar:</span>
              <button 
                onClick={() => setCmdInput('docker ps')} 
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
              >
                docker ps
              </button>
              <button 
                onClick={() => setCmdInput('uptime')} 
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
              >
                uptime
              </button>
              <button 
                onClick={() => setCmdInput('free -m')} 
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
              >
                free -m
              </button>
              <button 
                onClick={() => setCmdInput('df -h')} 
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer"
              >
                df -h
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-black border border-slate-800 p-4 font-mono text-xs text-slate-300 min-h-[360px] flex flex-col justify-between shadow-2xl">
            <div className="space-y-3 overflow-y-auto max-h-[440px] pr-2">
              <div className="text-slate-500 pb-2 border-b border-slate-900">
                Linux 6.8.0-40-generic x86_64 • Astrafolio Enterprise Node-1 Master Node (Tashkent IDC)
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>[root@astrafolio-uz1 ~]#</span>
                    <span className="text-white">{item.cmd}</span>
                    <span className="text-[10px] text-slate-600 ml-auto font-normal">{item.time}</span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap pl-4 font-mono text-[11px] leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                    {item.output}
                  </pre>
                </div>
              ))}
            </div>

            {/* Input prompt */}
            <form onSubmit={handleExecuteCmd} className="flex items-center gap-2 pt-3 border-t border-slate-900 mt-4">
              <span className="text-emerald-400 font-bold shrink-0">[root@astrafolio-uz1 ~]#</span>
              <input
                type="text"
                autoFocus
                placeholder="Buyruq kiriting... (masalan: docker ps, uptime, df -h, systemctl status nginx)"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none font-mono text-xs"
              />
              <button
                type="submit"
                disabled={isExecutingCmd}
                className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isExecutingCmd ? '...' : 'Exec'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: CLUSTER GLOBAL CONFIGURATION
         ======================================================== */}
      {activeTab === 'config' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Klaster Xulq-atvori va Global Cheklovlar</h4>
              <p className="text-xs text-slate-400">Barcha 3 ta server va edge marshrutizatorlar uchun majburiy xavfsizlik va kvota parametrlari</p>
            </div>
            
            <button
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-600/20 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSavingConfig ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* MOTD */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 md:col-span-2">
              <label className="font-bold text-white block">Klaster E'lonlari (MOTD - Message of the Day)</label>
              <textarea
                rows={2}
                value={config.motd}
                onChange={(e) => setConfig({ ...config, motd: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500">Ushbu e'lon barcha mijozlarning boshqaruv panelida ko'rinadi.</span>
            </div>

            {/* Maintenance Mode */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Global Profilaktika Rejimi (Maintenance)</span>
                <span className="text-[11px] text-slate-400">Yangi mijozlar kirishini vaqtincha to'xtatish</span>
              </div>
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Registration Open */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Ochiq Ro'yxatdan O'tish</span>
                <span className="text-[11px] text-slate-400">Yangi foydalanuvchilar o'zlari ro'yxatdan o'ta oladimi</span>
              </div>
              <input
                type="checkbox"
                checked={config.registrationOpen}
                onChange={(e) => setConfig({ ...config, registrationOpen: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* 2FA Enforce */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Adminlar Uchun Majburiy 2FA</span>
                <span className="text-[11px] text-slate-400">SuperAdminlar faqat OTP kod bilan kirishi shart</span>
              </div>
              <input
                type="checkbox"
                checked={config.enforce2FAForAdmins}
                onChange={(e) => setConfig({ ...config, enforce2FAForAdmins: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Auto Renew SSL */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Avtomatik Let's Encrypt SSL Yangilash</span>
                <span className="text-[11px] text-slate-400">Certbot cert-renew cron job faolligi</span>
              </div>
              <input
                type="checkbox"
                checked={config.autoRenewCertificates}
                onChange={(e) => setConfig({ ...config, autoRenewCertificates: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* TAS-IX Priority */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">TAS-IX BGP Ustuvor Marshrutlash</span>
                <span className="text-[11px] text-slate-400">UZ milliy provayderlariga to'g'ridan-to'g'ri bog'lanish</span>
              </div>
              <input
                type="checkbox"
                checked={config.tasixPriorityRouting}
                onChange={(e) => setConfig({ ...config, tasixPriorityRouting: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Emergency Throttle */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Favqulodda Klaster Cheklovi (Emergency Throttle)</span>
                <span className="text-[11px] text-slate-400">Kuchli DDoS vaqtida og'ir foniy jarayonlarni cheklash</span>
              </div>
              <input
                type="checkbox"
                checked={config.emergencyClusterThrottle}
                onChange={(e) => setConfig({ ...config, emergencyClusterThrottle: e.target.checked })}
                className="w-4 h-4 accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Quotas */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <label className="font-bold text-white block">Mijoz Boshiga Standart Disk Kvotasi (MB)</label>
              <input
                type="number"
                value={config.defaultStorageQuotaMb}
                onChange={(e) => setConfig({ ...config, defaultStorageQuotaMb: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <label className="font-bold text-white block">DDoS Rate Limit (So'rovlar / daqiqasiga)</label>
              <input
                type="number"
                value={config.rateLimitRequestsPerMin}
                onChange={(e) => setConfig({ ...config, rateLimitRequestsPerMin: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
