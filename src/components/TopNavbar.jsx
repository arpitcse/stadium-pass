import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Zap, User, Bell, 
  CheckCircle2, AlertTriangle, Info,
  Home, MapPin, Utensils, Ticket 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { NAV_CONFIG } from '../config/constants';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'High congestion at Gate 2', time: '2 min ago', type: 'alert' },
  { id: 2, title: 'Route updated to Gate 3', time: '5 min ago', type: 'info' },
  { id: 3, title: 'Crowd levels optimized', time: '12 min ago', type: 'success' },
];



const getIconForType = (type) => {
  switch(type) {
    case 'alert': return <AlertTriangle size={16} className="text-amber-500" />;
    case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
    case 'info':
    default: return <Info size={16} className="text-indigo-400" />;
  }
};

const ICON_MAP = {
  Home,
  MapPin,
  Utensils,
  Ticket
};

const DesktopNavLink = React.memo(({ link, activeTab, onTabChange }) => {
  const handleClick = useCallback(() => {
    onTabChange(link.id);
  }, [link.id, onTabChange]);

  return (
    <button
      onClick={handleClick}
      aria-label={`${link.label} navigation button`}
      aria-current={activeTab === link.id ? 'page' : undefined}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === link.id 
          ? 'bg-indigo-500 text-white shadow-lg' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
      }`}
    >
      {React.createElement(ICON_MAP[link.icon], { 
        size: 14,
        'aria-hidden': 'true'
      })}
      {link.label}
    </button>
  );
});

export const TopNavbar = React.memo(({ activeTab, onTabChange }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Optimized rendering to reduce unnecessary re-renders
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = useCallback(() => {
    if (onTabChange) onTabChange('home');
  }, [onTabChange]);

  const handleProfileClick = useCallback(() => {
    if (onTabChange) onTabChange('profile');
  }, [onTabChange]);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-7xl px-6 flex items-center justify-between pointer-events-auto">
        
        {/* Logo Section */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHomeClick}
          aria-label="FlowPass Home"
          className="flex items-center gap-3 cursor-pointer group outline-none"
        >
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-all">
            <Zap size={20} className="text-white" fill="white" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-outfit font-black tracking-tighter text-slate-900 dark:text-white">
              Flow<span className="text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-400 dark:group-hover:text-indigo-300">Pass</span>
            </h1>
          </div>
        </motion.button>

        {/* Desktop Navigation */}
        {currentUser && onTabChange && (
          <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 p-1.5 rounded-2xl shadow-xl backdrop-blur-xl">
            {NAV_CONFIG.MAIN_LINKS.map(link => (
              <DesktopNavLink 
                key={link.id} 
                link={link} 
                activeTab={activeTab} 
                onTabChange={onTabChange} 
              />
            ))}
          </div>
        )}

        {/* Action Section */}
        <div className="flex items-center gap-3 relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white transition-all shadow-md focus:outline-none backdrop-blur-xl"
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </motion.button>

          {currentUser && (
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleNotifications}
                  aria-label="Toggle notifications menu"
                  aria-expanded={showNotifications}
                  className={`w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 flex items-center justify-center transition-all ${showNotifications ? 'text-indigo-500 dark:text-indigo-400 border-indigo-500/50 ring-2 ring-indigo-500/10' : 'text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}
                >
                  <Bell size={18} aria-hidden="true" />
                  <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-white dark:border-slate-950 animate-pulse" />
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-72 glass-card bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 origin-top-right z-50 flex flex-col gap-2"
                    >
                      <h3 className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] mb-2 px-2">Notifications</h3>
                      {MOCK_NOTIFICATIONS.map(note => (
                        <button key={note.id} className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group">
                          <div className="p-2 border border-slate-200 dark:border-white/5 rounded-full bg-slate-50 dark:bg-white/[0.02] group-hover:scale-110 transition-transform">
                            {getIconForType(note.type)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{note.title}</p>
                            <p className="text-[9px] text-slate-500 dark:text-white/20 font-black uppercase tracking-widest mt-1.5">{note.time}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleProfileClick} 
                aria-label="Toggle profile menu"
                className="flex items-center gap-3 pl-3 py-1.5 pr-1.5 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-2xl hover:border-slate-300 dark:hover:border-white/10 transition-all shadow-md outline-none"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none">
                    {currentUser.displayName?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[7px] font-bold text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-tighter">
                    {currentUser.isGuest ? 'Guest Access' : 'Verified'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center overflow-hidden">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} className="text-indigo-400" />
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});
