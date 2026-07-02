import { z } from 'zod';

export const addressSchema = z.object({
  recipientName: z.string().min(2, 'Họ và tên người nhận phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, 'Số điện thoại Việt Nam không hợp lệ'),
  provinceId: z.number().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  districtId: z.number().min(1, 'Vui lòng chọn Quận/Huyện'),
  wardCode: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
  streetNumber: z.string().min(5, 'Địa chỉ cụ thể (số nhà, đường...) phải có ít nhất 5 ký tự'),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
