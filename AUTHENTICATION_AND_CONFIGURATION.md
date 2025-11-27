# Authentication, Token Management, and Configuration Documentation

## Table of Contents

1. [LDAP Authentication Integration](#ldap-authentication-integration)
2. [Token Management System](#token-management-system)
3. [Proxy Configuration](#proxy-configuration)
4. [Environment Variables Setup](#environment-variables-setup)
5. [API Configuration](#api-configuration)
6. [Security Considerations](#security-considerations)

---

## LDAP Authentication Integration

### Overview

The application uses LDAP (Lightweight Directory Access Protocol) for user authentication. Users authenticate against an LDAP directory service, and upon successful authentication, receive access and refresh tokens.

### Authentication Flow

#### 1. Login Process

```
User Input → Frontend → Backend API → LDAP Server → Token Generation → Frontend Storage
```

**Step-by-step:**

1. User enters username and password on the login page
2. Frontend sends credentials to `/api/ldap-login` endpoint
3. Backend validates credentials against LDAP directory
4. Backend generates JWT access token and refresh token
5. Frontend receives tokens and stores them securely
6. User is redirected to dashboard

#### 2. Login Request Format

**Endpoint:** `POST /api/ldap-login`

**Request Body:**

```json
{
  "username": "user@example.com",
  "password": "userpassword",
  "portal": "partner"
}
```

**Response Structure:**

```json
{
  "error": false,
  "message": "Login Successful",
  "data": {
    "user": {
      "id": 3,
      "guid": "bb2f511f-7fa9-4b5a-a8e4-e23622629929",
      "domain": "testi.com",
      "ldap_dn": "CN=User Name,OU=Employees,DC=testi,DC=com",
      "name": "User Name",
      "email": "user@example.com",
      "username": "user",
      "status": "active",
      "last_login_at": "2025-11-26T10:00:32.000000Z",
      "email_verified_at": null,
      "created_at": "2025-11-16T05:14:47.000000Z",
      "updated_at": "2025-11-26T10:00:32.000000Z"
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "refresh_token": "def5020036a6141e2e7bd5d53eef518fcfa7b5a4...",
    "expires_in": 60,
    "token_type": "Bearer",
    "scope": "partner"
  }
}
```

#### 3. Logout Process

**Endpoint:** `POST /api/logout`

**Flow:**

1. Frontend calls logout API endpoint (destroys backend session)
2. Frontend clears all stored tokens from localStorage
3. Frontend clears Redux authentication state
4. User is redirected to login page

**Important:** The logout process always clears frontend state, even if the backend API call fails. This ensures users can always log out locally.

---

## Token Management System

### Token Types

#### 1. Access Token

- **Purpose:** Used to authenticate API requests
- **Lifetime:** Short-lived (typically 60 seconds, configurable)
- **Storage:** localStorage (Base64 encoded)
- **Format:** JWT (JSON Web Token)
- **Usage:** Included in `Authorization: Bearer <token>` header

#### 2. Refresh Token

- **Purpose:** Used to obtain new access tokens when the current one expires
- **Lifetime:** Long-lived (typically days/weeks)
- **Storage:** localStorage (Base64 encoded)
- **Format:** Opaque token string
- **Usage:** Sent to `/api/refresh-token` endpoint to get new access token

### Token Storage

#### Storage Location

Tokens are stored in browser's `localStorage` with the following keys:

- `auth_token` - Access token (Base64 encoded)
- `auth_refresh_token` - Refresh token (Base64 encoded)
- `auth_token_expiry` - Expiry timestamp (milliseconds)

#### Encoding/Decoding

Tokens are Base64 encoded before storage for basic obfuscation:

- **Encoding:** `btoa(token)` - Converts token to Base64
- **Decoding:** `atob(encodedToken)` - Converts Base64 back to token

**Example:**

```
Original Token: "def502008ad8..."
Encoded (stored): "ZGVmNTAyMDA4YWQ4..."
Decoded (retrieved): "def502008ad8..."
```

### Automatic Token Refresh

#### Proactive Refresh

The system proactively refreshes tokens before they expire:

- Checks token expiry before each API request
- Refreshes if token expires within 10 seconds (configurable buffer)
- Prevents failed requests due to expired tokens

#### Reactive Refresh (401 Handling)

If a request fails with 401 Unauthorized:

1. System detects 401 error
2. Checks if refresh token exists
3. Calls `/api/refresh-token` endpoint
4. Updates access token (and refresh token if new one provided)
5. Retries the original failed request
6. Processes any queued requests

#### Queue Management

- Prevents multiple simultaneous refresh requests
- Queues failed requests during token refresh
- Processes all queued requests after successful refresh

### Token Refresh Endpoint

**Endpoint:** `POST /api/refresh-token`

**Request Body:**

```json
{
  "refresh_token": "def5020036a6141e2e7bd5d53eef518fcfa7b5a4..."
}
```

**Response Structure:**

```json
{
  "access_token": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "expiresIn": 60,
    "tokenType": "Bearer"
  },
  "refresh_token": "def502003d720def733040dfd307fc14c6a0f08c73ce7c8759266c3cb7882250...",
  "token_type": "Bearer"
}
```

### Token Management Functions

#### Available Functions (`src/utils/tokenStorage.ts`)

**Storage Functions:**

- `setAccessToken(token, expiresIn?)` - Store access token with optional expiry
- `setRefreshToken(token)` - Store refresh token
- `getAccessToken()` - Retrieve and decode access token
- `getRefreshToken()` - Retrieve and decode refresh token
- `clearTokens()` - Remove all tokens from storage

**Validation Functions:**

- `isAccessTokenExpired(bufferSeconds?)` - Check if token is expired (default buffer: 60 seconds)
- `hasValidTokens()` - Check if both access and refresh tokens exist and are valid

---

## Proxy Configuration

### Development Proxy Setup

The application uses Vite's development server proxy to forward API requests to the backend server. This eliminates CORS issues during development.

#### Configuration Location

`vite.config.ts`

#### Proxy Settings

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://10.0.130.163:8000',  // Backend server URL
      changeOrigin: true,                   // Changes origin header
      secure: false,                        // Allow self-signed certificates
      rewrite: (path) => path,              // Keep path as-is
    },
  },
}
```

#### How It Works

1. **Development Mode:**
   - Frontend runs on `http://localhost:5173` (or Vite default port)
   - All requests to `/api/*` are proxied to the backend server
   - Example: `http://localhost:5173/api/ldap-login` → `http://10.0.130.163:8000/api/ldap-login`

2. **Production Mode:**
   - No proxy is used
   - Frontend makes direct requests to the backend URL specified in environment variables
   - Example: `https://api.example.com/api/ldap-login`

#### Proxy Target Configuration

The proxy target can be configured via environment variable:

- **Environment Variable:** `VITE_API_PROXY_TARGET`
- **Default:** `http://10.0.130.163:8000`
- **Example:** `VITE_API_PROXY_TARGET=http://localhost:8000`

---

## Environment Variables Setup

### Required Environment Variables

Create a `.env` file in the project root directory with the following variables:

#### Development Environment (`.env.development`)

```env
# API Configuration
VITE_API_BASE_URL=http://10.0.130.163:8000/api
VITE_API_PROXY_TARGET=http://10.0.130.163:8000

# Application Configuration
VITE_APP_NAME=INTRASITE
VITE_APP_ENV=development
```

#### Production Environment (`.env.production`)

```env
# API Configuration
VITE_API_BASE_URL=https://api.example.com/api
VITE_API_PROXY_TARGET=https://api.example.com

# Application Configuration
VITE_APP_NAME=INTRASITE
VITE_APP_ENV=production
```

### Environment Variable Usage

#### In Code

Environment variables are accessed using `import.meta.env`:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;
const mode = import.meta.env.MODE;
```

#### Important Notes

1. **Vite Prefix:** All environment variables must be prefixed with `VITE_` to be exposed to the client
2. **Security:** Never expose sensitive data (API keys, secrets) in client-side environment variables
3. **Build Time:** Environment variables are embedded at build time, not runtime
4. **Restart Required:** Changes to `.env` files require restarting the development server

### Environment Variable Priority

1. `.env.[mode].local` (highest priority, git-ignored)
2. `.env.local` (git-ignored)
3. `.env.[mode]` (e.g., `.env.development`)
4. `.env` (lowest priority)

### Example `.env` File Structure

```env
# ============================================
# API Configuration
# ============================================
# Base URL for API requests (production)
# In development, this is overridden by proxy
VITE_API_BASE_URL=http://10.0.130.163:8000/api

# Proxy target for development server
# Only used in development mode
VITE_API_PROXY_TARGET=http://10.0.130.163:8000

# ============================================
# Application Settings
# ============================================
VITE_APP_NAME=INTRASITE
VITE_APP_VERSION=1.0.0
```

---

## API Configuration

### Base URL Configuration

The API base URL is determined automatically based on the environment:

#### Development Mode

- Uses `/api` (relative path)
- Requests are proxied by Vite to the backend server
- No CORS issues

#### Production Mode

- Uses `VITE_API_BASE_URL` from environment variables
- Falls back to `http://10.0.130.163:8000/api` if not set
- Direct requests to backend server

### API Endpoints

All API endpoints are centralized in `src/config/apiConfig.ts`:

#### Authentication Endpoints

- `POST /api/ldap-login` - LDAP authentication
- `POST /api/refresh-token` - Refresh access token
- `POST /api/logout` - Logout user
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password

#### User Endpoints

- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/avatar` - Get user avatar

#### Other Endpoints

- Directory, NID Search, Settings, Documents endpoints

### Using API Endpoints in Code

```typescript
import { API_ENDPOINTS, buildApiUrl } from '@/config/apiConfig';

// Simple endpoint
const loginUrl = API_ENDPOINTS.AUTH.LOGIN; // '/ldap-login'

// Endpoint with parameters
const userUrl = buildApiUrl(API_ENDPOINTS.USER.PROFILE);
// Returns: '/api/user' (in dev) or 'http://api.example.com/api/user' (in prod)

// Endpoint with path parameters
const documentUrl = buildApiUrl(API_ENDPOINTS.DOCUMENTS.GET, { id: '123' });
// Returns: '/api/documents/123'
```

---

## Security Considerations

### Token Security

#### Current Implementation

- **Storage:** localStorage with Base64 encoding
- **Encoding:** Basic obfuscation (not encryption)
- **Lifetime:** Short-lived access tokens (60 seconds)

#### Security Best Practices

1. **Access Tokens:**
   - Short expiration time (60 seconds)
   - Automatically refreshed before expiry
   - Included in Authorization header

2. **Refresh Tokens:**
   - Long-lived but can be revoked
   - Stored securely in localStorage
   - Used only for token refresh, not for API calls

3. **Token Encoding:**
   - Base64 encoding provides basic obfuscation
   - Not true encryption (tokens can be decoded)
   - Consider httpOnly cookies for production

### Recommendations for Production

1. **Use httpOnly Cookies:**
   - Store refresh tokens in httpOnly cookies
   - Prevents XSS attacks from accessing tokens
   - Requires backend support

2. **Implement CSRF Protection:**
   - Use CSRF tokens for state-changing operations
   - Validate origin headers

3. **HTTPS Only:**
   - Always use HTTPS in production
   - Prevents token interception
   - Required for secure cookie transmission

4. **Token Rotation:**
   - Rotate refresh tokens on each use
   - Invalidate old refresh tokens
   - Implement token blacklisting

5. **Rate Limiting:**
   - Implement rate limiting on authentication endpoints
   - Prevent brute force attacks
   - Backend responsibility

### CORS Configuration

#### Development

- Proxy handles CORS automatically
- No CORS issues during development

#### Production

- Backend must configure CORS headers:
  ```
  Access-Control-Allow-Origin: https://your-frontend-domain.com
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Authorization, Content-Type
  Access-Control-Allow-Credentials: true
  ```

### Error Handling

#### Authentication Errors

- **401 Unauthorized:** Triggers automatic token refresh
- **403 Forbidden:** User lacks required permissions
- **Network Errors:** Graceful error messages to user

#### Token Refresh Failures

- If refresh fails, user is automatically logged out
- Frontend state is cleared
- User is redirected to login page

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors in Development

**Problem:** CORS errors when making API requests
**Solution:** Ensure proxy is configured correctly in `vite.config.ts` and development server is running

#### 2. Token Not Refreshing

**Problem:** Access token expires but doesn't refresh automatically
**Solution:**

- Check if refresh token exists in localStorage
- Verify `/api/refresh-token` endpoint is working
- Check browser console for errors

#### 3. Environment Variables Not Loading

**Problem:** Environment variables return `undefined`
**Solution:**

- Ensure variables are prefixed with `VITE_`
- Restart development server after changing `.env` file
- Check file is in project root directory

#### 4. Proxy Not Working

**Problem:** API requests fail in development
**Solution:**

- Verify `VITE_API_PROXY_TARGET` is set correctly
- Check backend server is running and accessible
- Review Vite server logs for proxy errors

#### 5. Tokens Not Persisting

**Problem:** User logged out after page refresh
**Solution:**

- Check localStorage is enabled in browser
- Verify tokens are being saved after login
- Check for errors in token storage functions

---

## Summary

### Key Points

1. **LDAP Authentication:** Users authenticate via LDAP, receive JWT tokens
2. **Token Management:** Automatic refresh with queue management for concurrent requests
3. **Proxy Configuration:** Vite proxy handles CORS in development
4. **Environment Variables:** Configure API URLs and settings via `.env` files
5. **Security:** Base64 encoding, short-lived tokens, automatic refresh

### File Locations

- **API Configuration:** `src/config/apiConfig.ts`
- **Token Storage:** `src/utils/tokenStorage.ts`
- **Authentication API:** `src/api/auth.ts`
- **Login Hook:** `src/hooks/useLogin.ts`
- **Logout Hook:** `src/hooks/useLogout.ts`
- **Proxy Config:** `vite.config.ts`
- **Environment:** `.env`, `.env.development`, `.env.production`

---

_Last Updated: November 2025_
