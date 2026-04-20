import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation,
  Sparkles,
  Search,
  Loader2,
  ChevronRight,
  Cpu,
  Clock,
  Database,
  Activity
} from 'lucide-react';

// Modules & Services
import { useNotifications } from '../hooks/useNotifications';
import { useCrowdAnalysis } from '../hooks/useCrowdAnalysis';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../contexts/AuthContext';
import { AI_CONFIG } from '../config/constants';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Sub-components
import { StadiumMap } from '../components/Navigation/StadiumMap';
import { 
  RouteSummary, 
  GuidanceSteps, 
  AIStatusLog 
} from '../components/Navigation/SubSections/InfoPanels';
import { trackEvent } from '../services/analytics';

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
`;

// Fixed route persistence — now remains active until destination changes
export const NavigationScreen = React.memo(() => {
  const { alerts, pushNotification } = useNotifications();
  const { currentUser } = useAuth();
  const { status, currentInsight, geminiInsight, isGeminiLoading, lastSync } = useCrowdAnalysis();
  
  // Initialize from localStorage for persistence
  const [isNavigating, setIsNavigating] = useState(() => {
    return localStorage.getItem('flowpass_is_navigating') === 'true';
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seatCode, setSeatCode] = useState(() => {
    return localStorage.getItem('flowpass_active_seat') || '';
  });
  const [inputError, setInputError] = useState('');
  
  // Debounced inputs for performance optimization
  const debouncedSeatCode = useDebounce(seatCode, 300);

  const optimalGate = useMemo(() => {
    if (!debouncedSeatCode) return 'Gate 4 North';
    return debouncedSeatCode.toUpperCase().startsWith('B') ? 'Gate 4 South' : 'Gate 1 North';
  }, [debouncedSeatCode]);

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
    trackEvent("navigate_clicked", { 
      method: "AI_route",
      seat_code: seatCode.toUpperCase()
    });
    
    // Persistent Backend Logging via Firestore
    try {
      await addDoc(collection(db, 'navigation'), {
        userId: currentUser?.uid || 'anonymous',
        userName: currentUser?.displayName || 'Anonymous',
        seatCode: seatCode.toUpperCase(),
        optimalGate,
        timestamp: serverTimestamp(),
        context: 'AI Optimized Route'
      });
    } catch (e) {
      console.warn("Firestore navigation logging failed", e);
    }

    trackEvent("route_generated", { 
      status: "success",
      gate: optimalGate
    });

    // Persistence
    localStorage.setItem('flowpass_is_navigating', 'true');
    localStorage.setItem('flowpass_active_seat', seatCode.toUpperCase());
  };

  const handleClearRoute = () => {
    setIsNavigating(false);
    localStorage.removeItem('flowpass_is_navigating');
    localStorage.removeItem('flowpass_active_seat');
    pushNotification("Navigation guidance cleared.", "info");
    trackEvent("navigation_cleared", { method: "manual" });
  };

  return (
    <main className="flex flex-col lg:flex-row h-full min-h-[80vh] lg:h-[calc(100vh-160px)] gap-6 pb-24 lg:pb-6 pt-6 overflow-hidden">
      <style>{customStyles}</style>
      
      {/* Left Panel: Intelligent Assistant */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6 h-full overflow-hidden shrink-0">
        <div className="glass-card p-6 bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                <Sparkles size={18} className="text-white" aria-hidden="true" />
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
                  id="seat-code-input"
                  value={seatCode}
                  onChange={(e) => {
                    setSeatCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5));
                    setInputError('');
                  }}
                  placeholder="e.g. B12"
                  aria-label="Enter your stadium seat code"
                  aria-invalid={!!inputError}
                  aria-describedby={inputError ? "seat-code-error" : undefined}
                  className={`w-full bg-white dark:bg-white/5 border ${inputError ? 'border-red-500/50' : 'border-slate-300 dark:border-white/10'} rounded-2xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-white text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all`}
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20" size={16} aria-hidden="true" />
               </div>
               {inputError && <p id="seat-code-error" className="text-[10px] text-red-500 dark:text-red-400 font-bold ml-1">{inputError}</p>}
            </div>

            <div 
              aria-live="polite"
              aria-busy={isGeminiLoading}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
              isGeminiLoading ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-slate-900/40 border-indigo-500/10'
            }`}>
              {/* AI Branding Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-[6px] font-black text-indigo-400 uppercase tracking-[0.1em]">Powered by Google Gemini AI</span>
              </div>

              <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Cpu size={14} className={isGeminiLoading ? 'animate-spin' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Prediction Engine</span>
              </div>

              {isGeminiLoading ? (
                <div className="py-4 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-1 rounded-full bg-indigo-500/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500" 
                      animate={{ x: ["-100%", "100%"] }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-white/40 animate-pulse italic">AI analyzing crowd data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Congestion Prediction</p>
                    <p className="text-sm font-medium text-white italic leading-relaxed">
                      "{geminiInsight?.congestion}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Best Route</p>
                      <p className="text-[11px] font-bold text-white leading-tight">
                        {geminiInsight?.suggestion}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Est. Wait Time</p>
                      <p className="text-[11px] font-bold text-white">
                        {geminiInsight?.waitTime}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={isNavigating ? handleClearRoute : handleNavigate}
              disabled={isAnalyzing}
              aria-label={isNavigating ? "Stop navigation guidance" : "Start navigation to seat"}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 shadow-xl transition-all ${
                isNavigating ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
              } disabled:opacity-50`}
            >
              {isAnalyzing ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Analyzing Sensors...</> : 
               isNavigating ? <><Navigation size={14} className="rotate-180" aria-hidden="true" /> Clear Active Route</> :
               <><Navigation size={14} aria-hidden="true" /> Navigate Now <ChevronRight size={14} aria-hidden="true" /></>}
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

      {/* Map & Overlays Wrapper */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="nav-container">
          {/* Main Map Visualization */}
          <div className="map-section relative glass-card p-0 border-none shadow-2xl">
            <StadiumMap status={status} isNavigating={isNavigating} seatCode={seatCode} />
            
            <div className="absolute top-4 left-4 z-[100] pointer-events-none flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase text-white shadow-xl italic">
                <Database size={10} className="text-cyan-400" /> Live data from Firebase Firestore
              </div>
            </div>
          </div>

          {/* Right Info Panel */}
          <div className="info-section">
            <RouteSummary to={geminiInsight?.suggestion || 'VIP Lounge'} />
            <GuidanceSteps isNavigating={isNavigating} />
            <AIStatusLog alerts={alerts} />
          </div>
        </div>

        {/* Global Navigation Status Bar */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-4 bg-slate-900/80 backdrop-blur-xl border-white/10 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-all ${isNavigating ? 'bg-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-indigo-500'}`}><Navigation size={18} className="text-white" /></div>
            <div>
              <p className="text-sm font-bold text-white">{isNavigating ? 'VIP Lounge Area' : 'Select Destination'}</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-0.5">
                {isNavigating ? 'Guided route active — follow highlighted path' : 'Ready to Start'}
              </p>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400">
               <Activity size={12} className={isAnalyzing ? 'animate-pulse' : ''} /> 
               {lastSync ? `SYNCED: ${lastSync.toLocaleTimeString()}` : 'CONNECTING...'}
             </div>
             <p className="text-[9px] text-white/20 font-black mt-1 uppercase tracking-widest italic">Persisting Session to Firebase</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
});
