import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  X, 
  FolderKanban, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Clock, 
  FileText,
  CornerDownLeft
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, extraParam?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { services, portfolio, orders, projects } = useApp();
  const { currentUser } = useAuth();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'portfolio' | 'orders' | 'projects'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search Results Compilation
  const cleanQ = query.trim().toLowerCase();

  const matchedServices = (activeFilter === 'all' || activeFilter === 'services')
    ? services.filter(s => 
        !cleanQ || 
        s.title.toLowerCase().includes(cleanQ) || 
        s.shortDesc.toLowerCase().includes(cleanQ) ||
        s.category.toLowerCase().includes(cleanQ)
      ).map(s => ({
        type: 'service' as const,
        id: s.id,
        title: s.title,
        subtitle: `${s.category} · Starts ${s.startingPrice}`,
        badge: 'Service',
        targetView: 'services',
        targetParam: s.id,
        icon: Sparkles,
      }))
    : [];

  const matchedPortfolio = (activeFilter === 'all' || activeFilter === 'portfolio')
    ? portfolio.filter(p => 
        !cleanQ || 
        p.title.toLowerCase().includes(cleanQ) || 
        p.client.toLowerCase().includes(cleanQ) ||
        p.tags.some(t => t.toLowerCase().includes(cleanQ))
      ).map(p => ({
        type: 'portfolio' as const,
        id: p.id,
        title: p.title,
        subtitle: `${p.category} · Client: ${p.client}`,
        badge: 'Portfolio',
        targetView: 'portfolio_detail',
        targetParam: p.id,
        icon: Layers,
      }))
    : [];

  const matchedOrders = (currentUser && (activeFilter === 'all' || activeFilter === 'orders'))
    ? orders.filter(o => 
        !cleanQ || 
        o.title.toLowerCase().includes(cleanQ) || 
        o.orderNumber.toLowerCase().includes(cleanQ) ||
        o.serviceName.toLowerCase().includes(cleanQ) ||
        o.status.toLowerCase().includes(cleanQ)
      ).map(o => ({
        type: 'order' as const,
        id: o.id,
        title: o.title,
        subtitle: `${o.orderNumber} · Status: ${o.status.replace('_', ' ')} (${o.progress}%)`,
        badge: 'My Order',
        targetView: 'client_orders',
        targetParam: o.id,
        icon: FolderKanban,
      }))
    : [];

  const matchedProjects = (currentUser && (activeFilter === 'all' || activeFilter === 'projects'))
    ? projects.filter(pr => 
        !cleanQ || 
        pr.title.toLowerCase().includes(cleanQ) || 
        pr.orderNumber.toLowerCase().includes(cleanQ) ||
        pr.serviceName.toLowerCase().includes(cleanQ)
      ).map(pr => ({
        type: 'project' as const,
        id: pr.id,
        title: pr.title,
        subtitle: `${pr.serviceName} · Milestone ${pr.progress}%`,
        badge: 'Project Workspace',
        targetView: 'client_projects',
        targetParam: pr.id,
        icon: FileText,
      }))
    : [];

  const allResults = [...matchedOrders, ...matchedProjects, ...matchedServices, ...matchedPortfolio];

  const handleSelectResult = (item: typeof allResults[0]) => {
    onNavigate(item.targetView, item.targetParam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#0f1118] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search disciplines, portfolio cases, orders, and projects..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 px-2 py-0.5 border border-white/10 rounded-md">
            ESC to close
          </span>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-white/5 bg-[#0b0c13] flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'services', 'portfolio', ...(currentUser ? ['orders', 'projects'] : [])] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f as any);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === f
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {f === 'all' ? 'All Results' : f === 'orders' ? 'My Orders' : f === 'projects' ? 'My Projects' : f}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.04] p-2">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching results found for "{query}". Try a different keyword.
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelectResult(item)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    idx === selectedIndex ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-white/5 text-cyan-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate font-display">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="px-4 py-2.5 bg-[#090a0f] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span>Search services, portfolio & your orders</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px] flex items-center gap-1">
              <CornerDownLeft className="w-2.5 h-2.5" />
              <span>select</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
