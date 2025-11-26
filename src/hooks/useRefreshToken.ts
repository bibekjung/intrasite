/**
 * Hook for manual token refresh (if needed)
 * Usually tokens refresh automatically, but this can be used for proactive refresh
 */

import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { refreshAccessToken } from '@/api/auth';
import { getRefreshToken } from '@/utils/tokenStorage';
import { updateTokens } from '@/slices/authSlice';
import { useToast } from '@/components/ui/toaster';

export const useRefreshToken = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (refreshToken?: string) => {
      const token = refreshToken || getRefreshToken();
      if (!token) {
        throw new Error('No refresh token available');
      }
      return refreshAccessToken(token);
    },
    onSuccess: (data) => {
      dispatch(
        updateTokens({
          token: data.access_token.accessToken,
          refreshToken: data.refresh_token,
          expiresIn: data.access_token.expiresIn,
        }),
      );

      toast({
        title: 'Token refreshed',
        description: 'Your session has been extended.',
        variant: 'default',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Token refresh failed',
        description: error.message || 'Please login again.',
        variant: 'destructive',
      });
    },
  });
};
