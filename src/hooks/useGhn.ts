import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchProvincesThunk,
  fetchDistrictsThunk,
  fetchWardsThunk,
  calculateShippingFeeThunk,
  clearGhnError,
  clearDistrictsAndWards,
  clearWards,
  clearShippingFee,
} from '@/stores/slices/ghnSlice';
import type { ShippingFeeRequest } from '@/types/ghn';

export const useGhn = () => {
  const dispatch = useAppDispatch();
  const { provinces, districts, wards, shippingFee, isFetching, isSubmitting, error } = useAppSelector(
    (state) => state.ghn
  );

  const fetchProvinces = useCallback(async () => {
    return await dispatch(fetchProvincesThunk()).unwrap();
  }, [dispatch]);

  const fetchDistricts = useCallback(
    async (provinceId: number) => {
      return await dispatch(fetchDistrictsThunk(provinceId)).unwrap();
    },
    [dispatch]
  );

  const fetchWards = useCallback(
    async (districtId: number) => {
      return await dispatch(fetchWardsThunk(districtId)).unwrap();
    },
    [dispatch]
  );

  const calculateShippingFee = useCallback(
    async (payload: ShippingFeeRequest) => {
      return await dispatch(calculateShippingFeeThunk(payload)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearGhnError());
  }, [dispatch]);

  const clearDistrictsWards = useCallback(() => {
    dispatch(clearDistrictsAndWards());
  }, [dispatch]);

  const clearWardsList = useCallback(() => {
    dispatch(clearWards());
  }, [dispatch]);

  const clearFee = useCallback(() => {
    dispatch(clearShippingFee());
  }, [dispatch]);

  return useMemo(
    () => ({
      provinces,
      districts,
      wards,
      shippingFee,
      isFetching,
      isSubmitting,
      error,
      fetchProvinces,
      fetchDistricts,
      fetchWards,
      calculateShippingFee,
      clearError,
      clearDistrictsWards,
      clearWardsList,
      clearFee,
    }),
    [
      provinces,
      districts,
      wards,
      shippingFee,
      isFetching,
      isSubmitting,
      error,
      fetchProvinces,
      fetchDistricts,
      fetchWards,
      calculateShippingFee,
      clearError,
      clearDistrictsWards,
      clearWardsList,
      clearFee,
    ]
  );
};
