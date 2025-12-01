import { useQuery } from '@tanstack/react-query';
import { getPermissions, type Permission } from '@/api/authorization';

/**
 * Hook to fetch all permissions from the API
 * This is used for displaying/managing permissions in the Permission Management page
 */
export const usePermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
};
