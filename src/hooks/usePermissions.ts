import { useQuery } from '@tanstack/react-query';
import {
  getPermissions,
  getPermission,
  type Permission,
} from '@/api/authorization';

export const usePermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
};

export const usePermission = (id: number) => {
  return useQuery<Permission, Error>({
    queryKey: ['permission', id],
    queryFn: () => getPermission(id),
    enabled: !!id,
  });
};
