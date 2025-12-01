import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRoles,
  getRole,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  addPermissionToRole,
  type Role,
  type RoleWithPermissions,
  type CreateRoleInput,
  type UpdateRoleInput,
  type AddPermissionToRoleInput,
} from '@/api/authorization';
import { useToast } from '@/components/ui/toaster';

export const useRoles = () => {
  return useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
};

export const useRole = (id: number) => {
  return useQuery<Role, Error>({
    queryKey: ['role', id],
    queryFn: () => getRole(id),
    enabled: !!id,
  });
};

export const useRoleWithPermissions = (id: number) => {
  return useQuery<RoleWithPermissions, Error>({
    queryKey: ['roleWithPermissions', id],
    queryFn: () => getRoleWithPermissions(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Role, Error, CreateRoleInput>({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Success',
        description: 'Role created successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create role',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Role, Error, { id: number; data: UpdateRoleInput }>({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
      toast({
        title: 'Success',
        description: 'Role updated successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete role',
        variant: 'destructive',
      });
    },
  });
};

export const useAddPermissionToRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, AddPermissionToRoleInput>({
    mutationFn: addPermissionToRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.role_id] });
      toast({
        title: 'Success',
        description: 'Permissions added to role successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add permissions to role',
        variant: 'destructive',
      });
    },
  });
};
