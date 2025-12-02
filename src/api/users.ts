import { AxiosError } from 'axios';
import { apiClient } from './auth';
import { API_ENDPOINTS } from '@/config/apiConfig';

/**
 * User types and interfaces
 */
export interface UserRole {
  id: number;
  portal_id: number;
  role: string;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    user_id: number;
    role_id: number;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export interface AdminUser {
  id: number;
  guid?: string;
  domain?: string;
  ldap_dn?: string;
  name: string;
  email?: string | null;
  username: string;
  status?: string;
  last_login_at?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  two_factor_secret?: string | null;
  two_factor_recovery_codes?: string | null;
  two_factor_confirmed_at?: string | null;
  roles?: UserRole[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedUsersResponse {
  current_page: number;
  data: AdminUser[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

/**
 * User API functions
 */
export const getAllUsers = async (
  page: number = 1,
): Promise<PaginatedUsersResponse> => {
  try {
    const response = await apiClient.get<{
      error: boolean;
      message: string;
      data: PaginatedUsersResponse;
    }>(API_ENDPOINTS.ADMIN_USERS.LIST, {
      params: {
        page,
      },
    });

    // Extract the nested data property
    if (response.data?.data) {
      return response.data.data;
    }

    // Fallback: if response.data is already the paginated response
    return response.data as unknown as PaginatedUsersResponse;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch users'
        : 'Failed to fetch users';
    throw new Error(message);
  }
};

export const getUser = async (id: number): Promise<AdminUser> => {
  try {
    const endpoint = API_ENDPOINTS.ADMIN_USERS.GET.replace(':id', String(id));
    const response = await apiClient.get(endpoint);
    return response.data?.data || response.data;
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to fetch user'
        : 'Failed to fetch user';
    throw new Error(message);
  }
};

export interface AssignRolesToUserInput {
  user_id: number;
  role_id: number[];
}

export const assignRolesToUser = async (
  data: AssignRolesToUserInput,
): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.ADMIN_USERS.ASSIGN_ROLES, data);
  } catch (error: unknown) {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to assign roles to user'
        : 'Failed to assign roles to user';
    throw new Error(message);
  }
};
