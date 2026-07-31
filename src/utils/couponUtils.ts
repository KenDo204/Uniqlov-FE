import type { CouponResponse } from '@/types/coupon/responses';
import type { CartItem } from '@/stores/slices/cartSlice';

export interface OrderFinancials {
  subtotal: number;
  shippingFee: number;
  shopDiscount: number;
  shippingDiscount: number;
  paymentDiscount: number;
  grandTotal: number;
  errors: string[];
  warnings: Record<number, string>;
  validCoupons: CouponResponse[];
}

export const calculateOrderFinancials = (
  items: CartItem[],
  baseShippingFee: number,
  appliedCoupons: CouponResponse[],
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | string
): OrderFinancials => {
  // 1. Tính Subtotal: Σ(totalMoney) thay vì price * quantity
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = typeof item.totalMoney === 'number' ? item.totalMoney : item.price * item.quantity;
    return sum + itemTotal;
  }, 0);

  let shippingFee = baseShippingFee;
  let shopDiscount = 0;
  let shippingDiscount = 0;
  let paymentDiscount = 0;
  const errors: string[] = [];
  const warnings: Record<number, string> = {};
  const validCoupons: CouponResponse[] = [];

  const now = new Date();

  const calculateDiscount = (coupon: CouponResponse, baseAmount: number) => {
    let discount = 0;
    if (coupon.discountType === 'FIXED_AMOUNT') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round(baseAmount * (coupon.discountValue / 100));
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    }
    return discount;
  };

  // 2. Lọc mã hợp lệ (Tối đa 1 SHOP_VOUCHER, 1 FREE_SHIPPING, 1 PAYMENT_VOUCHER)
  const shopCoupons = appliedCoupons.filter(c => c.couponType === 'SHOP_VOUCHER');
  const shippingCoupons = appliedCoupons.filter(c => c.couponType === 'FREE_SHIPPING');
  const paymentCoupons = appliedCoupons.filter(c => c.couponType === 'PAYMENT_VOUCHER');
  
  const activeShopCoupon = shopCoupons.length > 0 ? shopCoupons[0] : null;
  const activeShippingCoupon = shippingCoupons.length > 0 ? shippingCoupons[0] : null;
  const activePaymentCoupon = paymentCoupons.length > 0 ? paymentCoupons[0] : null;

  // Thứ tự xử lý: SHOP_VOUCHER -> FREE_SHIPPING -> PAYMENT_VOUCHER
  const couponsToProcess = [activeShopCoupon, activeShippingCoupon, activePaymentCoupon].filter(Boolean) as CouponResponse[];

  // 3. Phân loại và xử lý Coupons
  couponsToProcess.forEach((coupon) => {
    if (!coupon.isActive) {
      errors.push(`Mã ${coupon.code} hiện không hoạt động.`);
      return;
    }
    
    if (coupon.startDate && coupon.endDate) {
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);
      if (now < startDate || now > endDate) {
        errors.push(`Mã ${coupon.code} đã hết hạn hoặc chưa đến thời gian sử dụng.`);
        return;
      }
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      errors.push(`Mã ${coupon.code} yêu cầu giá trị tối thiểu là ${coupon.minOrderAmount}.`);
      return;
    }

    if (coupon.couponType === 'SHOP_VOUCHER') {
      let discount = calculateDiscount(coupon, subtotal);
      discount = Math.min(discount, subtotal);
      shopDiscount += discount;
      validCoupons.push(coupon);
    } 
    else if (coupon.couponType === 'FREE_SHIPPING') {
      let discount = calculateDiscount(coupon, subtotal); 
      discount = Math.min(discount, shippingFee);
      shippingDiscount += discount;
      validCoupons.push(coupon);
    }
    else if (coupon.couponType === 'PAYMENT_VOUCHER') {
      let isPaymentValid = false;
      try {
        if (coupon.applicableConditions) {
          const conditions = JSON.parse(coupon.applicableConditions);
          if (Array.isArray(conditions.payment_methods)) {
            if (conditions.payment_methods.includes(paymentMethod.toUpperCase())) {
              isPaymentValid = true;
            }
          } else if (conditions.payment_method) {
            if (String(conditions.payment_method).toUpperCase() === paymentMethod.toUpperCase()) {
              isPaymentValid = true;
            }
          } else {
            isPaymentValid = true;
          }
        } else {
          isPaymentValid = true;
        }
      } catch (e) {
        isPaymentValid = true;
      }

      if (!isPaymentValid) {
        errors.push(`Mã ${coupon.code} không áp dụng cho phương thức thanh toán hiện tại.`);
        return;
      }

      let discount = calculateDiscount(coupon, subtotal);
      const remainingSubtotal = Math.max(0, subtotal - shopDiscount);
      discount = Math.min(discount, remainingSubtotal);
      paymentDiscount += discount;
      validCoupons.push(coupon);
    }
  });

  const grandTotal = Math.max(0, subtotal - shopDiscount) 
                     + Math.max(0, shippingFee - shippingDiscount) 
                     - paymentDiscount;

  return {
    subtotal,
    shippingFee,
    shopDiscount,
    shippingDiscount,
    paymentDiscount,
    grandTotal: Math.max(0, grandTotal),
    errors,
    warnings,
    validCoupons
  };
};
