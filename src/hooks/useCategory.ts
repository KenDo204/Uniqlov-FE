import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchAdminCategoriesThunk, 
  fetchPublicCategoriesThunk, 
  createCategoryThunk, 
  updateCategoryThunk, 
  deleteCategoryThunk,
  clearCategoryError
} from '@/stores/slices/categorySlice';
import type { CategoryCreateRequest, CategoryUpdateRequest } from '@/types/category';

export const useCategory = () => {
  const dispatch = useAppDispatch();
  const { categoryTree, isFetching, isSubmitting, error } = useAppSelector((state) => state.category);

  // --- Public API ---
  const fetchPublicCategories = useCallback(async () => {
    return await dispatch(fetchPublicCategoriesThunk()).unwrap();
  }, [dispatch]);

  // --- Admin API ---
  const fetchAdminCategories = useCallback(async () => {
    return await dispatch(fetchAdminCategoriesThunk()).unwrap();
  }, [dispatch]);

  const createCategory = useCallback(async (payload: CategoryCreateRequest) => {
    return await dispatch(createCategoryThunk(payload)).unwrap();
  }, [dispatch]);

  const updateCategory = useCallback(async (id: number, payload: CategoryUpdateRequest) => {
    return await dispatch(updateCategoryThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deleteCategory = useCallback(async (id: number) => {
    return await dispatch(deleteCategoryThunk(id)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearCategoryError());
  }, [dispatch]);

  return useMemo(() => ({
    categories: categoryTree, // Tree data đệ quy đã được xử lý ở Slice
    isFetching,
    isSubmitting,
    error,
    fetchPublicCategories,
    fetchAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  }), [categoryTree, isFetching, isSubmitting, error, fetchPublicCategories, fetchAdminCategories, createCategory, updateCategory, deleteCategory, clearError]);
};