import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { ProductResponse } from '@/types/product';

const API_URL = '/recommendations';

export const recommendationService = {
  getRecommendedForYou: async (limit: number = 10): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/for-you`, {
        params: { limit },
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      // Fallback an toàn cho Guest: Trả về danh sách trống nếu bị chặn / từ chối 401
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  },

  getSimilarProducts: async (productId: number): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/similar`, {
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  },

  getBoughtTogether: async (productId: number): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/bought-together`, {
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  }
};
