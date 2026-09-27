import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Layers,
  Upload,
  Link as LinkIcon,
  Tag,
  Check,
  Zap,
  BookmarkCheck,
  Phone,
  Mail,
  Instagram,
  FileText,
  UploadCloud,
  FileImage,
  X,
  ArrowUpRight
} from 'lucide-react';

interface ContactPageProps {
  initialServiceId?: string;
  onNavigate: (view: string, extraParam?: string) => void;
  onOpenAuth: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ 
  initialServiceId, 
  onNavigate,
  onOpenAuth 
}) => {
  const { services, createOrder } = useApp();
  const { currentUser, userProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form Fields
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'poster-design');
  const [clientName, setClientName] = useState(userProfile?.displayName || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [company, setCompany] = useState(userProfile?.company || userProfile?.frequentlyUsedInfo?.defaultBrandName || '');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // References: URLs and Uploaded Files
  const [referenceUrl, setReferenceUrl] = useState('');
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string; dataUrl?: string }[]>([]);
  
  // Timeline & Priority
  const [deadline, setDeadline] = useState('2 – 3 Weeks');
  const [budgetRange, setBudgetRange] = useState('$1,000 – $2,500');
  const [priority, setPriority] = useState<'standard' | 'rush' | 'exclusive'>('standard');
  
  // Submission
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync saved information pre-fill
  useEffect(() => {
    if (userProfile) {
      if (!clientName && userProfile.displayName) setClientName(userProfile.displayName);
      if (!company && (userProfile.company || userProfile.frequentlyUsedInfo?.defaultBrandName)) {
        setCompany(userProfile.company || userProfile.frequentlyUsedInfo?.defaultBrandName || '');
      }
      if (userProfile.frequentlyUsedInfo?.brandWebsite && referenceLinks.length === 0) {
        setReferenceLinks([userProfile.frequentlyUsedInfo.brandWebsite]);
      }
    }
  }, [userProfile]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleAddRef = () => {
    if (referenceUrl.trim() && !referenceLinks.includes(referenceUrl.trim())) {
      setReferenceLinks([...referenceLinks, referenceUrl.trim()]);
      setReferenceUrl('');
    }
  };

  const handleRemoveRef = (index: number) => {
    setReferenceLinks(referenceLinks.filter((_, i) => i !== index));
  };

  // Handle Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const fileSizeFormatted = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      reader.onload = () => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: fileSizeFormatted,
            type: file.type || 'Document / Asset',
            dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
          }
        ]);
      };

      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1 && !selectedServiceId) {
      setError('Please select a creative discipline to continue.');
      return;
    }
    if (currentStep === 2 && (!projectTitle.trim() || !description.trim())) {
      setError('Please provide a project title and brief description.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError('Please sign in or create an account to officially register and track your commission.');
      onOpenAuth();
      return;
    }

    setSubmitting(true);
    try {
      // Consolidate links and uploaded file descriptors
      const allReferences = [
        ...referenceLinks,
        ...uploadedFiles.map(f => `[Uploaded Reference File: ${f.name} (${f.size})]`),
      ];

      const orderId = await createOrder({
        serviceId: selectedServiceId,
        serviceName: selectedService?.title || 'Creative Service',
        title: projectTitle.trim(),
        description: description.trim(),
        referenceLinks: allReferences,
        deadline,
        budgetRange,
        priority,
      });

      setSubmittedOrderId(orderId);

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#ec4899', '#f97316', '#8b5cf6', '#10b981'],
      });
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setError(err?.message || 'Failed to submit order. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* ========================================================================= */}
        {/* POLISHED SECTION: LET'S CREATE SOMETHING                                  */}
        {/* Contains Official Phone, Email, and Instagram with clickable links        */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#121422] via-[#0f111a] to-[#1a1224] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pixel Design House · Direct Inquiries</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
                Let's Create Something.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Whether you need a high-impact poster, a complete brand identity, or an international advertising rollout, connect directly with our creative leadership.
              </p>
            </div>

            {/* Official Contact Cards Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-3.5">
              
              {/* Phone */}
              <a
                href="tel:8074562812"
                className="p-4 rounded-2xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Phone</span>
                    <span className="text-base font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                      8074562812
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              {/* Email */}
              <a
                href="mailto:namantoshniwal201212@gmail.com"
                className="p-4 rounded-2xl bg-white/[0.04] hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Email</span>
                    <span className="text-sm font-bold text-white font-mono group-hover:text-pink-400 transition-colors truncate max-w-[210px] block">
                      namantoshniwal201212@gmail.com
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/pixel_design_house/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white/[0.04] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono block">Instagram</span>
                    <span className="text-base font-bold text-white font-mono group-hover:text-amber-400 transition-colors">
                      @pixel_design_house
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </a>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMMISSION & ORDER WORKFLOW FUNNEL                                        */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-[#0e1017] border border-white/[0.08] p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
                Start a Project
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                Register Your Creative Commission
              </h2>
            </div>

            {/* Step Progress Pill */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    s === currentStep
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : s < currentStep
                      ? 'bg-white/10 text-cyan-400'
                      : 'bg-white/[0.04] text-slate-600'
                  }`}
                >
                  {s < currentStep ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Success Screen */}
          {submittedOrderId ? (
            <div className="py-12 text-center space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">
                  Commission Identifier: <strong className="text-cyan-400">{submittedOrderId}</strong>
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  Your project has been recorded in our production queue. An art director will review your specifications and references within 24 business hours.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('client_orders', submittedOrderId)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer font-display"
                >
                  <span>Track Order in Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('chat')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Chat With Us About Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: SELECT DISCIPLINE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mb-1">
                      Step 1: Choose Creative Discipline
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select which capability best aligns with your project objectives.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((s) => {
                      const isSelected = selectedServiceId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedServiceId(s.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/10'
                              : 'bg-[#121420] border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                                {s.category}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <h4 className="text-sm font-bold text-white font-display mb-1">{s.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{s.shortDesc}</p>
                          </div>

                          <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-xs">
                            <span className="text-slate-500">{s.turnaroundTime}</span>
                            <span className="font-mono font-bold text-cyan-400">{s.startingPrice}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: PROJECT DESCRIPTION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mb-1">
                      Step 2: Tell Us What You Need
                    </h3>
                    <p className="text-xs text-slate-400">
                      Describe the core objectives, intended mediums, and vision for this commission.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                        Brand / Company Name
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Innovations"
                        className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Modernist Kinetic Poster Series"
                        className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Creative Brief & Specifications *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Outline target dimensions, print vs digital requirements, aesthetic direction, copy guidelines, and any mandatory elements..."
                      className="w-full bg-[#131622] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: REFERENCES & UPLOAD FILES */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mb-1">
                      Step 3: Share References & Upload Files
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload reference images, logos, sketches, or paste Figma, Pinterest, and website links.
                    </p>
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
                      Upload Files for Reference (Images, PDF, Brand Assets)
                    </label>

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-[#121420]/80 transition-all cursor-pointer text-center group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.svg,.ai,.psd"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-white">Click to browse or drag & drop reference files</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">PNG, JPG, SVG, PDF, AI, PSD up to 50MB</p>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <span className="text-xs font-semibold text-cyan-400 uppercase font-mono block">
                          Attached Reference Files ({uploadedFiles.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 truncate">
                                {file.dataUrl ? (
                                  <img src={file.dataUrl} alt={file.name} className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                                )}
                                <div className="truncate">
                                  <span className="font-semibold text-white block truncate">{file.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* External Links */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Add Reference URLs (Figma, Pinterest, Google Drive, Website)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={referenceUrl}
                        onChange={(e) => setReferenceUrl(e.target.value)}
                        placeholder="Paste reference link (e.g. https://www.figma.com/... or Pinterest link)"
                        className="flex-1 bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddRef}
                        className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl cursor-pointer"
                      >
                        Add Link
                      </button>
                    </div>

                    {referenceLinks.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {referenceLinks.map((link, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs"
                          >
                            <span className="text-cyan-400 font-mono truncate max-w-md">{link}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRef(idx)}
                              className="text-slate-500 hover:text-rose-400 text-xs cursor-pointer ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: TIMELINE & PRIORITY */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mb-1">
                      Step 4: Target Timeline & Priority
                    </h3>
                    <p className="text-xs text-slate-400">
                      Specify turnaround requirements and queue priority.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                        Target Completion
                      </label>
                      <select
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="1 Week (Rush Production)">1 Week (Rush Production)</option>
                        <option value="2 – 3 Weeks">2 – 3 Weeks (Standard)</option>
                        <option value="1 Month">1 Month</option>
                        <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                        Estimated Budget Tier
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="$500 – $1,000">$500 – $1,000</option>
                        <option value="$1,000 – $2,500">$1,000 – $2,500</option>
                        <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                        <option value="$5,000 – $10,000+">$5,000 – $10,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                        Queue Priority Tier
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="standard">Standard Studio Queue</option>
                        <option value="rush">Priority Fast-Track</option>
                        <option value="exclusive">Exclusive Director Engagement</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & PLACE ORDER */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-display mb-1">
                      Step 5: Review & Confirm Commission
                    </h3>
                    <p className="text-xs text-slate-400">
                      Confirm your project specifications before submitting to Pixel Design House.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#12141f] border border-white/[0.08] space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                      <div>
                        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block font-mono">
                          {selectedService?.category}
                        </span>
                        <h4 className="text-lg font-bold text-white font-display">{selectedService?.title}</h4>
                      </div>
                      <span className="text-sm font-mono font-bold text-white">{selectedService?.startingPrice}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Project Working Title:</span>
                        <span className="text-white font-semibold">{projectTitle}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Target Completion:</span>
                        <span className="text-white font-semibold">{deadline}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Client Partner:</span>
                        <span className="text-white font-semibold">{company || clientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Queue Priority:</span>
                        <span className="text-white font-semibold capitalize">{priority} Tier</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08]">
                      <span className="text-slate-500 text-xs block mb-1 font-mono">Creative Brief Summary:</span>
                      <p className="text-xs text-slate-300 leading-relaxed italic">{description}</p>
                    </div>

                    {(referenceLinks.length > 0 || uploadedFiles.length > 0) && (
                      <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-cyan-400">
                        <span>Attached References: {referenceLinks.length} URLs, {uploadedFiles.length} files</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-7 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmit}
                    className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-xl shadow-pink-500/25 disabled:opacity-50 font-display"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Place Project Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
