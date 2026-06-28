import { axiosClient } from './axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type { CheckoutResponse, OrderResponse, OrderSummaryResponse } from '@/types/order/responses';
import type { CheckoutRequest, OrderCancelRequest, OrderStatusUpdateRequest } from '@/types/order/requests';

const API_URL = '/orders';

export const orderService = {
  // --- USER ENDPOINTS ---

  checkout: async (data: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> => {
    const response = await axiosClient.post<ApiResponse<CheckoutResponse>>(`${API_URL}/checkout`, data);
    return response.data;
  },

  getMyOrders: async (page: number = 0, size: number = 10): Promise<ApiResponse<PageResponse<OrderSummaryResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<OrderSummaryResponse>>>(`${API_URL}/my`, {
      params: { page, size }
    });
    return response.data;
  },

  getMyOrderDetail: async (orderId: number): Promise<ApiResponse<OrderResponse>> => {
    const response = await axiosClient.get<ApiResponse<OrderResponse>>(`${API_URL}/my/${orderId}`);
    return response.data;
  },

  cancelMyOrder: async (orderId: number, data: OrderCancelRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.put<ApiResponse<void>>(`${API_URL}/my/${orderId}/cancel`, data);
    return response.data;
  },

  // --- ADMIN ENDPOINTS ---

  getAllOrders: async (page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<OrderSummaryResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<OrderSummaryResponse>>>(API_URL, {
      params: { page, size }
    });
    return response.data;
  },

  getOrderDetail: async (orderId: number): Promise<ApiResponse<OrderResponse>> => {
    const response = await axiosClient.get<ApiResponse<OrderResponse>>(`${API_URL}/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, data: OrderStatusUpdateRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.put<ApiResponse<void>>(`${API_URL}/${orderId}/status`, data);
    return response.data;
  }
};
