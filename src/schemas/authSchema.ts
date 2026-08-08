import { z } from 'zod';

/** 1. Login Schema */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Định dạng email không hợp lệ')
    .max(100, 'Email không được vượt quá 100 ký tự'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .max(64, 'Mật khẩu không được vượt quá 64 ký tự'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

/** 2. Register Schema */
export const registerSchema = z.object({
  registrationToken: z.string().min(1, 'Thiếu token đăng ký'),
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải từ 2 đến 50 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải từ 8 đến 64 ký tự')
    .max(64, 'Mật khẩu tối đa 64 ký tự'),
  phone: z
    .union([
      z.string().trim().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại Việt Nam không hợp lệ (VD: 0912345678)'),
      z.literal('')
    ])
    .optional(),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

/** 3. OTP Schema */
export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Mã OTP phải bao gồm 6 chữ số')
    .regex(/^[0-9]{6}$/, 'Mã OTP chỉ chứa các chữ số từ 0-9'),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

/** 4. Send OTP Schema */
export const sendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Định dạng email không hợp lệ')
    .max(100, 'Email không được vượt quá 100 ký tự'),
});
export type SendOtpFormValues = z.infer<typeof sendOtpSchema>;

/** 5. Forgot Password Schema */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Định dạng email không hợp lệ')
    .max(100, 'Email không được vượt quá 100 ký tự'),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/** 6. Reset Password Schema */
export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Định dạng email không hợp lệ').max(100),
    otp: z.string().trim().length(6, 'Mã OTP phải bao gồm 6 chữ số').regex(/^[0-9]{6}$/, 'Mã OTP chỉ chứa các chữ số từ 0-9'),
    password: z.string().min(8, 'Mật khẩu phải từ 8 đến 64 ký tự').max(64, 'Mật khẩu tối đa 64 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/** 7. OAuth2 Exchange Request Schema */
export const oauth2ExchangeSchema = z.object({
  code: z.string().trim().min(1, 'Authorization Code không được để trống').max(255, 'Mã không được vượt quá 255 ký tự'),
});
export type OAuth2ExchangeFormValues = z.infer<typeof oauth2ExchangeSchema>;
