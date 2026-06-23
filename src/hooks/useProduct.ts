import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchPublicProductsThunk,
  fetchPublicProductBySlugThunk,
  fetchAdminProductsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk
} from '@/stores/slices/productSlice';
import type { ProductCreateRequest, ProductUpdateRequest } from '@/types/product';

export const useProduct = () => {
  const dispatch = useAppDispatch();
  const { productsList, currentProductDetail, isFetching, isSubmitting, error } = useAppSelector((state) => state.product);

  // --- Public APIs ---
  const fetchPublicProducts = useCallback(async () => {
    return await dispatch(fetchPublicProductsThunk()).unwrap();
  }, [dispatch]);

  const fetchProductBySlug = useCallback(async (slug: string) => {
    return await dispatch(fetchPublicProductBySlugThunk(slug)).unwrap();
  }, [dispatch]);

  // --- Admin APIs ---
  const fetchAdminProducts = useCallback(async () => {
    return await dispatch(fetchAdminProductsThunk()).unwrap();
  }, [dispatch]);

  const createProduct = useCallback(async (payload: ProductCreateRequest) => {
    return await dispatch(createProductThunk(payload)).unwrap();
  }, [dispatch]);

  const updateProduct = useCallback(async (id: number, payload: ProductUpdateRequest) => {
    return await dispatch(updateProductThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deleteProduct = useCallback(async (id: number) => {
    return await dispatch(deleteProductThunk(id)).unwrap();
  }, [dispatch]);

  return useMemo(() => ({
    products: productsList,
    productDetail: currentProductDetail,
    isFetching,
    isSubmitting,
    error,
    fetchPublicProducts,
    fetchProductBySlug,
    fetchAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }), [productsList, currentProductDetail, isFetching, isSubmitting, error, fetchPublicProducts, fetchProductBySlug, fetchAdminProducts, createProduct, updateProduct, deleteProduct]);
};