import { axiosClient } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { UploadImageResponse } from '@/types/image/responses';

const API_URL = '/uploads';

export const uploadService = {
  uploadProductImage: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ApiResponse<UploadImageResponse>>(`${API_URL}/image/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadReviewImage: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ApiResponse<UploadImageResponse>>(`${API_URL}/image/reviews`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadUserAvatar: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ApiResponse<UploadImageResponse>>(`${API_URL}/image/users`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadCategoryIcon: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ApiResponse<UploadImageResponse>>(`${API_URL}/image/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  uploadSliderImage: async (file: File): Promise<ApiResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<ApiResponse<UploadImageResponse>>(`${API_URL}/image/sliders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
