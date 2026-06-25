import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  loginThunk, 
  logoutThunk, 
  getCurrentUserThunk, 
  clearAuth,
  registerThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  resendOtpThunk,
  activateAccountThunk,
  introspectThunk
} from '@/stores/slices/authSlice';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResendOtpRequest, ResetPasswordRequest } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(async (payload: LoginRequest) => {
    return await dispatch(loginThunk(payload)).unwrap();
  }, [dispatch]);

  const logout = useCallback(async () => {
    return await dispatch(logoutThunk()).unwrap();
  }, [dispatch]);

  const fetchProfile = useCallback(async () => {
    return await dispatch(getCurrentUserThunk()).unwrap();
  }, [dispatch]);

  const register = useCallback(async (payload: RegisterRequest) => {
    return await dispatch(registerThunk(payload)).unwrap();
  }, [dispatch]);

  const forgotPassword = useCallback(async (payload: ForgotPasswordRequest) => {
    return await dispatch(forgotPasswordThunk(payload)).unwrap();
  }, [dispatch]);

  const activateAccount = useCallback(async (payload: { email: string, otp: string }) => {
    return await dispatch(activateAccountThunk(payload)).unwrap();
  }, [dispatch]);

  const resendOtp = useCallback(async (payload: ResendOtpRequest) => {
    return await dispatch(resendOtpThunk(payload)).unwrap();
  }, [dispatch]);
  
  const resetPassword = useCallback(async (payload: ResetPasswordRequest) => {
    return await dispatch(resetPasswordThunk(payload)).unwrap();
  }, [dispatch]);

  const introspectToken = useCallback(async (token: string) => {
    return await dispatch(introspectThunk({ token })).unwrap();
  }, [dispatch]);

  const resetAuth = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    accessToken,
    loading: isLoading,
    error,
    login,
    logout,
    fetchProfile,
    resetAuth,
    register,
    forgotPassword,
    activateAccount,
    resendOtp,
    resetPassword,
    introspectToken
  }), [user, isAuthenticated, accessToken, isLoading, error, login, logout, fetchProfile, resetAuth, register, forgotPassword, activateAccount, resendOtp, resetPassword, introspectToken]);
};