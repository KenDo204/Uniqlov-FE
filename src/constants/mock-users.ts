export interface UserAddress {
  address_id: number;
  recipient_name: string;
  phone: string;
  province_id: number;
  district_id: number;
  ward_code: string;
  street_number: string;
  full_address: string;
  is_default: boolean;
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  gender: number; // 0: Nữ, 1: Nam, 2: Khác
  phone: string;
  dob: string;
  is_active: boolean;
  role_id: number;
  password: string;
  addresses: UserAddress[];
}

export const mockCurrentUser: User = {
  user_id: 99,
  email: 'khoi.dta.2004@gmail.com',
  full_name: 'Đỗ Tiến Anh Khôi',
  gender: 1,
  phone: '0901234567',
  dob: '2004-11-29',
  is_active: true,
  password: '123456',
  role_id: 3,
  addresses: [
    {
      address_id: 201,
      recipient_name: 'Đỗ Tiến Anh Khôi',
      phone: '0901234567',
      province_id: 202,
      district_id: 1452,
      ward_code: '21609',
      street_number: 'Số 123, Đường Nguyễn Văn Cừ',
      full_address: 'Số 123, Đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh',
      is_default: true
    }
  ]
};