import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Play, 
  Trash2, 
  CheckCircle2, 
  Pause, 
  Terminal,
  AlertCircle,
  X
} from 'lucide-react';
import { Website } from '../../types';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  command: string;
  status: 'ACTIVE' | 'PAUSED';
  lastRun: string;
  nextRun: string;
}

interface CronJobsViewProps {
  websites: Website[];
}

export const CronJobsView: React.FC<CronJobsViewProps> = ({ websites }) => {
  const [jobs, setJobs] = useState<CronJob[]>([
    {
      id: 'cron_01',
      name: 'Kunlik DB Tozalash & Optimallashtirish',
      schedule: '0 0 * * *',
      command: 'php /var/www/site_01/artisan db:cleanup',
      status: 'ACTIVE',
      lastRun: '2026-09-12 00:00:02 (0.8s, exit 0)',
      nextRun: '2026-09-13 00:00:00',
    },
    {
      id: 'cron_02',
      name: 'Valyuta Kurslarini Yangilash (CBU API)',
      schedule: '*/30 * * * *',
      command: 'node /var/www/site_02/scripts/sync-currency.js',
      status: 'ACTIVE',
      lastRun: '2026-09-12 21:30:00 (1.4s, exit 0)',
      nextRun: '2026-09-12 22:00:00',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobName, setJobName] = useState('');
  const [schedule, setSchedule] = useState('0 0 * * *');
  const [command, setCommand] = useState('php artisan schedule:run');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName || !command) return;
    const newJob: CronJob = {
      id: `cron_${Date.now()}`,
      name: jobName,
      schedule,
      command,
      status: 'ACTIVE',
      lastRun: 'Hali ishga tushmadi',
      nextRun: 'Keyingi tsiklda',
    };
    setJobs([...jobs, newJob]);
    setJobName('');
    setIsModalOpen(false);
  };

  const toggleJob = (id: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === id ? { ...j, status: j.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : j
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Cron Jobs (Rejalashtirilgan Vazifalar)</h2>
          <p className="text-xs text-slate-400">
            Avtomatik tsikllar, fon skriptlari va ma'lumotlar sinxronizatsiyasi
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Vazifa Qo'shish</span>
        </button>
      </div>

      {/* Jobs List */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Faol Cron Vazifalar ({jobs.length})</h3>
        </div>

        <div className="divide-y divide-slate-800/60">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  job.status === 'ACTIVE' ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{job.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      {job.schedule}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      job.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono mt-1">
                    $ {job.command}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    So'nggi ijro: {job.lastRun}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJob(job.id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={job.status === 'ACTIVE' ? 'Pauza qilish' : 'Faollashtirish'}
                >
                  {job.status === 'ACTIVE' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="O'chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Cron Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Yangi Cron Vazifasi</h3>
            <p className="text-xs text-slate-400 mb-5">
              Belgilangan vaqt jadvalida avtomatik ishga tushuvchi skript
            </p>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vazifa Nomi</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: Keshni tozalash"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vaqt Jadvali (Cron Expression)</label>
                <input
                  type="text"
                  required
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
                <div className="flex gap-2 mt-1.5 text-[10px] text-cyan-400 font-mono">
                  <button type="button" onClick={() => setSchedule('* * * * *')} className="hover:underline">Har daqiqada</button>
                  <button type="button" onClick={() => setSchedule('0 * * * *')} className="hover:underline">Har soatda</button>
                  <button type="button" onClick={() => setSchedule('0 0 * * *')} className="hover:underline">Har kuni</button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bajariladigan Buyruq (Command)</label>
                <input
                  type="text"
                  required
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                />
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
                  Vazifani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
