import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchAllPermissionsThunk, 
  createPermissionThunk, 
  updatePermissionThunk, 
  deletePermissionThunk,
  clearPermissionError
} from '@/stores/slices/permissionSlice';
import type { CreatePermissionRequest, UpdatePermissionRequest } from '@/types/permission';

export const usePermission = () => {
  const dispatch = useAppDispatch();
  const { permissionsList, isFetching, isSubmitting, error } = useAppSelector((state) => state.permission);

  const fetchAllPermissions = useCallback(async () => {
    return await dispatch(fetchAllPermissionsThunk()).unwrap();
  }, [dispatch]);

  const createPermission = useCallback(async (payload: CreatePermissionRequest) => {
    return await dispatch(createPermissionThunk(payload)).unwrap();
  }, [dispatch]);

  const updatePermission = useCallback(async (id: number, payload: UpdatePermissionRequest) => {
    return await dispatch(updatePermissionThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deletePermission = useCallback(async (id: number) => {
    return await dispatch(deletePermissionThunk(id)).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearPermissionError());
  }, [dispatch]);

  return useMemo(() => ({
    permissions: permissionsList,
    isFetching,
    isSubmitting,
    error,
    fetchAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    clearError
  }), [permissionsList, isFetching, isSubmitting, error, fetchAllPermissions, createPermission, updatePermission, deletePermission, clearError]);
};