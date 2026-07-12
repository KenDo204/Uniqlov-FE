import { axiosClient } from './axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type {
  ProductResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductVariantResponse,
  ProductFilterRequest
} from '@/types/product';

const API_URL = '/products';

export const productService = {
  // --- PUBLIC ENDPOINTS (Storefront) ---

  getPublicProducts: async (filter?: ProductFilterRequest & { page?: number; size?: number; sort?: string }): Promise<ApiResponse<PageResponse<ProductResponse>>> => {
    // Xóa các key undefined/null ra khỏi filter
    const cleanFilter = filter ? Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ) : {};

    const response = await axiosClient.get<ApiResponse<PageResponse<ProductResponse>>>(`${API_URL}/public`, {
      params: cleanFilter,
    });
    return response.data;
  },

  getPublicProductById: async (productId: number): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`${API_URL}/public/${productId}`);
    return response.data;
  },

  getPublicProductBySlug: async (slug: string): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`${API_URL}/public/slug/${slug}`);
    return response.data;
  },

  getVariantsPublic: async (productId: number): Promise<ApiResponse<ProductVariantResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductVariantResponse[]>>(`${API_URL}/public/${productId}/variants`);
    return response.data;
  },

  // --- ADMIN ENDPOINTS (CMS) ---

  getAdminProducts: async (): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>(API_URL);
    return response.data;
  },

  getAdminProductById: async (productId: number): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`${API_URL}/${productId}`);
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.post<ApiResponse<ProductResponse>>(API_URL, data);
    return response.data;
  },

  updateProduct: async (productId: number, data: ProductUpdateRequest): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.put<ApiResponse<ProductResponse>>(`${API_URL}/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`${API_URL}/${productId}`);
    return response.data;
  }
};