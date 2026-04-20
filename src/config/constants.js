/**
 * FlowPass Project Constants
 * Centralized configuration for stadium maps, AI logic, and global settings.
 */

export const MAP_CONFIG = {
  DEFAULT_CENTER: [-37.8249, 144.9839],
  STADIUM_BOUNDS: [
    [-37.8265, 144.9815],
    [-37.8235, 144.9865]
  ],
  DEFAULT_ZOOM: 17,
  MAX_ZOOM: 19,
  LANDMARKS: {
    GATES: [
      { id: 'g1', name: 'Gate 1 North', pos: [-37.8242, 144.9845] },
      { id: 'g4', name: 'Gate 4 South', pos: [-37.8258, 144.9832] },
      { id: 'ga', name: 'Gate A', pos: [-37.8249, 144.9825] }
    ],
    FOOD: [
      { id: 'f1', name: 'Concourse Cafe', pos: [-37.8245, 144.9850] },
      { id: 'f2', name: 'Gourmet Burger', pos: [-37.8252, 144.9838] },
      { id: 'f3', name: 'Beer Garden', pos: [-37.8255, 144.9842] }
    ],
    RESTROOMS: [
      { id: 'r1', name: 'Level 1 North', pos: [-37.8241, 144.9839] },
      { id: 'r2', name: 'Level 2 South', pos: [-37.8256, 144.9835] }
    ]
  }
};

export const AI_CONFIG = {
  INSIGHT_TEMPLATES: [
    { text: "Gate 4 South is clear. Fastest entry path!", congestionSaved: 30, minsSaved: 6 },
    { text: "Minor congestion at Gate 2 concourse.", congestionSaved: 15, minsSaved: 4 },
    { text: "Gate 1 queue dropped significantly.", congestionSaved: 45, minsSaved: 10 },
    { text: "South Corridor is 20% faster right now.", congestionSaved: 20, minsSaved: 5 },
    { text: "Security checks at Gate 3 moving swiftly.", congestionSaved: 25, minsSaved: 3 }
  ],
  ANALYSIS_STEPS: [
    "Connecting to real-time stadium sensors...",
    "Analyzing crowd density at Gate 4...",
    "Google Gemini: Calculating optimal entry strategy...",
    "Intelligence Layer: Route optimized."
  ],
  GEMINI_POLLING_INTERVAL: 15000, // 15 seconds
  SIMULATION_INTERVAL: 4500, // 4.5 seconds
};

export const MINIMAX_CONFIG = {
  MODEL: import.meta.env.VITE_MINIMAX_MODEL || "M2-her",
  SYSTEM_PROMPT: import.meta.env.VITE_MINIMAX_SYSTEM_PROMPT || "You are the FlowPass 'Smart Buddy' - a helpful, witty stadium navigation assistant. You help users find gates, seats, food, and restrooms. Use stadium emojis and keep answers concise.",
  INITIAL_GREETING: import.meta.env.VITE_MINIMAX_GREETING || "Hi! I'm your Smart Buddy. Need help finding a gate or checking the queue? Ask me anything!"
};

export const APP_THEME = {
  TRANSITION_DURATION: 300,
  GLASS_OPACITY: '0.1',
};

export const NAV_CONFIG = {
  MAIN_LINKS: [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'map', label: 'Navigate', icon: 'MapPin' },
    { id: 'queue', label: 'Food', icon: 'Utensils' },
    { id: 'ticket', label: 'Ticket', icon: 'Ticket' }
  ]
};
