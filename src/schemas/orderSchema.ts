import { z } from 'zod';
import { PaymentMethod } from '@/types/enums/paymentType';
import { ShippingMethod } from '@/types/enums/shippingType';
import { OrderStatus } from '@/types/enums/orderType';

/** 1. Checkout Schema */
export const checkoutSchema = z.object({
  cartItemIds: z
    .array(z.number().int().positive())
    .min(1, 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán'),
  addressId: z.number().int().positive('Vui lòng chọn địa chỉ giao hàng hợp lệ'),
  couponCodes: z
    .array(z.string().trim().max(50))
    .max(3, 'Chỉ được áp dụng tối đa 3 mã giảm giá cho một đơn hàng')
    .optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: 'Phương thức thanh toán không hợp lệ',
  }),
  shippingMethod: z.nativeEnum(ShippingMethod, {
    message: 'Phương thức vận chuyển không hợp lệ',
  }),
  note: z.string().trim().max(500, 'Ghi chú đơn hàng không được quá 500 ký tự').optional(),
});
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

/** 2. Order Cancel Schema */
export const orderCancelSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Lý do hủy đơn phải có ít nhất 5 ký tự')
    .max(500, 'Lý do hủy đơn không được vượt quá 500 ký tự'),
});
export type OrderCancelFormValues = z.infer<typeof orderCancelSchema>;

/** 3. Order Status Update Schema */
export const orderStatusUpdateSchema = z.object({
  newStatus: z.nativeEnum(OrderStatus, {
    message: 'Trạng thái đơn hàng không hợp lệ',
  }),
});
export type OrderStatusUpdateFormValues = z.infer<typeof orderStatusUpdateSchema>;
