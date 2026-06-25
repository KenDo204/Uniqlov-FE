import { axiosClient } from './axiosClient';
import type { ApiResponse, PageResponse } from '@/types/common/apiResponse';
import type { CouponResponse, CouponApplyResponse } from '@/types/coupon/responses';
import type { CouponCreateRequest, CouponUpdateRequest, CouponApplyRequest } from '@/types/coupon/requests';

export const couponService = {
  createCoupon: async (data: CouponCreateRequest): Promise<ApiResponse<CouponResponse>> => {
    const response = await axiosClient.post<ApiResponse<CouponResponse>>('/coupons', data);
    return response.data;
  },

  updateCoupon: async (id: number, data: CouponUpdateRequest): Promise<ApiResponse<CouponResponse>> => {
    const response = await axiosClient.put<ApiResponse<CouponResponse>>(`/coupons/${id}`, data);
    return response.data;
  },

  deactivateCoupon: async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete<ApiResponse<void>>(`/coupons/${id}`);
    return response.data;
  },

  getAllCoupons: async (page: number = 0, size: number = 20): Promise<ApiResponse<PageResponse<CouponResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<CouponResponse>>>('/coupons', {
      params: { page, size }
    });
    return response.data;
  },

  getCoupon: async (id: number): Promise<ApiResponse<CouponResponse>> => {
    const response = await axiosClient.get<ApiResponse<CouponResponse>>(`/coupons/${id}`);
    return response.data;
  },

  previewApply: async (data: CouponApplyRequest): Promise<ApiResponse<CouponApplyResponse>> => {
    const response = await axiosClient.post<ApiResponse<CouponApplyResponse>>('/coupons/preview', data);
    return response.data;
  }
};
