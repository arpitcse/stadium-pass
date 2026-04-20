import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../AuthService';
import { AuthRepository } from '../../repositories/AuthRepository';
import { UserRepository } from '../../repositories/UserRepository';

// Mock dependencies
vi.mock('../../repositories/AuthRepository');
vi.mock('../../repositories/UserRepository');
vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should successfully register a user and create a profile', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      AuthRepository.signUpWithEmail.mockResolvedValue({ user: mockUser });
      AuthRepository.updateUserProfile.mockResolvedValue();
      UserRepository.saveUser.mockResolvedValue();

      const result = await AuthService.registerUser('Test User', 'test@example.com', 'password123');

      expect(AuthRepository.signUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(AuthRepository.updateUserProfile).toHaveBeenCalledWith(mockUser, expect.objectContaining({
        displayName: 'Test User'
      }));
      expect(UserRepository.saveUser).toHaveBeenCalledWith('123', expect.objectContaining({
        displayName: 'Test User',
        email: 'test@example.com'
      }));
      expect(result.uid).toBe('123');
    });

    it('should propagate errors from AuthRepository', async () => {
      AuthRepository.signUpWithEmail.mockRejectedValue(new Error('Auth failed'));
      
      await expect(AuthService.registerUser('Test', 'email', 'pass')).rejects.toThrow('Auth failed');
    });
  });

  describe('loginAsGuest', () => {
    it('should return a guest user and persist to localStorage', async () => {
      const result = await AuthService.loginAsGuest();
      
      expect(result.isGuest).toBe(true);
      expect(result.uid).toBe('guest-eval-123');
      expect(localStorage.getItem('flowpass_guest')).toContain('Guest User');
    });
  });

  describe('logout', () => {
    it('should sign out and update user fields for non-guests', async () => {
      const mockUser = { uid: '123', isGuest: false };
      AuthRepository.signOut.mockResolvedValue();
      UserRepository.updateUserFields.mockResolvedValue();

      await AuthService.logout(mockUser);

      expect(UserRepository.updateUserFields).toHaveBeenCalledWith('123', { sessionActive: false });
      expect(AuthRepository.signOut).toHaveBeenCalled();
    });

    it('should only clear localStorage for guests', async () => {
      const mockGuest = { uid: 'guest-123', isGuest: true };
      localStorage.setItem('flowpass_guest', 'data');

      await AuthService.logout(mockGuest);

      expect(localStorage.getItem('flowpass_guest')).toBeNull();
      expect(AuthRepository.signOut).not.toHaveBeenCalled();
    });
  });
});
