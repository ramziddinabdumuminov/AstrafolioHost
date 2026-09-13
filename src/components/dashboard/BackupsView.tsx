import React, { useState } from 'react';
import { 
  HardDrive, 
  Plus, 
  RotateCcw, 
  Download, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';
import { BackupItem, Website } from '../../types';

interface BackupsViewProps {
  backups: BackupItem[];
  websites: Website[];
  onCreateBackup: (data: { websiteId: string; type: any }) => void;
  onRestoreBackup: (backupId: string) => void;
}

export const BackupsView: React.FC<BackupsViewProps> = ({
  backups,
  websites,
  onCreateBackup,
  onRestoreBackup,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(websites[0]?.id || 'site_01');
  const [backupType, setBackupType] = useState<'FULL' | 'DATABASE' | 'FILES'>('FULL');
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBackup({
      websiteId: selectedSiteId,
      type: backupType,
    });
    setIsCreateModalOpen(false);
  };

  const executeRestore = () => {
    if (confirmRestoreId) {
      onRestoreBackup(confirmRestoreId);
      setConfirmRestoreId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Zaxira Nusxalari (Backups)</h2>
          <p className="text-xs text-slate-400">
            Avtomatik tungi va qo'lda yaratilgan shifrlangan S3 zaxira nusxalari
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Zaxira Yaratish</span>
        </button>
      </div>

      {/* Security & S3 Info */}
      <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">AES-256 Shifrlash & S3 Redundancy</span>
            <span className="text-[11px] text-slate-400">
              Har bir zaxira fayli alohida shifrlanadi va 3 ta geografik serverda saqlanadi
            </span>
          </div>
        </div>
        <span className="text-cyan-400 font-mono text-[11px]">
          Saqlash muddati: 30 kun
        </span>
      </div>

      {/* Backups List */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Mavjud Zaxira Fayllari ({backups.length})</h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {backups.map((b) => (
            <div
              key={b.id}
              className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{b.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {b.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Hajmi: {b.sizeMb} MB • Yaratilgan: {new Date(b.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmRestoreId(b.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qayta Tiklash</span>
                </button>

                <a
                  href={`/api/backups/${b.id}/download`}
                  download
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Yuklab olish"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Backup Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Zaxira Nusxasi</h3>
            <p className="text-xs text-slate-400 mb-5">
              Sayt fayllari va ma'lumotlar bazasini to'liq arxivlash
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vebsaytni Tanlang</label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  {websites.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Zaxiralash Turi</label>
                <select
                  value={backupType}
                  onChange={(e) => setBackupType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  <option value="FULL">To'liq Zaxira (Fayllar + SQL Baza)</option>
                  <option value="DATABASE">Faqat Ma'lumotlar Bazasi (SQL Dump)</option>
                  <option value="FILES">Faqat Sayt Fayllari</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg"
                >
                  Zaxiralashni Boshlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Restore */}
      {confirmRestoreId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-amber-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Qayta Tiklashni Tasdiqlang</h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Diqqat: Ushbu zaxira nusxasini qayta tiklash joriy o'zgarishlarning ustiga yoziladi. Sayt bir necha soniyaga qayta yuklanadi. Davom ettirasizmi?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmRestoreId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Bekor qilish
              </button>
              <button
                onClick={executeRestore}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg"
              >
                Ha, Qayta Tiklansin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
