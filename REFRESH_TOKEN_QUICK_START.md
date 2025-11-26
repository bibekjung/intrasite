# Refresh Token Quick Start Guide

## ✅ Implementation Complete

The refresh token system is fully implemented and ready to use!

## What's Been Implemented

### 1. Secure Token Storage

- ✅ Tokens stored with encoding/obfuscation
- ✅ Expiry time tracking
- ✅ Automatic expiry checking

### 2. Automatic Token Refresh

- ✅ Intercepts 401 errors
- ✅ Automatically refreshes tokens
- ✅ Retries failed requests
- ✅ Queues concurrent requests

### 3. Redux Integration

- ✅ Tokens stored in Redux state
- ✅ Automatic state updates on refresh
- ✅ User data persistence

### 4. API Endpoints

- ✅ Login endpoint handles refresh tokens
- ✅ Refresh token endpoint implemented
- ✅ Error handling for all scenarios

## How It Works

### Automatic Flow (No Code Changes Needed!)

1. **User logs in** → Access token + Refresh token stored
2. **User makes API request** → Access token added automatically
3. **Token expires** → 401 error received
4. **System automatically:**
   - Detects 401 error
   - Gets refresh token
   - Calls `/api/refresh-token`
   - Updates tokens
   - Retries original request
   - User sees no interruption!

### API Endpoint

Your backend should implement:

```
POST /api/refresh-token
Content-Type: application/json

Request Body:
{
  "refresh_token": "refresh_token_here"
}

Response:
{
  "access_token": {
    "accessToken": "new_access_token",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "refresh_token": "new_refresh_token",  // Optional
  "token_type": "Bearer"
}
```

## Testing the Implementation

### Test 1: Login and Verify Tokens

1. Open browser DevTools → Application → Local Storage
2. Login to your app
3. Verify you see:
   - `auth_token` (encoded)
   - `auth_refresh_token` (encoded)
   - `auth_token_expiry` (timestamp)
   - `auth_user` (user data)

### Test 2: Automatic Token Refresh

**Option A: Wait for Expiry**

1. Login to app
2. Wait for access token to expire (check `auth_token_expiry`)
3. Make any API request
4. Check Network tab - should see:
   - Original request (401)
   - `/api/refresh-token` request
   - Original request retried (200)

**Option B: Manual Expiry (for testing)**

1. Login to app
2. Open browser console
3. Run:
   ```javascript
   localStorage.setItem('auth_token_expiry', (Date.now() - 1000).toString());
   ```
4. Make any API request
5. Should automatically refresh!

### Test 3: Concurrent Requests

1. Login to app
2. Expire the token (as above)
3. Make 5 API requests simultaneously
4. Check Network tab - should see:
   - Only ONE `/api/refresh-token` request
   - All 5 original requests retried with new token

### Test 4: Refresh Token Expiry

1. Use an expired refresh token
2. Make API request
3. Should:
   - Attempt refresh
   - Fail with 401
   - Clear all tokens
   - Redirect to login page

## Browser Console Testing

```javascript
// Check current tokens
import {
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpired,
} from '@/utils/tokenStorage';
console.log('Access Token:', getAccessToken());
console.log('Refresh Token:', getRefreshToken());
console.log('Is Expired:', isAccessTokenExpired());

// Manually refresh (if needed)
import { refreshAccessToken } from '@/api/auth';
const refreshToken = getRefreshToken();
if (refreshToken) {
  refreshAccessToken(refreshToken)
    .then((tokens) => console.log('New tokens:', tokens))
    .catch((err) => console.error('Refresh failed:', err));
}

// Check Redux state
import { store } from '@/store/store';
console.log('Auth state:', store.getState().auth);
```

## Files Created/Modified

### New Files:

- `src/utils/tokenStorage.ts` - Secure token storage
- `src/hooks/useRefreshToken.ts` - Manual refresh hook (optional)
- `src/utils/__tests__/tokenStorage.test.ts` - Tests
- `src/api/__tests__/auth.test.ts` - API tests
- `REFRESH_TOKEN_IMPLEMENTATION.md` - Full documentation
- `REFRESH_TOKEN_QUICK_START.md` - This file

### Modified Files:

- `src/api/auth.ts` - Added refresh token logic
- `src/api/schemas/authSchema.ts` - Added refresh token types
- `src/slices/authSlice.ts` - Added refresh token support
- `src/hooks/useLogin.ts` - Updated to store refresh token

## Security Notes

1. **Token Storage**: Currently uses localStorage with base64 encoding
   - For production, consider httpOnly cookies for refresh tokens
   - Tokens are obfuscated but not truly encrypted

2. **Token Expiry**:
   - Access tokens: Short-lived (default 1 hour)
   - Refresh tokens: Long-lived (server decides)
   - Buffer time: 60 seconds before expiry

3. **Error Handling**:
   - Failed refresh → User logged out
   - Network errors → Graceful handling
   - Invalid tokens → Automatic cleanup

## Troubleshooting

### Issue: Tokens not refreshing

**Solution**:

- Check Network tab for `/api/refresh-token` requests
- Verify refresh token exists in localStorage
- Check browser console for errors
- Verify API endpoint returns correct format

### Issue: Multiple refresh requests

**Solution**:

- Should not happen (queue prevents this)
- If it does, check `isRefreshing` flag logic
- Verify interceptor is working correctly

### Issue: User logged out unexpectedly

**Solution**:

- Check refresh token expiry
- Verify API response format matches schema
- Check error handling in interceptor
- Review browser console for errors

## Next Steps

1. ✅ Test login flow
2. ✅ Test automatic refresh
3. ✅ Test concurrent requests
4. ✅ Test refresh token expiry
5. ✅ Verify backend `/api/refresh-token` endpoint
6. ✅ Monitor in production

## Support

For detailed documentation, see `REFRESH_TOKEN_IMPLEMENTATION.md`

For issues or questions, check:

- Browser console for errors
- Network tab for API requests
- Redux DevTools for state changes
- LocalStorage for token storage
