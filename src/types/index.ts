export type UserRole = 'super_admin' | 'admin' | 'developer' | 'client' | 'USER' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: any;
  planId?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface HostingPlan {
  id: 'start' | 'pro' | 'ultra';
  name: string;
  tagline: string;
  priceUzs: number;
  period: string;
  storageGb: number;
  websitesLimit: number | 'unlimited';
  databasesLimit: number | 'unlimited';
  subdomainsLimit: number | 'unlimited';
  customDomains: boolean;
  sslType: string;
  gitDeploy: boolean;
  cicd: boolean;
  backupType: string;
  analyticsType: string;
  emailAccounts: number | 'unlimited';
  supportLevel: string;
  cronJobsLimit: number;
  cpuCores: number;
  ramGb: number;
  bandwidth: string;
  isPopular?: boolean;
}

export type RuntimeType = 'static' | 'nodejs' | 'python' | 'php' | 'docker' | 'git';

export interface Website {
  id: string;
  name: string;
  slug?: string;
  domain: string;
  runtime: RuntimeType | string;
  runtimeVersion: string;
  region: string;
  serverNodeId?: string;
  status: 'RUNNING' | 'STOPPED' | 'BUILDING' | 'ERROR' | 'RESTARTING' | string;
  sslActive: boolean;
  port: number;
  cpuPercent: number;
  ramMb: number;
  storageMb: number;
  visitsMonth: number;
  gitRepo?: string;
  gitBranch?: string;
  autoDeploy?: boolean;
  buildCommand?: string;
  startCommand?: string;
  envVars?: Record<string, string>;
  createdAt: string;
  updatedAt?: string;
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface RegistrantInfo {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  country?: string;
  city?: string;
  passportOrPinfl?: string;
}

export interface DomainItem {
  id: string;
  name: string;
  isCustom: boolean;
  status: 'ACTIVE' | 'PENDING_DNS' | 'VERIFYING' | 'ERROR' | 'TRANSFERRING' | string;
  verified?: boolean;
  sslActive: boolean;
  sslExpiresAt?: string;
  linkedWebsiteId?: string;
  linkedWebsiteName?: string;
  dnsRecords?: DnsRecord[];
  createdAt: string;
  expiresAt?: string;
  verificationToken?: string;
  registeredVia?: 'astrafolio' | 'external';
  registrar?: string;
  autoRenew?: boolean;
  privacyProtection?: boolean;
  periodYears?: number;
  pricePerYear?: number;
  totalPaidUzs?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  nameservers?: string[];
  registrant?: RegistrantInfo;
}

export interface DomainSearchResult {
  domain: string;
  tld: string;
  available: boolean;
  priceUzs: number;
  priceFormatted: string;
  isPopular?: boolean;
  dnsInfo?: {
    addresses?: string[];
    nameservers?: string[];
  };
}

export interface VirtualFile {
  id: string;
  websiteId: string;
  path: string;
  name: string;
  type: 'file' | 'folder';
  sizeBytes: number;
  updatedAt: string;
  content?: string;
  extension?: string;
}

export interface DatabaseInstance {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | string;
  version: string;
  host: string;
  port: number;
  username: string;
  status: 'ONLINE' | 'BACKING_UP' | 'RESTORING' | 'OFFLINE' | 'HEALTHY' | string;
  sizeMb: number;
  maxSizeMb: number;
  tablesCount: number;
  linkedWebsiteId?: string;
  createdAt: string;
}

export interface SslCertificate {
  id: string;
  domain: string;
  issuer: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'ERROR' | string;
  validFrom: string;
  validUntil: string;
  autoRenew: boolean;
  fingerprint: string;
  algorithm: string;
}

export interface PipelineStage {
  name: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | string;
  durationMs: number;
}

export interface Deployment {
  id: string;
  websiteId: string;
  websiteName: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  author: string;
  status: 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' | string;
  startedAt?: string;
  createdAt?: string;
  finishedAt?: string;
  duration: string;
  stages?: PipelineStage[];
  logs: string[];
}

export interface BackupItem {
  id: string;
  websiteId: string;
  websiteName?: string;
  name?: string;
  type: any;
  sizeMb: number;
  checksum?: string;
  status: any;
  isAutomated?: boolean;
  createdAt: string;
}

export interface CronJobItem {
  id: string;
  name: string;
  websiteId: string;
  websiteName: string;
  command: string;
  schedule: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED';
  lastRun?: string;
  lastRunStatus?: 'SUCCESS' | 'FAILED';
  nextRun: string;
}

export interface AnalyticsStats {
  period: '24h' | '7d' | '30d' | '90d';
  visitors: number;
  uniqueVisitors: number;
  pageViews: number;
  requests: number;
  bandwidthGb: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  timeline: {
    time: string;
    visitors: number;
    requests: number;
    latency: number;
    bandwidthMb: number;
  }[];
  httpCodes: { code: string; label: string; count: number; percent: number; color: string }[];
  topPages: { path: string; views: number; avgTime: string }[];
  geo: { country: string; code: string; flag: string; visitors: number; percent: number }[];
  devices: { device: string; percent: number }[];
}

export interface WafRule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  blockedAttempts: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  resource: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
  details?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userEmail: string;
  subject: string;
  category: 'HOSTING' | 'DNS' | 'DATABASE' | 'BILLING' | 'SSL' | 'SECURITY';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: string;
    senderRole: 'user' | 'support' | 'admin';
    content: string;
    timestamp: string;
  }[];
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'DEPLOY' | 'SECURITY' | 'SSL' | 'BACKUP' | 'BILLING' | 'SYSTEM';
  severity: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  linkAction?: string;
}

export interface ServerNode {
  id: string;
  name: string;
  hostname: string;
  region: string;
  flag: string;
  datacenter: string;
  status: 'HEALTHY' | 'WARNING' | 'MAINTENANCE';
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  networkInMbps: number;
  networkOutMbps: number;
  activeContainers: number;
  uptime: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  planId: string;
  planName: string;
  amountUzs: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  paymentMethod: string;
}

export interface Subscription {
  planId: 'start' | 'pro' | 'ultra';
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'PENDING_PAYMENT';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  priceUzs: number;
  cycle: 'monthly' | 'yearly';
}

export type AuditLogItem = {
  id: string;
  action: string;
  resource: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  ip?: string;
  timestamp: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FAILED' | 'WARNING' | string;
};

export type TicketItem = {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages?: any[];
  createdAt: string;
  updatedAt?: string;
};

export type InvoiceItem = {
  id: string;
  invoiceNumber: string;
  amountUzs: number;
  status: string;
  planName: string;
  createdAt: string;
};

export interface WebmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  unread: boolean;
  starred?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash';
  attachments?: { name: string; size: string; type: string }[];
}

export interface EmailAccount {
  id: string;
  email: string;
  domain: string;
  storageUsedMb: number;
  storageMaxMb: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  messagesCount?: number;
  forwardTo?: string;
  dkimStatus?: boolean;
  spfStatus?: boolean;
}

export interface MarketplaceApp {
  id: string;
  name: string;
  category: 'CMS' | 'BOTS' | 'FRAMEWORKS' | 'DATABASE' | 'ECOMMERCE' | 'DEVTOOLS';
  version: string;
  icon: string;
  description: string;
  installsCount: number;
  rating: number;
  author: string;
  tags: string[];
  features: string[];
  defaultPort: number;
  runtime: 'nodejs' | 'python' | 'php' | 'docker' | 'static';
  envDefaults: Record<string, string>;
  isPopular?: boolean;
}

export interface EdgeCdnConfig {
  cachingEnabled: boolean;
  tasIxOptimization: boolean;
  compression: 'brotli' | 'gzip' | 'off';
  browserCacheTtlSec: number;
  edgeCacheTtlSec: number;
  underAttackMode: boolean;
  rateLimitPerSec: number;
  cacheHitRatio: number;
  bandwidthSavedMb: number;
  totalCachedRequests: number;
  cachePurgeHistory: { id: string; timestamp: string; url: string; status: 'SUCCESS' }[];
}

export interface SpeedAuditResult {
  url: string;
  testedAt: string;
  performanceScore: number;
  seoScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  loadTimeMs: number;
  ttfbMs: number;
  pageSizeKb: number;
  recommendations: {
    type: 'warning' | 'error' | 'success';
    title: string;
    description: string;
  }[];
}

export interface TelegramNotificationSetting {
  enabled: boolean;
  botToken?: string;
  chatId?: string;
  connectedUser?: string;
  notifyOnDown: boolean;
  notifyOnDeploy: boolean;
  notifyOnSslExpiry: boolean;
  notifyOnWebmail: boolean;
  notifyOnSecurityThreat: boolean;
  lastSentAt?: string;
}

