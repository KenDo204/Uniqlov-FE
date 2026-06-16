import { type ApiResponse } from './mock-data-home';

export interface UserProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  gender: number; // 0: Nữ, 1: Nam, 2: Khác
  dob: string;    // Định dạng YYYY-MM-DD
  is_active: boolean;
  role_id: number;
}

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
  user_id: number;
}

export interface AccountManagementData {
  userProfile: UserProfile;
  userAddresses: UserAddress[];
}

export const mockDataAccount: ApiResponse<AccountManagementData> = {
  status: 200,
  message: "Lấy thông tin quản lý tài khoản thành công",
  errorCode: null,
  data: {
    userProfile: {
      user_id: 99,
      full_name: "Đỗ Tiến Anh Khôi",
      email: "khoi.dta.2004@gmail.com",
      phone: "0901234567",
      gender: 1,
      dob: "2004-11-29",
      is_active: true,
      role_id: 3
    },
    userAddresses: [
      {
        address_id: 201,
        recipient_name: "Đỗ Tiến Anh Khôi",
        phone: "0901234567",
        province_id: 202,
        district_id: 1452,
        ward_code: "21609",
        street_number: "Số 123, Đường Nguyễn Văn Cừ",
        full_address: "Số 123, Đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh",
        is_default: true,
        user_id: 99
      },
      {
        address_id: 202,
        recipient_name: "Chị Sáng (Nhà bố mẹ)",
        phone: "0909876543",
        province_id: 202,
        district_id: 1444,
        ward_code: "21502",
        street_number: "Chung cư Sunrise City, Block A",
        full_address: "Chung cư Sunrise City, Block A, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
        is_default: false,
        user_id: 99
      }
    ]
  }
};