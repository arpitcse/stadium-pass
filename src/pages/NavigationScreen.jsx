import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation,
  Sparkles,
  Search,
  Loader2,
  ChevronRight,
  Cpu,
  Clock
} from 'lucide-react';

// Modules & Services
import { useNotifications } from '../hooks/useNotifications';
import { useCrowdAnalysis } from '../hooks/useCrowdAnalysis';
import { AI_CONFIG } from '../config/constants';

// Sub-components
import { StadiumMap } from '../components/Navigation/StadiumMap';
import { NotificationOverlay } from '../components/Navigation/NotificationOverlay';
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";

const customStyles = `
  .pulse-marker {
    width: 20px; height: 20px; border-radius: 50%;
    animation: pulse-indigo 2s infinite;
  }
  .pulse-marker.high { background: #ef4444; animation: pulse-red 2s infinite; }
  .pulse-marker.medium { background: #f59e0b; animation: pulse-amber 2s infinite; }
  .pulse-marker.low { background: #10b981; animation: pulse-emerald 2s infinite; }
  .pulse-marker.user { background: #3b82f6; outline: 3px solid white; animation: pulse-blue 2s infinite; }
  
  @keyframes pulse-indigo { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } }
  @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } }
  @keyframes pulse-blue { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); } }
  .route-glow { 
    filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
    animation: dash-slide 20s linear infinite;
  }
  @keyframes dash-slide {
    from { stroke-dashoffset: 200; }
    to { stroke-dashoffset: 0; }
  }
  .pulse-marker.user {
    background: #3b82f6; 
    outline: 2px solid white; 
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);
    animation: pulse-blue 2s infinite;
  }
  .google-maps-badge {
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    pointer-events: auto;
  }
`;

export const NavigationScreen = () => {
  const { alerts, pushNotification } = useNotifications();
  const { status, currentInsight, geminiInsight, isGeminiLoading } = useCrowdAnalysis();
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seatCode, setSeatCode] = useState('');
  const [inputError, setInputError] = useState('');

  const handleNavigate = async () => {
    if (!seatCode.trim()) {
      setInputError('Please enter your seat code');
      return;
    }
    
    setInputError('');
    setIsAnalyzing(true);
    
    for (const step of AI_CONFIG.ANALYSIS_STEPS) {
      pushNotification(step, "info");
      await new Promise(r => setTimeout(r, 600));
    }
    
    setIsAnalyzing(false);
    setIsNavigating(true);
    logEvent(analytics, "navigate_click", {
      destination: optimalGate
    });
    pushNotification(`Seat ${seatCode.toUpperCase()} confirmed. Optimal path active.`, "success");
    setTimeout(() => setIsNavigating(false), 8000);
  };

  const optimalGate = useMemo(() => {
    if (!seatCode) return 'Gate 4 North';
    return seatCode.toUpperCase().startsWith('B') ? 'Gate 4 South' : 'Gate 1 North';
  }, [seatCode]);

  return (
    <main className="flex flex-col lg:flex-row h-full min-h-[80vh] lg:h-[calc(100vh-160px)] gap-6 pb-24 lg:pb-6 pt-6 overflow-hidden">
      <style>{customStyles}</style>
      
      {/* Left Panel: Intelligent Assistant */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6 h-full overflow-hidden shrink-0">
        <div className="glass-card p-6 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                <Sparkles size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-outfit font-black text-slate-900 dark:text-white leading-none">Smart Buddy</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Live Data</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-500 dark:text-white/40 uppercase tracking-[0.2em] ml-1">Your Seat Code</label>
               <div className="relative">
                 <input 
                  type="text" 
                  value={seatCode}
                  onChange={(e) => {
                    setSeatCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5));
                    setInputError('');
                  }}
                  placeholder="e.g. B12"
                  className={`w-full bg-white dark:bg-white/5 border ${inputError ? 'border-red-500/50' : 'border-slate-300 dark:border-white/10'} rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all`}
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={16} />
               </div>
               {inputError && <p className="text-[10px] text-red-500 dark:text-red-400 font-bold ml-1">{inputError}</p>}
            </div>

            <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/10 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20 transition-all">
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-300">
                  <Cpu size={12} className={isGeminiLoading ? 'animate-spin' : ''} />
                  <span className="text-[9px] font-black uppercase tracking-widest">AI Insight (Google Gemini)</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-white italic leading-relaxed">
                "{geminiInsight ? `${geminiInsight}` : currentInsight.text}"
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={handleNavigate}
              disabled={isAnalyzing}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 shadow-xl transition-all ${
                isNavigating ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white hover:bg-indigo-400'
              } disabled:opacity-50`}
            >
              {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Navigation size={14} /> {isNavigating ? 'Guidance Active' : 'Navigate Now'} <ChevronRight size={14} /></>}
            </motion.button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <h3 className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.3em] ml-2">Navigation Insights</h3>
          <div className="flex-1 glass-card p-6 bg-slate-50 dark:bg-indigo-500/5 border border-slate-200 dark:border-indigo-500/10 flex flex-col items-center justify-center text-center gap-4">
             <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400"><Cpu size={20} /></div>
             <p className="text-xs font-bold text-slate-600 dark:text-white/60 px-4 leading-relaxed">Real-time crowd patterns are currently being analyzed across all levels.</p>
          </div>
        </div>
      </div>

      {/* Map View & Overlays */}
      <div className="flex-1 min-h-[400px] lg:h-full relative glass-card bg-slate-900 border-none p-0 overflow-hidden shadow-2xl">
        <StadiumMap status={status} isNavigating={isNavigating} seatCode={seatCode} />
        <NotificationOverlay alerts={alerts} />

          <div className="absolute top-4 left-4 z-[1000] pointer-events-none flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase text-white shadow-xl italic">
              <Sparkles size={10} className="text-indigo-400" /> AI Guided Routing Active
            </div>
            <div className="google-maps-badge flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full text-[8px] font-black text-slate-600 uppercase tracking-tighter self-start">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Powered by Google Maps-like Navigation
            </div>
          </div>

        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-6 left-6 right-6 z-[1000] glass-card p-4 bg-slate-900/80 backdrop-blur-xl border-white/10 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-all ${isNavigating ? 'bg-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-indigo-500'}`}><Navigation size={18} className="text-white" /></div>
            <div>
              <p className="text-sm font-bold text-white">{optimalGate}</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-0.5">Your Suggested Entry</p>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400"><Clock size={12} /> 4-6 MIN</div>
             <p className="text-[9px] text-white/20 font-black mt-1">Satellite Connected</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};
