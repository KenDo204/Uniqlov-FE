import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { ProductResponse } from '@/types/product';

const API_URL = '/recommendations';

export const recommendationService = {
  getRecommendedForYou: async (limit: number = 10): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/for-you`, {
      params: { limit }
    });
    return response.data;
  },

  getSimilarProducts: async (productId: number): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/similar`);
    return response.data;
  },

  getBoughtTogether: async (productId: number): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/bought-together`);
    return response.data;
  }
};
