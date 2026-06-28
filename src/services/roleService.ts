import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type {
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest
} from '@/types/role';

const API_URL = '/roles';

export const roleService = {

  getAllRoles: async (): Promise<ApiResponse<RoleResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<RoleResponse[]>>(API_URL);
    return response.data;
  },

  getRoleById: async (id: number): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.get<ApiResponse<RoleResponse>>(`${API_URL}/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.post<ApiResponse<RoleResponse>>(API_URL, data);
    return response.data;
  },

  updateRole: async (id: number, data: UpdateRoleRequest): Promise<ApiResponse<RoleResponse>> => {
    const response = await axiosClient.put<ApiResponse<RoleResponse>>(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${id}`);
    return response.data;
  }
};