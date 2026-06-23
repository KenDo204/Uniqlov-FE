import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { 
  PermissionResponse, 
  CreatePermissionRequest, 
  UpdatePermissionRequest 
} from '@/types/permission';

export const permissionService = {

  getAllPermissions: async (): Promise<ApiResponse<PermissionResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<PermissionResponse[]>>('/permissions');
    return response.data;
  },


  createPermission: async (data: CreatePermissionRequest): Promise<ApiResponse<PermissionResponse>> => {
    const response = await axiosClient.post<ApiResponse<PermissionResponse>>('/permissions', data);
    return response.data;
  },

  updatePermission: async (id: number, data: UpdatePermissionRequest): Promise<ApiResponse<PermissionResponse>> => {
    const response = await axiosClient.put<ApiResponse<PermissionResponse>>(`/permissions/${id}`, data);
    return response.data;
  },

  deletePermission: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/permissions/${id}`);
    return response.data;
  }
};