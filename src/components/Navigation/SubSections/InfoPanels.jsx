import React from 'react';
import { Navigation, ChevronRight, Cpu } from 'lucide-react';

/**
 * RouteSummary Component
 * Displays the high-level path details and estimated metrics.
 */
export const RouteSummary = ({ from = "Gate A", to = "VIP Lounge" }) => (
  <div className="info-card">
    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
      <Navigation size={12} className="text-indigo-400" /> Route Summary
    </h3>
    <div className="space-y-2">
      <p className="text-[11px] font-bold text-white/90">
        {from} → North Corridor → {to}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
          <div className="text-[10px] font-black text-emerald-400 leading-none mb-1">4-6 MIN</div>
          <div className="text-[7px] font-black text-white/20 uppercase tracking-tighter">EST. TIME</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
          <div className="text-[10px] font-black text-amber-400 leading-none mb-1">MODERATE</div>
          <div className="text-[7px] font-black text-white/20 uppercase tracking-tighter">CONGESTION</div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * GuidanceSteps Component
 * List of turn-by-turn instructions for active navigation.
 */
export const GuidanceSteps = ({ isNavigating }) => {
  if (!isNavigating) return null;
  
  return (
    <div className="info-card">
      <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
        <ChevronRight size={12} className="text-emerald-400" /> Guidance Steps
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl text-[9px] font-bold text-white/60">
          <span className="text-emerald-400">➡</span> Walk straight for 50m
        </div>
        <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[9px] font-bold text-amber-400">
          <span>➡</span> Turn left at Gate 4 North
        </div>
        <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9px] font-bold text-emerald-400">
          <span>➡</span> Continue to VIP Lounge
        </div>
      </div>
    </div>
  );
};

/**
 * AIStatusLog Component
 * Real-time log of AI analysis events and notifications.
 */
export const AIStatusLog = ({ alerts }) => (
  <div className="info-card flex-1 flex flex-col overflow-hidden">
    <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 shrink-0">
      <Cpu size={12} className="text-cyan-400" /> AI Status Log
    </h3>
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="space-y-2 pr-1">
        {alerts.slice(-3).map((alert, idx) => (
          <div key={idx} className={`p-3 rounded-xl text-[10px] font-bold border ${
            alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
            alert.type === 'info' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
            'bg-slate-800/50 border-white/5 text-white/60'
          }`}>
            {alert.message}
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-[9px] text-white/20 font-black uppercase text-center py-8 italic tracking-widest">
            Scanning for sensors...
          </p>
        )}
      </div>
    </div>
  </div>
);
