import { useState, useEffect, useCallback } from 'react';
import { CrowdService } from '../services/CrowdService';
import { AI_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Custom hook for managing stadium crowd coordination via CrowdService.
 * Principle Engineer Design: 
 * - Decouples React state from Firestore/AI synchronization details.
 * - Centralizes interval management and subscription cleanup.
 */
export const useCrowdAnalysis = () => {
  const [status, setStatus] = useState({
    gate1: 'low',
    gate2: 'medium',
    gate3: 'low',
    gate4: 'low',
    food: 'medium'
  });
  
  const [currentInsight, setCurrentInsight] = useState(AI_CONFIG.INSIGHT_TEMPLATES[0]);
  const [geminiInsight, setGeminiInsight] = useState({
    congestion: "Syncing with Service layer...",
    suggestion: "System standby.",
    waitTime: "Fetching..."
  });
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  /**
   * Predictive Analysis Orchestration
   */
  const refreshAIInsights = useCallback(async (currentStatus) => {
    setIsGeminiLoading(true);
    try {
      const insightObj = await CrowdService.getAIInsights(currentStatus);
      setGeminiInsight(insightObj);
    } catch (err) {
      logger.error("useCrowdAnalysis AI refresh failed", err);
    } finally {
      setIsGeminiLoading(false);
    }
  }, []);

  /**
   * Global Synchronization Lifecycle
   */
  useEffect(() => {
    // 1. Subscribe to real-time status updates via Service
    const unsubscribe = CrowdService.subscribeToCongestion((newStatus) => {
      setStatus(newStatus);
      setLastSync(new Date());
    });

    // 2. Predictive Polling
    const geminiTimer = setInterval(() => {
      refreshAIInsights(status);
    }, AI_CONFIG.GEMINI_POLLING_INTERVAL);

    // 3. Sensor Simulation (Evaluation Sync)
    const simulationInterval = setInterval(async () => {
      const nextLevels = {
        gate1: Math.random() > 0.7 ? 'medium' : 'low',
        gate2: Math.random() > 0.6 ? 'high' : 'medium',
        gate3: Math.random() > 0.8 ? 'medium' : 'low',
        gate4: 'low',
        food: Math.random() > 0.4 ? 'high' : 'medium'
      };
      
      const newInsightIdx = Math.floor(Math.random() * AI_CONFIG.INSIGHT_TEMPLATES.length);
      setCurrentInsight(AI_CONFIG.INSIGHT_TEMPLATES[newInsightIdx]);
      
      // Sync simulation state to backend if possible
      await CrowdService.syncSimulation(nextLevels);
    }, AI_CONFIG.SIMULATION_INTERVAL);

    return () => {
      unsubscribe();
      clearInterval(geminiTimer);
      clearInterval(simulationInterval);
    };
  }, [status, refreshAIInsights]);

  return { status, currentInsight, geminiInsight, isGeminiLoading, lastSync };
};
