import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { reviewService } from '@/services/reviewService';
import type { ReviewResponse } from '@/types/review/responses';
import type { PageResponse } from '@/types/common/apiResponse';
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

export interface UseAllReviewsParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  keyword?: string;
}

/**
 * React Query Hook cho Admin Review Management (GET /api/v1/reviews/all)
 */
export const useAllReviews = (params: UseAllReviewsParams = {}) => {
  const { page = 0, size = 10, sort = 'createdAt,desc', status, keyword } = params;
  const normalizedStatus = status && status !== 'ALL' ? status : 'ALL';
  const normalizedKeyword = keyword ? keyword.trim() : '';

  return useQuery<PageResponse<ReviewResponse>>({
    queryKey: ['reviews', 'all', page, size, sort, normalizedStatus, normalizedKeyword],
    queryFn: async () => {
      const response = await reviewService.getAllReviews(page, size, sort, status, keyword);
      return response.result || {
        content: [],
        pageNumber: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 0,
        last: true,
      } as any;
    },
    staleTime: 0,
  });
};

/**
 * React Query Mutation Hook cập nhật trạng thái Review cho Admin
 */
export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateReviewStatusRequest }) => {
      const response = await reviewService.updateReviewStatus(id, data);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

