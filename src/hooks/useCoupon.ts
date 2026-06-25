import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchAllCouponsThunk, 
  fetchCouponByIdThunk, 
  createCouponThunk, 
  updateCouponThunk, 
  deactivateCouponThunk, 
  previewApplyCouponThunk,
  clearCouponError,
  clearPreviewResult
} from '@/stores/slices/couponSlice';
import type { CouponCreateRequest, CouponUpdateRequest, CouponApplyRequest } from '@/types/coupon/requests';

export const useCoupon = () => {
  const dispatch = useAppDispatch();
  const { 
    couponsList, 
    currentCoupon, 
    previewResult, 
    isFetching, 
    isSubmitting, 
    error 
  } = useAppSelector((state) => state.coupon);

  const fetchAllCoupons = useCallback(async (page: number = 0, size: number = 20) => {
    return await dispatch(fetchAllCouponsThunk({ page, size })).unwrap();
  }, [dispatch]);

  const fetchCouponById = useCallback(async (id: number) => {
    return await dispatch(fetchCouponByIdThunk(id)).unwrap();
  }, [dispatch]);

  const createCoupon = useCallback(async (payload: CouponCreateRequest) => {
    return await dispatch(createCouponThunk(payload)).unwrap();
  }, [dispatch]);

  const updateCoupon = useCallback(async (id: number, payload: CouponUpdateRequest) => {
    return await dispatch(updateCouponThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deactivateCoupon = useCallback(async (id: number) => {
    return await dispatch(deactivateCouponThunk(id)).unwrap();
  }, [dispatch]);

  const previewApplyCoupon = useCallback(async (payload: CouponApplyRequest) => {
    return await dispatch(previewApplyCouponThunk(payload)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCouponError());
  }, [dispatch]);

  const clearPreview = useCallback(() => {
    dispatch(clearPreviewResult());
  }, [dispatch]);

  return useMemo(() => ({
    coupons: couponsList?.content || [],
    pagination: couponsList,
    currentCoupon,
    previewResult,
    isFetching,
    isSubmitting,
    error,
    fetchAllCoupons,
    fetchCouponById,
    createCoupon,
    updateCoupon,
    deactivateCoupon,
    previewApplyCoupon,
    clearError,
    clearPreview
  }), [
    couponsList, 
    currentCoupon, 
    previewResult, 
    isFetching, 
    isSubmitting, 
    error, 
    fetchAllCoupons, 
    fetchCouponById, 
    createCoupon, 
    updateCoupon, 
    deactivateCoupon, 
    previewApplyCoupon, 
    clearError, 
    clearPreview
  ]);
};
