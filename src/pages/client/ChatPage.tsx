import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  MessageSquare, 
  User as UserIcon, 
  Shield, 
  Sparkles, 
  Clock, 
  CheckCheck,
  ChevronLeft,
  Paperclip,
  FolderKanban,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';

interface ChatPageProps {
  onNavigate: (view: string, extraParam?: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { 
    orders,
    conversations, 
    activeConversationMessages, 
    selectedConversationId, 
    setSelectedConversationId, 
    sendMessage,
    markConversationAsRead,
    getOrCreateConversationForClient
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [attachmentLink, setAttachmentLink] = useState('');
  const [showAttachInput, setShowAttachInput] = useState(false);
  const [mobileShowList, setMobileShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  // Mark conversation read on selection
  useEffect(() => {
    if (selectedConversationId) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId]);

  const activeConversation = conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let targetConvId = selectedConversationId;

    // If client has no conversation yet, create one
    if (!targetConvId && currentUser) {
      targetConvId = await getOrCreateConversationForClient(
        currentUser.uid,
        userProfile?.displayName || currentUser.displayName || 'Client Partner',
        currentUser.email || '',
        selectedOrderId || undefined
      );
    }

    if (targetConvId) {
      const fullText = attachmentLink.trim() 
        ? `${inputText.trim()}\n\n[Attachment Reference]: ${attachmentLink.trim()}`
        : inputText.trim();

      await sendMessage(targetConvId, fullText, selectedOrderId || undefined);
      setInputText('');
      setAttachmentLink('');
      setShowAttachInput(false);
    }
  };

  const handleSelectConv = (id: string) => {
    setSelectedConversationId(id);
    setMobileShowList(false);
  };

  const filteredConversations = conversations.filter((c) => 
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.orderTitle && c.orderTitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Dedicated Studio Messenger
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Direct Customer Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Chat with Pixel Design House
            </h1>
          </div>
        </div>

        {/* Chat Window Workspace */}
        <div className="h-[78vh] bg-[#0e1017] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Left Sidebar: Conversations & Channels */}
          <div className={`w-full md:w-80 lg:w-96 bg-[#0a0c13] border-r border-white/[0.08] flex flex-col ${
            mobileShowList ? 'block' : 'hidden md:flex'
          }`}>
            <div className="p-4 border-b border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  {isAdmin ? 'Studio Client Inbox' : 'Direct Studio Support'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {conversations.length} Active
                </span>
              </div>

              {/* Search Inside Conversations */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full bg-[#131622] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-3">
                  <p>No conversations found.</p>
                  {!isAdmin && (
                    <button
                      onClick={async () => {
                        if (currentUser) {
                          await getOrCreateConversationForClient(
                            currentUser.uid,
                            userProfile?.displayName || 'Client',
                            currentUser.email || ''
                          );
                        }
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-sm"
                    >
                      Start Conversation with Studio
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === selectedConversationId;
                  const unread = isAdmin ? (conv.unreadByAdmin || 0) : (conv.unreadByClient || 0);

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConv(conv.id)}
                      className={`p-4 transition-colors cursor-pointer space-y-1.5 ${
                        isSelected ? 'bg-white/[0.06] border-l-2 border-cyan-400' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-display truncate max-w-[170px]">
                          {isAdmin ? conv.clientName : 'Pixel Design House (Creative Team)'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      {conv.orderTitle && (
                        <span className="text-[10px] text-cyan-400 block truncate">
                          Order: {conv.orderTitle}
                        </span>
                      )}

                      <p className="text-xs text-slate-400 truncate">
                        {conv.lastMessage || 'Channel active.'}
                      </p>

                      {unread > 0 && (
                        <span className="inline-block px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-bold font-mono">
                          {unread} unread
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Area: Active Chat Window */}
          <div className={`flex-1 flex flex-col bg-[#0e1017] ${
            mobileShowList ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1017]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowList(true)}
                  className="md:hidden p-1.5 rounded-lg bg-white/5 text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                  {isAdmin ? (activeConversation?.clientName || 'C')[0] : 'P'}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    {isAdmin 
                      ? (activeConversation?.clientName || 'Client Channel') 
                      : 'Pixel Design House (Lead Artists & Director)'}
                  </h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Support & Creative Feedback</span>
                  </span>
                </div>
              </div>

              {/* Order Association Dropdown/Pill */}
              {orders.length > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Order Ref:</span>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="bg-[#121420] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white max-w-[200px]"
                  >
                    <option value="">General Studio Inquiry</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} - {o.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeConversationMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">Direct Creative Support</h4>
                  <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                    Send a message to discuss your design direction, request revision details, or share new references.
                  </p>
                </div>
              ) : (
                activeConversationMessages.map((msg) => {
                  const isMyMessage = msg.senderId === currentUser?.uid;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-200">{msg.senderName}</span>
                        <span className={`px-1 rounded ${
                          msg.senderRole === 'admin' ? 'bg-pink-500/20 text-pink-300' : 'bg-cyan-500/20 text-cyan-300'
                        }`}>
                          {msg.senderRole === 'admin' ? 'Creative Director' : 'Client Partner'}
                        </span>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-md text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isMyMessage
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none shadow-md shadow-cyan-500/10'
                            : 'bg-[#151824] text-slate-200 border border-white/10 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Optional Attachment Box */}
            {showAttachInput && (
              <div className="p-3 bg-[#131622] border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="url"
                    value={attachmentLink}
                    onChange={(e) => setAttachmentLink(e.target.value)}
                    placeholder="Paste reference link or select file below..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-slate-200 cursor-pointer flex items-center gap-1.5">
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAttachmentLink(`[File: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAttachInput(false)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Message Composer */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#0c0e15] flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAttachInput(!showAttachInput)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  showAttachInput 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' 
                    : 'bg-[#151824] border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Attach reference link or asset"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to Pixel Design House..."
                className="flex-1 bg-[#151824] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-cyan-500/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
