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
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  scope?: string;
  [key: string]: any;
}

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

  const hasPermission = useCallback((permission: string) => {
    if (!accessToken) return false;
    try {
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
      const scopes = (decoded.scope || '').split(' ');
      
      // ADMIN role has all permissions
      if (scopes.includes('ROLE_ADMIN')) return true;
      
      return scopes.includes(permission);
    } catch {
      return false;
    }
  }, [accessToken]);

  const isCustomer = useMemo(() => {
    if (!isAuthenticated || !accessToken) return false;
    try {
      const decoded = jwtDecode<CustomJwtPayload>(accessToken);
      const scopes = (decoded.scope || '').split(' ');
      const nonCustomerRoles = ['ROLE_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'ROLE_SUPER_ADMIN', 'STAFF', 'ROLE_STAFF', 'OWNER', 'ROLE_OWNER'];
      if (scopes.some(s => nonCustomerRoles.includes(s))) {
        return false;
      }
      if (user?.roleName && nonCustomerRoles.includes(user.roleName)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [isAuthenticated, accessToken, user]);

  return useMemo(() => ({
    user,
    isAuthenticated,
    isCustomer,
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
    introspectToken,
    hasPermission
  }), [user, isAuthenticated, isCustomer, accessToken, isLoading, error, login, logout, fetchProfile, resetAuth, register, forgotPassword, activateAccount, resendOtp, resetPassword, introspectToken, hasPermission]);
};