export interface Coupon {
  coupon_id: number;
  code: string;
  description: string;
  coupon_type: 'SHOP_VOUCHER' | 'FREE_SHIPPING' | 'PAYMENT_VOUCHER';
  discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
}

export const mockCoupons: Coupon[] = [
  {
    coupon_id: 1,
    code: 'WELCOME50',
    description: 'Giảm 50k cho đơn hàng từ 500k',
    coupon_type: 'SHOP_VOUCHER',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 50000,
    min_order_amount: 500000,
    max_discount_amount: null
  },
  {
    coupon_id: 2,
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển toàn quốc (tối đa 30k)',
    coupon_type: 'FREE_SHIPPING',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 30000,
    min_order_amount: 0,
    max_discount_amount: null
  },
  {
    coupon_id: 3,
    code: 'VNPAY10',
    description: 'Giảm 10% tối đa 100k qua VNPAY',
    coupon_type: 'PAYMENT_VOUCHER',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    min_order_amount: 1000000,
    max_discount_amount: 100000
  }
];