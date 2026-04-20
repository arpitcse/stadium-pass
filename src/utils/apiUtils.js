import { logger } from './logger';

/**
 * Enhanced fetch request with an internal timeout mechanism.
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Handles fetch logic with configurable retries and timeout for resilient API handling.
 * @param {string} url - Target URL path or endpoint.
 * @param {Object} options - Standard fetch options (method, headers, body, etc.).
 * @param {number} retries - Number of total retry attempts (excluding original).
 * @param {number} delay - Base delay in milliseconds between retries (uses exponential backoff).
 * @param {number} timeout - Request timeout limit in milliseconds.
 * @returns {Promise<Response>} Resolves with fetch response if successful.
 * @throws {Error} Final error if all retries fail.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000, timeout = 5000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (attempt === retries) {
        logger.error(`API Request failed after ${retries} retries`, error, { url });
        throw error;
      }
      
      const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
      logger.warn(`API attempt ${attempt + 1} failed. Retrying in ${waitTime}ms`, { url, error: error.message });
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
