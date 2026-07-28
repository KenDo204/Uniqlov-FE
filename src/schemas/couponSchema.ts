import { z } from 'zod';
import { DiscountType } from '@/types/enums/discountType';
import { CouponType } from '@/types/enums/couponType';

/** 1. Coupon Apply Schema */
export const couponApplySchema = z.object({
  couponCode: z
    .string()
    .trim()
    .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
    .max(20, 'Mã giảm giá không quá 20 ký tự')
    .regex(/^[A-Z0-9_-]+$/i, 'Mã giảm giá chỉ chứa chữ cái và số'),
  orderAmount: z.number().positive('Tổng giá trị đơn hàng phải > 0'),
  shippingFee: z.number().min(0, 'Phí vận chuyển không được âm').optional(),
});
export type CouponApplyFormValues = z.infer<typeof couponApplySchema>;

/** 2. Coupon Create Schema */
export const couponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Mã giảm giá từ 3 - 20 ký tự')
    .max(20, 'Mã giảm giá tối đa 20 ký tự')
    .regex(/^[A-Z0-9_-]+$/, 'Mã giảm giá chỉ gồm chữ hoa, số, dấu gạch ngang'),
  description: z.string().trim().max(500, 'Mô tả không quá 500 ký tự').optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive('Giá trị giảm giá phải lớn hơn 0'),
  maxDiscountAmount: z.number().positive('Mức giảm tối đa phải > 0').optional(),
  minOrderAmount: z.number().min(0, 'Đơn hàng tối thiểu không được âm').optional(),
  maxUsage: z.number().int().positive('Số lượt dùng tối đa phải > 0').optional(),
  userUsageLimit: z.number().int().positive('Giới hạn/người dùng phải > 0').optional(),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  couponType: z.nativeEnum(CouponType),
  applicableConditions: z.string().trim().max(1000).optional(),
});
export type CouponCreateFormValues = z.infer<typeof couponCreateSchema>;
