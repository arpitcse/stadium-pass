import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, MapPin, Zap, Utensils, Ticket, ArrowUpRight, Signal, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/Dashboard/StatCard';

const ActionButton = React.memo(({ icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="glass-card p-4 md:p-6 flex flex-col items-center justify-center gap-2 w-full border border-slate-200 dark:border-none shadow-sm dark:shadow-none bg-white dark:bg-white/[0.04] transition-all"
  >
    <Icon className="text-indigo-500 dark:text-indigo-400" size={24} />
    <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-white/60 uppercase tracking-widest">{label}</span>
  </motion.button>
));

// Performance optimized using memoization and lazy loading
export const Dashboard = React.memo(({ onNavigate }) => {
  const { currentUser } = useAuth();

  const handleNavigateMap = useCallback(() => onNavigate('map'), [onNavigate]);
  const handleNavigateQueue = useCallback(() => onNavigate('queue'), [onNavigate]);
  const handleNavigateTicket = useCallback(() => onNavigate('ticket'), [onNavigate]);
  const handleNavigateProfile = useCallback(() => onNavigate('profile'), [onNavigate]);
  
  return (
    <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNavigateProfile}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group relative"
          >
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center">
                <User size={20} className="text-indigo-400" />
              </div>
            )}
          </motion.button>
          <div>
            <h1 className="text-xl md:text-2xl font-outfit font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Hello, {currentUser?.displayName?.split(' ')[0] || 'Guest'}
            </h1>
            <p className="text-slate-400 dark:text-white/30 text-xs md:text-sm mt-1 uppercase tracking-widest font-bold">Smart Pass Active</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none relative"
        >
          <Bell size={20} className="text-slate-600 dark:text-white/60" />
          <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-[#05070a]" />
        </motion.button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Smart Path Card - Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 lg:col-span-3 glass-card p-6 md:p-8 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/30 overflow-hidden relative group"
        >
          <div className="flex gap-6 items-start relative z-10">
            <div className="p-4 bg-indigo-500 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <Zap size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Smart Route Strategy Active</h3>
              <p className="text-slate-600 dark:text-white/60 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                We've detected heavy congestion near the main concourse. Your personalized route through **Gate 4 Corridor** is currently saving you an average of 12 minutes.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <button 
                  onClick={handleNavigateMap}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                >
                  NAVIGATE NOW <ArrowUpRight size={14} />
                </button>
                <div className="bg-slate-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest flex items-center">
                  Confidence Score: 98%
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-colors duration-500" />
        </motion.div>

        {/* 2. Crowd Level Card */}
        <StatCard 
          icon={Signal}
          title="Current Density"
          subtitle="Moderate Flow"
          status="Stable"
          statusColor="emerald"
          progress={40}
        />

        {/* 3. Closest Gate Card */}
        <StatCard 
          icon={MapPin}
          title="Nearest Gateway"
          value="Gate 4"
          subtitle="G4 SOUTH"
          progress="350m"
        />

        {/* 4. Mini Insights / Weather */}
        <StatCard 
          icon={Bell}
          title="Smart Info"
          subtitle="Wait times are 15% lower at stall B."
          status="Info"
          statusColor="amber"
          className="md:col-span-2 lg:col-span-1 border-dashed border-slate-200 dark:border-white/5 bg-transparent"
        />
      </div>

      {/* Action Sections */}
      <div className="pt-4 pb-12">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-6 text-center">Quick Navigation</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton icon={MapPin} label="Find My Seat" onClick={handleNavigateMap} />
          <ActionButton icon={Utensils} label="Order Food" onClick={handleNavigateQueue} />
          <ActionButton icon={Ticket} label="View Ticket" onClick={handleNavigateTicket} />
          <ActionButton icon={Bell} label="View Alerts" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
});
