import type { CouponResponse } from '@/types/coupon/responses';

export const getOptimalCoupon = (
  coupons: CouponResponse[],
  orderAmount: number
): {
  coupon: CouponResponse | null;
  discountAmount: number;
} => {
  if (!coupons || coupons.length === 0) {
    return { coupon: null, discountAmount: 0 };
  }

  const now = new Date();

  // 1. Filter valid coupons
  const validCoupons = coupons.filter((coupon) => {
    // Must be active
    if (!coupon.isActive) return false;

    // Must be within date range
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    if (now < startDate || now > endDate) return false;

    // Must meet min order value
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) return false;

    return true;
  });

  if (validCoupons.length === 0) {
    return { coupon: null, discountAmount: 0 };
  }

  // 2. Map coupons with their actual discount amount for this order
  const couponsWithDiscount = validCoupons.map((coupon) => {
    let actualDiscount = 0;

    if (coupon.discountType === 'FIXED_AMOUNT') {
      actualDiscount = coupon.discountValue;
    } else if (coupon.discountType === 'PERCENTAGE') {
      actualDiscount = Math.round(orderAmount * (coupon.discountValue / 100));
      if (coupon.maxDiscountAmount && actualDiscount > coupon.maxDiscountAmount) {
        actualDiscount = coupon.maxDiscountAmount;
      }
    }

    // Discount cannot exceed order amount
    actualDiscount = Math.min(actualDiscount, orderAmount);

    return {
      coupon,
      actualDiscount,
    };
  });

  // 3. Sort coupons to find the optimal one
  couponsWithDiscount.sort((a, b) => {
    // Rule 1: Highest discount amount
    if (a.actualDiscount !== b.actualDiscount) {
      return b.actualDiscount - a.actualDiscount;
    }

    // Rule 2: Highest discount percentage (if amount is the same)
    // To compare fairly, we check if one is percentage
    const aIsPercentage = a.coupon.discountType === 'PERCENTAGE';
    const bIsPercentage = b.coupon.discountType === 'PERCENTAGE';
    if (aIsPercentage !== bIsPercentage) {
      return aIsPercentage ? -1 : 1;
    }
    if (aIsPercentage && bIsPercentage) {
      if (a.coupon.discountValue !== b.coupon.discountValue) {
        return b.coupon.discountValue - a.coupon.discountValue;
      }
    }

    // Rule 3: Nearest expiry date
    const aEndDate = new Date(a.coupon.endDate).getTime();
    const bEndDate = new Date(b.coupon.endDate).getTime();
    if (aEndDate !== bEndDate) {
      return aEndDate - bEndDate; // Ascending (sooner expiry wins)
    }

    // Rule 4: Lowest minOrderValue
    const aMin = a.coupon.minOrderAmount || 0;
    const bMin = b.coupon.minOrderAmount || 0;
    return aMin - bMin; // Ascending
  });

  return {
    coupon: couponsWithDiscount[0].coupon,
    discountAmount: couponsWithDiscount[0].actualDiscount,
  };
};
