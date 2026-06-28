import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { CartResponse } from '@/types/cart/responses';
import type { CartItemRequest } from '@/types/cart/requests';

const API_URL = '/carts';

export const cartService = {
  getCart: async (): Promise<ApiResponse<CartResponse>> => {
    const response = await axiosClient.get<ApiResponse<CartResponse>>(`${API_URL}/me`);
    return response.data;
  },

  addItem: async (data: CartItemRequest): Promise<ApiResponse<CartResponse>> => {
    const response = await axiosClient.post<ApiResponse<CartResponse>>(`${API_URL}/me/items`, data);
    return response.data;
  },

  updateItem: async (variantId: number, data: CartItemRequest): Promise<ApiResponse<CartResponse>> => {
    const response = await axiosClient.put<ApiResponse<CartResponse>>(`${API_URL}/me/items/${variantId}`, data);
    return response.data;
  },

  removeItem: async (variantId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/me/items/${variantId}`);
    return response.data;
  },

  clearCart: async (): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/me`);
    return response.data;
  }
};
