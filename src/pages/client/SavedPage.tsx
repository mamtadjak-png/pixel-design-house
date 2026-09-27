import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  Tag
} from 'lucide-react';

interface SavedPageProps {
  onNavigate: (view: string, extraParam?: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ onNavigate }) => {
  const { portfolio, services, savedWorkIds, toggleSaveWork } = useApp();

  const savedProjects = portfolio.filter((p) => savedWorkIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-pink-400 uppercase tracking-widest">
                Client Wishlist
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Curated References & Ideas</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Saved Works & Disciplines
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Art direction references and studio services bookmarked for upcoming creative commissions.
            </p>
          </div>

          <button
            onClick={() => onNavigate('portfolio')}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-fit"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore More Work</span>
          </button>
        </div>

        {/* Saved List */}
        {savedProjects.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0e1017] border border-white/[0.08] text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">No saved works yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our portfolio and bookmark projects or services you love. You can start a commission directly from any saved piece.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Browse Portfolio Work
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-[#0e1017] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Artwork Preview */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent opacity-60" />
                    
                    {/* Remove Bookmark Button */}
                    <button
                      onClick={() => toggleSaveWork(project.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-pink-400 hover:text-rose-300 hover:bg-black/80 transition-colors border border-white/10 cursor-pointer"
                      title="Remove from saved wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/10">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-2">
                    <div className="text-[11px] text-slate-500">
                      <span>Client: {project.client}</span> · <span className="font-mono">{project.year}</span>
                    </div>

                    <h3 
                      onClick={() => onNavigate('portfolio_detail', project.id)}
                      className="text-lg font-bold text-white font-display hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Start Commission From This Reference */}
                <div className="p-4 px-6 border-t border-white/[0.06] bg-[#0c0d15] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate('portfolio_detail', project.id)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Commission Similar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
