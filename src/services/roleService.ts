import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type {
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest
} from '@/types/role';

export const roleService = {

  getAllRoles: async (): Promise<ApiResponse<RoleResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<RoleResponse[]>>('/roles');
    return response.data;
  },

  getRoleById: async (id: number): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.get<ApiResponse<RoleResponse>>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.post<ApiResponse<RoleResponse>>('/roles', data);
    return response.data;
  },

  updateRole: async (id: number, data: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.put<ApiResponse<RoleResponse>>(`/roles/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/roles/${id}`);
    return response.data;
  }
};