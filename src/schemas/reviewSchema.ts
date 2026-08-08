import { z } from 'zod';
import { hasBadWords } from '@/utils/badWordsValidator';
import { ReviewStatus } from '@/types/enums/reviewStatus';

/** 1. Create Review Schema */
export const createReviewSchema = z.object({
  productId: z.number().int().positive('ID sản phẩm không hợp lệ'),
  orderId: z.number().int().positive('ID đơn hàng không hợp lệ').nullable().optional(),
  rating: z
    .number()
    .int('Điểm đánh giá phải là số nguyên')
    .min(1, 'Đánh giá tối thiểu 1 sao')
    .max(5, 'Đánh giá tối đa 5 sao'),
  comment: z
    .string()
    .trim()
    .min(5, 'Nội dung đánh giá phải có ít nhất 5 ký tự')
    .max(1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự')
    .refine((val) => !hasBadWords(val), 'Nội dung đánh giá chứa từ ngữ không phù hợp'),
  imageUrls: z
    .array(z.string().trim().url('URL hình ảnh không hợp lệ').max(500))
    .max(5, 'Tối đa 5 hình ảnh đánh giá')
    .default([]),
});
export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;

/** 2. Update Review Status Schema */
export const updateReviewStatusSchema = z.object({
  status: z.nativeEnum(ReviewStatus, {
    message: 'Trạng thái đánh giá không hợp lệ',
  }),
});
export type UpdateReviewStatusFormValues = z.infer<typeof updateReviewStatusSchema>;
