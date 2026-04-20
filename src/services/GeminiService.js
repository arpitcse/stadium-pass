/**
 * @file GeminiService.js
 * @description Lead Architect Grade Service for Google Gemini 1.5.
 * Features: Exponential Backoff (429 handling), Structured Outputs (JSON Schema).
 */

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { monitor } from '../utils/monitor';
import { logger } from '../utils/logger';

// --- Structured Output Schema ---
const insightsSchema = {
  description: "Stadium Analysis Response",
  type: SchemaType.OBJECT,
  properties: {
    congestion: {
      type: SchemaType.STRING,
      description: "Brief summary of crowd density.",
    },
    suggestion: {
      type: SchemaType.STRING,
      description: "Recommended gate or route.",
    },
    waitTime: {
      type: SchemaType.STRING,
      description: "Human-readable wait time estimate (e.g. 5-10 mins).",
    }
  },
  required: ["congestion", "suggestion", "waitTime"],
};

/**
 * Exponential Backoff Utility for API Resiliency
 */
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      // 429 is often embedded in the error message for SDK
      const isRateLimit = error.message?.includes('429') || error.status === 429;
      
      if (!isRateLimit || retries === maxRetries - 1) throw error;
      
      const delay = initialDelay * Math.pow(2, retries);
      logger.warn(`GeminiService: Rate limit hit (429). Retrying in ${delay}ms...`, { retry: retries + 1 });
      await new Promise(r => setTimeout(r, delay));
      retries++;
    }
  }
};

export const GeminiService = {
  /**
   * Generates predictive crowd analysis using Google Gemini 1.5 Flash.
   */
  fetchAIInsights: async (crowdData) => {
    const startTime = Date.now();
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
      logger.info('GeminiService: Using simulation mode (no API key).');
      return {
        congestion: "Sample: Moderate density at Gate 2.",
        suggestion: "Sample: Proceed to Gate 4 North.",
        waitTime: "5 mins"
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: insightsSchema,
        },
      });

      const densityContext = Object.entries(crowdData)
        .map(([loc, val]) => `${loc}: ${val}`)
        .join(", ");

      const prompt = `Stadium Status: ${densityContext}. Predict congestion and suggest best route.`;

      const result = await retryWithBackoff(() => model.generateContent(prompt));
      const response = await result.response;
      const text = response.text();
      
      const insight = JSON.parse(text);
      
      // Observability: Metrics tracking
      monitor.logMetric('ai_latency', Date.now() - startTime);
      monitor.logEvent('ai_success', { model: 'gemini-1.5-flash' });

      return insight;
    } catch (error) {
      monitor.logError('ai_failed', error);
      logger.error('GeminiService: Critical failure', error);
      
      return {
        congestion: "Predictive layer temporarily unavailable.",
        suggestion: "Follow standard stadium signage.",
        waitTime: "N/A"
      };
    }
  }
};
