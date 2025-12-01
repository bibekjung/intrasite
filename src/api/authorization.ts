import { AxiosError } from 'axios';
import { apiClient } from './auth';
import { API_ENDPOINTS, buildApiUrl } from '@/config/apiConfig';

/**
 * Role types and interfaces
 */
export interface Role {
  id: number;
  portal_id: number;
  role: string;
  created_at?: string;
  updated_at?: string;
  portal?: Portal;
}

export interface RoleWithPermissions extends Role {
  permissions?: Permission[];
}

export interface CreateRoleInput {
  portal_id: number;
  role: string;
}

export interface Portal {
  id: number;
  code: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePortalInput {
  code: string;
}

export interface UpdateRoleInput {
  name?: string;
  slug?: string;
  description?: string;
  permission_ids?: number[];
}

export interface AddPermissionToRoleInput {
  role_id: number;
  permission_id: number[];
}

export interface Permission {
  id: number;
  portal_id: number;
  action: string;
  resources: string;
  method: string;
  created_at?: string;
  updated_at?: string;
  portal?: Portal;
  pivot?: {
    role_id: number;
    permission_id: number;
    created_at?: string;
    updated_at?: string;
  };
}

/**
 * Role API functions
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.ROLES.LIST);
    return response.data?.data || response.data || [];
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch roles'
        : 'Failed to fetch roles';
    throw new Error(message);
  }
};

export const getRole = async (id: number): Promise<Role> => {
  try {
    const endpoint = API_ENDPOINTS.ROLES.GET.replace(':id', String(id));
    const response = await apiClient.get(endpoint);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch role'
        : 'Failed to fetch role';
    throw new Error(message);
  }
};

export const getRoleWithPermissions = async (
  id: number,
): Promise<RoleWithPermissions> => {
  try {
    const endpoint = API_ENDPOINTS.ROLES.GET_WITH_PERMISSIONS.replace(
      ':id',
      String(id),
    );
    const response = await apiClient.get(endpoint);
    // API returns data as an array, get the first item
    const data = response.data?.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    // Fallback if data is not an array
    return data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message ||
          'Failed to fetch role with permissions'
        : 'Failed to fetch role with permissions';
    throw new Error(message);
  }
};

export const createRole = async (data: CreateRoleInput): Promise<Role> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.ROLES.CREATE, data);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to create role'
        : 'Failed to create role';
    throw new Error(message);
  }
};

export const updateRole = async (
  id: number,
  data: UpdateRoleInput,
): Promise<Role> => {
  try {
    const endpoint = API_ENDPOINTS.ROLES.UPDATE.replace(':id', String(id));
    const response = await apiClient.put(endpoint, data);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to update role'
        : 'Failed to update role';
    throw new Error(message);
  }
};

export const deleteRole = async (id: number): Promise<void> => {
  try {
    const endpoint = API_ENDPOINTS.ROLES.DELETE.replace(':id', String(id));
    await apiClient.delete(endpoint);
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to delete role'
        : 'Failed to delete role';
    throw new Error(message);
  }
};

/**
 * Permission API functions
 */

export const getPermissions = async (): Promise<Permission[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS.LIST);
    return response.data?.data || response.data || [];
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch permissions'
        : 'Failed to fetch permissions';
    throw new Error(message);
  }
};

export const getPermission = async (id: number): Promise<Permission> => {
  try {
    const response = await apiClient.get(
      buildApiUrl(API_ENDPOINTS.PERMISSIONS.GET, { id }),
    );
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch permission'
        : 'Failed to fetch permission';
    throw new Error(message);
  }
};

export const addPermissionToRole = async (
  data: AddPermissionToRoleInput,
): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.PERMISSIONS.ADDPERMISSIONROLE, data);
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to add permissions to role'
        : 'Failed to add permissions to role';
    throw new Error(message);
  }
};

/**
 * Portal API functions
 */
export const getPortals = async (): Promise<Portal[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PORTAL.LIST);
    return response.data?.data || response.data || [];
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch portals'
        : 'Failed to fetch portals';
    throw new Error(message);
  }
};

export const getPortal = async (id: number): Promise<Portal> => {
  try {
    const response = await apiClient.get(
      buildApiUrl(API_ENDPOINTS.PORTAL.GET, { id }),
    );
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch portal'
        : 'Failed to fetch portal';
    throw new Error(message);
  }
};

export const createPortal = async (
  data: CreatePortalInput,
): Promise<Portal> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.PORTAL.CREATE, data);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to create portal'
        : 'Failed to create portal';
    throw new Error(message);
  }
};

export const updatePortal = async (
  id: number,
  data: Partial<CreatePortalInput>,
): Promise<Portal> => {
  try {
    const response = await apiClient.put(
      buildApiUrl(API_ENDPOINTS.PORTAL.UPDATE, { id }),
      data,
    );
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to update portal'
        : 'Failed to update portal';
    throw new Error(message);
  }
};

export const deletePortal = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(buildApiUrl(API_ENDPOINTS.PORTAL.DELETE, { id }));
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to delete portal'
        : 'Failed to delete portal';
    throw new Error(message);
  }
};
