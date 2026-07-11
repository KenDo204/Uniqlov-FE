import { axiosClient } from './axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type {
  SliderResponse,
  SliderCreateRequest,
  SliderUpdateRequest
} from '@/types/slider';

const API_URL = '/sliders';

export const sliderService = {
  getPublicSliders: async (): Promise<ApiResponse<SliderResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<SliderResponse[]>>(`${API_URL}/public`);
    return response.data;
  },

  getAllSliders: async (
    page: number = 0,
    size: number = 10,
    sort?: string
  ): Promise<ApiResponse<PageResponse<SliderResponse>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (sort) {
      params.append('sort', sort);
    }
    const response = await axiosClient.get<ApiResponse<PageResponse<SliderResponse>>>(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  createSlider: async (data: SliderCreateRequest): Promise<ApiResponse<SliderResponse>> => {
    const response = await axiosClient.post<ApiResponse<SliderResponse>>(API_URL, data);
    return response.data;
  },

  updateSlider: async (sliderId: number, data: SliderUpdateRequest): Promise<ApiResponse<SliderResponse>> => {
    const response = await axiosClient.put<ApiResponse<SliderResponse>>(`${API_URL}/${sliderId}`, data);
    return response.data;
  },

  deleteSlider: async (sliderId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${sliderId}`);
    return response.data;
  }
};
