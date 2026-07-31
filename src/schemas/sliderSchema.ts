import { z } from 'zod';

export const sliderCreateSchema = z.object({
  imageUrl: z.string().trim().url('Đường dẫn ảnh banner không hợp lệ').max(500, 'URL ảnh tối đa 500 ký tự'),
  targetUrl: z.string().trim().url('Đường dẫn đính kèm không hợp lệ').max(500).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  displayOrder: z
    .coerce
    .number()
    .int('Thứ tự hiển thị phải là số nguyên')
    .min(1, 'Thứ tự hiển thị chỉ được là 1 hoặc 2')
    .max(2, 'Thứ tự hiển thị chỉ được là 1 hoặc 2'),
});
export type SliderCreateFormValues = z.infer<typeof sliderCreateSchema>;

export const sliderUpdateSchema = sliderCreateSchema.partial();
export type SliderUpdateFormValues = z.infer<typeof sliderUpdateSchema>;
