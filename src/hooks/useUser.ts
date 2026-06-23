import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  fetchAllUsersThunk, 
  fetchUserByIdThunk, 
  createUserThunk, 
  updateUserThunk, 
  deleteUserThunk,
  clearCurrentUserDetail,
  clearUserError
} from '@/stores/slices/userSlice';
import type { CreateUserRequest, UpdateUserRequest } from '@/types/user';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const { usersList, currentUserDetail, isFetching, isSubmitting, error } = useAppSelector((state) => state.user);

  const fetchUsers = useCallback(async (page: number = 0, size: number = 20) => {
    return await dispatch(fetchAllUsersThunk({ page, size })).unwrap();
  }, [dispatch]);

  const fetchUserById = useCallback(async (id: number) => {
    return await dispatch(fetchUserByIdThunk(id)).unwrap();
  }, [dispatch]);

  const createUser = useCallback(async (payload: CreateUserRequest) => {
    return await dispatch(createUserThunk(payload)).unwrap();
  }, [dispatch]);

  const updateUser = useCallback(async (id: number, payload: UpdateUserRequest) => {
    return await dispatch(updateUserThunk({ id, data: payload })).unwrap();
  }, [dispatch]);

  const deleteUser = useCallback(async (id: number) => {
    return await dispatch(deleteUserThunk(id)).unwrap();
  }, [dispatch]);

  const clearDetail = useCallback(() => dispatch(clearCurrentUserDetail()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearUserError()), [dispatch]);

  return useMemo(() => ({
    users: usersList,
    userDetail: currentUserDetail,
    isFetching,
    isSubmitting,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    clearDetail,
    clearError
  }), [usersList, currentUserDetail, isFetching, isSubmitting, error, fetchUsers, fetchUserById, createUser, updateUser, deleteUser, clearDetail, clearError]);
};