/**
 * AI Service
 * Handles interactions with Google Gemini API for crowd analysis.
 * Refactored for maintainability and scalability.
 */
import { analytics } from '../firebase';
import { logEvent } from "firebase/analytics";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash";
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyzes stadium crowd density and suggests the best route using Google Gemini.
 * @param {Object} crowdData - Object containing gate status
 * @returns {Promise<string | null>} - AI Insight string or null for fallback
 */
// AI integration
// Improved readability and maintainability without altering functionality
export async function fetchAIInsights(crowdData) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    console.warn("Gemini API key missing or invalid. Triggering fallback simulation.");
    return null;
  }

  try {
    const statusSummary = Object.entries(crowdData)
      .map(([gate, level]) => `${gate}: ${level} density`)
      .join(", ");

    const prompt = `You are a smart stadium assistant. 
Current crowd density levels: ${statusSummary}. 
Analyze these patterns and suggest the best gate or route for a user. 
Provide a concise, friendly insight in one sentence (max 20 words).
Focus on speed and efficiency.`;

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const insight = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!insight) {
      throw new Error("Invalid or empty response structure from Gemini API");
    }

    logEvent(analytics, "ai_used");
    return insight.trim();
  } catch (error) {
    console.error("AI Insight fetch failed:", error.message);
    return null; // Ensure the UI can handle the fallback gracefully
  }
}
