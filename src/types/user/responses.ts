import { Gender } from '@/types/enums/genderType';

export interface UserDetailResponse {
  userId: number;
  email: string;
  fullName: string;

  gender?: Gender;
  
  phone?: string;

  dob?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt?: string;

  roleName: string;

  roleId: number;
}