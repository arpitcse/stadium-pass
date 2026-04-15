import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Globe, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";

export const LoginScreen = ({ onSwitch, onRecover }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginAsGuest } = useAuth();

  const handleGuestLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginAsGuest();
      logEvent(analytics, "login", { method: "guest" });
    } catch (err) {
      setError('Guest login failed. Please try again.');
    } finally {
      if (err) setLoading(false);
    }
  };

  // Firebase logic
  // Improved readability and maintainability without altering functionality
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Invalid email or password');
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      logEvent(analytics, "login", { method: "email" });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      logEvent(analytics, "login", { method: "google" });
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="FlowPass" 
      subtitle="Welcome back 👋"
      footer={
        <div className="flex flex-col gap-4">
          <p className="text-slate-600 dark:text-white/30 text-xs font-bold uppercase tracking-widest transition-colors">
            Don't have an account?{' '}
            <button onClick={onSwitch} className="text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1 transition-colors">Sign Up</button>
          </p>
          <button onClick={onRecover} className="text-slate-500 dark:text-white/20 text-[10px] uppercase font-black tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors">
            Forgot Password?
          </button>
        </div>
      }
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5 flex flex-col">
            <label htmlFor="email" className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-2 transition-colors">Email</label>
            <div className="relative flex items-center">
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm font-bold focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/30"
                placeholder="name@company.com"
              />
              <Mail className="absolute left-4 text-slate-400 dark:text-white/20 transition-colors" size={18} />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label htmlFor="password" className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-2 transition-colors">Password</label>
            <div className="relative flex items-center">
              <input 
                id="password"
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white text-sm font-bold focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/30"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 text-slate-400 dark:text-white/20 transition-colors" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 dark:text-white/20 hover:text-slate-700 dark:hover:text-white/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center transition-colors">
            {error}
          </motion.div>
        )}

        <motion.button 
          type="submit" 
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-500/20 disabled:opacity-70 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : <><LogIn size={16} /> Sign In</>}
        </motion.button>

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/5 transition-colors" />
          <span className="text-[8px] font-black text-slate-400 dark:text-white/10 uppercase tracking-widest transition-colors">Or Continue With</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-white/5 transition-colors" />
        </div>

        <motion.button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white text-black border border-gray-300 dark:bg-black dark:text-white dark:border-white/20 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Connecting...</> : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 flex-shrink-0" />
              Continue with Google
            </>
          )}
        </motion.button>

        <motion.button 
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-slate-500/10 text-slate-800 border border-slate-300 dark:bg-gray-500/20 dark:text-white dark:border-white/20 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          Continue as Guest
        </motion.button>      </form>
    </AuthLayout>
  );
};
