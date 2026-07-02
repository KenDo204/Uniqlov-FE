import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse } from '@/types/common/apiResponse';
import type { AddressResponse, CreateAddressRequest, UpdateAddressRequest } from '@/types/address';

const API_URL = '/addresses';

export const addressService = {
  getMyAddresses: async (): Promise<ApiResponse<AddressResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<AddressResponse[]>>(API_URL);
    return response.data;
  },

  createAddress: async (data: CreateAddressRequest): Promise<ApiResponse<AddressResponse>> => {
    const response = await axiosClient.post<ApiResponse<AddressResponse>>(API_URL, data);
    return response.data;
  },

  updateAddress: async (id: number, data: UpdateAddressRequest): Promise<ApiResponse<AddressResponse>> => {
    const response = await axiosClient.put<ApiResponse<AddressResponse>>(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${id}`);
    return response.data;
  },

  setDefault: async (id: number): Promise<ApiResponse<AddressResponse>> => {
    const response = await axiosClient.patch<ApiResponse<AddressResponse>>(`${API_URL}/${id}/default`);
    return response.data;
  },
};
