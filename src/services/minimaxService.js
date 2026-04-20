import { MINIMAX_CONFIG } from '../config/constants';
import { fetchWithTimeout } from '../utils/apiUtils';
import { logger } from '../utils/logger';

const API_URL = "https://api.minimax.io/v1/chat/completions";

/**
 * Sends a conversation history to MiniMax and retrieves a response.
 * @param {Array} messages - Array of message objects {role, content}
 * @returns {Promise<string>} The AI's response text.
 */
export async function fetchChatCompletion(messages) {
  const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY;

  if (!MINIMAX_API_KEY || MINIMAX_API_KEY === "your_minimax_api_key_here") {
    // Graceful fallback for demo purposes
    await new Promise(r => setTimeout(r, 1000));
    return "I'm the Smart Buddy assistant! Currently, I'm in simulation mode because your MiniMax API Key isn't configured in .env.local. However, once connected, I can help you navigate the stadium in real-time!";
  }

  try {
    const response = await fetchWithTimeout(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MINIMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: MINIMAX_CONFIG.MODEL,
        messages: [
          { role: "system", content: MINIMAX_CONFIG.SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_completion_tokens: 500
      })
    }, 8000); // 8-second timeout for chat completions

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "MiniMax API Error");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn't process that. Could you rephrase?";
  } catch (error) {
    logger.error("MiniMax Chat Failed:", error);
    return "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment! 🏟️";
  }
}
