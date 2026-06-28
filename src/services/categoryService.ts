import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type {
  CategoryResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest
} from '@/types/category';

const API_URL = '/categories';

export const categoryService = {
  getPublicCategoryTree: async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>(`${API_URL}/public`);
    return response.data;
  },

  getAdminCategoryTree: async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>(API_URL);
    return response.data;
  },

  createCategory: async (data: CategoryCreateRequest): Promise<ApiResponse<CategoryResponse>> => {
    const response = await axiosClient.post<ApiResponse<CategoryResponse>>(API_URL, data);
    return response.data;
  },

  updateCategory: async (categoryId: number, data: CategoryUpdateRequest): Promise<ApiResponse<CategoryResponse>> => {
    const response = await axiosClient.put<ApiResponse<CategoryResponse>>(`${API_URL}/${categoryId}`, data);
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${categoryId}`);
    return response.data;
  }
};