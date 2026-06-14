import { z } from 'zod';

export const userSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không đúng định dạng'),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, 'Số điện thoại Việt Nam không hợp lệ'),
  role: z.enum(['ADMIN', 'OWNER', 'CUSTOMER']),
});

export type UserFormValues = z.infer<typeof userSchema>;
