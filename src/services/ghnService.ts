import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse } from '@/types/common/apiResponse';
import type {
  GhnProvinceResponse,
  GhnDistrictResponse,
  GhnWardResponse,
  GhnShippingFeeResponse,
  ShippingFeeRequest,
  GhnWebhookRequest,
} from '@/types/ghn';

const API_URL = '/ghn';

export const ghnService = {
  getProvinces: async (): Promise<ApiResponse<GhnProvinceResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<GhnProvinceResponse[]>>(`${API_URL}/provinces`);
    return response.data;
  },

  getDistricts: async (provinceId: number): Promise<ApiResponse<GhnDistrictResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<GhnDistrictResponse[]>>(`${API_URL}/districts`, {
      params: { provinceId },
    });
    return response.data;
  },

  getWards: async (districtId: number): Promise<ApiResponse<GhnWardResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<GhnWardResponse[]>>(`${API_URL}/wards`, {
      params: { districtId },
    });
    return response.data;
  },

  calculateFee: async (data: ShippingFeeRequest): Promise<ApiResponse<GhnShippingFeeResponse>> => {
    const response = await axiosClient.post<ApiResponse<GhnShippingFeeResponse>>(`${API_URL}/shipping-fee`, data);
    return response.data;
  },

  handleWebhook: async (data: GhnWebhookRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/webhook`, data);
    return response.data;
  },
};
