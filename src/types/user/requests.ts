import { Gender } from '@/types/enums/genderType';

export interface CreateUserRequest {
  /**
   * Họ và tên
   * - Ánh xạ: @NotBlank
   */
  fullName: string;

  /**
   * Địa chỉ email
   * - Ánh xạ: @NotBlank, @Email
   * @format email
   */
  email: string;

  /**
   * Mật khẩu khởi tạo
   * - Ánh xạ: @NotBlank, @Size(min = 8)
   * @minLength 8
   */
  password: string;

  /** Số điện thoại */
  phone?: string;

  /**
   * ID của vai trò (Role) gán cho người dùng
   * - Ánh xạ: @NotNull
   */
  roleId: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  phone?: string;
  gender?: Gender;
  dob?: string;
  roleId?: number;
  isActive?: boolean;
}