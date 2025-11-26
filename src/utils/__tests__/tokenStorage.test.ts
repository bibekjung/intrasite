/**
 * Tests for token storage utility
 * Run with: npm test or pnpm test (if vitest is configured)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
  isAccessTokenExpired,
  hasValidTokens,
} from '../tokenStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Token Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Access Token', () => {
    it('should store and retrieve access token', () => {
      const token = 'test-access-token-123';
      setAccessToken(token);
      const retrieved = getAccessToken();
      expect(retrieved).toBe(token);
    });

    it('should store access token with expiry', () => {
      const token = 'test-access-token-123';
      const expiresIn = 3600; // 1 hour
      setAccessToken(token, expiresIn);
      const retrieved = getAccessToken();
      expect(retrieved).toBe(token);
    });

    it('should return null if no access token exists', () => {
      const retrieved = getAccessToken();
      expect(retrieved).toBeNull();
    });
  });

  describe('Refresh Token', () => {
    it('should store and retrieve refresh token', () => {
      const token = 'test-refresh-token-456';
      setRefreshToken(token);
      const retrieved = getRefreshToken();
      expect(retrieved).toBe(token);
    });

    it('should return null if no refresh token exists', () => {
      const retrieved = getRefreshToken();
      expect(retrieved).toBeNull();
    });
  });

  describe('Token Expiry', () => {
    it('should return true if token is expired', () => {
      const token = 'test-token';
      // Set token with expiry in the past
      setAccessToken(token, -100); // Expired 100 seconds ago
      expect(isAccessTokenExpired()).toBe(true);
    });

    it('should return false if token is not expired', () => {
      const token = 'test-token';
      setAccessToken(token, 3600); // Expires in 1 hour
      expect(isAccessTokenExpired()).toBe(false);
    });

    it('should return true if no expiry info exists', () => {
      const token = 'test-token';
      setAccessToken(token); // No expiry provided
      expect(isAccessTokenExpired()).toBe(true);
    });

    it('should consider token expired if within buffer period', () => {
      const token = 'test-token';
      // Set token to expire in 30 seconds (within 60 second buffer)
      setAccessToken(token, 30);
      expect(isAccessTokenExpired(60)).toBe(true);
    });
  });

  describe('Clear Tokens', () => {
    it('should clear all tokens', () => {
      setAccessToken('access-token');
      setRefreshToken('refresh-token');
      clearTokens();
      expect(getAccessToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe('Has Valid Tokens', () => {
    it('should return true if valid tokens exist', () => {
      setAccessToken('access-token', 3600);
      setRefreshToken('refresh-token');
      expect(hasValidTokens()).toBe(true);
    });

    it('should return false if access token is missing', () => {
      setRefreshToken('refresh-token');
      expect(hasValidTokens()).toBe(false);
    });

    it('should return false if refresh token is missing', () => {
      setAccessToken('access-token', 3600);
      expect(hasValidTokens()).toBe(false);
    });

    it('should return false if access token is expired', () => {
      setAccessToken('access-token', -100);
      setRefreshToken('refresh-token');
      expect(hasValidTokens()).toBe(false);
    });
  });
});
