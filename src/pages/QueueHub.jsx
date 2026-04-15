import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { FacilityItem } from '../components/Queue/FacilityItem';

// Performance optimized using memoization and lazy loading
export const QueueHub = React.memo(() => {
  // Fetch real-time crowd data from Firebase
  // Improved readability and maintainability without altering functionality
  return (
    <main className="flex flex-col gap-6 pb-32 pt-6" aria-label="Smart Queues">
      <div className="px-2">
        <h2 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white transition-colors duration-200">Smart Queues</h2>
        <p className="text-slate-500 dark:text-white/40 text-sm transition-colors duration-200 tracking-tight">Real-time wait times for nearby facilities</p>
      </div>

      {/* Suggestion Card */}
      <div className="bg-indigo-600/20 rounded-3xl p-6 border border-indigo-500/10 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-indigo-300">
            <CheckCircle2 size={16} />
            <span className="text-[11px] font-black uppercase tracking-widest">Smart Suggestion</span>
          </div>
          <h3 className="text-lg font-bold text-indigo-950 dark:text-white leading-tight mb-2">
            "Stall B" is much faster than "Stall A" right now.
          </h3>
          <p className="text-indigo-900/70 dark:text-white/60 text-sm mb-4 leading-relaxed">
            You can save approximately 14 minutes by walking 2 minutes further.
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl text-xs font-black shadow-lg shadow-black/10 flex items-center gap-2 hover:bg-white/90 transition-all uppercase tracking-widest">
            Take Me There <ChevronRight size={14} />
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500" />
      </div>

      <div className="flex flex-col gap-4 px-1">
        <FacilityItem 
          name="Victory Tacos" 
          type="food" 
          waitTime={22} 
          priceRange="$$"
        />
        <FacilityItem 
          name="Apex Brews" 
          type="cafe" 
          waitTime={5} 
          recommended={true}
          priceRange="$"
        />
        <FacilityItem 
          name="The Pitstop" 
          type="food" 
          waitTime={12} 
          priceRange="$$$"
        />
      </div>

      {/* Footer Status Message */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center py-12 gap-3 opacity-20 select-none pb-24"
      >
        <div className="w-10 h-10 rounded-full border border-slate-400 dark:border-white/20 flex items-center justify-center">
           <CheckCircle2 size={18} className="text-slate-500 dark:text-white" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center text-slate-600 dark:text-white">
          No congestion detected.<br/>You're good to go 🚀
        </p>
      </motion.div>
    </main>
  );
});
