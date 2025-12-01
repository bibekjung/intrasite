import { useQuery } from '@tanstack/react-query';
import {
  getAllUsers,
  getUser,
  type AdminUser,
  type PaginatedUsersResponse,
} from '@/api/users';
import { useToast } from '@/components/ui/toaster';

export const useUsers = (page: number = 1) => {
  const { toast } = useToast();

  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ['users', page],
    queryFn: () => getAllUsers(page),
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch users',
        variant: 'destructive',
      });
    },
  });
};

export const useUser = (id: number) => {
  const { toast } = useToast();

  return useQuery<AdminUser, Error>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch user',
        variant: 'destructive',
      });
    },
  });
};
