import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ContactCTA } from '../components/common/ContactCTA';
import { Clock, Tag, ArrowRight, CheckCircle2, Sparkles, Filter } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (view: string, serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const { services } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Print & Digital', 'Identity & Systems', 'Commercial & Media', 'Motion & Sound', 'Luxury & Events'];

  const filteredServices = selectedFilter === 'All'
    ? services
    : services.filter((s) => s.category.toLowerCase().includes(selectedFilter.toLowerCase()) || selectedFilter.toLowerCase().includes(s.category.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-2">
            Studio Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Art-direction grade creative services.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Every engagement is bespoke. We partner with ventures, founders, and cultural institutions requiring rigorous visual architecture and deliberate design execution.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-white/[0.08]">
          <span className="text-xs text-slate-500 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id}
              className="bg-[#0d0f17] border border-white/[0.08] hover:border-white/20 rounded-2xl p-6 sm:p-10 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Media Preview */}
              <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 border border-white/5 relative group">
                <img
                  src={service.sampleImage}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent opacity-40" />
              </div>

              {/* Service Info */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="font-mono text-cyan-400">0{idx + 1}</span>
                    <span>·</span>
                    <span className="text-slate-300">{service.category}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-3">
                    {service.title}
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {service.fullDesc}
                  </p>

                  {/* Deliverables Grid */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
                      Included Deliverables
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Metrics & Request CTA */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{service.turnaroundTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-mono text-slate-200 font-semibold">{service.startingPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('contact', service.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Request this service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Studio Contact CTA */}
        <ContactCTA onNavigate={onNavigate} />

      </div>
    </div>
  );
};
