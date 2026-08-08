import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse } from '@/types/common/apiResponse';
import type { PaymentUrlResponse } from '@/types/payment/responses';

const API_URL = '/payment';

export const paymentService = {
  createPaymentUrl: async (orderId: number): Promise<ApiResponse<PaymentUrlResponse>> => {
    const response = await axiosClient.post<ApiResponse<PaymentUrlResponse>>(`${API_URL}/create-url?orderId=${orderId}`);
    return response.data;
  },
};
