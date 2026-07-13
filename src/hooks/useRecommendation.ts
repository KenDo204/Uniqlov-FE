import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchRecommendedForYouThunk,
  fetchSimilarProductsThunk,
  fetchBoughtTogetherThunk
} from '@/stores/slices/recommendationSlice';

export const useRecommendation = () => {
  const dispatch = useAppDispatch();
  const {
    recommendedForYou,
    similarProducts,
    boughtTogether,
    isFetching,
    error
  } = useAppSelector(state => state.recommendation);

  const fetchRecommendedForYou = useCallback(async (limit: number = 10) => {
    return await dispatch(fetchRecommendedForYouThunk(limit)).unwrap();
  }, [dispatch]);

  const fetchSimilarProducts = useCallback(async (productId: number) => {
    return await dispatch(fetchSimilarProductsThunk(productId)).unwrap();
  }, [dispatch]);

  const fetchBoughtTogether = useCallback(async (productId: number) => {
    return await dispatch(fetchBoughtTogetherThunk(productId)).unwrap();
  }, [dispatch]);

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
