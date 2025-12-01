/**
 * Permission/Access Route types
 */

export interface AccessRoute {
  id: number;
  action: string;
  uri: string;
  method: string;
}

export interface AccessRoutesResponse {
  error: boolean;
  message: string;
  data: AccessRoute[];
}
