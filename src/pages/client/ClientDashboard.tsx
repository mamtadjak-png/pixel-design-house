import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  FolderKanban, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  FileText,
  Bookmark,
  Bell,
  Search,
  ExternalLink,
  Shield,
  Zap,
  Tag
} from 'lucide-react';

interface ClientDashboardProps {
  onNavigate: (view: string, extraParam?: string) => void;
  onOpenSearch: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate, onOpenSearch }) => {
  const { userProfile, currentUser, isAdmin } = useAuth();
  const { 
    orders, 
    projects, 
    conversations, 
    notifications, 
    services, 
    savedWorkIds,
    recentlyViewedProjects,
    loadingOrders 
  } = useApp();

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const recentOrders = orders.slice(0, 3);
  const unreadNotifs = notifications.filter((n) => !n.read);
  const clientName = userProfile?.displayName?.split(' ')[0] || 'Client';

  // Recommended Services based on client's selected preferences or general curated picks
  const recommendedServices = services.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Personalized Welcome Hero */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141726] via-[#0f111d] to-[#090b12] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle glow spots */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Client Hub & Operations
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">
                  {userProfile?.company || 'Verified Client Account'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                Welcome to your creative workspace, {clientName}.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Track active design deliverables, communicate directly with lead artists in real-time, and commission new studio works with one click.
              </p>
            </div>

            {/* Quick Primary Actions Cluster (Amazon / Blinkit Level Usability) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start a Project</span>
              </button>

              <button
                onClick={() => onNavigate('client_orders')}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                <span>Chat with Studio</span>
              </button>

              <button
                onClick={onOpenSearch}
                className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-xl transition-colors cursor-pointer"
                title="Search Workspace (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Studio Pipeline Glance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div 
            onClick={() => onNavigate('client_orders')}
            className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <span className="text-xs text-slate-400 mb-1">Active Pipeline</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                {activeOrders.length}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">In Progress</span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('client_projects')}
            className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <span className="text-xs text-slate-400 mb-1">My Projects</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {projects.length}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Workspaces</span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('saved')}
            className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <span className="text-xs text-slate-400 mb-1">Saved Wishlist</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-mono">
                {savedWorkIds.length}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Bookmarked</span>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('notifications')}
            className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
          >
            <span className="text-xs text-slate-400 mb-1">Updates</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {unreadNotifs.length}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Unread</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Active Projects & Recent Orders */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Projects Tracker */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Active Project Workspaces</h2>
                  <p className="text-xs text-slate-400">Live milestones, proofs, and production files</p>
                </div>
                <button
                  onClick={() => onNavigate('client_projects')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loadingOrders ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading project data...</div>
              ) : activeOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0e1017] border border-white/[0.08] text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display">No active projects</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You have no active projects running right now. Let's create your next visual asset!
                  </p>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-xl cursor-pointer"
                  >
                    Start a Project
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => onNavigate('client_orders', order.id)}
                      className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer space-y-4"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-cyan-400 font-semibold">{order.orderNumber}</span>
                        <span className="font-bold text-slate-200 capitalize">
                          {order.status.replace('_', ' ')} Phase
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white font-display">
                          {order.title}
                        </h4>
                        <span className="text-xs text-slate-400">{order.serviceName}</span>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Milestone Completion</span>
                          <span className="font-mono text-white font-bold">{order.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Target: {order.deadline}</span>
                        </div>

                        <span className="text-slate-300 font-medium flex items-center gap-1">
                          <span>Inspect deliverables & timeline</span>
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white font-display">Recent Commissions</h2>
                <button
                  onClick={() => onNavigate('client_orders')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>See all orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] text-center text-xs text-slate-500">
                  No orders placed yet.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.06] rounded-2xl bg-[#0e1017] border border-white/[0.08] overflow-hidden">
                  {recentOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => onNavigate('client_orders', o.id)}
                      className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                          <span className="font-mono">{o.orderNumber}</span>
                          <span>·</span>
                          <span>{new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-display">{o.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          o.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {o.status.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-1 font-mono">{o.invoiceAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Services for Your Brand (Modern Commerce Inspired) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Recommended Studio Services</h2>
                  <p className="text-xs text-slate-400">Curated creative disciplines for scaling your visual presence</p>
                </div>
                <button
                  onClick={() => onNavigate('services')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>All services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedServices.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
                        {s.category}
                      </span>
                      <h4 className="text-base font-bold text-white font-display mb-2">{s.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">{s.shortDesc}</p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{s.startingPrice}</span>
                      <button
                        onClick={() => onNavigate('contact', s.id)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Request</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Studio Communications, Notifications & Recently Viewed */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Direct Studio Chat Widget */}
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white font-display">Studio Direct Channel</h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Live</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with your creative director. Discuss briefs, clarify specifications, or review proofs.
              </p>

              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Pixel Design House</span>
              </button>
            </div>

            {/* Quick Notification Feed */}
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-display">Latest Notifications</h3>
                </div>
                <button
                  onClick={() => onNavigate('notifications')}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No new updates.</p>
                ) : (
                  notifications.slice(0, 3).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onNavigate('notifications')}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        n.read ? 'bg-white/[0.02] text-slate-400' : 'bg-cyan-500/10 text-slate-200 border border-cyan-500/20'
                      }`}
                    >
                      <div className="font-semibold text-white mb-0.5">{n.title}</div>
                      <p className="line-clamp-2 text-[11px]">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Work / Wishlist Preview */}
            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-bold text-white font-display">Saved Work ({savedWorkIds.length})</h3>
                </div>
                <button
                  onClick={() => onNavigate('saved')}
                  className="text-[11px] text-pink-400 hover:underline cursor-pointer"
                >
                  View Wishlist
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Bookmarks of studio artwork, reference posters, and brand identities you are considering for future commissions.
              </p>

              <button
                onClick={() => onNavigate('saved')}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse Saved Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recently Viewed Projects */}
            {recentlyViewedProjects.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-display">Recently Viewed</h3>
                <div className="space-y-2">
                  {recentlyViewedProjects.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onNavigate('portfolio_detail', p.id)}
                      className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors cursor-pointer flex items-center gap-3"
                    >
                      <img src={p.coverImage} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-900" />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate font-display">{p.title}</h5>
                        <span className="text-[10px] text-slate-400">{p.category} · {p.client}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
