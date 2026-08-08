import { z } from 'zod';
import { hasBadWords } from '@/utils/badWordsValidator';

export const createRoleSchema = z.object({
  roleName: z
    .string()
    .trim()
    .min(2, 'Tên vai trò phải từ 2 - 50 ký tự')
    .max(50, 'Tên vai trò tối đa 50 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Tên vai trò phải là chữ in hoa, không dấu'),
  description: z.string().trim().max(255, 'Mô tả không quá 255 ký tự').optional().refine((val) => !hasBadWords(val), 'Mô tả chứa từ ngữ không phù hợp'),
  permissionIds: z.array(z.number().int().positive()).min(1, 'Vui lòng gán ít nhất 1 quyền'),
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  description: z.string().trim().max(255, 'Mô tả không quá 255 ký tự').optional().refine((val) => !hasBadWords(val), 'Mô tả chứa từ ngữ không phù hợp'),
  permissionIds: z.array(z.number().int().positive()).min(1, 'Vui lòng gán ít nhất 1 quyền'),
});
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
