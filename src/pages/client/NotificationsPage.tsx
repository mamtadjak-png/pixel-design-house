import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  FolderKanban, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Eye,
  Filter
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsPageProps {
  onNavigate: (view: string, extraParam?: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'messages'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'orders') return n.type.includes('order') || n.type.includes('status') || n.type.includes('preview') || n.type.includes('delivered');
    if (filter === 'messages') return n.type === 'message';
    return true;
  });

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-pink-400" />;
      case 'preview_ready':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'order_placed':
      case 'status_change':
      case 'order_update':
        return <FolderKanban className="w-4 h-4 text-cyan-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Real-time Studio Feed
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Activity & Milestones</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Notification Center
            </h1>
          </div>

          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllNotificationsRead}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-fit"
            >
              <CheckCheck className="w-4 h-4 text-cyan-400" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08] overflow-x-auto">
          {(['all', 'unread', 'orders', 'messages'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {f === 'all' ? `All Updates (${notifications.length})` :
               f === 'unread' ? `Unread (${notifications.filter(n => !n.read).length})` :
               f === 'orders' ? 'Order Milestones' : 'Studio Messages'}
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifs.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#0e1017] border border-white/[0.08] text-center space-y-4">
            <Bell className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white font-display">No notifications in this filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You are completely caught up with your studio communications and order milestones.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.link) {
                    onNavigate(notif.link.replace('/', ''));
                  }
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  notif.read
                    ? 'bg-[#0e1017] border-white/[0.06] hover:border-white/15'
                    : 'bg-[#121626] border-cyan-500/30 shadow-md shadow-cyan-500/5'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  notif.read ? 'bg-white/5' : 'bg-cyan-500/10'
                }`}>
                  {getIconForType(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white font-display truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-medium">
                    <span>Jump to details</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 self-center" />
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
