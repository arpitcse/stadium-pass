/**
 * @file CrowdService.js
 * @description Service for managing stadium crowd business logic and AI coordination.
 */

import { AnalysisRepository } from '../repositories/AnalysisRepository';
import { GeminiService } from '../services/GeminiService';
import { AI_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Service for Stadium Crowd analysis.
 */
export const CrowdService = {
  /**
   * Monitor real-time congestion and update state.
   */
  subscribeToCongestion: (onStatusChange) => {
    return AnalysisRepository.subscribeToCongestion((data) => {
      if (data && data.levels) {
        onStatusChange(data.levels);
      }
    });
  },

  /**
   * Fetch predictive AI insights based on current status.
   * @param {Object} currentLevels 
   * @returns {Promise<Object>}
   */
  getAIInsights: async (currentLevels) => {
    try {
      const insights = await GeminiService.fetchAIInsights(currentLevels);
      return insights;
    } catch (error) {
      logger.error('CrowdService.getAIInsights failed', error);
      throw error;
    }
  },

  /**
   * Pushes simulated data to the backend for visualization purposes.
   * @param {Object} levels 
   */
  syncSimulation: async (levels) => {
    try {
      await AnalysisRepository.updateCongestionLevels(levels);
    } catch (error) {
       // Log but don't break UI for simulation failures
       logger.warn('Simulation sync failed', error);
    }
  }
};
