import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AccessRoute } from '@/types/permissions';

/**
 * Get access routes array from the auth state
 */
const getAccessRoutesArray = (accessRoutes: unknown): AccessRoute[] => {
  if (!accessRoutes) {
    return [];
  }

  // Handle AccessRoutesResponse structure { error, message, data: [...] }
  if (
    typeof accessRoutes === 'object' &&
    accessRoutes !== null &&
    'data' in accessRoutes &&
    Array.isArray((accessRoutes as { data: unknown }).data)
  ) {
    return (accessRoutes as { data: AccessRoute[] }).data;
  }

  // Handle direct array
  if (Array.isArray(accessRoutes)) {
    return accessRoutes as AccessRoute[];
  }

  return [];
};

/**
 * Hook to check if user has a specific permission/action
 * @param action - The permission action to check (e.g., 'admin.create-role')
 * @returns boolean indicating if user has the permission
 */
export const useHasPermission = (action: string): boolean => {
  const { accessRoutes } = useSelector((state: RootState) => state.auth);
  const routes = getAccessRoutesArray(accessRoutes);
  return routes.some((route: AccessRoute) => route.action === action);
};

/**
 * Hook to get all user permissions
 * @returns Array of permission actions the user has access to
 */
export const useUserPermissions = (): string[] => {
  const { accessRoutes } = useSelector((state: RootState) => state.auth);
  const routes = getAccessRoutesArray(accessRoutes);
  return routes.map((route: AccessRoute) => route.action);
};

/**
 * Hook to check multiple permissions at once
 * @param actions - Array of permission actions to check
 * @param requireAll - If true, user must have all permissions. If false, user needs at least one (default: false)
 * @returns boolean indicating if user has the required permissions
 */
export const useHasPermissions = (
  actions: string[],
  requireAll: boolean = false,
): boolean => {
  const { accessRoutes } = useSelector((state: RootState) => state.auth);
  const routes = getAccessRoutesArray(accessRoutes);
  const userActions = routes.map((route) => route.action);

  if (requireAll) {
    return actions.every((action) => userActions.includes(action));
  }

  return actions.some((action) => userActions.includes(action));
};
