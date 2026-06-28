import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchMyWishlistThunk,
  toggleWishlistThunk,
  removeFromWishlistThunk,
  clearWishlistError,
  clearWishlistData,
} from '@/stores/slices/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const { wishlist, isFetching, isSubmitting, error } = useAppSelector((state) => state.wishlist);

  const fetchMyWishlist = useCallback(
    async (page?: number, size?: number) => {
      return await dispatch(fetchMyWishlistThunk({ page, size })).unwrap();
    },
    [dispatch]
  );

  const toggleWishlist = useCallback(
    async (productId: number) => {
      return await dispatch(toggleWishlistThunk(productId)).unwrap();
    },
    [dispatch]
  );

  const removeFromWishlist = useCallback(
    async (productId: number) => {
      return await dispatch(removeFromWishlistThunk(productId)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearWishlistError());
  }, [dispatch]);

  const clearData = useCallback(() => {
    dispatch(clearWishlistData());
  }, [dispatch]);

  return useMemo(
    () => ({
      wishlist,
      isFetching,
      isSubmitting,
      error,
      fetchMyWishlist,
      toggleWishlist,
      removeFromWishlist,
      clearError,
      clearData,
    }),
    [wishlist, isFetching, isSubmitting, error, fetchMyWishlist, toggleWishlist, removeFromWishlist, clearError, clearData]
  );
};
