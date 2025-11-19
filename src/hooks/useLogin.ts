import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginLdap } from '@/api/auth';
import { setCredentials } from '@/slices/authSlice';
import { type LoginInput, type LoginResponse } from '@/api/schemas/authSchema';
import { useToast } from '@/components/ui/toaster';

export const useLdapLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: loginLdap,
    onSuccess: (data) => {
      // Extract token from access_token object
      const token = data.access_token.accessToken;

      if (!token) {
        throw new Error('Token not found in login response');
      }

      dispatch(
        setCredentials({
          token: token,
          user: {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email || undefined,
            username: data.user.username,
          },
          fullResponse: data,
        }),
      );

      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name}!`,
        variant: 'default',
      });

      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
