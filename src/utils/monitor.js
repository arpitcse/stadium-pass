/**
 * @file monitor.js
 * @description Cloud-spec Observability utility.
 * Simulates Structured Logging for Google Cloud Operations Suite (formerly Stackdriver).
 */

const IS_PROD = import.meta.env.PROD;

export const monitor = {
  /**
   * Logs a structured event.
   * In local/dev, it prints to console. In simulated prod, it tracks globally.
   */
  logEvent: (name, metadata = {}) => {
    const payload = {
      event: name,
      timestamp: new Date().toISOString(),
      severity: 'INFO',
      ...metadata
    };

    if (!IS_PROD) {
      console.log(`[CLOUD MONITOR] ${name}`, payload);
    }
    
    // Logic for actual Cloud Logging would go here (e.g. Google Cloud SDK)
  },

  /**
   * Specifically tracks performance metrics.
   */
  logMetric: (metricName, value, unit = 'ms') => {
    if (!IS_PROD) {
      console.log(`[PERF MONITOR] ${metricName}: ${value}${unit}`);
    }
  },

  /**
   * Logs errors with high severity for alerting.
   */
  logError: (name, error, metadata = {}) => {
    const payload = {
      error: name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      ...metadata
    };

    console.error(`[ALERT MONITOR] ${name}`, payload);
  }
};
