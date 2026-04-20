/**
 * @file AnalysisRepository.js
 * @description Repository for stadium crowd and analysis data.
 */

import { doc, onSnapshot, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

/**
 * Repository for Stadium Density and Analysis data.
 */
export const AnalysisRepository = {
  /**
   * Subscribes to real-time congestion updates.
   * @param {function(Object): void} callback - Handler for incoming data.
   * @returns {import('firebase/auth').Unsubscribe}
   */
  subscribeToCongestion: (callback) => {
    const docRef = doc(db, 'stadium', 'congestion');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        // Initialize if missing
        setDoc(docRef, {
          levels: { gate1: 'low', gate2: 'medium', gate3: 'low', gate4: 'low', food: 'medium' },
          lastUpdated: new Date().toISOString()
        });
      }
    }, (error) => {
      logger.error('AnalysisRepository.subscribeToCongestion subscription error', error);
    });
  },

  /**
   * Updates stadium density levels.
   * @param {Object} levels - { gate1, gate2, ... }
   * @returns {Promise<void>}
   */
  updateCongestionLevels: async (levels) => {
    try {
      const docRef = doc(db, 'stadium', 'congestion');
      await updateDoc(docRef, {
        levels,
        lastUpdated: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      logger.error('AnalysisRepository.updateCongestionLevels failed', error);
      throw error;
    }
  }
};
