import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchAllRolesThunk, 
  fetchRoleByIdThunk, 
  createRoleThunk, 
  updateRoleThunk, 
  deleteRoleThunk,
  clearCurrentRoleDetail,
  clearRoleError
} from '@/stores/slices/roleSlice';
import type { CreateRoleRequest, UpdateRoleRequest } from '@/types/role';

export const useRole = () => {
  const dispatch = useAppDispatch();
  const { rolesList, currentRoleDetail, isFetching, isSubmitting, error } = useAppSelector((state) => state.role);

  const fetchAllRoles = useCallback(async () => {
    return await dispatch(fetchAllRolesThunk()).unwrap();
  }, [dispatch]);

  const fetchRoleById = useCallback(async (id: number) => {
    return await dispatch(fetchRoleByIdThunk(id)).unwrap();
  }, [dispatch]);

  const createRole = useCallback(async (payload: CreateRoleRequest) => {
    return await dispatch(createRoleThunk(payload)).unwrap();
  }, [dispatch]);

  const updateRole = useCallback(async (id: number, payload: UpdateRoleRequest) => {
    return await dispatch(updateRoleThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deleteRole = useCallback(async (id: number) => {
    return await dispatch(deleteRoleThunk(id)).unwrap();
  }, [dispatch]);

  const clearDetail = useCallback(() => {
    dispatch(clearCurrentRoleDetail());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearRoleError());
  }, [dispatch]);

  return useMemo(() => ({
    roles: rolesList,
    roleDetail: currentRoleDetail,
    isFetching,
    isSubmitting,
    error,
    fetchAllRoles,
    fetchRoleById,
    createRole,
    updateRole,
    deleteRole,
    clearDetail,
    clearError
  }), [rolesList, currentRoleDetail, isFetching, isSubmitting, error, fetchAllRoles, fetchRoleById, createRole, updateRole, deleteRole, clearDetail, clearError]);
};