import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  FileCode, 
  FileText, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Save, 
  Search, 
  ShieldCheck, 
  ChevronRight, 
  Folder,
  File,
  Terminal,
  Check
} from 'lucide-react';
import { VirtualFile, Website } from '../../types';

interface FileManagerViewProps {
  websites: Website[];
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({ websites }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(websites[0]?.id || 'site_01');
  const [files, setFiles] = useState<VirtualFile[]>([]);
  const [activeFile, setActiveFile] = useState<VirtualFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Fetch files for website
  const loadFiles = async (siteId: string) => {
    try {
      const res = await fetch(`/api/files/${siteId}`);
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
        const defaultFile = data.files.find((f: any) => f.type === 'file') || null;
        setActiveFile(defaultFile);
        setFileContent(defaultFile?.content || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedSiteId) {
      loadFiles(selectedSiteId);
    }
  }, [selectedSiteId]);

  const handleSelectFile = (file: VirtualFile) => {
    if (file.type === 'file') {
      setActiveFile(file);
      setFileContent(file.content || '');
    }
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/files/${selectedSiteId}/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: activeFile.path,
          content: fileContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        // update local files list
        setFiles(files.map((f) => (f.path === activeFile.path ? { ...f, content: fileContent } : f)));
      }
    } catch (err) {
      alert('Faylni saqlashda xatolik yuz berdi');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;
    const cleanPath = newFileName.startsWith('/') ? newFileName : `/${newFileName}`;
    try {
      const res = await fetch(`/api/files/${selectedSiteId}/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: cleanPath,
          content: `// ${newFileName}\nconsole.log('Hello Astrafolio');`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewFileName('');
        setIsCreating(false);
        await loadFiles(selectedSiteId);
        setActiveFile(data.file);
        setFileContent(data.file.content);
      }
    } catch (err) {
      alert('Fayl yaratishda xatolik');
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    if (!confirm(`${filePath} faylini o'chirishni tasdiqlaysizmi?`)) return;
    try {
      const res = await fetch(`/api/files/${selectedSiteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath }),
      });
      const data = await res.json();
      if (data.success) {
        loadFiles(selectedSiteId);
        if (activeFile?.path === filePath) {
          setActiveFile(null);
          setFileContent('');
        }
      }
    } catch (err) {
      alert('O\'chirishda xatolik');
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header & Site Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Fayl Menejeri & Kod Tahrirlagich</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Path-Traversal Himoyasi Faol
            </span>
            <span>•</span>
            <span>Chroot izolyatsiyalangan konteyner muhiti</span>
          </div>
        </div>

        {/* Website Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Loyihani tanlang:</span>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-cyan-400 font-semibold focus:outline-none"
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.domain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor & File Browser Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl bg-[#080c16] border border-slate-800 overflow-hidden min-h-[600px]">
        
        {/* Left: File Tree Explorer (4 Cols) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
          <div>
            
            {/* Search & Actions */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Fayllarni qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  title="Yangi Fayl"
                  className="p-1.5 bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-lg hover:bg-cyan-600/50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {isCreating && (
                <form onSubmit={handleCreateFile} className="flex gap-1 animate-in fade-in">
                  <input
                    autoFocus
                    type="text"
                    placeholder="/src/app.js"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-cyan-500/50 rounded text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-cyan-500 text-black font-bold text-xs rounded"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </form>
              )}
            </div>

            {/* Tree Items */}
            <div className="p-2 space-y-1 max-h-[480px] overflow-y-auto font-mono text-xs">
              {filteredFiles.map((file) => {
                const isSelected = activeFile?.path === file.path;
                return (
                  <div
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.type === 'folder' ? (
                        <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                      <span className="truncate">{file.name}</span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-600 font-sans">
                        {file.sizeBytes} B
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.path);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Root Stats */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Jami: {files.length} ta fayl</span>
            <span className="font-mono">/var/www/{selectedSiteId}</span>
          </div>
        </div>

        {/* Right: Code Editor (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {/* Editor Header */}
          <div className="px-4 py-3 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-500">Tahrirlanmoqda:</span>
              <span className="font-bold text-white">{activeFile?.path || 'Hech qanday fayl tanlanmagan'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveFile}
                disabled={saving || !activeFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors cursor-pointer disabled:opacity-40"
              >
                {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? 'Saqlanmoqda...' : saveSuccess ? 'Saqlandi!' : 'Saqlash (Ctrl+S)'}</span>
              </button>
            </div>
          </div>

          {/* Textarea Code Canvas */}
          <div className="p-4 flex-1 bg-[#060a14] font-mono text-xs">
            {activeFile ? (
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[480px] bg-transparent text-cyan-100 focus:outline-none resize-none leading-relaxed font-mono"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600">
                Tahrirlash uchun chap paneldan biror faylni tanlang
              </div>
            )}
          </div>

          {/* Editor Footer Status Bar */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>UTF-8</span>
              <span>LF</span>
              <span>Konteyner: /home/astra/app</span>
            </div>
            <span>{fileContent.length} belgi</span>
          </div>

        </div>

      </div>

    </div>
  );
};
