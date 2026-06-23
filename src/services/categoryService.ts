import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type {
  CategoryResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest
} from '@/types/category';

export const categoryService = {
  getPublicCategoryTree: async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>('/categories/public');
    return response.data;
  },

  getAdminCategoryTree: async (): Promise<ApiResponse<CategoryResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<CategoryResponse[]>>('/categories');
    return response.data;
  },

  createCategory: async (data: CategoryCreateRequest): Promise<ApiResponse<CategoryResponse>> => {
    const response = await axiosClient.post<ApiResponse<CategoryResponse>>('/categories', data);
    return response.data;
  },

  updateCategory: async (categoryId: number, data: CategoryUpdateRequest): Promise<ApiResponse<CategoryResponse>> => {
    const response = await axiosClient.put<ApiResponse<CategoryResponse>>(`/categories/${categoryId}`, data);
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/categories/${categoryId}`);
    return response.data;
  }
};