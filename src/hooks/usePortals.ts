import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPortals,
  getPortal,
  createPortal,
  updatePortal,
  deletePortal,
  type Portal,
  type CreatePortalInput,
} from '@/api/authorization';
import { useToast } from '@/components/ui/toaster';

export const usePortals = () => {
  return useQuery<Portal[], Error>({
    queryKey: ['portals'],
    queryFn: getPortals,
  });
};

export const usePortal = (id: number) => {
  return useQuery<Portal, Error>({
    queryKey: ['portal', id],
    queryFn: () => getPortal(id),
    enabled: !!id,
  });
};

export const useCreatePortal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Portal, Error, CreatePortalInput>({
    mutationFn: createPortal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portals'] });
      toast({
        title: 'Success',
        description: 'Portal created successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create portal',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePortal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    Portal,
    Error,
    { id: number; data: Partial<CreatePortalInput> }
  >({
    mutationFn: ({ id, data }) => updatePortal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portals'] });
      queryClient.invalidateQueries({ queryKey: ['portal', variables.id] });
      toast({
        title: 'Success',
        description: 'Portal updated successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update portal',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePortal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationFn: deletePortal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portals'] });
      toast({
        title: 'Success',
        description: 'Portal deleted successfully',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete portal',
        variant: 'destructive',
      });
    },
  });
};
