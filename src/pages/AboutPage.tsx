import React from 'react';
import { PixelLogo } from '../components/common/PixelLogo';
import { ContactCTA } from '../components/common/ContactCTA';
import { Sparkles, Layers, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block mb-4">
            <PixelLogo variant="full" size="lg" showTagline={true} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            Pixels with Purpose.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We are an international digital creative studio and bespoke client platform dedicated to creating timeless visual identity systems, kinetic posters, high-impact campaigns, and bespoke digital artifacts.
          </p>
        </div>

        {/* Studio Story */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e1017] border border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block">
              Origin & Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Rejecting AI slop in favor of human art direction.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pixel Design House was founded with a singular conviction: as generative tools flooded the world with derivative, repetitive digital clutter, true craft would become the ultimate differentiator.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every curve of our logomarks, every point size of our poster typography, and every frame of our kinetic motion sequences is authored with obsessive human discipline and mathematical intention.
            </p>
          </div>

          <div className="md:col-span-6 rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="Pixel Design House Studio Session"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Core Principles */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-widest block mb-2">
              Our Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Four non-negotiable principles.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Layers,
                color: 'text-cyan-400',
                title: 'Mathematical Rigor',
                desc: 'Every layout is grounded in Swiss grid theory, proportional balance, and optical kerning rather than arbitrary decoration.',
              },
              {
                icon: Sparkles,
                color: 'text-pink-400',
                title: 'Visceral Chromatics',
                desc: 'Vibrant, purposeful color dynamics drawn from our pencil-to-pixel identity, commanding emotional resonance in every medium.',
              },
              {
                icon: Cpu,
                color: 'text-amber-400',
                title: 'Production-Grade Engineering',
                desc: 'Master files are delivered clean, layered, CMYK press-calibrated, and fully documented for immediate scale.',
              },
              {
                icon: ShieldCheck,
                color: 'text-emerald-400',
                title: 'Radical Transparency',
                desc: 'Our proprietary client platform gives you 24/7 visibility into milestones, direct messaging, and version histories.',
              },
            ].map((pillar, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0c0e15] border border-white/[0.08] space-y-3">
                <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                <h4 className="text-base font-bold text-white font-display">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Studio Contact CTA */}
        <ContactCTA onNavigate={onNavigate} />

      </div>
    </div>
  );
};
