import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchAddressesThunk,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  clearAddressError,
} from '@/stores/slices/addressSlice';
import type { CreateAddressRequest, UpdateAddressRequest } from '@/types/address';

export const useAddress = () => {
  const dispatch = useAppDispatch();
  const { addresses, defaultAddress, isFetching, isSubmitting, error } = useAppSelector(
    (state) => state.address
  );

  const fetchAddresses = useCallback(async () => {
    return await dispatch(fetchAddressesThunk()).unwrap();
  }, [dispatch]);

  const createAddress = useCallback(
    async (payload: CreateAddressRequest) => {
      return await dispatch(createAddressThunk(payload)).unwrap();
    },
    [dispatch]
  );

  const updateAddress = useCallback(
    async (id: number, payload: UpdateAddressRequest) => {
      return await dispatch(updateAddressThunk({ id, data: payload })).unwrap();
    },
    [dispatch]
  );

  const deleteAddress = useCallback(
    async (id: number) => {
      return await dispatch(deleteAddressThunk(id)).unwrap();
    },
    [dispatch]
  );

  const setDefaultAddress = useCallback(
    async (id: number) => {
      return await dispatch(setDefaultAddressThunk(id)).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearAddressError());
  }, [dispatch]);

  return useMemo(
    () => ({
      addresses,
      defaultAddress,
      isFetching,
      isSubmitting,
      error,
      fetchAddresses,
      createAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      clearError,
    }),
    [
      addresses,
      defaultAddress,
      isFetching,
      isSubmitting,
      error,
      fetchAddresses,
      createAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      clearError,
    ]
  );
};
