import { z } from 'zod';

export const cartItemSchema = z.object({
  variantId: z.number().int().positive('ID biến thể sản phẩm phải là số nguyên dương'),
  quantity: z
    .number()
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng tối thiểu là 1')
    .max(99, 'Số lượng mua tối đa cho mỗi sản phẩm là 99'),
  note: z.string().trim().max(255, 'Ghi chú không được quá 255 ký tự').optional(),
});

export type CartItemFormValues = z.infer<typeof cartItemSchema>;
