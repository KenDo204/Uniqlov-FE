export interface GhnCreateOrderResponse {
  orderCode: string;
  totalFee: number;
  expectedDeliveryTime: string;
}

export interface GhnDistrictResponse {
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
}

export interface GhnProvinceResponse {
  ProvinceID: number;
  ProvinceName: string;
}

export interface GhnServiceResponse {
  service_id: number;
  service_type_id: number;
  short_name: string;
}

export interface GhnShippingFeeResponse {
  total: number;
  serviceFee: number;
  insuranceFee: number;
  serviceId: number;
  shortName: string;
}

export interface GhnWardResponse {
  WardCode: string;
  WardName: string;
  DistrictID: number;
}
