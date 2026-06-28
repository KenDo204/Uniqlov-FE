import { Gender } from '@/types/enums/genderType';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;

  /**
   * Loại token
   * @default "Bearer"
   */
  tokenType?: string;
}

export interface IntrospectResponse {
  valid: boolean;
}

export interface UserResponse {
    userId: number;
    email: string;
    fullName: string;
    gender?: Gender;
    phone?: string;
    dob?: string;
    isActive?: boolean;
    createdAt?: string;
    roleName?: string;
}