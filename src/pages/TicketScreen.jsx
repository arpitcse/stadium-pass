import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { TicketCard } from '../components/Ticket/TicketCard';

// Performance optimized using memoization and lazy loading
export const TicketScreen = React.memo(() => {
  return (
    <main className="flex flex-col gap-8 pb-32 pt-6 items-center" aria-label="Your Digital Pass">
      <div className="w-full px-2 self-start">
        <h2 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white transition-colors duration-200">Your Digital Pass</h2>
        <p className="text-slate-500 dark:text-white/40 text-sm font-bold transition-colors duration-200 tracking-tight">Valid for Tonight's Match</p>
      </div>

      <TicketCard 
        matchName="Storm vs Titans"
        venue="Apex Stadium"
        area="G4"
        section="104"
        row="12"
        seat="42"
        gateStatus="Gate 4 South Optimized"
      />

      {/* Usage Tooltip */}
      <motion.div
        animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="flex flex-col items-center gap-2 text-slate-400 dark:text-white/30 mt-4"
      >
        <ChevronUp size={20} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scan at Gate 4 Turnstile</span>
      </motion.div>
    </main>
  );
});
