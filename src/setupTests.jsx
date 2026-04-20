import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Principal Engineer Grade Mocks
const MockComp = ({ children }) => <div>{children}</div>;

vi.mock('framer-motion', () => ({
  motion: {
    div: MockComp,
    h1: MockComp,
    h2: MockComp,
    p: MockComp,
    button: MockComp,
    span: MockComp,
    section: MockComp,
    nav: MockComp,
    main: MockComp,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useScroll: () => ({ scrollY: { onChange: vi.fn() }, scrollX: { onChange: vi.fn() } }),
  useTransform: () => ({}),
  useSpring: () => ({}),
  useReducedMotion: () => false,
}));

vi.mock('react-leaflet', () => ({
  MapContainer: MockComp,
  TileLayer: () => <div />,
  Marker: MockComp,
  Popup: MockComp,
  Polyline: () => <div />,
  ZoomControl: () => null,
  ImageOverlay: () => null,
  useMap: () => ({ 
    setMaxBounds: vi.fn(), 
    on: vi.fn(), 
    panInsideBounds: vi.fn(),
    fitBounds: vi.fn()
  }),
}));

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    // Add specific mocks if needed, otherwise rely on the factory if possible
  };
});

vi.mock('./firebase', () => ({
  auth: { 
    currentUser: null,
    onAuthStateChanged: vi.fn()
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn()
  },
  provider: {},
  analytics: {
    logEvent: vi.fn(),
  },
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  updateProfile: vi.fn(),
  deleteUser: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockImplementation(() => ({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            congestion: "Test congestion",
            suggestion: "Test suggestion",
            waitTime: "Test wait"
          })
        }
      })
    }))
  })),
  SchemaType: {
    OBJECT: 'OBJECT',
    STRING: 'STRING'
  }
}));

vi.mock('./contexts/AuthContext', () => ({
  AuthProvider: MockComp,
  useAuth: () => ({ 
    currentUser: { uid: 'test-user', displayName: 'Test User', photoURL: 'test-url' }, 
    loading: false,
    login: vi.fn(), 
    loginWithGoogle: vi.fn(),
    signup: vi.fn(),
    resetPassword: vi.fn(),
    updateUserProfile: vi.fn(),
    logout: vi.fn(),
    deleteAccount: vi.fn()
  }),
}));

vi.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: MockComp,
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

vi.mock('./hooks/useNotifications', () => ({
  useNotifications: () => ({
    alerts: [],
    pushNotification: vi.fn(),
  }),
}));

vi.mock('./hooks/useCrowdAnalysis', () => ({
  useCrowdAnalysis: () => ({
    status: { gate1: 'low', gate2: 'medium', gate3: 'low', gate4: 'low', food: 'medium' },
    currentInsight: 'No congestion',
    geminiInsight: {
      congestion: 'Smooth flow expected',
      suggestion: 'Proceed to Gate 1',
      waitTime: '2 mins'
    },
    isGeminiLoading: false,
    lastSync: new Date()
  }),
}));

vi.mock('./services/analytics', () => ({
  trackPageView: vi.fn(),
  trackEvent: vi.fn(),
}));
