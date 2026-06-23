import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  loginThunk, 
  logoutThunk, 
  getCurrentUserThunk, 
  clearAuth 
} from '@/stores/slices/authSlice';
import type { LoginRequest } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken, isLoading, error } = useAppSelector((state) => state.auth);

  // Dùng .unwrap() để Component có thể .catch() lỗi hoặc .then() chuyển trang ngay lập tức
  const login = useCallback(async (payload: LoginRequest) => {
    return await dispatch(loginThunk(payload)).unwrap();
  }, [dispatch]);

  const logout = useCallback(async () => {
    return await dispatch(logoutThunk()).unwrap();
  }, [dispatch]);

  const fetchProfile = useCallback(async () => {
    return await dispatch(getCurrentUserThunk()).unwrap();
  }, [dispatch]);

  const resetAuth = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  // Đóng gói trả về cho UI
  return useMemo(() => ({
    user,
    isAuthenticated,
    accessToken,
    loading: isLoading,
    error,
    login,
    logout,
    fetchProfile,
    resetAuth
  }), [user, isAuthenticated, accessToken, isLoading, error, login, logout, fetchProfile, resetAuth]);
};