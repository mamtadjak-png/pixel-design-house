import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContactCTA } from '../components/common/ContactCTA';
import { ArrowRight, Search, ArrowUpRight, Bookmark } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (view: string, projectId?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const { portfolio, savedWorkIds, toggleSaveWork, recordRecentlyViewed } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Posters', 'Invitations', 'Advertisements', 'Logos', 'Social Media', 'Video'];

  const filteredProjects = portfolio.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
            Selected Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Pixels with Purpose.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            An archive of identity systems, typographic posters, motion sequences, and commercial campaigns crafted for visionary clients.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-6 border-b border-white/[0.08]">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, title, tag..."
              className="w-full bg-[#12141e] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-white/[0.06] rounded-2xl bg-[#0c0e15] p-8">
            <h3 className="text-lg font-bold text-white mb-2 font-display">No matching projects found</h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-white/10 text-xs font-semibold text-white rounded-lg hover:bg-white/15"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  recordRecentlyViewed(project.id);
                  onNavigate('portfolio_detail', project.id);
                }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0d0f17] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Viewport */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent opacity-60" />
                    
                    {/* Hover Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    {/* Bookmark / Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveWork(project.id);
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                        savedWorkIds.includes(project.id)
                          ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/30'
                          : 'bg-black/60 text-slate-300 hover:text-white border-white/10 hover:bg-black/80'
                      }`}
                      title={savedWorkIds.includes(project.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span>{project.client}</span>
                      <span>·</span>
                      <span className="font-mono">{project.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {project.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Footer Tags */}
                <div className="px-6 pb-6 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[11px] text-slate-500">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                    <span>View Case</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Studio Contact CTA */}
        <ContactCTA onNavigate={onNavigate} />

      </div>
    </div>
  );
};
