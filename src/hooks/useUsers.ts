import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllUsers,
  getUser,
  assignRolesToUser,
  type AssignRolesToUserInput,
} from '@/api/users';
import { useToast } from '@/components/ui/toaster';

export const useUsers = (page: number = 1) => {
  const { toast } = useToast();

  return useQuery({
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

  return useQuery({
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

export const useAssignRolesToUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, AssignRolesToUserInput>({
    mutationFn: assignRolesToUser,
    onSuccess: (_, variables) => {
      // Invalidate users queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.user_id] });
      toast({
        title: 'Success',
        description: 'Roles assigned to user successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign roles to user',
        variant: 'destructive',
      });
    },
  });
};
