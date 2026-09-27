import React from 'react';
import { PixelLogo } from '../common/PixelLogo';
import { Phone, Mail, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#06070a] border-t border-white/[0.08] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
        
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer inline-block"
          >
            <PixelLogo variant="horizontal" size="md" />
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Pixels with Purpose. An independent digital creative studio engineering high-craft brand identities, kinetic posters, campaign visuals, and bespoke creative systems.
          </p>
        </div>

        {/* Official Contact Column */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
            Direct Contact
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Phone</div>
              <a 
                href="tel:8074562812" 
                className="text-white hover:text-cyan-400 font-mono transition-colors inline-flex items-center gap-2 mt-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>8074562812</span>
              </a>
            </li>
            <li>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Email</div>
              <a 
                href="mailto:namantoshniwal201212@gmail.com" 
                className="text-white hover:text-cyan-400 font-mono transition-colors inline-flex items-center gap-2 mt-0.5"
              >
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>namantoshniwal201212@gmail.com</span>
              </a>
            </li>
            <li>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Instagram</div>
              <a 
                href="https://www.instagram.com/pixel_design_house/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-pink-400 transition-colors inline-flex items-center gap-2 mt-0.5"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@pixel_design_house</span>
                <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>

        {/* Navigation Links (Home, About, Services, Portfolio, My Orders, Chat, Contact) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
            Navigation
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('about')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('services')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              Services
            </button>
            <button 
              onClick={() => onNavigate('portfolio')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              Portfolio
            </button>
            <button 
              onClick={() => onNavigate('client_orders')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              My Orders
            </button>
            <button 
              onClick={() => onNavigate('chat')} 
              className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              Chat
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className="text-left text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
            <button 
              onClick={() => onNavigate('ai_studio')} 
              className="text-left text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer py-1"
            >
              AI Studio Lab
            </button>
          </div>
        </div>

      </div>

      {/* Hairline Divider & Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © 2026 Pixel Design House. Pixels with Purpose. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>Phone: 8074562812</span>
          <span className="text-slate-700">|</span>
          <span>@pixel_design_house</span>
        </div>
      </div>
    </footer>
  );
};
