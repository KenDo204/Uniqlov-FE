import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse, type PageResponse } from '@/types/common/apiResponse';
import { type CreateReviewRequest, type UpdateReviewStatusRequest } from '@/types/review/requests';
import { type ReviewResponse, type ReviewSummaryResponse } from '@/types/review/responses';

const API_URL = '/reviews';

export const reviewService = {
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> => {
    const response = await axiosClient.post<ApiResponse<ReviewResponse>>(API_URL, data);
    return response.data;
  },

  getMyReviews: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<ReviewResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<ReviewResponse>>>(`${API_URL}/me`, {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
  },

  deleteReview: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${id}`);
    return response.data;
  },

  getProductReviews: async (productId: number, page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<ReviewResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<ReviewResponse>>>(`${API_URL}/product/${productId}`, {
      params: { page, size, sort: 'createdAt,desc' },
    });
    return response.data;
  },

  getProductReviewSummary: async (productId: number): Promise<ApiResponse<ReviewSummaryResponse>> => {
    const response = await axiosClient.get<ApiResponse<ReviewSummaryResponse>>(`${API_URL}/product/${productId}/summary`);
    return response.data;
  },

  updateReviewStatus: async (id: number, data: UpdateReviewStatusRequest): Promise<ApiResponse<ReviewResponse>> => {
    const response = await axiosClient.patch<ApiResponse<ReviewResponse>>(`${API_URL}/${id}/status`, data);
    return response.data;
  },
};
