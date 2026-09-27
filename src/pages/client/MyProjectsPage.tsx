import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FolderKanban, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Download, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Search,
  Eye,
  ChevronRight,
  Layers
} from 'lucide-react';
import { ClientProject } from '../../types';

interface MyProjectsPageProps {
  initialProjectId?: string;
  onNavigate: (view: string, extraParam?: string) => void;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ initialProjectId, onNavigate }) => {
  const { projects, orders, loadingProjects } = useApp();
  const [selectedProjId, setSelectedProjId] = useState<string | null>(initialProjectId || null);
  const [tab, setTab] = useState<'current' | 'completed'>('current');
  const [search, setSearch] = useState('');

  const currentProjects = projects.filter((p) => p.status !== 'completed');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  const displayedList = (tab === 'current' ? currentProjects : completedProjects).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const activeProject = projects.find((p) => p.id === selectedProjId) || displayedList[0] || null;

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Creative Asset Management
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Project Workspaces</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              My Projects & Deliverables
            </h1>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commission New Work</span>
          </button>
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-[#0e1017] border border-white/[0.08] rounded-2xl">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTab('current')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                tab === 'current' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Current Workspaces ({currentProjects.length})
            </button>
            <button
              onClick={() => setTab('completed')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                tab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed Vault ({completedProjects.length})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project titles..."
              className="w-full bg-[#131622] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Content Section */}
        {loadingProjects ? (
          <div className="py-24 text-center text-slate-500 text-xs">Loading projects...</div>
        ) : displayedList.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0e1017] border border-white/[0.08] text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white font-display">No {tab} projects</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {tab === 'current' 
                ? 'You have no creative projects in progress right now.' 
                : 'No finished projects archived yet.'}
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-xl cursor-pointer"
            >
              Commission a Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Project Cards List */}
            <div className="lg:col-span-4 space-y-3">
              {displayedList.map((proj) => {
                const isSelected = activeProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjId(proj.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-[#151824] border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0d0f17] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-cyan-400 font-semibold">{proj.orderNumber}</span>
                      <span className={`font-semibold uppercase tracking-wider ${
                        proj.status === 'completed' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display leading-snug">
                      {proj.title}
                    </h4>

                    <div className="text-xs text-slate-400">
                      <span>{proj.serviceName}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Project Workspace */}
            {activeProject && (
              <div className="lg:col-span-8 bg-[#0e1017] border border-white/[0.08] rounded-3xl p-6 sm:p-10 space-y-8">
                
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-mono text-cyan-400 font-semibold">{activeProject.orderNumber}</span>
                      <span>·</span>
                      <span>{activeProject.serviceName}</span>
                      <span>·</span>
                      <span>Created {new Date(activeProject.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display">
                      {activeProject.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onNavigate('client_orders', activeProject.orderId)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Order Details</span>
                    </button>

                    <button
                      onClick={() => onNavigate('chat')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Studio Team Chat</span>
                    </button>
                  </div>
                </div>

                {/* Cover Image Visual Preview */}
                {activeProject.coverImage && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/8] bg-slate-900 border border-white/10 relative shadow-xl">
                    <img
                      src={activeProject.coverImage}
                      alt={activeProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/15">
                        Active Creative Studio Artifact
                      </span>
                    </div>
                  </div>
                )}

                {/* Progress & Milestone History */}
                <div className="p-6 rounded-2xl bg-[#12141f] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Milestone Roadmap
                    </h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {activeProject.progress}% Handover
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProject.milestones.map((m, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                          m.completed 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-200' 
                            : 'bg-white/[0.02] border-white/5 text-slate-500'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${m.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <span className="truncate flex-1">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creative Brief */}
                <div className="p-6 rounded-2xl bg-[#12141f] border border-white/[0.08] space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Project Creative Brief
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeProject.brief}
                  </p>
                </div>

                {/* Deliverables Files Vault */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Production Deliverables Vault
                    </h3>
                    <span className="text-xs text-slate-400">
                      {activeProject.deliverables.length} Available
                    </span>
                  </div>

                  {activeProject.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {activeProject.deliverables.map((file) => (
                        <div
                          key={file.id}
                          className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/15 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-white block">{file.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{file.size} · {file.type}</span>
                            </div>
                          </div>

                          <a
                            href={file.downloadUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-slate-400">
                      No files published yet. Deliverables will be uploaded here as milestones are completed.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
