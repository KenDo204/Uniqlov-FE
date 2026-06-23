import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse } from '@/types/common/apiResponse';
import type {
  RegisterRequest,
  ActivateAccountRequest,
  ResendOtpRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  IntrospectRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  IntrospectResponse,
  UserResponse
} from '@/types/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/register', data);
    return response.data;
  },

  activateAccount: async (data: ActivateAccountRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/active', data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/resend-otp', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/logout', data);
    return response.data;
  },

  refresh: async (data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>('/auth/refresh', data);
    return response.data;
  },

  introspect: async (data: IntrospectRequest): Promise<ApiResponse<IntrospectResponse>> => {
    const response = await axiosClient.post<ApiResponse<IntrospectResponse>>('/auth/introspect', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await axiosClient.get<ApiResponse<UserResponse>>('/auth/me');
    return response.data;
  },
};