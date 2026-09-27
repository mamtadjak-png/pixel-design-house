import React, { useState } from 'react';
import { useApp, ORDER_STATUS_STEPS } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  FolderKanban, 
  Users, 
  Layers, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  ExternalLink, 
  Upload, 
  Clock, 
  DollarSign, 
  AlertCircle,
  MessageSquare,
  ArrowRight,
  FileText,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { OrderStatus, PortfolioProject, ServiceItem, DeliverableFile } from '../../types';

interface AdminDashboardProps {
  onNavigate: (view: string, extraParam?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    orders, 
    projects,
    portfolio, 
    services, 
    conversations, 
    updateOrderStatus, 
    updateOrderDetails,
    addDeliverableToOrder,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    updateServiceItem 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'projects' | 'clients' | 'portfolio' | 'services'>('orders');

  // Order editor state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('request_reviewed');
  const [newProgress, setNewProgress] = useState<number>(30);
  const [statusNotes, setStatusNotes] = useState<string>('');

  // Deliverable file state
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileType, setNewFileType] = useState('Vector AI / PDF (300 DPI)');

  // Portfolio creator / editor state
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<'Posters' | 'Invitations' | 'Advertisements' | 'Logos' | 'Social Media' | 'Video' | 'Custom'>('Posters');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjImage, setNewProjImage] = useState('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85');

  // Service pricing editor state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editServiceTitle, setEditServiceTitle] = useState('');
  const [editServiceDesc, setEditServiceDesc] = useState('');
  const [editServiceTurnaround, setEditServiceTurnaround] = useState('');

  const handleStartEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setEditServicePrice(service.startingPrice);
    setEditServiceTitle(service.title);
    setEditServiceDesc(service.shortDesc);
    setEditServiceTurnaround(service.turnaroundTime);
  };

  const handleSaveService = async (serviceId: string) => {
    await updateServiceItem(serviceId, {
      startingPrice: editServicePrice,
      title: editServiceTitle,
      shortDesc: editServiceDesc,
      turnaroundTime: editServiceTurnaround,
    });
    setEditingServiceId(null);
  };

  const handleStartEditProject = (proj: PortfolioProject) => {
    setEditingProjectId(proj.id);
    setNewProjTitle(proj.title);
    setNewProjCategory(proj.category as any);
    setNewProjClient(proj.client);
    setNewProjDesc(proj.shortDesc);
    setNewProjImage(proj.coverImage);
    setShowAddProject(true);
  };

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId: string) => {
    await updateOrderStatus(orderId, newStatus, newProgress, statusNotes);
    setEditingOrderId(null);
  };

  // Handle Mark Completed Shortcut
  const handleMarkDelivered = async (orderId: string) => {
    await updateOrderStatus(orderId, 'delivered', 100, 'Commission completed and master deliverables published.');
  };

  // Handle Add Deliverable
  const handleAddDeliverable = async (orderId: string) => {
    if (!newFileName.trim()) return;
    await addDeliverableToOrder(orderId, {
      id: `file-${Date.now()}`,
      name: newFileName.trim(),
      type: newFileType,
      size: '28.4 MB',
      downloadUrl: newFileUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
      uploadedAt: new Date().toISOString(),
    });
    setNewFileName('');
    setNewFileUrl('');
  };

  // Handle Add / Edit Project
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;

    if (editingProjectId) {
      await updatePortfolioProject(editingProjectId, {
        title: newProjTitle.trim(),
        category: newProjCategory,
        client: newProjClient || 'Independent Partner',
        shortDesc: newProjDesc,
        fullDesc: newProjDesc,
        coverImage: newProjImage,
      });
      setEditingProjectId(null);
    } else {
      const slug = newProjTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newProject: PortfolioProject = {
        id: `proj-${Date.now()}`,
        slug,
        title: newProjTitle.trim(),
        category: newProjCategory,
        shortDesc: newProjDesc || 'Bespoke creative design commission by Pixel Design House.',
        fullDesc: newProjDesc || 'High-fidelity creative direction and brand system crafted for discerning audiences.',
        client: newProjClient || 'Independent Partner',
        year: new Date().getFullYear().toString(),
        coverImage: newProjImage,
        gallery: [newProjImage],
        deliverables: ['Vector Master Files', 'Digital Guidelines'],
        creativeProcess: 'Engineered through modular grid layouts and chromatic lighting tests.',
        featured: true,
        tags: [newProjCategory, 'Editorial'],
        accentColor: '#00d2ff',
        order: portfolio.length + 1,
      };

      await addPortfolioProject(newProject);
    }

    setShowAddProject(false);
    setNewProjTitle('');
    setNewProjClient('');
    setNewProjDesc('');
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#19101b] via-[#10121d] to-[#090b12] border border-pink-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-pink-400" />
                <span>Pixel Design House Studio Director Suite</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Studio Operations & Client Management
            </h1>
            <p className="text-xs text-slate-400">
              Advance order milestone timelines, publish deliverables, manage client workspaces, and curate the portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Studio Support Inbox ({conversations.length})</span>
            </button>
          </div>
        </div>

        {/* Studio Top KPI Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08]">
            <span className="text-xs text-slate-400 block mb-1">Total Client Orders</span>
            <span className="text-2xl font-extrabold text-white font-mono">{orders.length}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08]">
            <span className="text-xs text-slate-400 block mb-1">Active Pipeline</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              {orders.filter((o) => o.status !== 'delivered').length}
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08]">
            <span className="text-xs text-slate-400 block mb-1">Project Workspaces</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{projects.length}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08]">
            <span className="text-xs text-slate-400 block mb-1">Published Cases</span>
            <span className="text-2xl font-extrabold text-pink-400 font-mono">{portfolio.length}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Order Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'projects' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Project Workspaces ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'portfolio' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Portfolio Showcase ({portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'services' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Services Catalog ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'clients' ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Clients Directory ({conversations.length})
          </button>
        </div>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display">Client Commissions Pipeline</h2>
                <p className="text-xs text-slate-400">Advance order milestones and upload deliverables</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs bg-[#0e1017] rounded-2xl border border-white/5">
                No client orders received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isEditing = editingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                            <span className="font-mono text-cyan-400 font-semibold">{order.orderNumber}</span>
                            <span>·</span>
                            <span>Client: <strong className="text-white">{order.clientName}</strong> ({order.clientEmail})</span>
                            <span>·</span>
                            <span>Priority: {order.priority}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white font-display">
                            {order.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                            order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {order.status.replace('_', ' ')} ({order.progress}%)
                          </span>

                          <button
                            onClick={() => {
                              if (isEditing) {
                                setEditingOrderId(null);
                              } else {
                                setEditingOrderId(order.id);
                                setNewStatus(order.status);
                                setNewProgress(order.progress);
                                setStatusNotes(order.notes || '');
                              }
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {isEditing ? 'Close' : 'Update Milestone'}
                          </button>

                          {order.status !== 'delivered' && (
                            <button
                              onClick={() => handleMarkDelivered(order.id)}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Milestone Status Advance Form */}
                      {isEditing && (
                        <div className="p-5 rounded-2xl bg-[#141724] border border-cyan-500/30 space-y-4">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            Advance Milestone & Timeline Status (Notifies Client)
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-slate-300 font-semibold mb-1">
                                New Pipeline Milestone
                              </label>
                              <select
                                value={newStatus}
                                onChange={(e) => {
                                  const val = e.target.value as OrderStatus;
                                  setNewStatus(val);
                                  const step = ORDER_STATUS_STEPS.find((s) => s.status === val);
                                  if (step) setNewProgress(step.defaultProgress);
                                }}
                                className="w-full bg-[#0a0c13] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                              >
                                {ORDER_STATUS_STEPS.map((step) => (
                                  <option key={step.status} value={step.status}>
                                    {step.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-slate-300 font-semibold mb-1">
                                Progress Completion: {newProgress}%
                              </label>
                              <input
                                type="range"
                                min={0}
                                max={100}
                                step={5}
                                value={newProgress}
                                onChange={(e) => setNewProgress(Number(e.target.value))}
                                className="w-full accent-cyan-400 mt-2"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-300 font-semibold mb-1">
                              Creative Director Milestone Notes for Client
                            </label>
                            <input
                              type="text"
                              value={statusNotes}
                              onChange={(e) => setStatusNotes(e.target.value)}
                              placeholder="e.g. Master vector exported and color proofs calibrated."
                              className="w-full bg-[#0a0c13] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id)}
                              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                            >
                              Save & Dispatch Notification
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Deliverables Upload Panel for Order */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-300">
                            Deliverables Attached ({order.deliverables?.length || 0})
                          </span>
                        </div>

                        {order.deliverables && order.deliverables.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {order.deliverables.map((d) => (
                              <div key={d.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center gap-2 text-slate-300">
                                <span className="font-semibold text-white">{d.name}</span>
                                <span className="text-slate-500 font-mono">({d.type})</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick file add input */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <input
                            type="text"
                            placeholder="Deliverable Name (e.g. Poster_300DPI_Vector.pdf)"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="w-full sm:flex-1 bg-[#121420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                          />
                          <button
                            onClick={() => handleAddDeliverable(order.id)}
                            className="w-full sm:w-auto px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Upload Deliverable</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white font-display">Client Project Workspaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400">{proj.orderNumber}</span>
                    <span className="font-bold text-slate-300 uppercase">{proj.status}</span>
                  </div>
                  <h4 className="text-base font-bold text-white font-display">{proj.title}</h4>
                  <p className="text-xs text-slate-400">Client: {proj.clientName} · {proj.serviceName}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span>{proj.deliverables.length} Deliverables</span>
                    <button
                      onClick={() => onNavigate('client_projects', proj.id)}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PORTFOLIO SHOWCASE */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-display">Manage Portfolio Showcase</h2>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddProject ? 'Close Form' : 'Add Showcase Case'}</span>
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleCreatePortfolio} className="p-6 rounded-2xl bg-[#0e1017] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-cyan-400">Add New Portfolio Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Project Title</label>
                    <input
                      type="text"
                      required
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Kinetic Sound Poster Series"
                      className="w-full bg-[#121420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={newProjCategory}
                      onChange={(e) => setNewProjCategory(e.target.value as any)}
                      className="w-full bg-[#121420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Posters">Posters</option>
                      <option value="Invitations">Invitations</option>
                      <option value="Advertisements">Advertisements</option>
                      <option value="Logos">Logos</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Video">Video</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newProjClient}
                      onChange={(e) => setNewProjClient(e.target.value)}
                      placeholder="e.g. Tokyo Sound Biennial"
                      className="w-full bg-[#121420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newProjImage}
                    onChange={(e) => setNewProjImage(e.target.value)}
                    className="w-full bg-[#121420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Short summary of project and concept..."
                    className="w-full bg-[#121420] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Save & Publish to Portfolio
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-[#0e1017] border border-white/[0.08] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={proj.coverImage} alt={proj.title} className="w-14 h-14 rounded-lg object-cover bg-slate-900" />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{proj.title}</h4>
                      <span className="text-xs text-slate-400">{proj.category} · {proj.client}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditProject(proj)}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePortfolioProject(proj.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES CATALOG & PRICING */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display">Services & Pricing Architecture</h2>
                <p className="text-xs text-slate-400">Admin pricing control: edit fee tiers, turnaround times, and descriptions live.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const isEditing = editingServiceId === service.id;
                return (
                  <div key={service.id} className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Service Title</label>
                          <input
                            type="text"
                            value={editServiceTitle}
                            onChange={(e) => setEditServiceTitle(e.target.value)}
                            className="w-full bg-[#121420] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Starting Price</label>
                            <input
                              type="text"
                              value={editServicePrice}
                              onChange={(e) => setEditServicePrice(e.target.value)}
                              placeholder="e.g. $450"
                              className="w-full bg-[#121420] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cyan-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Turnaround</label>
                            <input
                              type="text"
                              value={editServiceTurnaround}
                              onChange={(e) => setEditServiceTurnaround(e.target.value)}
                              placeholder="e.g. 3 – 5 Days"
                              className="w-full bg-[#121420] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Short Description</label>
                          <textarea
                            rows={2}
                            value={editServiceDesc}
                            onChange={(e) => setEditServiceDesc(e.target.value)}
                            className="w-full bg-[#121420] border border-white/10 rounded-lg p-2 text-xs text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingServiceId(null)}
                            className="px-3 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveService(service.id)}
                            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            Save Price & Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white font-display">{service.title}</h3>
                          <span className="text-xs font-mono font-bold text-cyan-400">{service.startingPrice}</span>
                        </div>
                        <p className="text-xs text-slate-400">{service.shortDesc}</p>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5 text-slate-400">
                          <span>Turnaround: {service.turnaroundTime}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditService(service)}
                              className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 text-cyan-300 cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit Pricing</span>
                            </button>
                            <button
                              onClick={() => updateServiceItem(service.id, { active: !service.active })}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase cursor-pointer ${
                                service.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {service.active ? 'Active' : 'Hidden'}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: CLIENTS DIRECTORY */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white font-display">Client Accounts & Contacts</h2>
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4">
              <div className="divide-y divide-white/[0.06]">
                {conversations.map((conv) => (
                  <div key={conv.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{conv.clientName}</h4>
                      <p className="text-xs text-slate-400">{conv.clientEmail}</p>
                      {conv.orderTitle && (
                        <span className="text-[11px] text-cyan-400">Order: {conv.orderTitle}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onNavigate('chat')}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
