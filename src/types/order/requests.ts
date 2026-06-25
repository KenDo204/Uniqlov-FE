import type { OrderStatus } from '@/types/enums/orderType';
import type { PaymentMethod } from '@/types/enums/paymentType';
import type { ShippingMethod } from '@/types/enums/shippingType';

export interface CheckoutRequest {
  cartItemIds: number[];
  addressId: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  note?: string;
}

export interface OrderCancelRequest {
  reason: string;
}

export interface OrderStatusUpdateRequest {
  newStatus: OrderStatus;
}