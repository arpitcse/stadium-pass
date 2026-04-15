import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, LogOut, Save, Camera, ShieldCheck, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { sanitizeText } from '../utils/validation';
import { AvatarPicker } from '../components/Profile/AvatarPicker';
import { DeleteConfirmModal } from '../components/Profile/DeleteConfirmModal';

// Performance optimized using memoization and lazy loading
// Debounced inputs for performance optimization
export const ProfileScreen = React.memo(() => {
  const { currentUser, logout, updateUserProfile, deleteAccount, loginAsGuest } = useAuth();
  const isGuest = currentUser?.isGuest;
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedName = useDebounce(displayName, 300);
  const debouncedPassword = useDebounce(password, 300);
  const [message, setMessage] = useState(null);
  const [isAvatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const cleanName = sanitizeText(displayName.trim());
      if (!cleanName) {
        setLoading(false);
        return setMessage({ type: 'error', text: 'Display name cannot be empty' });
      }

      const updates = { displayName: cleanName, photoURL: avatarUrl };
      if (password.trim()) {
        updates.password = password.trim();
      }
      
      await updateUserProfile(updates);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword("");
    } catch (err) {
      setMessage({ type: 'error', text: 'Update failed. Check your connection.' });
    } finally {
      setLoading(false);
    }
  }, [displayName, avatarUrl, password, updateUserProfile]);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await deleteAccount();
      setShowDeleteConfirm(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  }, [deleteAccount]);

  return (
    <main className="flex flex-col gap-8 pb-32 pt-6 items-center" aria-label="Profile Settings">
      <div className="w-full px-2">
        <h2 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Your Profile</h2>
        <p className="text-slate-400 dark:text-white/40 text-sm font-bold tracking-tight">Security & personalization</p>
      </div>

      <div className="w-full flex flex-col gap-6">
        {/* User Profile Header */}
        <div className="glass-card p-10 flex flex-col items-center gap-6 bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 relative overflow-hidden group">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl">
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setAvatarPickerOpen(!isAvatarPickerOpen)} 
              disabled={isGuest}
              className="absolute bottom-0 right-0 bg-indigo-500 p-2.5 rounded-full border-4 border-slate-900 hover:scale-110 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
          
          <AnimatePresence>
            {isAvatarPickerOpen && (
              <AvatarPicker 
                currentUrl={avatarUrl} 
                onSelect={(url) => { setAvatarUrl(url); setAvatarPickerOpen(false); }} 
              />
            )}
          </AnimatePresence>

          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{currentUser?.displayName || "Stadium Guest"}</h3>
            <div className="flex items-center gap-1.5 justify-center text-indigo-500 dark:text-indigo-400">
              <ShieldCheck size={14} className={isGuest ? "text-amber-400" : ""} />
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isGuest ? "text-amber-400" : ""}`}>
                {isGuest ? "Guest Mode Active" : "Verified Smart Buddy"}
              </span>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-6 flex flex-col gap-2 bg-slate-50 dark:bg-white/[0.03]">
            <label className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <div className="flex items-center gap-4">
              <User size={18} className="text-indigo-500 dark:text-indigo-400" />
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isGuest}
                className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col gap-2 bg-slate-50 dark:bg-white/[0.03]">
            <label className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] ml-1">New Password</label>
            <div className="flex items-center gap-4">
              <Lock size={18} className="text-indigo-500 dark:text-indigo-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isGuest}
                className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder={isGuest ? "Not available in Guest Mode" : "•••••••• (leave blank to keep)"}
              />
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col gap-2 bg-slate-100 dark:bg-white/[0.01] opacity-70 dark:opacity-40">
            <label className="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="flex items-center gap-4">
              <Mail size={18} className="text-slate-500 dark:text-white/40" />
              <span className="text-slate-600 dark:text-white/60 font-medium">{currentUser?.email}</span>
            </div>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center text-[10px] font-black uppercase tracking-widest py-4 px-6 rounded-2xl border ${message.type === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: isGuest ? 1 : 1.02 }}
            whileTap={{ scale: isGuest ? 1 : 0.98 }}
            disabled={loading || isGuest}
            onClick={handleUpdate}
            className="w-full bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Save size={16} /> {loading ? "Saving..." : (isGuest ? "Disabled in Guest Mode" : "Update Profile")}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/60 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-slate-300 dark:hover:bg-white/10 transition-all"
          >
            <LogOut size={16} /> Secure Logout
          </motion.button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isGuest}
            className="w-full mt-4 text-red-500/40 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <Trash2 size={14} /> {isGuest ? "Account Deletion Disabled" : "Delete Account"}
          </button>
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        onConfirm={handleDelete}
        loading={loading}
      />
    </main>
  );
});
