import React, { useState, useRef, useEffect } from 'react';
import { sendGeminiStudioChat, GeminiChatMessage } from '../../services/geminiService';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  CornerDownLeft, 
  Layers, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface GeminiStudioAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBriefToCommission?: (briefText: string) => void;
}

export const GeminiStudioAdvisor: React.FC<GeminiStudioAdvisorProps> = ({
  isOpen,
  onClose,
  onApplyBriefToCommission,
}) => {
  const [messages, setMessages] = useState<GeminiChatMessage[]>([
    {
      role: 'assistant',
      content: "Welcome to Pixel Design House. I am the studio's AI Creative Director. Whether you need assistance structuring a bespoke creative brief, choosing a color psychology matrix, or planning deliverables for an upcoming campaign, I am here to assist. What are you looking to create?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const newHistory: GeminiChatMessage[] = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendGeminiStudioChat(newHistory, selectedModel);
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages([...newHistory, { role: 'assistant', content: "Our studio director is reviewing current works. Please proceed with placing your brief in the commission form." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Drawer Window */}
      <div className="relative w-full sm:max-w-2xl bg-[#0f111a] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col h-[90vh] sm:h-[680px]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0b0d14] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display">
                  Pixel AI Studio Director
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Gemini Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Creative brief formulation, aesthetic consulting & project planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-[#151824] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (Balanced)</option>
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Strategy)</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => {
            const isAI = m.role === 'assistant';
            return (
              <div
                key={i}
                className={`flex gap-3 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isAI 
                    ? 'bg-gradient-to-tr from-cyan-400 to-pink-500 text-black' 
                    : 'bg-white/10 text-white'
                }`}>
                  {isAI ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="max-w-[85%] space-y-1">
                  <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isAI 
                      ? 'bg-[#151824] text-slate-200 border border-white/10 rounded-tl-none' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-tr-none shadow-md shadow-cyan-500/10'
                  }`}>
                    {m.content}
                  </div>

                  {/* Transfer to Commission Button on AI responses */}
                  {isAI && i > 0 && onApplyBriefToCommission && (
                    <button
                      onClick={() => {
                        onApplyBriefToCommission(m.content);
                        onClose();
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <ArrowRight className="w-3 h-3" />
                      <span>Use this direction in Project Brief</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center text-black">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#151824] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Formulating creative recommendation...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#0c0e16] flex items-center gap-2 overflow-x-auto">
          {[
            'Formulate a B1 poster brief',
            'Suggest an editorial Swiss color palette',
            'What deliverables do I need for a brand re-identity?',
            'How should I structure a 3D video reel brief?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2.5 py-1 whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Composer */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 sm:p-4 border-t border-white/10 bg-[#0a0c13] flex items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Creative Director about briefs, styles, deliverables..."
            className="flex-1 bg-[#141724] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-cyan-500/10"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
