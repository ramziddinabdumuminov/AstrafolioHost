import React, { useState } from 'react';
import { 
  Activity, 
  Globe, 
  Layers, 
  HardDrive, 
  FileCode, 
  FolderOpen, 
  KeyRound, 
  Clock, 
  ShieldCheck, 
  Bot, 
  Mail, 
  CreditCard, 
  Terminal, 
  HelpCircle, 
  Server, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Search, 
  Bell, 
  ExternalLink,
  ChevronRight,
  Zap,
  Store,
  Gauge,
  Send
} from 'lucide-react';
import { User, Website, DatabaseInstance, DomainItem, Deployment, BackupItem, ServerNode, AuditLogItem, TicketItem } from '../types';
import { OverviewView } from './dashboard/OverviewView';
import { WebsitesView } from './dashboard/WebsitesView';
import { WebsiteBuilderView } from './dashboard/WebsiteBuilderView';
import { MarketplaceView } from './dashboard/MarketplaceView';
import { EdgeCdnView } from './dashboard/EdgeCdnView';
import { SpeedAuditView } from './dashboard/SpeedAuditView';
import { TelegramBotView } from './dashboard/TelegramBotView';
import { DomainsView } from './dashboard/DomainsView';
import { FileManagerView } from './dashboard/FileManagerView';
import { DatabasesView } from './dashboard/DatabasesView';
import { SslView } from './dashboard/SslView';
import { DeploymentsView } from './dashboard/DeploymentsView';
import { BackupsView } from './dashboard/BackupsView';
import { CronJobsView } from './dashboard/CronJobsView';
import { AnalyticsView } from './dashboard/AnalyticsView';
import { SecurityView } from './dashboard/SecurityView';
import { AstraAiView } from './dashboard/AstraAiView';
import { EmailView } from './dashboard/EmailView';
import { BillingView } from './dashboard/BillingView';
import { TerminalView } from './dashboard/TerminalView';
import { SupportView } from './dashboard/SupportView';
import { AdminView } from './dashboard/AdminView';
import { SettingsView } from './dashboard/SettingsView';

interface DashboardLayoutProps {
  user: User;
  activeView: string;
  onSelectView: (viewId: string) => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  // Shared state
  websites: Website[];
  databases: DatabaseInstance[];
  domains: DomainItem[];
  deployments: Deployment[];
  backups: BackupItem[];
  servers: ServerNode[];
  auditLogs: AuditLogItem[];
  tickets: TicketItem[];
  // Handlers
  onCreateWebsite: (data: any) => void;
  onToggleSite: (siteId: string) => void;
  onRestartSite: (siteId: string) => void;
  onDeleteSite: (siteId: string) => void;
  onAddDomain: (data: any) => void;
  onRegisterDomain?: (data: any) => Promise<any>;
  onVerifyDomain: (domainId: string) => void;
  onAddDnsRecord: (domainId: string, record: any) => void;
  onDeleteDnsRecord: (domainId: string, recordId: string) => void;
  onDeleteDomain?: (domainId: string) => void;
  onLinkDomainSite?: (domainId: string, websiteId?: string) => void;
  onCreateDatabase: (data: any) => void;
  onBackupDatabase: (dbId: string) => void;
  onIssueSsl: (domainId: string) => void;
  onTriggerDeploy: (siteId: string) => void;
  onRollback: (deploymentId: string) => void;
  onCreateBackup: (data: any) => void;
  onRestoreBackup: (backupId: string) => void;
  onCreateTicket: (data: any) => void;
  onReplyTicket: (ticketId: string, text: string) => void;
  onSelectPlan: (planId: string) => void;
  onUpdateUser: (data: any) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  activeView,
  onSelectView,
  onLogout,
  onOpenCommandPalette,
  websites,
  databases,
  domains,
  deployments,
  backups,
  servers,
  auditLogs,
  tickets,
  onCreateWebsite,
  onToggleSite,
  onRestartSite,
  onDeleteSite,
  onAddDomain,
  onRegisterDomain,
  onVerifyDomain,
  onAddDnsRecord,
  onDeleteDnsRecord,
  onDeleteDomain,
  onLinkDomainSite,
  onCreateDatabase,
  onBackupDatabase,
  onIssueSsl,
  onTriggerDeploy,
  onRollback,
  onCreateBackup,
  onRestoreBackup,
  onCreateTicket,
  onReplyTicket,
  onSelectPlan,
  onUpdateUser,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navigationGroups = [
    {
      title: 'ASOSIY',
      items: [
        { id: 'overview', label: 'Boshqaruv Paneli', icon: Activity },
        { id: 'websites', label: 'Vebsaytlarim', icon: Globe, count: websites.length },
        { id: 'marketplace', label: 'Marketplace & Botlar', icon: Store, isNew: true },
        { id: 'builder', label: 'Vebsayt Konstruktori', icon: Layers, isNew: true },
        { id: 'domains', label: 'Domen & DNS', icon: Globe, count: domains.length },
      ],
    },
    {
      title: 'FAYLLAR VA BAZA',
      items: [
        { id: 'files', label: 'Fayl Menejeri', icon: FolderOpen },
        { id: 'databases', label: 'Ma\'lumotlar Bazasi', icon: HardDrive, count: databases.length },
        { id: 'email', label: 'Webmail & Pochta', icon: Mail, isNew: true },
      ],
    },
    {
      title: 'DEVOPS VA XAVFSIZLIK',
      items: [
        { id: 'edge', label: 'Edge CDN & TAS-IX', icon: Zap, isNew: true },
        { id: 'deployments', label: 'Git Deploy & CI/CD', icon: FileCode },
        { id: 'ssl', label: 'SSL Sertifikatlari', icon: KeyRound },
        { id: 'security', label: 'Xavfsizlik & WAF', icon: ShieldCheck },
        { id: 'backups', label: 'Zaxira Nusxalari', icon: HardDrive },
        { id: 'cron', label: 'Cron Jobs', icon: Clock },
      ],
    },
    {
      title: 'MONITORING & AI',
      items: [
        { id: 'speed', label: 'Tezlik & SEO Auditi', icon: Gauge, isNew: true },
        { id: 'telegram', label: 'Telegram Xabarnoma', icon: Send, isNew: true },
        { id: 'analytics', label: 'Analitika', icon: Activity },
        { id: 'ai', label: 'Astra AI Yordamchi', icon: Bot, isAi: true },
        { id: 'terminal', label: 'Web Terminal', icon: Terminal },
      ],
    },
    {
      title: 'HISOB & TIZIM',
      items: [
        { id: 'billing', label: 'To\'lov & Obuna', icon: CreditCard },
        { id: 'support', label: 'Yordam & Tiketlar', icon: HelpCircle, count: tickets.length },
        { id: 'admin', label: 'SuperAdmin Panel', icon: ShieldCheck, isNew: true },
        { id: 'settings', label: 'Sozlamalar', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#050811] text-slate-100 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ========================================================
          SIDEBAR NAVIGATION (Fixed Left)
         ======================================================== */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#080d1a] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <div
              onClick={() => onSelectView('overview')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="leading-tight">
                <span className="font-black tracking-wider text-sm text-white">ASTRAFOLIO</span>
                <span className="text-[10px] text-cyan-400 block font-mono">CLOUD CONSOLE</span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search Trigger inside Sidebar */}
          <div className="p-3">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Qidirish...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation Links Scroll Area */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)] text-xs">
            {navigationGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {grp.title}
                </span>

                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.count !== undefined && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono">
                            {item.count}
                          </span>
                        )}
                        {item.isNew && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                            NEW
                          </span>
                        )}
                        {item.isAi && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                            AI
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Mini Profile & Logout in Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070b14]">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                {user.firstName[0]}
              </div>
              <div className="truncate text-xs">
                <span className="font-bold text-white block truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {user.planId.toUpperCase()} PLAN
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Chiqish"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* ========================================================
          MAIN CONTENT VIEW AREA
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Astrafolio</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="font-bold text-white capitalize">{activeView}</span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tezkor buyruqlar</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                Ctrl+K
              </kbd>
            </button>

            <div className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tashkent UZ-1 (Online)</span>
            </div>
          </div>

        </header>

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#050811]">
          {activeView === 'overview' && (
            <OverviewView
              user={user}
              websites={websites}
              databases={databases}
              domains={domains}
              deployments={deployments}
              servers={servers}
              onNavigate={onSelectView}
              onRestartSite={onRestartSite}
            />
          )}

          {activeView === 'websites' && (
            <WebsitesView
              websites={websites}
              onCreateWebsite={onCreateWebsite}
              onToggleSite={onToggleSite}
              onRestartSite={onRestartSite}
              onDeleteSite={onDeleteSite}
              onNavigate={onSelectView}
            />
          )}

          {activeView === 'marketplace' && (
            <MarketplaceView
              websites={websites}
              domains={domains}
              onNavigate={onSelectView}
            />
          )}

          {activeView === 'builder' && <WebsiteBuilderView />}

          {activeView === 'edge' && <EdgeCdnView websites={websites} />}
          {activeView === 'speed' && <SpeedAuditView websites={websites} />}
          {activeView === 'telegram' && <TelegramBotView />}

          {activeView === 'domains' && (
            <DomainsView
              domains={domains}
              websites={websites}
              onAddDomain={onAddDomain}
              onRegisterDomain={onRegisterDomain}
              onVerifyDomain={onVerifyDomain}
              onAddDnsRecord={onAddDnsRecord}
              onDeleteDnsRecord={onDeleteDnsRecord}
              onIssueSsl={onIssueSsl}
              onDeleteDomain={onDeleteDomain}
              onLinkDomainSite={onLinkDomainSite}
            />
          )}

          {activeView === 'files' && <FileManagerView websites={websites} />}

          {activeView === 'databases' && (
            <DatabasesView
              databases={databases}
              websites={websites}
              onCreateDatabase={onCreateDatabase}
              onBackupDatabase={onBackupDatabase}
            />
          )}

          {activeView === 'ssl' && (
            <SslView domains={domains} onIssueSsl={onIssueSsl} />
          )}

          {activeView === 'deployments' && (
            <DeploymentsView
              deployments={deployments}
              websites={websites}
              onTriggerDeploy={onTriggerDeploy}
              onRollback={onRollback}
            />
          )}

          {activeView === 'backups' && (
            <BackupsView
              backups={backups}
              websites={websites}
              onCreateBackup={onCreateBackup}
              onRestoreBackup={onRestoreBackup}
            />
          )}

          {activeView === 'cron' && <CronJobsView websites={websites} />}

          {activeView === 'analytics' && <AnalyticsView />}

          {activeView === 'security' && <SecurityView auditLogs={auditLogs} />}

          {activeView === 'ai' && <AstraAiView websites={websites} />}

          {activeView === 'email' && <EmailView domains={domains} />}

          {activeView === 'billing' && (
            <BillingView user={user} onSelectPlan={onSelectPlan} />
          )}

          {activeView === 'terminal' && <TerminalView websites={websites} />}

          {activeView === 'support' && (
            <SupportView
              tickets={tickets}
              onCreateTicket={onCreateTicket}
              onReplyTicket={onReplyTicket}
            />
          )}

          {activeView === 'admin' && (
            <AdminView
              servers={servers}
              websites={websites}
              databases={databases}
              onNavigate={onSelectView}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView user={user} onUpdateUser={onUpdateUser} />
          )}
        </main>

      </div>

    </div>
  );
};
