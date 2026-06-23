import { type PermissionResponse } from '../permission';

export interface RoleResponse {
  roleId: number;
  
  roleName: string;

  description?: string;
  
  createdAt: string;

  permissions: PermissionResponse[];
}