import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PixelLogo } from '../common/PixelLogo';
import { Pixel3DScene } from '../3d/Pixel3DScene';
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, resetPassword, quickLoginDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onSuccess?.();
        onClose();
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, name);
        onSuccess?.();
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('A password recovery email has been sent. Please check your inbox.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let message = 'An error occurred during authentication. Please try again.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      else if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      else if (err.code === 'auth/email-already-in-use') message = 'An account already exists with this email address.';
      else if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in could not be completed. You can use standard email login or the instant demo access below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'client' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await quickLoginDemo(role);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError('Could not initialize demo session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Studio Backdrop */}
      <div 
        className="fixed inset-0 bg-[#08090d]/90 backdrop-blur-xl transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Dialog Window */}
      <div className="relative w-full max-w-4xl bg-[#0f1118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: 3D Art Studio Visual & Brand Identity */}
        <div className="md:col-span-5 relative bg-gradient-to-br from-[#121420] via-[#0b0c13] to-[#08090d] p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {/* Subtle 3D Interactive Pixels in background */}
          <div className="absolute inset-0 opacity-75">
            <Pixel3DScene interactive={true} intensity="minimal" />
          </div>

          <div className="relative z-10">
            <PixelLogo variant="full" size="md" showTagline={true} />
          </div>

          <div className="relative z-10 mt-8 space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client & Studio Portal</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track active design deliverables, communicate directly with the creative team in real-time, and manage brand assets.
              </p>
            </div>

            {/* Quick Demo Credentials */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-slate-400 block mb-2">
                Instant Evaluation Access:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('client')}
                  className="px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="px-3 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-pink-400" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-[#0e1017]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white font-display">
              {mode === 'login' && 'Sign in to Pixel Design House'}
              {mode === 'signup' && 'Create Your Client Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {mode === 'login' && 'Access your design projects, active timelines, and deliverables.'}
              {mode === 'signup' && 'Join leading brands creating purpose-driven design.'}
              {mode === 'forgot' && "Enter your email to receive recovery instructions."}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name / Company
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Vance or Studio Horizon"
                    className="w-full bg-[#151824] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#151824] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-[#151824] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:opacity-95 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Enter Studio Portal'}
                    {mode === 'signup' && 'Create Account & Begin'}
                    {mode === 'forgot' && 'Send Recovery Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign-in Divider */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0e1017] px-3 text-slate-500 font-medium tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#151824] hover:bg-[#1a1f2e] border border-white/10 text-slate-200 text-sm font-medium rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Google Account</span>
              </button>
            </>
          )}

          {/* Toggle between login / signup / forgot */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 ml-1"
                >
                  Create client account
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 ml-1"
                >
                  Back to login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
