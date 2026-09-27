import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { PixelLogo } from '../common/PixelLogo';
import { 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Bell, 
  MessageSquare, 
  FolderKanban, 
  LayoutDashboard, 
  Check, 
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  Search,
  Bookmark,
  FileText,
  Settings,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extraParam?: string) => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenAuth,
  onOpenSearch 
}) => {
  const { currentUser, userProfile, isAdmin, logout, toggleDemoRole } = useAuth();
  const { notifications, conversations, savedWorkIds, markNotificationAsRead, markAllNotificationsRead } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Unread messages count
  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    return acc + (isAdmin ? (conv.unreadByAdmin || 0) : (conv.unreadByClient || 0));
  }, 0);

  // Unread notifications count
  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleNavClick = (view: string, extraParam?: string) => {
    onNavigate(view, extraParam);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090d]/85 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Lockup */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer select-none transition-opacity hover:opacity-90 shrink-0"
        >
          <PixelLogo variant="horizontal" size="md" />
        </div>

        {/* Global Search Bar (Amazon / Modern Platform Polish) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full bg-[#12141f] hover:bg-[#161927] border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-xs text-slate-400 hover:text-slate-300 flex items-center justify-between transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Search services, portfolio, orders...</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
              ⌘K / /
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'home' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('portfolio')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'portfolio' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Work
          </button>

          <button
            onClick={() => handleNavClick('services')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'services' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'about' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNavClick('ai_studio')}
            className={`text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              currentView === 'ai_studio' 
                ? 'bg-gradient-to-r from-cyan-500/25 to-purple-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-semibold' 
                : 'text-slate-300 hover:text-white border border-white/10 hover:border-white/20 bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Studio Lab</span>
          </button>

          {/* Quick Client Shortcuts on Header */}
          {currentUser && !isAdmin && (
            <>
              <span className="h-4 w-[1px] bg-white/10" aria-hidden="true" />
              <button
                onClick={() => handleNavClick('client_orders')}
                className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'client_orders' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Orders</span>
              </button>

              <button
                onClick={() => handleNavClick('client_projects')}
                className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'client_projects' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Projects</span>
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                className={`relative text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'chat' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Chat</span>
                {unreadMessagesCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                )}
              </button>
            </>
          )}

          {/* Admin shortcut on Header */}
          {currentUser && isAdmin && (
            <>
              <span className="h-4 w-[1px] bg-white/10" aria-hidden="true" />
              <button
                onClick={() => handleNavClick('admin_dashboard')}
                className={`text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin_dashboard' ? 'text-pink-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4 text-pink-400" />
                <span>Admin Suite</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Search Icon Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-white/5"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Saved / Wishlist Button (Commerce Platform Experience) */}
          <button
            onClick={() => {
              if (currentUser) {
                handleNavClick('saved');
              } else {
                onOpenAuth();
              }
            }}
            className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            title="Saved Works & Wishlist"
            aria-label="Saved Items"
          >
            <Bookmark className="w-4 h-4" />
            {savedWorkIds.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold font-mono flex items-center justify-center">
                {savedWorkIds.length}
              </span>
            )}
          </button>

          {/* Notifications Center Bell */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse ring-2 ring-[#08090d]" />
                )}
              </button>

              {/* Notifications Dropdown Window */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#11131c] border border-white/15 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Studio Updates ({unreadNotifs.length})
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={() => handleNavClick('notifications')}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) handleNavClick(n.link.replace('/', ''));
                          }}
                          className={`p-3 rounded-xl text-xs cursor-pointer transition-colors ${
                            n.read 
                              ? 'bg-white/[0.02] text-slate-400' 
                              : 'bg-cyan-500/10 text-slate-200 border border-cyan-500/20 shadow-sm'
                          }`}
                        >
                          <div className="font-semibold text-white mb-0.5">{n.title}</div>
                          <div className="line-clamp-2">{n.message}</div>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 text-center">
                    <button
                      onClick={() => handleNavClick('notifications')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Open Full Notification Center →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start a Project Primary Action */}
          <button
            onClick={() => handleNavClick('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-pink-500 hover:opacity-95 rounded-xl shadow-md shadow-cyan-500/10 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </button>

          {/* Complete Account Menu System (As Requested) */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-[11px] font-bold text-black">
                  {(userProfile?.displayName || currentUser.email || 'P')[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[100px] truncate">
                  {userProfile?.displayName?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Comprehensive Account Menu Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#10121c] border border-white/15 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                  
                  {/* Account Header */}
                  <div className="px-3 py-2.5 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">
                      {userProfile?.displayName || 'Creative Partner'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider">
                      <span className={isAdmin ? 'text-pink-400' : 'text-cyan-400'}>
                        {isAdmin ? 'Studio Director' : 'Verified Client Account'}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 space-y-0.5 text-xs">
                    <button
                      onClick={() => handleNavClick('client_dashboard')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('client_orders')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                    >
                      <FolderKanban className="w-4 h-4 text-cyan-400" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('client_projects')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>My Projects</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('chat')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>Chat with Pixel Design House</span>
                      </div>
                      {unreadMessagesCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-mono font-bold">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('saved')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-cyan-400" />
                        <span>Saved Work / Wishlist</span>
                      </div>
                      {savedWorkIds.length > 0 && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          ({savedWorkIds.length})
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('notifications')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        <span>Notification Center</span>
                      </div>
                      {unreadNotifs.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full px-3 py-2 text-left font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2.5 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-cyan-400" />
                      <span>Account Settings</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin_dashboard')}
                        className="w-full px-3 py-2 text-left font-medium text-pink-300 hover:bg-pink-500/10 rounded-xl flex items-center gap-2.5 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-pink-400" />
                        <span>Admin Operations Suite</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl bg-white/5"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0c13] border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('portfolio')}
              className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              Work Portfolio
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              Services & Pricing
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              About Studio
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left text-sm font-medium text-cyan-400 py-1"
            >
              Start a Project
            </button>
            <button
              onClick={() => handleNavClick('ai_studio')}
              className="text-left text-sm font-medium text-purple-400 py-1 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Studio Lab (Images & Veo Video)</span>
            </button>

            {currentUser && (
              <>
                <div className="border-t border-white/10 pt-3">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                    {isAdmin ? 'Admin Operations' : 'Client Account Hub'}
                  </span>
                </div>
                <button
                  onClick={() => handleNavClick('client_dashboard')}
                  className="text-left text-sm font-medium text-cyan-400 py-1"
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('client_orders')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
                >
                  My Orders
                </button>
                <button
                  onClick={() => handleNavClick('client_projects')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
                >
                  My Projects
                </button>
                <button
                  onClick={() => handleNavClick('chat')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1 flex items-center justify-between"
                >
                  <span>Chat with Pixel Design House</span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full font-mono">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('saved')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1 flex items-center justify-between"
                >
                  <span>Saved Work / Wishlist</span>
                  {savedWorkIds.length > 0 && (
                    <span className="text-xs text-cyan-400 font-mono">({savedWorkIds.length})</span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('notifications')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
                >
                  Notification Center
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="text-left text-sm font-medium text-slate-300 hover:text-white py-1"
                >
                  Profile & Saved Details
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin_dashboard')}
                    className="text-left text-sm font-medium text-pink-400 py-1"
                  >
                    Admin Suite
                  </button>
                )}
                <button
                  onClick={async () => {
                    await toggleDemoRole();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-xs font-semibold text-amber-300 py-1"
                >
                  Switch Role ({isAdmin ? 'to Client' : 'to Admin'})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
