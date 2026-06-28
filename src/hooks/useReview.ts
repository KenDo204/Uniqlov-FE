import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  createReviewThunk,
  fetchMyReviewsThunk,
  deleteReviewThunk,
  fetchProductReviewsThunk,
  fetchProductReviewSummaryThunk,
  updateReviewStatusThunk,
  clearReviewError,
  clearProductReviews,
} from '@/stores/slices/reviewSlice';
import type { CreateReviewRequest, UpdateReviewStatusRequest } from '@/types/review/requests';

export const useReview = () => {
  const dispatch = useAppDispatch();
  const {
    myReviews,
    productReviews,
    productSummary,
    isFetching,
    isSubmitting,
    error,
  } = useAppSelector((state) => state.review);

  const createReview = useCallback(
    async (payload: CreateReviewRequest) => {
      return await dispatch(createReviewThunk(payload)).unwrap();
    },
    [dispatch]
  );

  const fetchMyReviews = useCallback(
    async (page?: number, size?: number) => {
      return await dispatch(fetchMyReviewsThunk({ page, size })).unwrap();
    },
    [dispatch]
  );

  const deleteReview = useCallback(
    async (id: number) => {
      return await dispatch(deleteReviewThunk(id)).unwrap();
    },
    [dispatch]
  );

  const fetchProductReviews = useCallback(
    async (productId: number, page?: number, size?: number) => {
      return await dispatch(fetchProductReviewsThunk({ productId, page, size })).unwrap();
    },
    [dispatch]
  );

  const fetchProductReviewSummary = useCallback(
    async (productId: number) => {
      return await dispatch(fetchProductReviewSummaryThunk(productId)).unwrap();
    },
    [dispatch]
  );

  const updateReviewStatus = useCallback(
    async (id: number, data: UpdateReviewStatusRequest) => {
      return await dispatch(updateReviewStatusThunk({ id, data })).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearReviewError());
  }, [dispatch]);

  const clearProductReviewsData = useCallback(() => {
    dispatch(clearProductReviews());
  }, [dispatch]);

  return useMemo(
    () => ({
      myReviews,
      productReviews,
      productSummary,
      isFetching,
      isSubmitting,
      error,
      createReview,
      fetchMyReviews,
      deleteReview,
      fetchProductReviews,
      fetchProductReviewSummary,
      updateReviewStatus,
      clearError,
      clearProductReviewsData,
    }),
    [
      myReviews,
      productReviews,
      productSummary,
      isFetching,
      isSubmitting,
      error,
      createReview,
      fetchMyReviews,
      deleteReview,
      fetchProductReviews,
      fetchProductReviewSummary,
      updateReviewStatus,
      clearError,
      clearProductReviewsData,
    ]
  );
};
