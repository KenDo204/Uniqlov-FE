export interface UserDetailResponse {
  userId: number;
  email: string;
  fullName: string;

  gender?: number;
  
  phone?: string;

  dob?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt?: string;

  roleName: string;

  roleId: number;
}