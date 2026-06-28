import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse, type PageResponse } from '@/types/common/apiResponse';
import { type WishlistResponse } from '@/types/wishlist/responses';

const API_URL = '/wishlists';

export const wishlistService = {
  toggle: async (productId: number): Promise<ApiResponse<{ inWishlist: boolean }>> => {
    const response = await axiosClient.post<ApiResponse<{ inWishlist: boolean }>>(`${API_URL}/${productId}`);
    return response.data;
  },

  getMyWishlist: async (page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<WishlistResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<WishlistResponse>>>(`${API_URL}/me`, {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
  },

  remove: async (productId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${productId}`);
    return response.data;
  },
};
