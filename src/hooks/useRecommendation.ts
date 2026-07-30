import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchRecommendedForYouThunk,
  fetchSimilarProductsThunk,
  fetchBoughtTogetherThunk
} from '@/stores/slices/recommendationSlice';
import { recommendationService } from '@/services/recommendationService';
import type { ProductResponse } from '@/types/product';

/**
 * Redux Toolkit Hook cho Recommendation Module
 */
export const useRecommendation = () => {
  const dispatch = useAppDispatch();
  const {
    recommendedForYou,
    similarProducts,
    boughtTogether,
    isFetching,
    error
  } = useAppSelector((state) => state.recommendation);

  const fetchRecommendedForYou = useCallback(
    async (limit: number = 10) => {
      return await dispatch(fetchRecommendedForYouThunk({ limit })).unwrap();
    },
    [dispatch]
  );

  const fetchSimilarProducts = useCallback(
    async (productId: number | string, limit?: number) => {
      return await dispatch(fetchSimilarProductsThunk({ productId, limit })).unwrap();
    },
    [dispatch]
  );

  const fetchBoughtTogether = useCallback(
    async (productId: number | string, limit?: number) => {
      return await dispatch(fetchBoughtTogetherThunk({ productId, limit })).unwrap();
    },
    [dispatch]
  );

  return {
    recommendedForYou,
    similarProducts,
    boughtTogether,
    isFetching,
    error,
    fetchRecommendedForYou,
    fetchSimilarProducts,
    fetchBoughtTogether
  };
};

/**
 * React Query Hook cho API "For You" Recommendation
 * Cache key: ['recommendation', 'for-you', limit]
 */
export const useForYouRecommendations = (limit: number = 10) => {
  return useQuery<ProductResponse[]>({
    queryKey: ['recommendation', 'for-you', limit],
    queryFn: async () => {
      const response = await recommendationService.getForYouRecommendations(limit);
      return response.result || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * React Query Hook cho API Similar Products
 * Cache key: ['recommendation', 'similar', productId]
 */
export const useSimilarProducts = (productId?: number | string, limit?: number) => {
  return useQuery<ProductResponse[]>({
    queryKey: ['recommendation', 'similar', productId],
    queryFn: async () => {
      if (!productId) return [];
      const response = await recommendationService.getSimilarProducts(productId, limit);
      return response.result || [];
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * React Query Hook cho API Bought Together
 * Cache key: ['recommendation', 'bought-together', productId]
 */
export const useBoughtTogetherProducts = (productId?: number | string, limit?: number) => {
  return useQuery<ProductResponse[]>({
    queryKey: ['recommendation', 'bought-together', productId],
    queryFn: async () => {
      if (!productId) return [];
      const response = await recommendationService.getBoughtTogetherProducts(productId, limit);
      return response.result || [];
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
};


