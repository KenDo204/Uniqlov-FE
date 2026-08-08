import { type OtpType } from '../enums/otpType';

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  registrationToken: string;
  fullName: string;
  password: string;
  phone?: string;
}

/**
 * Dữ liệu yêu cầu quên mật khẩu
 */
export interface ForgotPasswordRequest {
  /**
   * @format email
   */
  email: string;
}

export interface ResendOtpRequest {
  /**
   * @format email
   */
  email: string;

  /** Loại OTP cần gửi lại (Kích hoạt hoặc Quên mật khẩu) */
  type: OtpType;
}

export interface ResetPasswordRequest {
  /**
   * @format email
   */
  email: string;

  /**
   * Mã OTP xác thực
   * @minLength 6
   * @maxLength 6
   */
  otp: string;

  /**
   * Mật khẩu mới
   * @minLength 8
   */
  newPassword: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}

export interface OAuth2ExchangeRequest {
  code: string;
}

