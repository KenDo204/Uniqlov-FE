import { type OtpType } from '../enums/otpType';
export interface ActivateAccountRequest {
  /**
   * Địa chỉ email cần kích hoạt
   * - Ánh xạ từ: @NotBlank, @Email
   * @format email
   */
  email: string;

  /**
   * Mã OTP xác thực gửi về email
   * - Ánh xạ từ: @NotBlank, @Size(min = 6, max = 6)
   * @minLength 6
   * @maxLength 6
   */
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  /** Bắt buộc nhập */
  fullName: string;

  /**
   * @format email
   */
  email: string;

  /**
   * Mật khẩu người dùng
   * @minLength 8
   */
  password: string;

  /** Số điện thoại (Không bắt buộc) */
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
