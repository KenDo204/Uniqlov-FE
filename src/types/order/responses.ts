import { type OrderStatus } from '@/types/enums/orderType';
import { type PaymentMethod } from '@/types/enums/paymentType';
import { type ShippingMethod } from '@/types/enums/shippingType';

export interface AddressResponse {
  addressId: number;
  recipientName: string;
  phone: string;
  fullAddress: string;
  streetNumber: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
}

export interface CheckoutResponse {
  orderId: number;
  orderStatus: OrderStatus;
  finalPaymentMoney: number;
  paymentUrl: string | null;
}

export interface OrderDetailResponse {
  orderDetailId: number;
  variantId: number;
  skuCode: string;
  productName: string;
  variantAttributes: Record<string, any>; // Thay thế cho Object của Java
  price: number;
  quantity: number;
  totalMoney: number;
  itemStatus?: string;
}

export interface OrderResponse {
  orderId: number;
  orderDate: string; // Sử dụng string cho LocalDate (YYYY-MM-DD)
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  note?: string;

  totalProductMoney: number;
  shopDiscountAmount: number;
  originalShippingFee: number;
  shippingDiscountAmount: number;
  paymentDiscountAmount: number;
  finalPaymentMoney: number;

  address: AddressResponse;
  items: OrderDetailResponse[];
}

export interface OrderSummaryResponse {
  orderId: number;
  orderDate: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  finalPaymentMoney: number;
  itemCount: number;
}