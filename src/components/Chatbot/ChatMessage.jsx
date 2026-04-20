import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu } from 'lucide-react';

/**
 * ChatMessage Component
 * Renders individual chat bubbles for the user and assistant.
 */
export const ChatMessage = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <Cpu size={14} className="text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
        isAssistant 
          ? 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-tl-none' 
          : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20'
      }`}>
        {message.content}
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
          <User size={14} className="text-slate-600 dark:text-white/60" />
        </div>
      )}
    </motion.div>
  );
};
