import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginLdap, getAccessRoutes } from '@/api/auth';
import { setCredentials, setAccessRoutes } from '@/slices/authSlice';
import { type LoginInput, type LoginResponse } from '@/api/schemas/authSchema';
import { useToast } from '@/components/ui/toaster';
import { ROUTES } from '@/config/routes';
import { AccessRoute } from '@/types/permissions';

export const useLdapLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: loginLdap,
    onSuccess: async (data) => {
      const token = data.access_token.accessToken;
      if (!token) {
        throw new Error('Token not found in login response');
      }

      dispatch(
        setCredentials({
          token: token,
          refreshToken: data.refresh_token,
          user: {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email || undefined,
            username: data.user.username,
          },
          fullResponse: data,
          expiresIn: data.access_token.expiresIn,
        }),
      );

      // Fetch access routes after successful login
      // Token is already set in storage by setCredentials, so apiClient will use it
      try {
        const accessRoutes = await getAccessRoutes();
        // Store access routes in Redux state
        dispatch(setAccessRoutes(accessRoutes));

        // Check if user has dashboard permission
        const routes = accessRoutes?.data || [];
        const hasDashboard = routes.some(
          (route: AccessRoute) =>
            route.action === 'admin.dashboard' ||
            route.action === 'partner.dashboard' ||
            route.action === 'web.dashboard',
        );

        toast({
          title: 'Login successful',
          description: `Welcome back, ${data.user.name}!`,
          variant: 'default',
        });

        // Only redirect to dashboard if user has permission
        if (hasDashboard) {
          navigate(ROUTES.DASHBOARD);
        } else {
          // User has no dashboard access, they'll see only logout in sidebar
          // Still navigate to dashboard but it will show "no access" message
          navigate(ROUTES.DASHBOARD);
        }
      } catch (error) {
        // Log error but don't block login flow
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to fetch access routes:',
          error instanceof Error ? error.message : String(error),
        );

        toast({
          title: 'Login successful',
          description: `Welcome back, ${data.user.name}!`,
          variant: 'default',
        });

        // Navigate to dashboard even if access routes fetch failed
        navigate(ROUTES.DASHBOARD);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.message || 'Invalid credentials. Please try again.';
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
};
