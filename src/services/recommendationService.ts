import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { ProductResponse } from '@/types/product';

const API_URL = '/recommendations';

export const recommendationService = {
  getForYouRecommendations: async (limit: number = 10): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/for-you`, {
        params: { limit },
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  },


  getSimilarProducts: async (productId: number | string, limit?: number): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const params: Record<string, any> = {};
      if (limit !== undefined && limit !== null) {
        params.limit = limit;
      }
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/similar`, {
        params,
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  },

  getBoughtTogetherProducts: async (productId: number | string, limit?: number): Promise<ApiResponse<ProductResponse[]>> => {
    try {
      const params: Record<string, any> = {};
      if (limit !== undefined && limit !== null) {
        params.limit = limit;
      }
      const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(`${API_URL}/products/${productId}/bought-together`, {
        params,
        skipToast: true,
      });
      return response.data;
    } catch (_error) {
      return { code: 200, message: 'Guest fallback', result: [] };
    }
  }
};

