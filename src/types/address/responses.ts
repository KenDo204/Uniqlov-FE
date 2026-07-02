export interface AddressResponse {
  addressId: number;
  recipientName: string;
  phone: string;

  provinceId: number;
  provinceName: string;

  districtId: number;
  districtName: string;

  wardCode: string;
  wardName: string;

  streetNumber: string;
  fullAddress: string;
  isDefault: boolean;
}