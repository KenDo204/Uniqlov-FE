export interface GhnWebhookRequest {
  orderCode: string;
  status: string;
  exCode: string | null;
  reason: string | null;
  time: string;
}

export interface ShippingFeeRequest {
  toDistrictId: number;
  toWardCode: string;
  weightGram: number;
  serviceId: number;
}
