import { z } from 'zod';

/** 1. Contact Message Request Schema */
export const contactMessageSchema = z.object({
  guestName: z.string().trim().max(50, 'Tên người gửi không quá 50 ký tự').optional(),
  guestEmail: z.string().trim().email('Định dạng email không hợp lệ').max(100, 'Email không quá 100 ký tự').optional().or(z.literal('')),
  subject: z
    .string()
    .trim()
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự')
    .max(150, 'Tiêu đề không được quá 150 ký tự'),
  content: z
    .string()
    .trim()
    .min(10, 'Nội dung liên hệ phải có ít nhất 10 ký tự')
    .max(2000, 'Nội dung liên hệ không được vượt quá 2000 ký tự'),
});
export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;

/** 2. Contact Status Request Schema */
export const contactMessageStatusSchema = z.object({
  status: z.enum(['RESOLVED', 'REJECTED'], {
    message: 'Trạng thái xử lý không hợp lệ',
  }),
});
export type ContactMessageStatusFormValues = z.infer<typeof contactMessageStatusSchema>;
