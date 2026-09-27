import React, { useState, useMemo } from 'react';
import { IntegratedScroll3DCanvas } from '../components/3d/IntegratedScroll3DCanvas';
import { PixelLogo } from '../components/common/PixelLogo';
import { GeminiStudioAdvisor } from '../components/common/GeminiStudioAdvisor';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Palette, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  FileCheck2,
  Bot,
  Filter,
  Clock,
  Send,
  Eye,
  ChevronRight,
  Compass,
  FileText,
  UploadCloud,
  Check
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, extraParam?: string) => void;
  onOpenAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  const { services, portfolio } = useApp();
  const { currentUser } = useAuth();
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtered portfolio projects for Section 4
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') {
      return portfolio.slice(0, 6);
    }
    return portfolio.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    ).slice(0, 6);
  }, [portfolio, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'Posters', label: 'Posters' },
    { id: 'Invitations', label: 'Invitations' },
    { id: 'Advertisements', label: 'Advertisements' },
    { id: 'Logos', label: 'Logos' },
    { id: 'Social Media', label: 'Social Media' },
    { id: 'Video', label: 'Video' },
  ];

  return (
    <div className="relative min-h-screen bg-[#08090d] text-slate-100 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 3D SCROLL LAYER: Integrated WebGL Canvas (React Three Fiber)               */}
      {/* Runs in the background, smoothly transforming as user scrolls naturally.  */}
      {/* Pointer-events are disabled so every button, link, and card works instantly. */}
      {/* ========================================================================= */}
      <IntegratedScroll3DCanvas />

      {/* Floating AI Studio Creative Director Trigger */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
        <button
          onClick={() => setAiAdvisorOpen(true)}
          className="p-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:scale-105 active:scale-95 text-white rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2.5 transition-all cursor-pointer group backdrop-blur-md"
          title="Consult Pixel AI Creative Director"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold font-display hidden sm:inline">
            Ask AI Creative Director
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 min-h-[92vh] flex items-center px-4 sm:px-6 lg:px-12 pt-28 pb-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-cyan-300">
                Pixels with Purpose
              </span>
            </div>

            {/* Brand Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.05]">
                PIXEL DESIGN <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">HOUSE</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-300 font-display">
                Pixels with Purpose.
              </p>
            </div>

            {/* Short Powerful Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              A world-class digital creative studio engineering brand identities, editorial posters, commercial campaigns, and spatial interfaces. Every pixel carries intention. Built for visionary brands who refuse average.
            </p>

            {/* Hero Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('our-work');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('portfolio');
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer font-display"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-xl border border-white/15 backdrop-blur-md transition-all cursor-pointer font-display flex items-center gap-2"
              >
                <span>Place an Order</span>
                <ArrowUpRight className="w-4 h-4 text-pink-400" />
              </button>
            </div>

            {/* Studio Metrics Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/[0.08] max-w-md">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">100%</span>
                <span className="text-[11px] text-slate-400 block font-mono">Vector & Swiss Craft</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">7</span>
                <span className="text-[11px] text-slate-400 block font-mono">Disciplines</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-pink-400 font-display">Live</span>
                <span className="text-[11px] text-slate-400 block font-mono">Client Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Column: Subtle backdrop framing that highlights the 3D object */}
          <div className="lg:col-span-5 hidden lg:flex justify-center items-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 — ABOUT US                                                      */}
      {/* Headline: "We turn ideas into visuals."                                   */}
      {/* ========================================================================= */}
      <section id="about-us" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#090b10]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
              We turn ideas into visuals.
            </h2>

            <p className="text-sm font-mono text-slate-400">
              PIXEL DESIGN HOUSE · STUDIO MANIFESTO
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
            <p>
              In an era saturated by automated templates and disposable visual noise, <strong className="text-white">Pixel Design House</strong> stands for intentional, mathematical craft. We believe visual communication should feel visceral, intelligent, and memorable.
            </p>
            <p className="text-slate-400 text-base">
              Every commission pairs Swiss typographic geometry with contemporary chromatic artistry. Whether designing an architectural monograph poster, an enduring corporate logomark, or a high-converting global advertising campaign, we engineer visuals that command respect.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 block mb-2" />
                <h4 className="text-sm font-bold text-white font-display">Mathematical Precision</h4>
                <p className="text-xs text-slate-400 mt-1">Calibrated on golden ratio proportions and typographic grids.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-pink-400 block mb-2" />
                <h4 className="text-sm font-bold text-white font-display">Original Artistry</h4>
                <p className="text-xs text-slate-400 mt-1">No recycled templates. Every asset is conceived from a blank canvas.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-amber-400 block mb-2" />
                <h4 className="text-sm font-bold text-white font-display">Production Polish</h4>
                <p className="text-xs text-slate-400 mt-1">CMYK print-ready master files and pixel-perfect digital exports.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group"
              >
                <span>Read our full studio philosophy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 — PLACE YOUR ORDER                                              */}
      {/* Headline: "Just place your order. We’ll take it from there."              */}
      {/* ========================================================================= */}
      <section id="place-order" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#07080c]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-widest font-mono">
              Simple Studio Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
              Just place your order. We’ll take it from there.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              A transparent, streamlined 5-step commissioning experience designed for speed, clarity, and total creative alignment.
            </p>
          </div>

          {/* 5-Step Process Timeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
            {[
              {
                step: '01',
                title: 'Choose a service',
                desc: 'Select from our 7 specialized creative capabilities tailored to your specific project needs.',
                icon: Layers,
                color: '#00d2ff',
              },
              {
                step: '02',
                title: 'Tell us what you need',
                desc: 'Outline your brief, target audience, preferred dimensions, deadline, and creative vision.',
                icon: FileText,
                color: '#ec4899',
              },
              {
                step: '03',
                title: 'Share references',
                desc: 'Upload visual inspiration, existing brand guidelines, copy drafts, or moodboards.',
                icon: UploadCloud,
                color: '#f97316',
              },
              {
                step: '04',
                title: 'We design it',
                desc: 'Our senior art directors craft high-fidelity concepts with precision Swiss balance.',
                icon: Sparkles,
                color: '#8b5cf6',
              },
              {
                step: '05',
                title: 'You receive final work',
                desc: 'Download print-ready vectors and web deliverables directly through your portal.',
                icon: CheckCircle2,
                color: '#10b981',
              },
            ].map((p, idx) => {
              const IconComponent = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0e1017]/90 border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold" style={{ color: p.color }}>
                        STEP {p.step}
                      </span>
                      <div className="p-2 rounded-lg bg-white/[0.04] text-slate-300 group-hover:text-white transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-display">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Phase {idx + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prominent Start a Project Button */}
          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-9 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-2xl shadow-pink-500/25 inline-flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-display"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-400 mt-3 font-mono">
              Quick 2-minute project submission · Instant order confirmation
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3 — OUR SERVICES                                                  */}
      {/* Headline: "What can we create for you?"                                   */}
      {/* ========================================================================= */}
      <section id="services" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#090b10]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono">
                Seven Specialized Disciplines
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                What can we create for you?
              </h2>
            </div>

            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
            >
              <span>View full service catalog & rates</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Interactive Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-[#0e1017]/90 hover:bg-[#131622]/95 border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-7 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      0{index + 1}
                    </span>
                    <span className="text-xs text-slate-400 px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.05]">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors font-display">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block font-mono">
                      Included Deliverables
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {service.deliverables.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-mono">Starting from</span>
                    <span className="text-base font-bold text-white font-mono">{service.startingPrice}</span>
                  </div>

                  <button
                    onClick={() => onNavigate('contact', service.id)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 border border-white/10 group-hover:border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Request Service</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4 — OUR WORK                                                      */}
      {/* Headline: "Made with purpose."                                            */}
      {/* ========================================================================= */}
      <section id="our-work" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#07080c]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest font-mono">
                Curated Commissions
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Made with purpose.
              </h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Explore real case studies engineered for clients in Tokyo, Zurich, London, and New York.
              </p>
            </div>

            <button
              onClick={() => onNavigate('portfolio')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 px-5 py-2.5 rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <span>Explore Full Portfolio</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/[0.08] hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Large Visual Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigate('portfolio_detail', project.id)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0d0f16]/95 border border-white/[0.08] hover:border-white/25 transition-all duration-300 flex flex-col shadow-xl hover:-translate-y-1.5"
              >
                {/* Artwork Viewport */}
                <div className="relative aspect-[16/11] overflow-hidden bg-slate-900">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-transparent to-transparent opacity-60" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                      <span>{project.client}</span>
                      <span>·</span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {project.shortDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[11px] text-slate-400 font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 font-display">
                      <span>View Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 — YOUR ORDERS                                                   */}
      {/* Headline: "Your project. Your timeline. Your control."                   */}
      {/* ========================================================================= */}
      <section id="your-orders" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#090b10]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
              The Client Portal Experience
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display leading-tight">
              Your project. Your timeline. Your control.
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              No lost email attachments, guesswork, or delayed replies. Pixel Design House provides a dedicated real-time client console where every phase of your commission is visible and managed.
            </p>

            {/* Platform Capabilities List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5 border border-cyan-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">7-Step Visual Progress Timeline</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Follow your project status live from Order Placed to Final Delivered.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 shrink-0 mt-0.5 border border-pink-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">Encrypted Deliverables Vault</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Download high-resolution vectors, brand manuals, and print assets whenever you need them.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-display">Instant Status Notification Alerts</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automatic alerts whenever drafts are ready for client review and approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Prominent View My Orders Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  if (currentUser) {
                    onNavigate('client_orders');
                  } else {
                    onOpenAuth();
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-display"
              >
                <span>View My Orders</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Opens authenticated client login'}
              </p>
            </div>

          </div>

          {/* Interactive Portal Preview Mockup Window */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/15 bg-[#12141f] shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">portal.pixeldesignhouse.com</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  Live Status Engine
                </span>
              </div>

              {/* Active Project Mockup Card */}
              <div className="p-5 rounded-xl bg-white/[0.04] border border-white/10 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white font-display">LUMINA Synthetics: Sonic Biennial</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">90% Final Polish</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-emerald-400 rounded-full w-[90%]" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Current Phase: Master Color Separation</span>
                  <span className="text-slate-300">Expected Delivery: 2 Days</span>
                </div>
              </div>

              {/* 7-Step Timeline Preview */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1 font-medium">1. Order Placed & Creative Brief Verified</span>
                  <span className="text-[10px] text-slate-400 font-mono">Done</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1 font-medium">2. Request Reviewed & Art Director Assigned</span>
                  <span className="text-[10px] text-slate-400 font-mono">Done</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="flex-1 font-medium">3. First Preview: Composition & Vector Draft</span>
                  <span className="text-[10px] text-slate-400 font-mono">Approved</span>
                </div>
                <div className="flex items-center gap-3 text-cyan-300 font-medium bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20">
                  <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                  <span className="flex-1 font-bold">4. Final Design & CMYK Calibration</span>
                  <span className="text-[10px] text-cyan-400 font-mono">In Progress</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  <span className="flex-1">5. Delivered to Vault</span>
                  <span className="text-[10px] text-slate-400 font-mono">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6 — CHAT WITH US                                                  */}
      {/* Headline: "Need to talk? We're right here."                               */}
      {/* ========================================================================= */}
      <section id="chat-with-us" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-[#07080c]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Messaging Window Preview */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-2xl border border-white/15 bg-[#12141f] shadow-2xl p-6 backdrop-blur-xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs font-display">
                    PD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Pixel Studio Director</h4>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Now · Typical reply &lt; 15m
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">ORDER #PD-8429</span>
              </div>

              {/* Sample Chat Messages */}
              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[10px] text-white shrink-0 mt-0.5 font-bold">
                    PD
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08] text-slate-200 max-w-[85%]">
                    <p>We’ve reviewed your references and tuned the typographic hierarchy for the Swiss grid poster. The high-res proof is ready in your portal!</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">10:42 AM</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 justify-end">
                  <div className="p-3.5 rounded-2xl rounded-tr-sm bg-cyan-600 text-white max-w-[85%]">
                    <p>The chromatic color separation looks phenomenal! Exactly the direction we wanted.</p>
                    <span className="text-[10px] text-cyan-200 font-mono mt-1 block text-right">10:45 AM</span>
                  </div>
                </div>
              </div>

              {/* Fake Input field */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
                <input
                  type="text"
                  placeholder="Type a message to Pixel Design House..."
                  readOnly
                  className="bg-transparent text-xs text-slate-300 placeholder-slate-500 flex-1 px-2 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (currentUser) onNavigate('chat');
                    else onOpenAuth();
                  }}
                  className="p-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Explanation Column */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono">
              Direct Communication
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display leading-tight">
              Need to talk? We're right here.
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Direct, real-time messaging with your assigned creative leads. Whether you need to ask questions, request an adjustment, share an urgent reference, or discuss new scope, we are one click away.
            </p>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Real-time conversation history saved to your account</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                <span>Attach references, sketches, and documents seamlessly</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Link conversations directly to specific active orders</span>
              </li>
            </ul>

            {/* Prominent Chat With Us Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (currentUser) {
                    onNavigate('chat');
                  } else {
                    onOpenAuth();
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-display"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat With Us</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7 — FINAL CTA                                                     */}
      {/* Headline: "Have an idea? Let's make it real."                             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-28 sm:py-36 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08] bg-gradient-to-b from-[#08090d]/90 via-[#0d101a]/95 to-[#08090d] text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
          
          <div className="flex justify-center mb-2">
            <PixelLogo variant="mark" size="lg" />
          </div>

          <span className="text-xs font-semibold text-pink-400 uppercase tracking-widest font-mono">
            Pixels with Purpose
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-display leading-[1.05]">
            Have an idea? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              Let's make it real.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Tell us about your brand vision, target timeline, and objectives. We deliver initial creative direction within 24 business hours.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-9 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-2xl shadow-pink-500/25 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-display"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start a Project</span>
            </button>

            <button
              onClick={() => onNavigate('portfolio')}
              className="px-9 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/15 rounded-2xl transition-all cursor-pointer font-display flex items-center gap-2"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Official Direct Contact Links */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-300">
            <a 
              href="tel:8074562812" 
              className="hover:text-cyan-400 transition-colors"
            >
              Phone: 8074562812
            </a>
            <span className="text-slate-600">·</span>
            <a 
              href="mailto:namantoshniwal201212@gmail.com" 
              className="hover:text-cyan-400 transition-colors"
            >
              Email: namantoshniwal201212@gmail.com
            </a>
            <span className="text-slate-600">·</span>
            <a 
              href="https://www.instagram.com/pixel_design_house/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-pink-400 transition-colors"
            >
              Instagram: @pixel_design_house
            </a>
          </div>

          <div className="pt-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
            Pixel Design House · Zurich · Tokyo · New York · Worldwide
          </div>

        </div>
      </section>

      {/* Gemini Studio Advisor Drawer */}
      <GeminiStudioAdvisor
        isOpen={aiAdvisorOpen}
        onClose={() => setAiAdvisorOpen(false)}
        onApplyBriefToCommission={() => {
          onNavigate('contact');
        }}
      />

    </div>
  );
};
