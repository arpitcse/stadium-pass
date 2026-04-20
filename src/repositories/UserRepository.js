/**
 * @file UserRepository.js
 * @description Repository for managing user data in Firestore.
 */

import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { logger } from '../utils/logger';

/**
 * Repository for User profile operations.
 */
export const UserRepository = {
  /**
   * Retrieves a user document by its UID.
   * @param {string} uid 
   * @returns {Promise<Object|null>} User data or null if not found.
   */
  getUserById: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      logger.error('UserRepository.getUserById failed', error);
      throw error;
    }
  },

  /**
   * Creates or overwrites a user profile.
   * @param {string} uid 
   * @param {Object} userData 
   * @returns {Promise<void>}
   */
  saveUser: async (uid, userData) => {
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      logger.error('UserRepository.saveUser failed', error);
      throw error;
    }
  },

  /**
   * Updates specific fields in a user profile.
   * @param {string} uid 
   * @param {Object} updates 
   * @returns {Promise<void>}
   */
  updateUserFields: async (uid, updates) => {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      logger.error('UserRepository.updateUserFields failed', error);
      throw error;
    }
  },

  /**
   * Deletes a user document.
   * @param {string} uid 
   * @returns {Promise<void>}
   */
  deleteUserDoc: async (uid) => {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (error) {
      logger.error('UserRepository.deleteUserDoc failed', error);
      throw error;
    }
  }
};
