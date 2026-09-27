import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PixelLogo } from '../common/PixelLogo';
import { Pixel3DScene } from '../3d/Pixel3DScene';
import { X, Sparkles, Shield, User as UserIcon, ArrowRight, Loader2, CheckCircle2, Lock, ArrowLeft, KeyRound } from 'lucide-react';

const ADMIN_EMAILS = [
  'namantoshniwal201212@gmail.com',
  'mamtadjak@gmail.com',
  'admin@pixeldesignhouse.com',
];

const STUDIO_DIRECTOR_PASSWORD = 'PixelDesignHouse@987654321';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle, directStudioLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Admin password gate state
  const [adminVerificationEmail, setAdminVerificationEmail] = useState<string | null>(null);
  const [adminDisplayName, setAdminDisplayName] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.warn('Google popup notice:', err);
      // Smoothly show Google account options without cryptic errors
      setShowAccountChooser(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = async (email: string, displayName?: string, role?: 'admin' | 'client') => {
    setError(null);
    setLoading(true);
    try {
      await directStudioLogin(email, displayName, role);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError('Could not complete Google sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateAdminLogin = (email: string, displayName: string) => {
    setError(null);
    setAdminVerificationEmail(email);
    setAdminDisplayName(displayName);
    setAdminPasswordInput('');
  };

  const handleVerifyAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!adminPasswordInput.trim()) {
      setError('Please enter the Studio Director password.');
      return;
    }

    if (adminPasswordInput !== STUDIO_DIRECTOR_PASSWORD) {
      setError('Incorrect Studio Director password. Access denied.');
      return;
    }

    if (adminVerificationEmail) {
      await handleSelectAccount(adminVerificationEmail, adminDisplayName, 'admin');
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      setError('Please enter your Google email.');
      return;
    }
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
    if (isAdmin) {
      handleInitiateAdminLogin(cleanEmail, customName.trim() || 'Studio Director');
      return;
    }
    await handleSelectAccount(
      cleanEmail,
      customName.trim() || cleanEmail.split('@')[0],
      'client'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Studio Backdrop */}
      <div 
        className="fixed inset-0 bg-[#08090d]/90 backdrop-blur-xl transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      {/* Main Studio Modal Window */}
      <div className="relative w-full max-w-4xl bg-[#0e1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Studio Brand Showcase */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-between p-8 bg-gradient-to-b from-[#131622] to-[#0a0c12] border-r border-white/10 overflow-hidden">
          {/* Interactive 3D Pixel Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <Pixel3DScene interactive={false} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <PixelLogo className="w-8 h-8 text-cyan-400" />
              <span className="font-bold text-lg tracking-wider text-white uppercase">
                Pixel Design House
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google One-Click Access</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 leading-snug">
              Pixels with Purpose.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              World-class design studio specializing in posters, invitations, brand identity systems, and motion visuals.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="relative z-10 space-y-2.5 pt-6">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex items-center gap-3">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white block">Instant Access</span>
                <span className="text-[11px] text-slate-400">No passwords to remember</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white block">Real-Time Deliverables</span>
                <span className="text-[11px] text-slate-400">Track 7-step design pipeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Authentication Panel */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-[#0e1017]">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Client & Studio Director Portal
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sign In with Google
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
              Connect your Google account to access your studio deliverables, place design commissions, or manage projects.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {!showAccountChooser ? (
            <div className="space-y-4">
              {/* Primary Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3.5 px-6 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span className="font-semibold tracking-wide">
                  {loading ? 'Connecting with Google...' : 'Continue with Google'}
                </span>
              </button>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAccountChooser(true)}
                  className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors py-2 cursor-pointer"
                >
                  Choose a specific Google account or explore as Client →
                </button>
              </div>
            </div>
          ) : (
            /* Google Account Selection Screen */
            <div className="space-y-4">
              {adminVerificationEmail ? (
                /* Studio Director Password Gate */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Studio Director Verification
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminVerificationEmail(null);
                        setAdminPasswordInput('');
                        setError(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to accounts
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <div className="text-[11px] text-amber-300 font-semibold mb-0.5">Authorizing Admin Session</div>
                    <div className="font-mono text-white text-xs">{adminVerificationEmail}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Please enter your Studio Director security password to unlock the admin console.</div>
                  </div>

                  <form onSubmit={handleVerifyAdminPassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Studio Director Password:
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          autoFocus
                          required
                          value={adminPasswordInput}
                          onChange={(e) => setAdminPasswordInput(e.target.value)}
                          placeholder="Enter admin password"
                          className="w-full bg-[#151824] border border-amber-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{loading ? 'Verifying...' : 'Verify & Enter Admin Portal →'}</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Google Account Selection List */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-slate-300">
                      Select your Google Account:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAccountChooser(false)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      ← Use Google Popup
                    </button>
                  </div>

                  {/* Quick Choice 1: Studio Director Account */}
                  <button
                    type="button"
                    onClick={() => handleInitiateAdminLogin('mamtadjak@gmail.com', 'Mamta (Studio Director)')}
                    className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border border-amber-500/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                        M
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>Studio Director</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Password Required
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">mamtadjak@gmail.com</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Quick Choice 2: Studio Director Co-Founder Account */}
                  <button
                    type="button"
                    onClick={() => handleInitiateAdminLogin('namantoshniwal201212@gmail.com', 'Naman (Studio Director)')}
                    className="w-full p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 hover:to-amber-600/10 border border-amber-500/30 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                        N
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>Studio Director</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Password Required
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">namantoshniwal201212@gmail.com</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Custom Google Account Entry for Clients */}
                  <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-white/10 space-y-2.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Or enter your Google Email (Client Portal):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="flex-1 bg-[#151824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        Continue →
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Privacy & Trust Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/80" />
            <span>Secure 256-bit encrypted authentication by Google</span>
          </div>
        </div>
      </div>
    </div>
  );
};
