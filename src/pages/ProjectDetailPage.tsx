import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sparkles, CheckCircle2, ArrowRight, Bookmark } from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onNavigate: (view: string, extraParam?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, onNavigate }) => {
  const { portfolio, savedWorkIds, toggleSaveWork, recordRecentlyViewed } = useApp();

  const project = portfolio.find((p) => p.id === projectId) || portfolio[0];

  useEffect(() => {
    if (project) {
      recordRecentlyViewed(project.id);
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#08090d] text-slate-100 py-24 text-center">
        <p className="text-slate-400">Project not found.</p>
        <button
          onClick={() => onNavigate('portfolio')}
          className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-xs font-semibold text-white"
        >
          Back to Work
        </button>
      </div>
    );
  }

  const isSaved = savedWorkIds.includes(project.id);
  const related = portfolio.filter((p) => p.id !== project.id && p.category === project.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all projects</span>
          </button>

          <button
            onClick={() => toggleSaveWork(project.id)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
          </button>
        </div>

        {/* Project Header */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-cyan-400 uppercase tracking-widest">{project.category}</span>
            <span>·</span>
            <span>Client: {project.client}</span>
            <span>·</span>
            <span className="font-mono">{project.year}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {project.shortDesc}
          </p>
        </div>

        {/* Hero Artwork Image */}
        <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-white/10 mb-12 shadow-2xl">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overview & Creative Process */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-white/[0.08]">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display mb-3">
                The Creative Brief & Execution
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {project.fullDesc}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white font-display mb-2">
                Creative Process & Methodology
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {project.creativeProcess}
              </p>
            </div>
          </div>

          {/* Sidebar Deliverables */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0f111a] border border-white/10 h-fit space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Final Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {project.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400 block mb-3">
                Need similar art direction for your venture?
              </span>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start a Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery of Additional Views */}
        {project.gallery && project.gallery.length > 1 && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-white font-display mb-6">
              Visual Studies & Detail Views
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.slice(1).map((imgUrl, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10">
                  <img
                    src={imgUrl}
                    alt={`${project.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {related.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-white font-display mb-6">
              Related Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('portfolio_detail', rel.id)}
                  className="p-6 rounded-2xl bg-[#0e1017] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs text-cyan-400 font-semibold">{rel.category}</span>
                    <h4 className="text-base font-bold text-white font-display mt-1">{rel.title}</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
