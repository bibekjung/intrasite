# Refresh Token Implementation

This document describes the robust refresh token implementation for secure authentication.

## Overview

The refresh token implementation provides:

- **Secure token storage** with encoding/obfuscation
- **Automatic token refresh** on 401 errors
- **Queue management** to prevent multiple simultaneous refresh requests
- **Redux state synchronization** for token updates
- **Token expiry management** with configurable buffer time

## Architecture

### 1. Token Storage (`src/utils/tokenStorage.ts`)

Secure utility for storing and retrieving tokens:

- `setAccessToken(token, expiresIn?)` - Store access token with optional expiry
- `getAccessToken()` - Retrieve access token
- `setRefreshToken(token)` - Store refresh token
- `getRefreshToken()` - Retrieve refresh token
- `isAccessTokenExpired(bufferSeconds?)` - Check if token is expired
- `clearTokens()` - Clear all tokens
- `hasValidTokens()` - Check if valid tokens exist

**Security Features:**

- Base64 encoding for token obfuscation
- Expiry time tracking
- Configurable buffer time before expiry

### 2. API Client (`src/api/auth.ts`)

Enhanced with automatic token refresh:

**Key Features:**

- Request interceptor: Automatically adds access token to requests
- Response interceptor: Handles 401 errors and triggers token refresh
- Queue management: Prevents multiple simultaneous refresh requests
- Redux integration: Updates store when tokens are refreshed

**Refresh Token Flow:**

1. API request fails with 401
2. Check if refresh token exists
3. If refreshing, queue the request
4. Call `/api/refresh-token` endpoint
5. Update tokens in storage and Redux
6. Retry original request with new token
7. Process queued requests

### 3. Auth Slice (`src/slices/authSlice.ts`)

Redux slice updated to handle refresh tokens:

- `setCredentials` - Store tokens and user data
- `updateTokens` - Update tokens after refresh
- `clearAuth` - Clear all auth data

### 4. API Endpoints

#### Login Endpoint

```
POST /api/ldap-login
Request: { username, password, portal }
Response: {
  access_token: { accessToken, expiresIn, ... },
  refresh_token: string,
  user: { ... }
}
```

#### Refresh Token Endpoint

```
POST /api/refresh-token
Request: { refresh_token: string }
Response: {
  access_token: { accessToken, expiresIn, ... },
  refresh_token?: string,  // Optional new refresh token
  token_type: string
}
```

## Usage

### Login Flow

```typescript
import { useLdapLogin } from '@/hooks/useLogin';

const { mutate: login } = useLdapLogin();

login({
  username: 'user@example.com',
  password: 'password',
  portal: 'portal-name',
});
```

The login hook automatically:

- Stores access token and refresh token securely
- Updates Redux state
- Handles token expiry

### Automatic Token Refresh

Token refresh happens automatically when:

- Access token expires (based on expiry time)
- API request receives 401 Unauthorized
- Token is within buffer period (default: 60 seconds)

No manual intervention required!

### Manual Token Refresh (if needed)

```typescript
import { refreshAccessToken } from '@/api/auth';
import { getRefreshToken } from '@/utils/tokenStorage';

const refreshToken = getRefreshToken();
if (refreshToken) {
  const newTokens = await refreshAccessToken(refreshToken);
  // Tokens are automatically stored and Redux is updated
}
```

## Testing

### Manual Testing Steps

1. **Login Test:**
   - Login with valid credentials
   - Verify tokens are stored in localStorage (encoded)
   - Check Redux state has tokens and user data

2. **Token Refresh Test:**
   - Wait for access token to expire (or manually expire it)
   - Make an API request
   - Verify automatic refresh happens
   - Check new tokens are stored
   - Verify original request succeeds

3. **Concurrent Requests Test:**
   - Make multiple API requests simultaneously
   - Let access token expire
   - Verify only one refresh request is made
   - Verify all requests are retried with new token

4. **Refresh Token Expiry Test:**
   - Use expired refresh token
   - Verify user is logged out
   - Verify redirect to login page

### Browser Console Testing

```javascript
// Check tokens
import {
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
} from '@/utils/tokenStorage';
console.log('Access Token:', getAccessToken());
console.log('Refresh Token:', getRefreshToken());
console.log('Is Expired:', isAccessTokenExpired());

// Test refresh
import { refreshAccessToken } from '@/api/auth';
const refreshToken = getRefreshToken();
if (refreshToken) {
  refreshAccessToken(refreshToken).then(console.log).catch(console.error);
}
```

## Security Best Practices

1. **Token Storage:**
   - Tokens are base64 encoded (not true encryption, but adds obfuscation)
   - Consider httpOnly cookies for refresh tokens in production
   - Never log tokens in production

2. **Token Expiry:**
   - Access tokens have short expiry (default: 1 hour)
   - Refresh tokens should have longer expiry
   - Buffer time prevents race conditions

3. **Error Handling:**
   - Failed refresh attempts log out user
   - Network errors are handled gracefully
   - User is redirected to login on auth failure

4. **Request Queue:**
   - Prevents multiple refresh requests
   - Ensures all requests get new token
   - Handles concurrent API calls

## Configuration

### Token Expiry Buffer

Default buffer is 60 seconds. To change:

```typescript
import { isAccessTokenExpired } from '@/utils/tokenStorage';

// Check with custom buffer (30 seconds)
const isExpired = isAccessTokenExpired(30);
```

### API Timeout

Default timeout is 30 seconds. Configured in `apiClient`:

```typescript
export const apiClient = axios.create({
  timeout: 30000, // 30 seconds
});
```

## Troubleshooting

### Tokens not refreshing

- Check browser console for errors
- Verify refresh token exists: `localStorage.getItem('auth_refresh_token')`
- Check network tab for `/api/refresh-token` requests
- Verify API endpoint is correct

### Multiple refresh requests

- Check `isRefreshing` flag logic
- Verify queue processing
- Check for race conditions

### User logged out unexpectedly

- Check refresh token expiry
- Verify API response format
- Check error handling in interceptor

## Future Enhancements

1. **True Encryption:**
   - Use Web Crypto API for token encryption
   - Implement key rotation

2. **HttpOnly Cookies:**
   - Store refresh tokens in httpOnly cookies
   - More secure than localStorage

3. **Token Rotation:**
   - Rotate refresh tokens on each use
   - Implement refresh token family tracking

4. **Offline Support:**
   - Queue requests when offline
   - Retry when connection restored
