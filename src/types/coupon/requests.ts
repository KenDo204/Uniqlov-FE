import { type DiscountType } from '../enums/discountType';
import { type CouponType } from '../enums/couponType';

export interface CouponApplyRequest {
    couponCode: string;
    orderAmount: number;
}

export interface CouponCreateRequest {
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
    couponType: CouponType;
    applicableConditions?: string;
}

export interface CouponUpdateRequest {
    description?: string;
    discountValue?: number;
    maxDiscountAmount?: number;
    minOrderAmount?: number;
    maxUsage?: number;
    userUsageLimit?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    applicableConditions?: string;
}