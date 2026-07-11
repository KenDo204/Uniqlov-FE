import { axiosClient } from './axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type {
  ContactMessageRequest,
  ContactMessageStatusRequest,
  ContactMessageResponse
} from '@/types/contact';

export const contactService = {
  createContact: async (data: ContactMessageRequest): Promise<ApiResponse<ContactMessageResponse>> => {
    const response = await axiosClient.post<ApiResponse<ContactMessageResponse>>('/contacts', data);
    return response.data;
  },

  getMyContacts: async (
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<ContactMessageResponse>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const response = await axiosClient.get<ApiResponse<PageResponse<ContactMessageResponse>>>(`/contacts/me?${params.toString()}`);
    return response.data;
  },

  getAdminContacts: async (
    page: number = 0,
    size: number = 10,
    status?: string
  ): Promise<ApiResponse<PageResponse<ContactMessageResponse>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await axiosClient.get<ApiResponse<PageResponse<ContactMessageResponse>>>(`/admin/contacts?${params.toString()}`);
    return response.data;
  },

  updateContactStatus: async (
    messageId: number,
    data: ContactMessageStatusRequest
  ): Promise<ApiResponse<ContactMessageResponse>> => {
    const response = await axiosClient.patch<ApiResponse<ContactMessageResponse>>(`/admin/contacts/${messageId}/status`, data);
    return response.data;
  }
};
