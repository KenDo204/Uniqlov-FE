import { z } from 'zod';
import { hasBadWords } from '@/utils/badWordsValidator';

/** 1. Category Create Schema */
export const categoryCreateSchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(200, 'Tên danh mục không được vượt quá 200 ký tự')
    .refine((val) => !hasBadWords(val), 'Tên danh mục chứa từ ngữ không phù hợp'),
  parentId: z.number().int().positive('ID danh mục cha phải là số dương').optional(),
  iconUrl: z.string().trim().url('URL icon không hợp lệ').max(500, 'URL icon tối đa 500 ký tự').optional().or(z.literal('')),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị không được âm').optional(),
});
export type CategoryCreateFormValues = z.infer<typeof categoryCreateSchema>;

/** 2. Category Update Schema */
export const categoryUpdateSchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(200, 'Tên danh mục không được vượt quá 200 ký tự')
    .refine((val) => !hasBadWords(val), 'Tên danh mục chứa từ ngữ không phù hợp'),
  categoryStatus: z.number().int().min(0, 'Trạng thái danh mục không hợp lệ'),
  iconUrl: z.string().trim().url('URL icon không hợp lệ').max(500).optional().or(z.literal('')),
  displayOrder: z.number().int().min(0, 'Thứ tự hiển thị không được âm').optional(),
});
export type CategoryUpdateFormValues = z.infer<typeof categoryUpdateSchema>;
