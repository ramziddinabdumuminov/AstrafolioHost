import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  HardDrive, 
  Server, 
  ShieldCheck, 
  KeyRound, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw,
  X,
  Terminal,
  Play,
  Clock
} from 'lucide-react';
import { DatabaseInstance, Website } from '../../types';

interface DatabasesViewProps {
  databases: DatabaseInstance[];
  websites: Website[];
  onCreateDatabase: (data: { name: string; type: 'postgresql' | 'mysql'; linkedWebsiteId?: string }) => void;
  onBackupDatabase: (dbId: string) => void;
}

export const DatabasesView: React.FC<DatabasesViewProps> = ({
  databases,
  websites,
  onCreateDatabase,
  onBackupDatabase,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbName, setDbName] = useState('');
  const [dbType, setDbType] = useState<'postgresql' | 'mysql'>('postgresql');
  const [linkedSiteId, setLinkedSiteId] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // SQL Console Modal state
  const [sqlModalDb, setSqlModalDb] = useState<DatabaseInstance | null>(null);
  const [sqlQuery, setSqlQuery] = useState('SELECT NOW(), version(), current_database();');
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState<any>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);

  const handleRunSql = async () => {
    if (!sqlModalDb || !sqlQuery.trim()) return;
    setSqlLoading(true);
    setSqlError(null);
    setSqlResult(null);

    try {
      const res = await fetch(`/api/databases/${sqlModalDb.id}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setSqlResult(data);
      } else {
        setSqlError(data.error || 'So\'rov bajarishda xatolik yuz berdi');
      }
    } catch {
      setSqlError('Server bilan real-vaqt aloqasi uzildi');
    } finally {
      setSqlLoading(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbName) return;
    onCreateDatabase({
      name: dbName,
      type: dbType,
      linkedWebsiteId: linkedSiteId || undefined,
    });
    setDbName('');
    setIsModalOpen(false);
  };

  const toggleReveal = (id: string) => {
    setRevealedPasswords({ ...revealedPasswords, [id]: !revealedPasswords[id] });
  };

  const copyString = (str: string, id: string) => {
    navigator.clipboard.writeText(str);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Ma'lumotlar Bazasi (Databases)</h2>
          <p className="text-xs text-slate-400">
            PostgreSQL 16 va MySQL 8.0 boshqariladigan klasterlari va PgBouncer ulanish filtri
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Baza Ochish</span>
        </button>
      </div>

      {/* Database Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {databases.map((db) => {
          const isRevealed = revealedPasswords[db.id];
          const connString = `${db.type}://${db.username}:${isRevealed ? 'sec_pass_astra_984' : '••••••••••••'}@${db.host}:${db.port}/${db.name}`;

          return (
            <div
              key={db.id}
              className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{db.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {db.version} • Port: {db.port}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                  {db.status}
                </span>
              </div>

              {/* Usage Gauges */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Band qilingan xotira</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {db.sizeMb} MB / {Math.floor(db.maxSizeMb / 1024)} GB
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full"
                    style={{ width: `${(db.sizeMb / db.maxSizeMb) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Jadvallar soni: {db.tablesCount} ta</span>
                  <span>PgBouncer: Pool 200</span>
                </div>
              </div>

              {/* Connection string snippet */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Ulanish Qatori (Connection URI):</span>
                  <button
                    onClick={() => toggleReveal(db.id)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{isRevealed ? 'Yashirish' : 'Parolni ko\'rish'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800 font-mono text-xs text-cyan-200 flex items-center justify-between">
                  <span className="truncate mr-2">{connString}</span>
                  <button
                    onClick={() => copyString(connString, db.id)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Nusxalash"
                  >
                    {copiedId === db.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBackupDatabase(db.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Dump Olish</span>
                  </button>

                  <button
                    onClick={() => {
                      setSqlModalDb(db);
                      setSqlResult(null);
                      setSqlError(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 hover:bg-cyan-900/40 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SQL Konsoli</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  Host: {db.host}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Database Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Ma'lumotlar Bazasi</h3>
            <p className="text-xs text-slate-400 mb-5">
              Toshkent yoki Frankfurt klasterida ajratilgan SQL instansiyasi ochiladi
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Baza Nomi</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: myshop_production"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">SQL Dvigateli</label>
                <select
                  value={dbType}
                  onChange={(e) => setDbType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-medium"
                >
                  <option value="postgresql">PostgreSQL 16.2 (Tavsiya etiladi)</option>
                  <option value="mysql">MySQL 8.0.36</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vebsaytga Bog'lash (ixtiyoriy)</label>
                <select
                  value={linkedSiteId}
                  onChange={(e) => setLinkedSiteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-medium"
                >
                  <option value="">Alohida instansiya (Bog'lanmagan)</option>
                  {websites.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
                >
                  Bazani Ishga Tushirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL Query Console Modal */}
      {sqlModalDb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#090e1a] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative font-sans text-xs">
            <button
              onClick={() => setSqlModalDb(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Jonli SQL So'rov Konsoli</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Baza: {sqlModalDb.name} ({sqlModalDb.type.toUpperCase()})
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">SQL So'rovi:</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="masalan: SELECT NOW(), version(); yoki SHOW TABLES;"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <div className="absolute right-2 bottom-3 flex items-center gap-1.5">
                    <button
                      disabled={sqlLoading}
                      onClick={handleRunSql}
                      className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{sqlLoading ? 'Bajarilmoqda...' : 'Bajarish (Run)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {sqlError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 font-mono text-xs">
                  {sqlError}
                </div>
              )}

              {/* Result Box */}
              {sqlResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">Muvaffaqiyatli bajarildi</span>
                    <span className="font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {sqlResult.executionTime}
                    </span>
                  </div>

                  <div className="overflow-x-auto max-h-48 border border-slate-800 rounded-xl bg-slate-950/90">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                        <tr>
                          {sqlResult.columns?.map((col: string, i: number) => (
                            <th key={i} className="px-3 py-2">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {sqlResult.rows?.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            {sqlResult.columns?.map((col: string, cIdx: number) => (
                              <td key={cIdx} className="px-3 py-2">{String(row[col] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
