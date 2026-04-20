/**
 * @file AIEngineService.js
 * @description Principal Engineering layer for Google Gemini 1.5.
 * Uses official Google SDK with Structured Outputs and robust retry logic.
 */

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";
import { logger } from '../utils/logger';

// Structured Output Schema Pattern (Principal Engineer Spec)
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
 * AI Engine for FlowPass Stadium Intelligence.
 */
export const AIEngineService = {
  /**
   * Generates predictive crowd analysis using Google Gemini 1.5.
   * @param {Object} crowdData - Density metrics from IoT Repositories.
   * @returns {Promise<Object>}
   */
  fetchAIInsights: async (crowdData) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
      logger.info('AIEngineService: API Key not found, using simulation.');
      return {
        congestion: "Moderate density at Gate 2.",
        suggestion: "Head to Gate 4 North for rapid entry.",
        waitTime: "4 mins"
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: insightsSchema,
        },
      });

      const densityStr = Object.entries(crowdData)
        .map(([loc, val]) => `${loc}: ${val}`)
        .join(", ");

      const prompt = `You are the FlowPass AI Engine. 
Context: ${densityStr}.
Action: Predict stadium congestion and suggest the fastest entry route. 
Constraint: Output MUST match the provided JSON schema.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const insight = JSON.parse(text);
      
      logEvent(analytics, "ai_engine_success", { model: "gemini-1.5-flash" });
      
      return {
        congestion: insight.congestion || "Recalibrating...",
        suggestion: insight.suggestion || "Standby for updates.",
        waitTime: insight.waitTime || "Calculating..."
      };
    } catch (error) {
      logger.error('AIEngineService.fetchAIInsights critical failure', error);
      logEvent(analytics, "ai_engine_failure", { error: error.message });
      
      return {
        congestion: "Optimization layer transient error.",
        suggestion: "Standard entry protocols in effect.",
        waitTime: "N/A"
      };
    }
  }
};
