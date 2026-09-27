import React from 'react';
import { Sparkles, Phone, Mail, Instagram, ArrowRight } from 'lucide-react';

interface ContactCTAProps {
  onNavigate: (view: string, extraParam?: string) => void;
  className?: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onNavigate, className = '' }) => {
  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#121422] via-[#10121d] to-[#181124] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono font-semibold text-pink-400 uppercase tracking-widest block">
              Have a project in mind?
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Let's create something.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with Pixel Design House. Whether you need a bespoke brand identity, kinetic posters, or an international commercial campaign rollout, we're ready to build.
            </p>

            {/* Direct interactive contact links */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <a 
                href="tel:8074562812" 
                className="text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>8074562812</span>
              </a>
              <span className="text-slate-600">·</span>
              <a 
                href="mailto:namantoshniwal201212@gmail.com" 
                className="text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>namantoshniwal201212@gmail.com</span>
              </a>
              <span className="text-slate-600">·</span>
              <a 
                href="https://www.instagram.com/pixel_design_house/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-pink-400 flex items-center gap-1.5 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@pixel_design_house</span>
              </a>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-pink-500/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-display"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
