import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authRepository from '../repositories/authRepository';
import { logger } from '../utils/logger';

const AuthContext = createContext();

/**
 * Lead Architect Specs: Thin wrapper for Identity state distribution.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Principal Strategy: Delegate lifecycle purely to Repository
    const unsubscribe = authRepository.subscribeToAuth((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (displayName, email, password, avatarUrl) => {
    try {
      const user = await authRepository.register(displayName, email, password, avatarUrl);
      setCurrentUser(user);
      return user;
    } catch (error) {
      logger.error('AuthProvider.signup failed', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    return await authRepository.login(email, password);
  };

  const loginWithGoogle = async () => {
    return await authRepository.loginWithGoogle();
  };

  const loginAsGuest = async () => {
    const guestUser = await authRepository.createGuestSession();
    setCurrentUser(guestUser);
    return guestUser;
  };

  const logout = async () => {
    await authRepository.terminateSession(currentUser);
    setCurrentUser(null);
  };

  const updateUserProfile = async (updates) => {
    if (currentUser?.isGuest) throw new Error("Guest profiles are read-only.");
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const deleteAccount = async () => {
    await authRepository.eraseIdentity(currentUser);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    loginAsGuest,
    loginWithGoogle,
    logout,
    updateUserProfile,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
