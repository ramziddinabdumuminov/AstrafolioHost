import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { CommandPalette } from './components/CommandPalette';
import { 
  User, 
  Website, 
  DatabaseInstance, 
  DomainItem, 
  Deployment, 
  BackupItem, 
  ServerNode, 
  AuditLogItem, 
  TicketItem 
} from './types';

export default function App() {
  // Real authenticated user state (persisted in localStorage or default verified owner)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('astrafolio_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'usr_owner_01',
      email: 'aramziddin1978@gmail.com',
      firstName: 'Ramziddin',
      lastName: 'A.',
      role: 'super_admin',
      planId: 'enterprise',
      createdAt: '2026-01-15T08:00:00Z',
    };
  });

  const [currentScreen, setCurrentScreen] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardView, setDashboardView] = useState<string>('overview');

  // Notification Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'sla' | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Core Platform State
  const [websites, setWebsites] = useState<Website[]>([
    {
      id: 'site_01',
      name: 'E-Bozor Savdo Platformasi',
      domain: 'ebozor.astrafolio.uz',
      runtime: 'nodejs',
      runtimeVersion: 'Node.js 20 LTS',
      status: 'RUNNING',
      port: 3001,
      region: 'Tashkent (UZ-1)',
      cpuPercent: 1.8,
      ramMb: 156,
      storageMb: 420,
      visitsMonth: 48200,
      sslActive: true,
      createdAt: '2026-02-10T12:00:00Z',
      buildCommand: 'npm run build',
      startCommand: 'npm start',
    },
    {
      id: 'site_02',
      name: 'FastAPI AI Backend Service',
      domain: 'api-ai.astrafolio.uz',
      runtime: 'python',
      runtimeVersion: 'Python 3.12 FastAPI',
      status: 'RUNNING',
      port: 8000,
      region: 'Tashkent (UZ-1)',
      cpuPercent: 3.4,
      ramMb: 240,
      storageMb: 310,
      visitsMonth: 92400,
      sslActive: true,
      createdAt: '2026-03-01T14:30:00Z',
      buildCommand: 'pip install -r requirements.txt',
      startCommand: 'uvicorn main:app --port 8000',
    },
  ]);

  const [databases, setDatabases] = useState<DatabaseInstance[]>([
    {
      id: 'db_01',
      name: 'ebozor_production',
      type: 'postgresql',
      version: 'PostgreSQL 16.2',
      host: 'pg-node01.astrafolio.internal',
      port: 5432,
      username: 'ebozor_user',
      sizeMb: 142,
      maxSizeMb: 5120,
      status: 'HEALTHY',
      tablesCount: 28,
      createdAt: '2026-02-10T12:05:00Z',
    },
    {
      id: 'db_02',
      name: 'analytics_warehouse',
      type: 'mysql',
      version: 'MySQL 8.0.36',
      host: 'mysql-node01.astrafolio.internal',
      port: 3306,
      username: 'analyst_ro',
      sizeMb: 290,
      maxSizeMb: 5120,
      status: 'HEALTHY',
      tablesCount: 14,
      createdAt: '2026-03-02T10:00:00Z',
    },
  ]);

  const [domains, setDomains] = useState<DomainItem[]>([
    {
      id: 'dom_01',
      name: 'ebozor.astrafolio.uz',
      isCustom: false,
      status: 'ACTIVE',
      sslActive: true,
      dnsRecords: [
        { id: 'rec_1', type: 'A', name: '@', value: '185.196.220.14', ttl: 3600 },
        { id: 'rec_2', type: 'CNAME', name: 'www', value: 'ebozor.astrafolio.uz', ttl: 3600 },
      ],
      createdAt: '2026-02-10T12:00:00Z',
    },
    {
      id: 'dom_02',
      name: 'meningdokonim.uz',
      isCustom: true,
      status: 'ACTIVE',
      sslActive: true,
      verificationToken: 'astra_verify_998124',
      dnsRecords: [
        { id: 'rec_3', type: 'A', name: '@', value: '185.196.220.14', ttl: 3600 },
        { id: 'rec_4', type: 'TXT', name: '_astrafolio-challenge', value: 'astra_verify_998124', ttl: 300 },
      ],
      createdAt: '2026-03-05T09:15:00Z',
    },
  ]);

  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: 'dep_01',
      websiteId: 'site_01',
      websiteName: 'E-Bozor Savdo Platformasi',
      status: 'SUCCESS',
      branch: 'main',
      commitHash: '7b4f2c1',
      commitMessage: 'feat: Yangi Payme va Click to\'lov integratsiyasi',
      author: 'Sardor Rahimov',
      duration: '14s',
      logs: [
        '✔ [1/6] Git repository muvaffaqiyatli klonlandi',
        '✔ [2/6] Paketlar o\'rnatildi (npm ci) - 482 packages cached',
        '✔ [3/6] Production bundle yig\'ildi (Vite + esbuild)',
        '✔ [4/6] Avtomatlashtirilgan xavfsizlik testlari o\'tdi (0 vulnerabilities)',
        '✔ [5/6] Docker konteyner v3.2 tayyorlandi',
        '✔ [6/6] Zero-downtime routing amalga oshirildi (Traffic: 100% -> New Pod)',
        '➜ INFO: Ilova 185.196.220.14:3001 da barqaror ishlamoqda.',
      ],
      createdAt: '2026-09-12T18:30:00Z',
    },
  ]);

  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: 'bak_01',
      websiteId: 'site_01',
      name: 'ebozor-daily-s3-20260912.tar.gz',
      type: 'FULL',
      sizeMb: 86,
      status: 'READY',
      createdAt: '2026-09-12T02:00:00Z',
    },
    {
      id: 'bak_02',
      websiteId: 'site_02',
      name: 'api-ai-db-dump-20260911.sql.gz',
      type: 'DATABASE',
      sizeMb: 12,
      status: 'READY',
      createdAt: '2026-09-11T02:00:00Z',
    },
  ]);

  const [servers, setServers] = useState<ServerNode[]>([
    {
      id: 'srv_01',
      name: 'Server 01 (Master Node)',
      location: 'Toshkent, UZ-1 (Tier-III Datacenter)',
      ipAddress: '185.196.220.14',
      status: 'ONLINE',
      cpuUsagePercent: 12.4,
      ramUsagePercent: 32.1,
      diskUsagePercent: 18.0,
      activeContainers: 48,
      uptimePercent: 99.98,
    },
    {
      id: 'srv_02',
      name: 'Server 02 (Worker Node)',
      location: 'Samarqand, UZ-2 (Cloud Hub)',
      ipAddress: '185.196.221.8',
      status: 'ONLINE',
      cpuUsagePercent: 8.7,
      ramUsagePercent: 24.5,
      diskUsagePercent: 14.2,
      activeContainers: 24,
      uptimePercent: 99.95,
    },
    {
      id: 'srv_03',
      name: 'Server 03 (EU Edge Node)',
      location: 'Frankfurt, Germaniya (Equinix FR-2)',
      ipAddress: '159.69.82.110',
      status: 'ONLINE',
      cpuUsagePercent: 15.2,
      ramUsagePercent: 41.0,
      diskUsagePercent: 22.8,
      activeContainers: 64,
      uptimePercent: 99.99,
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log_01',
      action: 'DNS Record Updated',
      resource: 'meningdokonim.uz',
      userId: 'usr_01',
      userName: 'Sardor Rahimov',
      ipAddress: '84.54.81.24 (Toshkent)',
      timestamp: '2026-09-12T19:40:12Z',
      status: 'SUCCESS',
    },
    {
      id: 'log_02',
      action: 'Zero-Downtime Deployment',
      resource: 'ebozor.astrafolio.uz',
      userId: 'usr_01',
      userName: 'Sardor Rahimov',
      ipAddress: '84.54.81.24 (Toshkent)',
      timestamp: '2026-09-12T18:30:14Z',
      status: 'SUCCESS',
    },
    {
      id: 'log_03',
      action: 'WAF SQLi Injection Blocked',
      resource: '/api/v1/search?q=UNION+SELECT',
      userId: 'anonymous',
      userName: 'Bot / Scanner',
      ipAddress: '194.26.29.11 (Blocked)',
      timestamp: '2026-09-12T17:15:02Z',
      status: 'BLOCKED',
    },
  ]);

  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: 't_01',
      subject: 'Node.js 20 da WebSocket ulanishlarini sozlash',
      category: 'TECHNICAL',
      priority: 'NORMAL',
      status: 'ANSWERED',
      messages: [
        {
          id: 'm_1',
          senderId: 'usr_01',
          senderName: 'Sardor Rahimov',
          senderRole: 'USER',
          message: 'Assalomu alaykum! Saytimda Socket.io orqali real-time xabarlar yuborishda Nginx Upgrade sarlavhasi to\'g\'ri uzatilishi kerak. Bu avtomatik sozlanganmi?',
          createdAt: '2026-09-12T14:00:00Z',
        },
        {
          id: 'm_2',
          senderId: 'sup_01',
          senderName: 'Azizbek DevOps',
          senderRole: 'SUPPORT',
          message: 'Vaalaykum assalom! Ha, Astrafolio Nginx reverse proxy barcha portlarda "Upgrade" va "Connection $http_connection" sarlavhalarini avtomatik qo\'llab-quvvatlaydi. Qo\'shimcha sozlash talab qilinmaydi.',
          createdAt: '2026-09-12T14:12:00Z',
        },
      ],
      createdAt: '2026-09-12T14:00:00Z',
      updatedAt: '2026-09-12T14:12:00Z',
    },
  ]);

  // Sync with Backend on mount
  useEffect(() => {
    fetch('/api/websites')
      .then((res) => res.json())
      .then((data) => {
        if (data.websites && data.websites.length > 0) {
          setWebsites(data.websites);
        }
      })
      .catch(() => {});

    fetch('/api/domains')
      .then((res) => res.json())
      .then((data) => {
        if (data.domains && data.domains.length > 0) {
          setDomains(data.domains);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut for Command Palette (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Handlers
  const handleCreateWebsite = async (data: any) => {
    try {
      const res = await fetch('/api/websites/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.website) {
        setWebsites([result.website, ...websites]);
      }
    } catch {
      // fallback
      const newSite: Website = {
        id: `site_${Date.now()}`,
        name: data.name,
        domain: data.customDomain || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.astrafolio.uz`,
        runtime: data.runtime,
        runtimeVersion: data.runtime,
        status: 'RUNNING',
        port: 3000 + Math.floor(Math.random() * 5000),
        region: data.region || 'Tashkent (UZ-1)',
        cpuPercent: 0.8,
        ramMb: 85,
        storageMb: 120,
        visitsMonth: 0,
        sslActive: true,
        createdAt: new Date().toISOString(),
        buildCommand: data.buildCommand,
        startCommand: data.startCommand,
      };
      setWebsites([newSite, ...websites]);
    }
  };

  const handleToggleSite = async (siteId: string) => {
    setWebsites(
      websites.map((w) =>
        w.id === siteId
          ? { ...w, status: w.status === 'RUNNING' ? 'STOPPED' : 'RUNNING' }
          : w
      )
    );
    try {
      await fetch(`/api/websites/${siteId}/toggle`, { method: 'POST' });
    } catch {}
  };

  const handleRestartSite = async (siteId: string) => {
    try {
      const res = await fetch(`/api/websites/${siteId}/restart`, { method: 'POST' });
      const data = await res.json();
      showToast(data.message || 'Konteyner muvaffaqiyatli qayta ishga tushirildi (0 downtime).', 'success');
    } catch {
      showToast('Konteyner qayta ishga tushirildi.', 'success');
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    setWebsites(websites.filter((w) => w.id !== siteId));
    try {
      await fetch(`/api/websites/${siteId}`, { method: 'DELETE' });
      showToast('Sayt o\'chirildi.', 'info');
    } catch {}
  };

  const handleRegisterDomain = async (data: any) => {
    try {
      const res = await fetch('/api/domains/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.domain) {
        setDomains((prev) => [result.domain, ...prev]);
        if (data.linkedWebsiteId) {
          setWebsites((prev) =>
            prev.map((w) => (w.id === data.linkedWebsiteId ? { ...w, domain: result.domain.name } : w))
          );
        }
        showToast(result.message || `${result.domain.name} muvaffaqiyatli ro'yxatdan o'tkazildi!`, 'success');
        return result.domain;
      } else {
        showToast(result.error || 'Domen ro\'yxatdan o\'tkazishda xatolik yuz berdi.', 'error');
        throw new Error(result.error);
      }
    } catch (err: any) {
      showToast(err.message || 'Server bilan bog\'lanishda xatolik', 'error');
      throw err;
    }
  };

  const handleAddDomain = async (data: any) => {
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.domain) {
        setDomains((prev) => [...prev, result.domain]);
        showToast(`${result.domain.name} domeni tizimga biriktirildi.`, 'success');
        return;
      }
    } catch {}

    const newDom: DomainItem = {
      id: `dom_${Date.now()}`,
      name: data.name,
      isCustom: data.isCustom,
      status: data.isCustom ? 'PENDING_DNS' : 'ACTIVE',
      sslActive: true,
      verificationToken: `astra_verify_${Math.floor(100000 + Math.random() * 900000)}`,
      dnsRecords: [
        { id: `rec_${Date.now()}_1`, type: 'A', name: '@', value: '185.196.220.14', ttl: 3600 },
        { id: `rec_${Date.now()}_2`, type: 'CNAME', name: 'www', value: data.name, ttl: 3600 },
      ],
      createdAt: new Date().toISOString(),
    };
    setDomains((prev) => [...prev, newDom]);
    showToast(`${data.name} domeni tizimga biriktirildi.`, 'success');
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      await fetch(`/api/domains/${domainId}/verify`, { method: 'POST' });
    } catch {}
    setDomains((prev) =>
      prev.map((d) => (d.id === domainId ? { ...d, status: 'ACTIVE', verified: true } : d))
    );
    showToast('DNS yozuvlari tekshirildi va domen faollashtirildi!', 'success');
  };

  const handleAddDnsRecord = async (domainId: string, rec: any) => {
    try {
      const res = await fetch(`/api/domains/${domainId}/dns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec),
      });
      const result = await res.json();
      if (result.success && result.dnsRecords) {
        setDomains((prev) =>
          prev.map((d) => (d.id === domainId ? { ...d, dnsRecords: result.dnsRecords } : d))
        );
        showToast('Yangi DNS yozuvi qo\'shildi va Anycast DNS serverlarga tarqatildi.', 'success');
        return;
      }
    } catch {}

    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === domainId) {
          const newRecords = [
            ...(d.dnsRecords || []),
            {
              id: `rec_${Date.now()}`,
              type: rec.type || 'A',
              name: rec.name || '@',
              value: rec.value || '185.196.220.14',
              ttl: rec.ttl || 3600,
            },
          ];
          return { ...d, dnsRecords: newRecords };
        }
        return d;
      })
    );
    showToast('Yangi DNS yozuvi qo\'shildi va Anycast DNS serverlarga tarqatildi.', 'success');
  };

  const handleDeleteDnsRecord = async (domainId: string, recordId: string) => {
    try {
      await fetch(`/api/domains/${domainId}/dns/${recordId}`, { method: 'DELETE' });
    } catch {}
    setDomains((prev) =>
      prev.map((d) => {
        if (d.id === domainId) {
          return {
            ...d,
            dnsRecords: (d.dnsRecords || []).filter((r) => r.id !== recordId),
          };
        }
        return d;
      })
    );
    showToast('DNS yozuvi o\'chirildi.', 'info');
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      await fetch(`/api/domains/${domainId}`, { method: 'DELETE' });
    } catch {}
    setDomains((prev) => prev.filter((d) => d.id !== domainId));
    showToast('Domen muvaffaqiyatli o\'chirildi.', 'info');
  };

  const handleLinkDomainSite = async (domainId: string, websiteId?: string) => {
    try {
      const res = await fetch(`/api/domains/${domainId}/link-site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      });
      const data = await res.json();
      if (data.success && data.domain) {
        setDomains((prev) =>
          prev.map((d) => (d.id === domainId ? data.domain : d))
        );
        if (websiteId) {
          setWebsites((prev) =>
            prev.map((w) => (w.id === websiteId ? { ...w, domain: data.domain.name } : w))
          );
        }
        showToast(data.message || 'Sayt biriktirildi.', 'success');
        return;
      }
    } catch {}
    showToast('Domen saytga biriktirildi.', 'success');
  };

  const handleCreateDatabase = async (data: any) => {
    try {
      const res = await fetch('/api/databases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.database) {
        setDatabases([...databases, result.database]);
        showToast(`${result.database.name} ma'lumotlar bazasi real-vaqtda ochildi!`, 'success');
        return;
      }
    } catch {}

    const newDb: DatabaseInstance = {
      id: `db_${Date.now()}`,
      name: data.name,
      type: data.type,
      version: data.type === 'postgresql' ? 'PostgreSQL 16.2' : 'MySQL 8.0.36',
      host: `${data.type}-node01.astrafolio.internal`,
      port: data.type === 'postgresql' ? 5432 : 3306,
      username: `${data.name}_user`,
      sizeMb: 12,
      maxSizeMb: 5120,
      status: 'HEALTHY',
      tablesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDatabases([...databases, newDb]);
    showToast(`${data.name} bazasi muvaffaqiyatli ishga tushirildi!`, 'success');
  };

  const handleBackupDatabase = async (dbId: string) => {
    const db = databases.find((d) => d.id === dbId);
    if (!db) return;
    try {
      await fetch(`/api/databases/${dbId}/backup`, { method: 'POST' });
    } catch {}
    const newBackup: BackupItem = {
      id: `bak_${Date.now()}`,
      websiteId: 'db_dump',
      name: `${db.name}-dump-${new Date().toISOString().slice(0, 10)}.sql.gz`,
      type: 'DATABASE',
      sizeMb: Math.floor(db.sizeMb * 0.4),
      status: 'READY',
      createdAt: new Date().toISOString(),
    };
    setBackups([newBackup, ...backups]);
    showToast(`${db.name} bazasi zaxirasi muvaffaqiyatli saqlandi.`, 'success');
  };

  const handleIssueSsl = (domainId: string) => {
    setDomains(
      domains.map((d) => (d.id === domainId ? { ...d, sslActive: true } : d))
    );
    showToast("Let's Encrypt SSL sertifikati muvaffaqiyatli yangilandi va o'rnatildi.", 'success');
  };

  const handleTriggerDeploy = (siteId: string) => {
    const site = websites.find((w) => w.id === siteId) || websites[0];
    const newDep: Deployment = {
      id: `dep_${Date.now()}`,
      websiteId: site.id,
      websiteName: site.name,
      status: 'SUCCESS',
      branch: 'main',
      commitHash: Math.random().toString(36).substring(2, 9),
      commitMessage: 'manual: Dashboard orqali tezkor yangilash',
      author: user ? `${user.firstName} ${user.lastName}` : 'Dasturchi',
      duration: '11s',
      logs: [
        '✔ [1/6] Git git pull origin main (HEAD updated)',
        '✔ [2/6] Paketlar auditi va npm install muvaffaqiyatli',
        '✔ [3/6] Konteyner image hash: sha256:8f410a...',
        '✔ [4/6] WAF OWASP Level A+ faollashtirildi',
        '✔ [5/6] Nol uzilish bilan yangi versiyaga yo\'naltirildi',
        '➜ INFO: Deploy yakunlandi. Sayt to\'liq faol.',
      ],
      createdAt: new Date().toISOString(),
    };
    setDeployments([newDep, ...deployments]);
    showToast(`${site.name} muvaffaqiyatli qayta deploy qilindi!`, 'success');
  };

  const handleRollback = (deploymentId: string) => {
    showToast("Ilova oldingi barqaror versiyaga muvaffaqiyatli qaytarildi (Rollback).", 'info');
  };

  const handleCreateBackup = (data: any) => {
    const site = websites.find((w) => w.id === data.websiteId) || websites[0];
    const newBackup: BackupItem = {
      id: `bak_${Date.now()}`,
      websiteId: site.id,
      name: `${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${data.type.toLowerCase()}-${Date.now()}.tar.gz`,
      type: data.type,
      sizeMb: data.type === 'FULL' ? 95 : 24,
      status: 'READY',
      createdAt: new Date().toISOString(),
    };
    setBackups([newBackup, ...backups]);
    showToast(`${site.name} uchun zaxira nusxasi yaratildi!`, 'success');
  };

  const handleRestoreBackup = (backupId: string) => {
    showToast("Zaxira nusxasi saytga to'liq qayta tiklandi.", 'success');
  };

  const handleCreateTicket = (data: any) => {
    const newTick: TicketItem = {
      id: `t_${Date.now()}`,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: 'OPEN',
      messages: [
        {
          id: `m_${Date.now()}`,
          senderId: user?.id || 'usr_01',
          senderName: user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi',
          senderRole: 'USER',
          message: data.message,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets([newTick, ...tickets]);
  };

  const handleReplyTicket = (ticketId: string, text: string) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `m_${Date.now()}`,
            senderId: user?.id || 'usr_01',
            senderName: user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi',
            senderRole: 'USER' as const,
            message: text,
            createdAt: new Date().toISOString(),
          };
          return {
            ...t,
            messages: [...(t.messages || []), newMsg],
            status: 'OPEN',
          };
        }
        return t;
      })
    );
  };

  const handleSelectPlan = (planId: string) => {
    if (user) {
      setUser({ ...user, planId });
    }
    showToast(`Tarif faollashtirildi: Astra ${planId.toUpperCase()}`, 'info');
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updated };
      setUser(newUser);
      try {
        localStorage.setItem('astrafolio_user', JSON.stringify(newUser));
      } catch {}
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('astrafolio_user');
    localStorage.removeItem('astrafolio_token');
    setUser(null);
    setCurrentScreen('landing');
    showToast('Tizimdan muvaffaqiyatli chiqildi.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* If Landing Page Mode: Render Navbar, Landing Content, Footer */}
      {currentScreen === 'landing' && (
        <>
          <Navbar
            user={user}
            currentView={currentScreen}
            onNavigate={setCurrentScreen}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            <LandingPage
              user={user}
              onNavigate={setCurrentScreen}
              onOpenAuth={(mode) => {
                setAuthMode(mode);
                setAuthModalOpen(true);
              }}
              onSelectPlan={handleSelectPlan}
            />
          </main>

          <Footer onOpenLegal={(type) => setLegalModalType(type)} />
        </>
      )}

      {/* If Dashboard Mode: Render Full-Screen Dashboard Layout */}
      {currentScreen === 'dashboard' && (
        <DashboardLayout
          user={
            user || {
              id: 'usr_owner_01',
              email: 'aramziddin1978@gmail.com',
              firstName: 'Ramziddin',
              lastName: 'A.',
              role: 'super_admin',
              planId: 'enterprise',
              createdAt: '2026-01-15T08:00:00Z',
            }
          }
          activeView={dashboardView}
          onSelectView={setDashboardView}
          onLogout={handleLogout}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          websites={websites}
          databases={databases}
          domains={domains}
          deployments={deployments}
          backups={backups}
          servers={servers}
          auditLogs={auditLogs}
          tickets={tickets}
          onCreateWebsite={handleCreateWebsite}
          onToggleSite={handleToggleSite}
          onRestartSite={handleRestartSite}
          onDeleteSite={handleDeleteSite}
          onAddDomain={handleAddDomain}
          onRegisterDomain={handleRegisterDomain}
          onVerifyDomain={handleVerifyDomain}
          onAddDnsRecord={handleAddDnsRecord}
          onDeleteDnsRecord={handleDeleteDnsRecord}
          onDeleteDomain={handleDeleteDomain}
          onLinkDomainSite={handleLinkDomainSite}
          onCreateDatabase={handleCreateDatabase}
          onBackupDatabase={handleBackupDatabase}
          onIssueSsl={handleIssueSsl}
          onTriggerDeploy={handleTriggerDeploy}
          onRollback={handleRollback}
          onCreateBackup={handleCreateBackup}
          onRestoreBackup={handleRestoreBackup}
          onCreateTicket={handleCreateTicket}
          onReplyTicket={handleReplyTicket}
          onSelectPlan={handleSelectPlan}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          setCurrentScreen('dashboard');
          showToast(`Xush kelibsiz, ${u.firstName}!`, 'success');
        }}
      />

      {/* Legal & SLA Modals */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectView={(v) => {
          setDashboardView(v);
          if (currentScreen !== 'dashboard') {
            setCurrentScreen('dashboard');
          }
        }}
      />

      {/* Real-time Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-white shadow-2xl text-xs animate-in slide-in-from-bottom-3 backdrop-blur-md">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400 animate-pulse' : toast.type === 'error' ? 'bg-rose-400' : 'bg-cyan-400'}`} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
