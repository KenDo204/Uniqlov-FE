import { z } from 'zod';

export const addressSchema = z.object({
  recipientName: z
    .string()
    .trim()
    .min(2, 'Họ và tên người nhận phải có ít nhất 2 ký tự')
    .max(50, 'Họ và tên người nhận không được quá 50 ký tự'),
  phone: z
    .string()
    .trim()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, 'Số điện thoại Việt Nam không hợp lệ (VD: 0912345678)'),
  provinceId: z.number().int().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  districtId: z.number().int().min(1, 'Vui lòng chọn Quận/Huyện'),
  wardCode: z.string().trim().min(1, 'Vui lòng chọn Phường/Xã').max(20, 'Mã Phường/Xã không được vượt quá 20 ký tự'),
  streetNumber: z
    .string()
    .trim()
    .min(5, 'Địa chỉ cụ thể (số nhà, đường...) phải có ít nhất 5 ký tự')
    .max(200, 'Địa chỉ cụ thể không được vượt quá 200 ký tự'),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
