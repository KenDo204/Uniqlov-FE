export interface GhnWebhookRequest {
  OrderCode: string;
  Status: string;
  ExCode: string | null;
  Reason: string | null;
  Time: string;
}

export interface ShippingFeeRequest {
  toDistrictId: number;
  toWardCode: string;
  weightGram: number;
  serviceId?: number;
}
