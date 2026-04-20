import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIEngineService } from '../AIEngineService';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from '../../utils/logger';

// Comprehensive Mocks for the Google AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => JSON.stringify({
                congestion: "Smooth flow at all gates",
                suggestion: "Proceed to Gate 1",
                waitTime: "2 mins"
              })
            }
          })
        })
      };
    }),
    SchemaType: {
      OBJECT: 'OBJECT',
      STRING: 'STRING'
    }
  };
});

vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }
}));

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../../firebase', () => ({
  analytics: {}
}));

describe('AIEngineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    import.meta.env.VITE_GEMINI_API_KEY = "test_key";
  });

  const mockCrowdData = {
    gate1: "low",
    gate2: "high"
  };

  it('should return simulation data if API key is placeholders', async () => {
    import.meta.env.VITE_GEMINI_API_KEY = "your_gemini_api_key_here";
    
    const result = await AIEngineService.fetchAIInsights(mockCrowdData);
    expect(result.congestion).toBe("Moderate density at Gate 2.");
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('using simulation'));
  });

  it('should successfully parse valid JSON from Gemini SDK', async () => {
    const mockResponseText = JSON.stringify({
      congestion: "Smooth flow at all gates",
      suggestion: "Proceed to Gate 1",
      waitTime: "2 mins"
    });

    const mockGenerateContent = vi.fn().mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const mockGetModel = vi.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });

    GoogleGenerativeAI.mockImplementation(function() {
      return {
        getGenerativeModel: mockGetModel
      };
    });

    const result = await AIEngineService.fetchAIInsights(mockCrowdData);

    expect(result.congestion).toBe("Smooth flow at all gates");
    expect(result.waitTime).toBe("2 mins");
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it('should return fallback data on SDK crash', async () => {
    GoogleGenerativeAI.mockImplementation(function() {
      throw new Error("SDK Init Failed");
    });

    const result = await AIEngineService.fetchAIInsights(mockCrowdData);

    expect(result.congestion).toBe("Optimization layer transient error.");
    expect(logger.error).toHaveBeenCalled();
  });

  it('should handle malformed JSON response from the model', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({
      response: {
        text: () => "This is not JSON"
      }
    });

    GoogleGenerativeAI.mockImplementation(function() {
      return {
        getGenerativeModel: () => ({
          generateContent: mockGenerateContent
        })
      };
    });

    const result = await AIEngineService.fetchAIInsights(mockCrowdData);
    
    expect(result.congestion).toBe("Optimization layer transient error.");
    expect(logger.error).toHaveBeenCalled();
  });
});
