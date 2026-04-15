import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout & Components
import { TopNavbar } from './components/TopNavbar';
import { BottomNav } from './components/BottomNav';

// Pages
// Pages (Lazy Loaded)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const NavigationScreen = lazy(() => import('./pages/NavigationScreen').then(m => ({ default: m.NavigationScreen })));
const QueueHub = lazy(() => import('./pages/QueueHub').then(m => ({ default: m.QueueHub })));
const TicketScreen = lazy(() => import('./pages/TicketScreen').then(m => ({ default: m.TicketScreen })));
const LoginScreen = lazy(() => import('./pages/LoginScreen').then(m => ({ default: m.LoginScreen })));
const SignupScreen = lazy(() => import('./pages/SignupScreen').then(m => ({ default: m.SignupScreen })));
const RecoveryScreen = lazy(() => import('./pages/RecoveryScreen').then(m => ({ default: m.RecoveryScreen })));
const ProfileScreen = lazy(() => import('./pages/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const SplashScreen = lazy(() => import('./pages/SplashScreen').then(m => ({ default: m.SplashScreen })));

const PAGE_VARIANTS = {
  initial: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    filter: 'blur(10px)'
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)'
  },
  exit: (direction) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
    filter: 'blur(10px)'
  }),
};

const AUTH_VARIANTS = {
  initial: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d < 0 ? 60 : -60, opacity: 0 }),
};

const TAB_ORDER = ['home', 'map', 'queue', 'ticket', 'profile'];

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [direction, setDirection] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState('login'); 
  const [authDir, setAuthDir] = useState(1);

  const switchTo = useCallback((view) => {
    const views = ['recovery', 'login', 'signup'];
    const oldIdx = views.indexOf(authView);
    const newIdx = views.indexOf(view);
    setAuthDir(newIdx > oldIdx ? 1 : -1);
    setAuthView(view);
  }, [authView]);

  const handleSwitchToSignup = useCallback(() => switchTo('signup'), [switchTo]);
  const handleSwitchToLogin = useCallback(() => switchTo('login'), [switchTo]);
  const handleSwitchToRecovery = useCallback(() => switchTo('recovery'), [switchTo]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = useCallback((newTab) => {
    const prevIndex = TAB_ORDER.indexOf(activeTab);
    const nextIndex = TAB_ORDER.indexOf(newTab);
    setDirection(nextIndex > prevIndex ? 1 : -1);
    setActiveTab(newTab);
  }, [activeTab]);

  if (showSplash) return (
    <Suspense fallback={<div className="h-screen w-full bg-[#05070a]" />}>
      <SplashScreen />
    </Suspense>
  );

  if (!currentUser) {
    return (
      <div className="h-screen w-full bg-transparent overflow-y-auto">
        <TopNavbar activeTab={activeTab} />
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#05070a]/50 backdrop-blur-md" />}>
          <AnimatePresence mode="wait" custom={authDir}>
            <motion.div
              key={authView}
              custom={authDir}
              variants={AUTH_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {authView === 'login' && <LoginScreen onSwitch={handleSwitchToSignup} onRecover={handleSwitchToRecovery} />}
              {authView === 'signup' && <SignupScreen onSwitch={handleSwitchToLogin} />}
              {authView === 'recovery' && <RecoveryScreen onSwitch={handleSwitchToLogin} />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard key="home" onNavigate={handleTabChange} />;
      case 'map': return <NavigationScreen key="map" />;
      case 'queue': return <QueueHub key="queue" />;
      case 'ticket': return <TicketScreen key="ticket" />;
      case 'profile': return <ProfileScreen key="profile" />;
      default: return <Dashboard key="home" onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-transparent overflow-hidden flex flex-col items-center relative">
      <TopNavbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="w-full h-full max-w-7xl relative flex flex-col">
        <main
          className="flex-1 w-full relative overflow-y-auto no-scrollbar scroll-smooth"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <Suspense fallback={<div className="flex-1 w-full flex items-center justify-center min-h-[50vh]" />}>
              <motion.div
                key={activeTab}
                custom={direction}
                variants={PAGE_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  filter: { duration: 0.2 }
                }}
                className="w-full px-6 pt-24 pb-48"
              >
                {renderContent()}
              </motion.div>
            </Suspense>
          </AnimatePresence>
        </main>

        <div className="fixed bottom-10 left-0 right-0 md:hidden flex justify-center px-6 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        </div>
      </div>

      {/* Atmospheric Decorations */}
      <div className="fixed top-[-10%] left-[-5%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}

// Performance optimized using memoization and lazy loading
const AppContentMemo = React.memo(AppContent);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContentMemo />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
