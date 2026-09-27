import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Layers, 
  FolderKanban, 
  MessageSquare, 
  User, 
  Sparkles,
  Shield
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { orders, conversations } = useApp();

  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const unreadMessagesCount = conversations.reduce((acc, conv) => {
    return acc + (isAdmin ? (conv.unreadByAdmin || 0) : (conv.unreadByClient || 0));
  }, 0);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090b12]/92 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            currentView === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </button>

        {/* 2. Work Portfolio */}
        <button
          onClick={() => onNavigate('portfolio')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            currentView === 'portfolio' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Work</span>
        </button>

        {/* 3. My Orders (or Start Project for unauthenticated) */}
        <button
          onClick={() => {
            if (currentUser) {
              onNavigate(isAdmin ? 'admin_dashboard' : 'client_orders');
            } else {
              onOpenAuth();
            }
          }}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            currentView === 'client_orders' || currentView === 'admin_dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">
            {isAdmin ? 'Admin' : 'Orders'}
          </span>
          {activeOrdersCount > 0 && !isAdmin && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </button>

        {/* 4. Chat with Studio */}
        <button
          onClick={() => {
            if (currentUser) {
              onNavigate('chat');
            } else {
              onOpenAuth();
            }
          }}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            currentView === 'chat' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-pink-500 text-white text-[9px] font-bold font-mono flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* 5. Account Hub */}
        <button
          onClick={() => {
            if (currentUser) {
              onNavigate('client_dashboard');
            } else {
              onOpenAuth();
            }
          }}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            ['client_dashboard', 'profile', 'saved', 'client_projects'].includes(currentView) 
              ? 'text-cyan-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {isAdmin ? (
            <Shield className="w-4 h-4 mb-1 text-pink-400" />
          ) : (
            <User className="w-4 h-4 mb-1" />
          )}
          <span className="text-[10px] font-medium tracking-tight">Account</span>
        </button>

      </div>
    </nav>
  );
};
