import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authRepository from '../authRepository';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/auth');
vi.mock('firebase/firestore');
vi.mock('../../firebase', () => ({
  auth: {},
  db: {},
  provider: {}
}));

describe('authRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully create auth user and Firestore profile', async () => {
      const mockUser = { uid: '123', email: 'test@test.com' };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      setDoc.mockResolvedValue();

      const result = await authRepository.register('Test User', 'test@test.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', 'password123');
      expect(setDoc).toHaveBeenCalled();
      expect(result.uid).toBe('123');
    });
  });

  describe('login', () => {
    it('should authenticate user and update lastLogin', async () => {
      const mockUser = { uid: '123' };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      updateDoc.mockResolvedValue();

      const result = await authRepository.login('test@test.com', 'pass');

      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled();
      expect(result.uid).toBe('123');
    });
  });

  describe('guest sessions', () => {
    it('should create a local guest user session', async () => {
      const guest = await authRepository.createGuestSession();
      expect(guest.isGuest).toBe(true);
      expect(localStorage.getItem('flowpass_guest_session')).toContain('Guest User');
    });
  });
});
