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

const API_URL = '/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/register`, data);
    return response.data;
  },

  activateAccount: async (data: ActivateAccountRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/active`, data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/resend-otp`, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>(`${API_URL}/login`, data);
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/logout`, data);
    return response.data;
  },

  refresh: async (data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>(`${API_URL}/refresh`, data);
    return response.data;
  },

  introspect: async (data: IntrospectRequest): Promise<ApiResponse<IntrospectResponse>> => {
    const response = await axiosClient.post<ApiResponse<IntrospectResponse>>(`${API_URL}/introspect`, data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/forgot-password`, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/reset-password`, data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await axiosClient.get<ApiResponse<UserResponse>>(`${API_URL}/me`);
    return response.data;
  },
};