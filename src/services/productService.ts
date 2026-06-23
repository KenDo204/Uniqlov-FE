import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type {
  ProductResponse,
  ProductCreateRequest,
  ProductUpdateRequest
} from '@/types/product';

export const productService = {
  // --- PUBLIC ENDPOINTS (Storefront) ---

  getPublicProducts: async (): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>('/products/public');
    return response.data;
  },

  getPublicProductById: async (productId: number): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`/products/public/${productId}`);
    return response.data;
  },

  getPublicProductBySlug: async (slug: string): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`/products/public/slug/${slug}`);
    return response.data;
  },

  // --- ADMIN ENDPOINTS (CMS) ---

  getAdminProducts: async (): Promise<ApiResponse<ProductResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse[]>>('/products');
    return response.data;
  },

  getAdminProductById: async (productId: number): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.get<ApiResponse<ProductResponse>>(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.post<ApiResponse<ProductResponse>>('/products', data);
    return response.data;
  },

  updateProduct: async (productId: number, data: ProductUpdateRequest): Promise<ApiResponse<ProductResponse>> => {
    const response = await axiosClient.put<ApiResponse<ProductResponse>>(`/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/products/${productId}`);
    return response.data;
  }
};