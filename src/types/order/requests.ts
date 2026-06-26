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

export interface FraudRequest {
  order_total_amount: number;
  payment_method: number;
  is_vpn_proxy: number;
  location_mismatch: number;
  orders_per_device_24h: number;
  account_age_days: number;
  reputation_score: number;
  failed_payment_attempts_10m: number;
  total_distinct_devices: number;
  return_rate: number;
}