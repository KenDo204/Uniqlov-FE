export const CouponType = {
  SHOP_VOUCHER: 'SHOP_VOUCHER',
  FREE_SHIPPING: 'FREE_SHIPPING',
  PAYMENT_VOUCHER: 'PAYMENT_VOUCHER',
} as const;

export type CouponType = typeof CouponType[keyof typeof CouponType];