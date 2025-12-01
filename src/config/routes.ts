/**
 * Route Configuration
 * Centralized route definitions for the application
 * Use these constants instead of hardcoded strings
 */

export const ROUTES = {
  // Public routes
  LOGIN: '/',
  HOME: '/dashboard',

  // Main routes
  DASHBOARD: '/dashboard',
  NID_SEARCH: '/nid-search',
  DIRECTORY: '/directory',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  RESET_PASSWORD: '/reset-password',
  POLICIES: '/policies',
  USERS: '/users',

  // Authorization routes
  AUTHORIZATION: {
    BASE: '/authorization',
    PORTALS: '/authorization/portals',
    ROLES: '/authorization/roles',
    ROLE_EDIT: (id: number | string) => `/authorization/roles/${id}/edit`,
    PERMISSIONS: '/authorization/permissions',
  },
} as const;

/**
 * Helper function to build authorization routes
 */
export const getAuthorizationRoute = {
  portals: () => ROUTES.AUTHORIZATION.PORTALS,
  roles: () => ROUTES.AUTHORIZATION.ROLES,
  roleEdit: (id: number | string) => ROUTES.AUTHORIZATION.ROLE_EDIT(id),
  permissions: () => ROUTES.AUTHORIZATION.PERMISSIONS,
};
