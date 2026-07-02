export interface CreateAddressRequest {
  recipientName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  streetNumber: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  recipientName: string;
  phone: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
  streetNumber: string;
  isDefault: boolean;
}
