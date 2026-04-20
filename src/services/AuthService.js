/**
 * @file AuthService.js
 * @description Domain logic service for Authentication and Identity.
 */

import { AuthRepository } from '../repositories/AuthRepository';
import { UserRepository } from '../repositories/UserRepository';
import { logger } from '../utils/logger';

/**
 * Service for managing authentication business logic.
 */
export const AuthService = {
  /**
   * Monitor auth state and enrich with user profile data.
   * @param {function(Object|null): void} onUserChange 
   */
  subscribeToUser: (onUserChange) => {
    return AuthRepository.onAuthStateChanged(async (authUser) => {
      if (!authUser) {
        onUserChange(null);
        return;
      }

      try {
        const enrichedUser = await UserRepository.getUserById(authUser.uid);
        onUserChange({ ...authUser, ...enrichedUser, isGuest: false });
      } catch (error) {
        logger.error('AuthService.subscribeToUser enrichment failed', error);
        onUserChange({ ...authUser, isGuest: false });
      }
    });
  },

  /**
   * Orchestrates the registration of a new user.
   * @param {string} displayName 
   * @param {string} email 
   * @param {string} password 
   * @param {string} avatarUrl - Optional override.
   */
  registerUser: async (displayName, email, password, avatarUrl = '') => {
    const userCredential = await AuthRepository.signUpWithEmail(email, password);
    const user = userCredential.user;

    const photoURL = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
    
    // 1. Update Auth Profile
    await AuthRepository.updateUserProfile(user, { displayName, photoURL });

    // 2. Persist to Firestore
    await UserRepository.saveUser(user.uid, {
      displayName,
      email,
      photoURL,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      sessionActive: true
    });

    return { ...user, displayName, photoURL };
  },

  /**
   * Orchestrates login and profile update.
   */
  login: async (email, password) => {
    const result = await AuthRepository.signInWithEmail(email, password);
    const user = result.user;

    // Update session status
    await UserRepository.updateUserFields(user.uid, {
      lastLogin: new Date().toISOString(),
      sessionActive: true
    });

    return user;
  },

  /**
   * Google Sign-In logic with automatic profile creation.
   */
  loginWithGoogle: async () => {
    const result = await AuthRepository.signInWithGoogle();
    const user = result.user;

    const existingProfile = await UserRepository.getUserById(user.uid);

    if (!existingProfile) {
      await UserRepository.saveUser(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        sessionActive: true
      });
    } else {
      await UserRepository.updateUserFields(user.uid, {
        lastLogin: new Date().toISOString(),
        sessionActive: true
      });
    }

    return user;
  },

  /**
   * Guest session management for high-speed evaluation.
   */
  loginAsGuest: async () => {
    const guestUser = {
      name: "Guest User",
      email: "guest@flowpass.com",
      displayName: "Guest User",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
      uid: "guest-eval-123",
      isGuest: true
    };
    
    // Log Guest Session (Atomic operation)
    // No dedicated repository needed for one-off logs, but we use UserRepository for consistency
    // However, guest sessions are mostly local for eval speed.
    localStorage.setItem("flowpass_guest", JSON.stringify(guestUser));
    return guestUser;
  },

  /**
   * Secure logout with session cleanup.
   */
  logout: async (currentUser) => {
    if (currentUser?.isGuest) {
      localStorage.removeItem('flowpass_guest');
      return;
    }

    if (currentUser?.uid) {
      try {
        await UserRepository.updateUserFields(currentUser.uid, { sessionActive: false });
      } catch (e) {
        logger.warn('Failed to mark session inactive during logout', e);
      }
    }

    await AuthRepository.signOut();
  },

  /**
   * Complete account erasure for data privacy compliance.
   */
  deleteAccount: async (user) => {
    if (user.isGuest) {
      localStorage.removeItem('flowpass_guest');
      return;
    }

    // 1. Delete Firestore Data
    await UserRepository.deleteUserDoc(user.uid);
    // 2. Delete Auth User
    await AuthRepository.deleteUser(user);
  }
};
