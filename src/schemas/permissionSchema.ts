import { z } from 'zod';

export const createPermissionSchema = z.object({
  permissionName: z
    .string()
    .trim()
    .min(3, 'Tên định danh quyền từ 3 - 50 ký tự')
    .max(50, 'Tên định danh quyền tối đa 50 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Tên quyền phải là chữ in hoa, ví dụ USER_CREATE'),
  description: z.string().trim().max(255, 'Mô tả không quá 255 ký tự').optional(),
});
export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;

export const updatePermissionSchema = z.object({
  description: z.string().trim().max(255, 'Mô tả không quá 255 ký tự').optional(),
});
export type UpdatePermissionFormValues = z.infer<typeof updatePermissionSchema>;
