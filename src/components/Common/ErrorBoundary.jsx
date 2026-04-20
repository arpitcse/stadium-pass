import React from 'react';
import { logger } from '../../utils/logger';

/**
 * Global Error Boundary Component
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Provides a "Premium Fallback" experience to the user.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry or Firebase Crashlytics
    logger.error("[Global Error Boundary] Caught error:", error, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05070a] px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-white/40 max-w-sm mb-8 leading-relaxed">
            FlowPass encountered an unexpected rendering error. We've logged the incident and are working on it.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20"
          >
            Refresh Application
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-left">
              <p className="text-[10px] font-mono text-red-400 break-all">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
