/**
 * @file authRepository.js
 * @description Lead Architect Grade Functional Repository for Authentication.
 * Handles primary OAuth, Registration, and Session persistence logic.
 */

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  deleteUser as deleteAuthUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, provider } from '../firebase';
import { logger } from '../utils/logger';

// --- Internal Utilities ---

const syncUserProfile = async (uid, userData) => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    ...userData,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

const fetchProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// --- Exported Functional Logic ---

/**
 * Monitors Authentication state changes and enriches user context.
 */
export const subscribeToAuth = (onUserChange) => {
  return onAuthStateChanged(auth, async (authUser) => {
    if (!authUser) {
      onUserChange(null);
      return;
    }

    try {
      const profile = await fetchProfile(authUser.uid);
      onUserChange({ 
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || profile?.displayName,
        photoURL: authUser.photoURL || profile?.photoURL,
        ...profile,
        isGuest: false 
      });
    } catch (error) {
      logger.error('authRepository: Profiling enrichment failed', error);
      onUserChange({ uid: authUser.uid, email: authUser.email, isGuest: false });
    }
  });
};

/**
 * Secure Session Registration
 */
export const register = async (displayName, email, password, avatarUrl) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    const photoURL = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;

    await updateProfile(user, { displayName, photoURL });
    await syncUserProfile(user.uid, {
      displayName,
      email,
      photoURL,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      sessionActive: true
    });

    return { uid: user.uid, email, displayName, photoURL };
  } catch (error) {
    logger.error('authRepository: Registration failed', error);
    throw error;
  }
};

/**
 * Standard Email/Password Login
 */
export const login = async (email, password) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date().toISOString(),
      sessionActive: true,
      updatedAt: serverTimestamp()
    });

    return user;
  } catch (error) {
    logger.error('authRepository: Login failed', error);
    throw error;
  }
};

/**
 * Google Identity Provider Integration
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const profile = await fetchProfile(user.uid);

    if (!profile) {
      await syncUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        sessionActive: true
      });
    } else {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString(),
        sessionActive: true,
        updatedAt: serverTimestamp()
      });
    }

    return user;
  } catch (error) {
    logger.error('authRepository: Google OAuth failed', error);
    throw error;
  }
};

/**
 * Guest Session (Local Persistence)
 */
export const createGuestSession = async () => {
  const guestUser = {
    displayName: "Guest User",
    email: "guest@flowpass.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
    uid: "guest-eval-123",
    isGuest: true
  };
  localStorage.setItem("flowpass_guest_session", JSON.stringify(guestUser));
  return guestUser;
};

/**
 * Secure Termination
 */
export const terminateSession = async (user) => {
  if (user?.isGuest) {
    localStorage.removeItem("flowpass_guest_session");
    return;
  }

  if (user?.uid) {
    try {
      await updateDoc(doc(db, 'users', user.uid), { 
        sessionActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      logger.warn('authRepository: Failed to mark session inactive', e);
    }
  }
  await signOut(auth);
};

/**
 * Identity Erasure
 */
export const eraseIdentity = async (user) => {
  if (user?.isGuest) {
    localStorage.removeItem("flowpass_guest_session");
    return;
  }
  await deleteDoc(doc(db, 'users', user.uid));
  await deleteAuthUser(auth.currentUser);
};
