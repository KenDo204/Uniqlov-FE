import { z } from 'zod';

export const sliderCreateSchema = z.object({
  imageUrl: z.string().trim().url('Đường dẫn ảnh banner không hợp lệ').max(500, 'URL ảnh tối đa 500 ký tự'),
  targetUrl: z.string().trim().url('Đường dẫn đính kèm không hợp lệ').max(500).optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị không được âm').optional(),
});
export type SliderCreateFormValues = z.infer<typeof sliderCreateSchema>;

export const sliderUpdateSchema = sliderCreateSchema.partial();
export type SliderUpdateFormValues = z.infer<typeof sliderUpdateSchema>;
