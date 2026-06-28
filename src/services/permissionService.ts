import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { 
  PermissionResponse, 
  CreatePermissionRequest, 
  UpdatePermissionRequest 
} from '@/types/permission';

const API_URL = '/permissions';

export const permissionService = {

  getAllPermissions: async (): Promise<ApiResponse<PermissionResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<PermissionResponse[]>>(API_URL);
    return response.data;
  },


  createPermission: async (data: CreatePermissionRequest): Promise<ApiResponse<PermissionResponse>> => {
    const response = await axiosClient.post<ApiResponse<PermissionResponse>>(API_URL, data);
    return response.data;
  },

  updatePermission: async (id: number, data: UpdatePermissionRequest): Promise<ApiResponse<PermissionResponse>> => {
    const response = await axiosClient.put<ApiResponse<PermissionResponse>>(`${API_URL}/${id}`, data);
    return response.data;
  },

  deletePermission: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${id}`);
    return response.data;
  }
};