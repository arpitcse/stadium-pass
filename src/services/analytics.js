/**
 * Analytics Service
 * Centralized wrapper for Google Analytics (GA4/gtag.js) and Firebase Analytics.
 * Ensures consistent event tracking across the application.
 */
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";
import { logger } from "../utils/logger";

/**
 * Centralized Event Tracking Utility
 * Dispatches analytic signals to both GA4 (gtag.js) and Firebase Analytics SDK.
 * 
 * @param {string} eventName - Semantic name of the event (e.g., 'navigate_clicked').
 * @param {Object} [params={}] - Key-value pair metadata to attach for granular analysis.
 * @returns {void}
 */
export const trackEvent = (eventName, params = {}) => {
  // 1. GA4 (Global Site Tag)
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  // 2. Firebase Analytics
  if (analytics) {
    logEvent(analytics, eventName, params);
  }

  // Debug log (can be disabled in production)
  logger.debug(`[Analytics] ${eventName}:`, params);
};

/**
 * Tracking page views
 * @param {string} pageTitle - Title of the page/tab
 * @param {string} pagePath - Path or tab ID
 */
export const trackPageView = (pageTitle, pagePath) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }

  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle,
      page_path: pagePath
    });
  }
};
