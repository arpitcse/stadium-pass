/**
 * Centralized logging utility for FlowPass.
 * Ensures structured logs and environment-aware logging levels.
 */

const isDev = import.meta.env.MODE === 'development';

export const logger = {
  info: (message, meta = {}) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, meta);
    }
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  error: (message, error = null, meta = {}) => {
    console.error(`[ERROR] ${message}`, { error, ...meta });
  },
  debug: (message, meta = {}) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }
};
