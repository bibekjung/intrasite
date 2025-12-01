import { ReactNode } from 'react';
import { useHasPermission } from '@/hooks/usePermissionCheck';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user permissions
 * @param permission - The permission action to check
 * @param children - Content to render if user has permission
 * @param fallback - Optional content to render if user doesn't have permission (default: null)
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const hasPermission = useHasPermission(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
