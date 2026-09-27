import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  User as UserIcon, 
  Mail, 
  Building, 
  Phone, 
  Shield, 
  CheckCircle2, 
  LogOut, 
  Sparkles,
  Bell,
  Globe,
  Palette,
  MessageSquare,
  Key,
  FolderKanban,
  FileCheck2,
  ExternalLink,
  Camera,
  Check,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Send,
  Eye
} from 'lucide-react';
import { FrequentlyUsedInfo } from '../../types';

interface ProfilePageProps {
  onNavigate?: (view: string, extraParam?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { userProfile, currentUser, updateUserProfileData, toggleDemoRole, logout, resetPassword, isAdmin } = useAuth();
  const { orders } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'security' | 'notifications' | 'brand'>('profile');

  // Form states
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [handle, setHandle] = useState(userProfile?.email?.split('@')[0] || 'user');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.photoURL || '');

  // Brand data
  const [brandWebsite, setBrandWebsite] = useState(userProfile?.frequentlyUsedInfo?.brandWebsite || '');
  const [brandColors, setBrandColors] = useState(userProfile?.frequentlyUsedInfo?.brandColors || '#00d2ff, #ec4899, #08090d');
  const [targetAudience, setTargetAudience] = useState(userProfile?.frequentlyUsedInfo?.targetAudience || '');
  const [additionalNotes, setAdditionalNotes] = useState(userProfile?.frequentlyUsedInfo?.additionalNotes || '');

  // Notifications
  const [emailUpdates, setEmailUpdates] = useState(userProfile?.notificationSettings?.emailUpdates ?? true);
  const [orderProgress, setOrderProgress] = useState(userProfile?.notificationSettings?.orderProgress ?? true);
  const [chatPings, setChatPings] = useState(userProfile?.notificationSettings?.chatPings ?? true);
  const [studioNews, setStudioNews] = useState(userProfile?.notificationSettings?.studioNews ?? false);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  // Preset avatar choices
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  ];

  const handleAvatarSelect = (url: string) => {
    setAvatarUrl(url);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const frequentlyUsedInfo: FrequentlyUsedInfo = {
        defaultBrandName: company || displayName,
        brandWebsite,
        brandColors,
        targetAudience,
        additionalNotes,
      };

      await updateUserProfileData({
        displayName,
        photoURL: avatarUrl,
        company,
        phone,
        bio,
        frequentlyUsedInfo,
        notificationSettings: {
          emailUpdates,
          orderProgress,
          chatPings,
          studioNews,
        },
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update profile settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser?.email) return;
    try {
      await resetPassword(currentUser.email);
      setPasswordResetSent(true);
      setTimeout(() => setPasswordResetSent(false), 5000);
    } catch (err) {
      console.error('Failed to send reset email:', err);
    }
  };

  const userOrders = orders.filter(o => o.clientId === currentUser?.uid);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* YOUTUBE-STYLE ACCOUNT HEADER BANNER                                       */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-[#121422] via-[#0f111a] to-[#1a1224] border border-white/[0.08] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            
            {/* Avatar & User Details */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-400 p-0.5 shadow-xl">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-[#121420] rounded-2xl flex items-center justify-center text-2xl font-bold font-display text-white">
                      {(displayName || currentUser?.email || 'P').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-black/80 border border-white/20 text-white shadow-md">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                    {displayName || currentUser?.email?.split('@')[0] || 'Studio Partner'}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isAdmin 
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {isAdmin ? 'Studio Director (Admin)' : 'Client Account'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  @{handle} · {currentUser?.email}
                </p>

                <p className="text-xs text-slate-300 max-w-md pt-1">
                  {bio || (isAdmin ? 'Creative Director & Founder at Pixel Design House.' : 'Client partner collaborating on brand & digital design commissions.')}
                </p>
              </div>
            </div>

            {/* Quick Stats / Actions */}
            <div className="flex sm:flex-col items-end justify-between gap-3 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/[0.08]">
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-slate-500 uppercase font-mono block">Account Status</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Active</span>
                </span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 border border-white/10 hover:border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>

        {/* Feedback Alert */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Account settings successfully saved and synced across Pixel Design House!</span>
          </div>
        )}

        {passwordResetSent && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2.5 shadow-lg">
            <Send className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Password reset instructions dispatched to {currentUser?.email}. Please check your inbox.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* YOUTUBE-STYLE TAB NAVIGATION & CONTENT GRID                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Navigation Tabs */}
          <div className="md:col-span-4 rounded-2xl bg-[#0e1017] border border-white/[0.08] p-3 space-y-1">
            {[
              { id: 'profile', label: 'Personal Information', icon: UserIcon },
              { id: 'account', label: 'Account Type & Permissions', icon: Shield },
              { id: 'security', label: 'Security & Sign-in', icon: Key },
              { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
              { id: 'brand', label: 'Saved Brand Assets', icon: Palette },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* Admin Switcher Preview for Testing */}
            <div className="pt-3 mt-3 border-t border-white/[0.06] px-3 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1.5">
                Account Switcher
              </span>
              <button
                type="button"
                onClick={toggleDemoRole}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 flex items-center justify-between border border-white/5 cursor-pointer"
              >
                <span>Switch Role ({isAdmin ? 'Admin' : 'Client'})</span>
                <RotateCcw className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Right Main Settings Panel */}
          <div className="md:col-span-8 rounded-3xl bg-[#0e1017] border border-white/[0.08] p-6 sm:p-8">
            
            {/* 1. PERSONAL INFORMATION TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">
                    Personal & Studio Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your identity across commissions, order tracking, and direct creative chat.
                  </p>
                </div>

                {/* Preset Avatar Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
                    Profile Picture / Avatar
                  </label>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {presetAvatars.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Avatar choice"
                        onClick={() => handleAvatarSelect(url)}
                        className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition-transform hover:scale-105 ${
                          avatarUrl === url ? 'border-cyan-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Or paste custom image URL..."
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Naman Toshniwal"
                      className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Studio / Company Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Pixel Design House"
                      className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={currentUser?.email || ''}
                      className="w-full bg-[#131622]/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Managed by Google / Firebase Auth</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 8074562812"
                      className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Bio / Creative Description
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short summary of your creative work, focus, or brand vision..."
                    className="w-full bg-[#131622] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* 2. ACCOUNT TYPE & PERMISSIONS TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">
                    Account Type & Privileges
                  </h3>
                  <p className="text-xs text-slate-400">
                    Role-based capabilities and publishing status on Pixel Design House.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Assigned Role</span>
                      <h4 className="text-base font-bold text-white font-display capitalize">
                        {isAdmin ? 'Studio Director (Admin)' : 'Standard Client Account'}
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      isAdmin ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {isAdmin ? 'Full Management Access' : 'Client Access'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAdmin
                      ? 'You have administrative rights over all service prices, portfolio projects, client orders, deliverable uploads, and master conversations.'
                      : 'You have full client privileges to place commissions, upload reference files, track order milestones live, and message the studio directly.'}
                  </p>

                  <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Unique User ID:</span>
                      <span className="text-white truncate block">{currentUser?.uid}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Official Admin Email:</span>
                      <span className="text-cyan-400 block truncate">namantoshniwal201212@gmail.com</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 font-display">
                      <Shield className="w-3.5 h-3.5 text-pink-400" />
                      <span>Admin Management Suite Active</span>
                    </span>
                    <p className="text-slate-300">
                      You can navigate to the Studio Operations Suite anytime to adjust service fees, add portfolio showcases, and deliver project files.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. SECURITY & SIGN-IN TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">
                    Security & Authentication
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage your credentials, password reset, and session integrity.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">Password Management</h4>
                      <p className="text-xs text-slate-400">
                        Trigger a secure Firebase password reset link sent to your verified email.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 cursor-pointer transition-colors"
                    >
                      Send Reset Email
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <h4 className="text-sm font-bold text-white font-display">Connected Authentication Provider</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <Key className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <span className="font-semibold block text-white">Firebase Secure Auth</span>
                      <span className="text-slate-400 font-mono">{currentUser?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS & ALERTS TAB */}
            {activeTab === 'notifications' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">
                    Notifications & Studio Updates
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select how you want to be alerted on project milestones and messages.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">Order Progress Updates</span>
                      <span className="text-[11px] text-slate-400">Alerts when your commission advances to the next stage.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={orderProgress}
                      onChange={(e) => setOrderProgress(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded bg-[#121420] border-white/20 cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">Direct Chat Pings</span>
                      <span className="text-[11px] text-slate-400">Real-time alerts when the studio replies to your conversation.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={chatPings}
                      onChange={(e) => setChatPings(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded bg-[#121420] border-white/20 cursor-pointer"
                    />
                  </label>

                  <label className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">Email Dispatch Copies</span>
                      <span className="text-[11px] text-slate-400">Receive deliverable links directly in your email inbox.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={(e) => setEmailUpdates(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded bg-[#121420] border-white/20 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    Save Notification Rules
                  </button>
                </div>
              </form>
            )}

            {/* 5. SAVED BRAND ASSETS TAB */}
            {activeTab === 'brand' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-1">
                    Pre-saved Brand Specifications
                  </h3>
                  <p className="text-xs text-slate-400">
                    Save your website, color palette, and audience to auto-fill future commission briefs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Brand Website URL
                  </label>
                  <input
                    type="url"
                    value={brandWebsite}
                    onChange={(e) => setBrandWebsite(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Brand Color Palette (Hex Codes)
                  </label>
                  <input
                    type="text"
                    value={brandColors}
                    onChange={(e) => setBrandColors(e.target.value)}
                    placeholder="#00d2ff, #ec4899, #08090d"
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                    Target Demographic / Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Design-conscious tech founders, architects, gallery collectors"
                    className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    Save Brand Data
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
