import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/Auth/AuthLayout';
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";

export const SignupScreen = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !displayName) return setError('Please fill in all fields');
    
    try {
      setError('');
      setLoading(true);
      await signup(displayName, email, password);
      logEvent(analytics, "sign_up", { method: "email" });
    } catch (err) {
      // Provide clearer error messages based on Firebase codes
      if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else {
        setError(err.message.replace('Firebase: ', '') || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join FlowPass"
      footer={
        <p className="text-slate-500 dark:text-white/30 text-xs font-bold uppercase tracking-widest transition-colors">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300 ml-1 transition-colors">Sign In</button>
        </p>
      }
    >
      <form onSubmit={handleSignup} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5 flex flex-col">
            <label className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-2 transition-colors">Full Name</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm font-bold focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/30"
                placeholder="John Doe"
              />
              <User className="absolute left-4 text-slate-400 dark:text-white/20 transition-colors" size={18} />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-2 transition-colors">Email Address</label>
            <div className="relative flex items-center">
              <input 
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
            <label className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-2 transition-colors">Password</label>
            <div className="relative flex items-center">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm font-bold focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/30"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 text-slate-400 dark:text-white/20 transition-colors" size={18} />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><UserPlus size={16} /> Get Started</>}
        </button>
      </form>
    </AuthLayout>
  );
};
