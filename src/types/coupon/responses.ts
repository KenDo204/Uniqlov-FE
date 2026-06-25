import { type DiscountType } from '../enums/discountType';
import { type CouponType } from '../enums/couponType';

export interface CouponApplyResponse {
    couponCode: string;
    couponType: CouponType;
    originalOrderAmount: number;
    discountAmount: number;
    finalOrderAmount: number;
    description?: string;
}

export interface CouponResponse {
    couponId: number;
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    maxUsage?: number;
    userUsageLimit?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    applicableConditions?: string;
    couponType: CouponType;
    createdAt: string;
}