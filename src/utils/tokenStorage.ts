/**
 * Secure token storage utility
 * Implements best practices for storing tokens in the browser
 */

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

/**
 * Simple encryption/obfuscation for tokens (not true encryption, but adds a layer)
 * In production, consider using httpOnly cookies for refresh tokens
 */
const encodeToken = (token: string): string => {
  // Simple base64 encoding with a prefix to identify encoded tokens
  // In a real production app, you might want to use a more secure method
  return btoa(token);
};

const decodeToken = (encodedToken: string): string => {
  try {
    return atob(encodedToken);
  } catch {
    return encodedToken; // Fallback if decoding fails
  }
};

/**
 * Store access token securely
 */
export const setAccessToken = (token: string, expiresIn?: number): void => {
  try {
    const encodedToken = encodeToken(token);
    localStorage.setItem(ACCESS_TOKEN_KEY, encodedToken);

    // Store expiry time if provided
    if (expiresIn) {
      const expiryTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error storing access token:', error);
    throw new Error('Failed to store access token');
  }
};

/**
 * Get access token
 */
export const getAccessToken = (): string | null => {
  try {
    const encodedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!encodedToken) return null;
    return decodeToken(encodedToken);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Store refresh token securely
 */
export const setRefreshToken = (token: string): void => {
  try {
    const encodedToken = encodeToken(token);
    localStorage.setItem(REFRESH_TOKEN_KEY, encodedToken);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error storing refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  try {
    const encodedToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!encodedToken) return null;
    return decodeToken(encodedToken);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Check if access token is expired or about to expire
 * @param bufferSeconds - Number of seconds before expiry to consider token expired (default: 60)
 */
export const isAccessTokenExpired = (bufferSeconds: number = 60): boolean => {
  try {
    const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTimeStr) return true; // No expiry info, consider expired

    const expiryTime = parseInt(expiryTimeStr, 10);
    const now = Date.now();
    const buffer = bufferSeconds * 1000;

    return now >= expiryTime - buffer;
  } catch {
    return true; // On error, consider expired
  }
};

/**
 * Clear all tokens
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Check if user has valid tokens
 */
export const hasValidTokens = (): boolean => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  return !!(accessToken && refreshToken && !isAccessTokenExpired());
};
