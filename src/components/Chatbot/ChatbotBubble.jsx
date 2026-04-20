import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { fetchChatCompletion } from '../../services/minimaxService';
import { trackEvent } from '../../services/analytics';
import { MINIMAX_CONFIG } from '../../config/constants';

/**
 * ChatbotBubble Component
 * The main floating UI for the 'Smart Buddy' AI Assistant.
 */
export const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: MINIMAX_CONFIG.INITIAL_GREETING }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    trackEvent("chatbot_question_asked", { length: input.length });

    const response = await fetchChatCompletion([...messages, userMsg]);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[85vw] sm:w-[380px] h-[500px] bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider leading-none">Smart Buddy</h3>
                  <p className="text-[10px] text-white/60 font-medium">MiniMax AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} message={msg} />
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center text-[10px] font-bold text-slate-400 italic ml-2">
                  <Loader2 size={12} className="animate-spin" /> Smart Buddy is thinking...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about gates, food, routes..."
                className="flex-1 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Bubble */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) trackEvent("chatbot_opened");
        }}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-indigo-500 rotate-90 scale-0 opacity-0' : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        <MessageSquare size={28} className="text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
            <span className="text-[10px] font-black text-white leading-none">1</span>
        </div>
      </motion.button>

      {/* Mini X (Shown when open) */}
      <AnimatePresence>
        {isOpen && (
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={() => setIsOpen(false)}
                className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-2xl border border-slate-200 dark:border-white/10"
            >
                <X size={28} className="text-slate-600 dark:text-white" />
            </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
