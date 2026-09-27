import React, { useState } from 'react';
import { useApp, ORDER_STATUS_STEPS } from '../../context/AppContext';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  Download, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Truck,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface MyOrdersPageProps {
  initialOrderId?: string;
  onNavigate: (view: string, extraParam?: string) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({ initialOrderId, onNavigate }) => {
  const { orders, loadingOrders } = useApp();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId || null);
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [search, setSearch] = useState('');

  // Default to first order if none selected
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0] || null;

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'delivered' ? order.status === 'delivered' : 
      order.status !== 'delivered';
    const matchesSearch = 
      order.title.toLowerCase().includes(search.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Client Operations
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Order Tracking & Fulfillment</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              My Orders & Commissions
            </h1>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/10 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Place New Commission</span>
          </button>
        </div>

        {/* Filter & Search Bar (Modern Commerce Usability) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-[#0e1017] border border-white/[0.08] rounded-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              In Progress ({orders.filter((o) => o.status !== 'delivered').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'delivered' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Delivered ({orders.filter((o) => o.status === 'delivered').length})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, title, or service..."
              className="w-full bg-[#131622] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Workspace Layout */}
        {loadingOrders ? (
          <div className="py-24 text-center text-slate-500 text-xs">Loading orders from database...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0e1017] border border-white/[0.08] text-center space-y-4">
            <FolderKanban className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white font-display">No commissions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No orders match the selected filter. Ready to commission your next project?
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-xl cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Orders List */}
            <div className="lg:col-span-4 space-y-3">
              {filteredOrders.map((order) => {
                const isSelected = activeOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-[#151824] border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0d0f17] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-cyan-400 font-semibold">{order.orderNumber}</span>
                      <span className={`font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'text-emerald-400' : 'text-slate-200'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display leading-snug">
                      {order.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{order.serviceName}</span>
                      <span className="font-mono text-white font-semibold">{order.invoiceAmount}</span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detailed Order Page & Live Status Timeline */}
            {activeOrder && (
              <div className="lg:col-span-8 bg-[#0e1017] border border-white/[0.08] rounded-3xl p-6 sm:p-10 space-y-8">
                
                {/* Order Top Bar & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-mono text-cyan-400 font-semibold">{activeOrder.orderNumber}</span>
                      <span>·</span>
                      <span>{activeOrder.serviceName}</span>
                      <span>·</span>
                      <span>Ordered {new Date(activeOrder.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display">
                      {activeOrder.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onNavigate('chat')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat About Order</span>
                    </button>

                    <button
                      onClick={() => onNavigate('client_projects', activeOrder.id)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Project Workspace</span>
                    </button>
                  </div>
                </div>

                {/* Commercial Summary Cards (Amazon / Blinkit Level Clarity) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Order Value & Billing</span>
                    </span>
                    <span className="text-sm font-bold text-white font-mono block">
                      {activeOrder.invoiceAmount} ({activeOrder.paymentStatus || 'Invoiced'})
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      <span>Expected Completion</span>
                    </span>
                    <span className="text-sm font-bold text-white block">
                      {activeOrder.deadline}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Delivery Information</span>
                    </span>
                    <span className="text-xs font-medium text-slate-300 block truncate">
                      {activeOrder.deliveryInformation || 'High-res master package'}
                    </span>
                  </div>
                </div>

                {/* THE 7-STEP DYNAMIC STATUS TIMELINE */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                        Production Status Timeline
                      </h3>
                      <p className="text-[11px] text-slate-400">Dynamically synced with Cloud Firestore</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {activeOrder.progress}% Completed
                    </span>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                    {ORDER_STATUS_STEPS.map((step, idx) => {
                      const isCompleted = ORDER_STATUS_STEPS.findIndex((s) => s.status === activeOrder.status) >= idx;
                      const isCurrent = activeOrder.status === step.status;

                      return (
                        <div key={step.status} className="relative flex items-start gap-4">
                          {/* Dot / Status Node */}
                          <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-cyan-500 ring-4 ring-cyan-500/20 text-black shadow-lg shadow-cyan-500/40'
                              : isCompleted
                              ? 'bg-emerald-500 text-black'
                              : 'bg-[#181b26] border border-white/20 text-slate-500'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            )}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold font-display ${
                                isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-slate-500'
                              }`}>
                                {step.label}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Creative Brief & Reference Files */}
                <div className="p-6 rounded-2xl bg-[#12141f] border border-white/[0.08] space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Project Parameters & Brief
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeOrder.description}
                  </p>

                  {activeOrder.referenceLinks && activeOrder.referenceLinks.length > 0 && (
                    <div className="pt-3 border-t border-white/10 mt-3">
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Attached Reference Links:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeOrder.referenceLinks.map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Ref #{i + 1}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeOrder.notes && (
                    <div className="pt-3 border-t border-white/10 mt-3">
                      <span className="text-[11px] font-semibold text-cyan-400 block mb-1">
                        Creative Director Notes:
                      </span>
                      <p className="text-xs text-slate-300 italic">{activeOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Deliverables Vault */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Files & Master Deliverables
                    </h3>
                    <span className="text-xs text-slate-400">
                      {activeOrder.deliverables?.length || 0} Assets
                    </span>
                  </div>

                  {activeOrder.deliverables && activeOrder.deliverables.length > 0 ? (
                    <div className="space-y-2">
                      {activeOrder.deliverables.map((file) => (
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
                            <span>Download Master</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-slate-400">
                      Master deliverables will be published here upon reaching the Final Design and Delivered phases.
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
