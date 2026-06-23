import { axiosClient } from '@/services/axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type { 
  UserDetailResponse, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '@/types/user';

export const userService = {
    
  getAllUsers: async (page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<UserDetailResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<UserDetailResponse>>>('/users', {
      params: {
        page,
        size,
      },
    });
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<UserDetailResponse>> => {
    const response = await axiosClient.get<ApiResponse<UserDetailResponse>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<UserDetailResponse>> => {
    const response = await axiosClient.post<ApiResponse<UserDetailResponse>>('/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<ApiResponse<UserDetailResponse>> => {
    const response = await axiosClient.put<ApiResponse<UserDetailResponse>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  }
};