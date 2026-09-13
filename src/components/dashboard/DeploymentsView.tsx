import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  AlertCircle,
  FileCode
} from 'lucide-react';
import { Deployment, Website } from '../../types';

interface DeploymentsViewProps {
  deployments: Deployment[];
  websites: Website[];
  onTriggerDeploy: (siteId: string) => void;
  onRollback: (deploymentId: string) => void;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  deployments,
  websites,
  onTriggerDeploy,
  onRollback,
}) => {
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment>(deployments[0]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(websites[0]?.id || 'site_01');

  const activeDep = deployments.find((d) => d.id === selectedDeployment?.id) || deployments[0];

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Git & CI/CD Avtomatlashtirilgan Deploy</h2>
          <p className="text-xs text-slate-400">
            Har bir git push bo'yicha testlar, Docker build va nol uzilish bilan deploy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onTriggerDeploy(selectedSiteId)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Yangi Deploy Boshlash</span>
          </button>
        </div>
      </div>

      {/* CI/CD Visual Pipeline (Section 12 Flow) */}
      {activeDep && (
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase font-mono">
                Pipeline: {activeDep.websiteName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                {activeDep.status}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Davomiyligi: {activeDep.duration} • Muallif: {activeDep.author}
            </span>
          </div>

          {/* Steps Visual Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { name: '1. Git Clone', status: 'SUCCESS' },
              { name: '2. Dependencies', status: 'SUCCESS' },
              { name: '3. Docker Build', status: 'SUCCESS' },
              { name: '4. Unit Tests', status: 'SUCCESS' },
              { name: '5. Security WAF', status: 'SUCCESS' },
              { name: '6. Zero-Downtime', status: 'SUCCESS' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-200 text-[11px]">{step.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>

          {/* Commit details */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2 font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>{activeDep.branch}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">{activeDep.commitHash}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">"{activeDep.commitMessage}"</span>
            </div>
            <button
              onClick={() => onRollback(activeDep.id)}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-[11px] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ushbu versiyaga qaytarish (Rollback)</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Split: Deployments Table & Live Build Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: History List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Deploy Tarixi ({deployments.length})
          </span>

          <div className="space-y-2">
            {deployments.map((dep) => (
              <button
                key={dep.id}
                onClick={() => setSelectedDeployment(dep)}
                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  activeDep?.id === dep.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                    : 'bg-[#090e1a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{dep.websiteName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {dep.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 truncate mb-2">
                  "{dep.commitMessage}"
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{dep.commitHash} ({dep.branch})</span>
                  <span>{new Date(dep.createdAt).toLocaleTimeString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Build Log Console (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#060912] border border-slate-800 p-5 font-mono text-xs flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-sans text-xs font-bold">Build & Container Logs</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">exit code 0</span>
            </div>

            <div className="space-y-1.5 text-slate-300 max-h-[380px] overflow-y-auto">
              {activeDep?.logs?.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-slate-600 select-none mr-2">[{i + 1}]</span>
                  <span className={log.includes('✔') ? 'text-emerald-400' : log.includes('INFO') ? 'text-cyan-300' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Container ID: astrafolio-{activeDep?.id}</span>
            <span>Zero-Downtime Switch: OK</span>
          </div>
        </div>

      </div>

    </div>
  );
};
