import { z } from 'zod';
import { hasBadWords } from '@/utils/badWordsValidator';
import { Gender } from '@/types/enums/genderType';

/** 1. Base User Schema */
export const userSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự')
    .refine((val) => !hasBadWords(val), 'Họ và tên chứa từ ngữ không phù hợp'),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Email không đúng định dạng')
    .max(100, 'Email không được vượt quá 100 ký tự'),
  phone: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, 'Số điện thoại Việt Nam không hợp lệ (VD: 0912345678)'),
  role: z.enum(['ADMIN', 'OWNER', 'CUSTOMER']),
});
export type UserFormValues = z.infer<typeof userSchema>;

/** 2. Create User Schema */
export const createUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự')
    .refine((val) => !hasBadWords(val), 'Họ và tên chứa từ ngữ không phù hợp'),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Email không đúng định dạng')
    .max(100, 'Email không được vượt quá 100 ký tự'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải từ 8 đến 64 ký tự')
    .max(64, 'Mật khẩu không được vượt quá 64 ký tự'),
  phone: z
    .union([
      z.string().trim().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại Việt Nam không hợp lệ'),
      z.literal('')
    ])
    .optional(),
  roleId: z.number({ message: 'Vui lòng chọn vai trò' }).int().positive('Role ID phải là số nguyên dương'),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

/** 3. Update User Schema */
export const updateUserSchema = z.object({
  fullName: z
    .string({ message: 'Vui lòng nhập họ và tên' })
    .trim()
    .min(1, 'Họ và tên là bắt buộc')
    .max(50, 'Họ và tên không được vượt quá 50 ký tự')
    .refine((val) => !hasBadWords(val), 'Họ và tên chứa từ ngữ không phù hợp'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Số điện thoại phải bao gồm đúng 10 chữ số')
    .optional()
    .or(z.literal('')),
  gender: z.nativeEnum(Gender).optional(),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải có định dạng YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
  roleId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  avatar: z.string().trim().url('Đường dẫn avatar không hợp lệ').max(500, 'URL không được quá 500 ký tự').optional().or(z.literal('')),
});
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

/** 4. Change Password Schema */
export const changePasswordSchema = z
  .object({
    otp: z.string().trim().length(6, 'Mã OTP phải bao gồm 6 chữ số').regex(/^[0-9]{6}$/, 'Mã OTP chỉ chứa các chữ số từ 0-9'),
    newPassword: z.string().min(8, 'Mật khẩu phải từ 8 đến 64 ký tự').max(64, 'Mật khẩu tối đa 64 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmPassword'],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
