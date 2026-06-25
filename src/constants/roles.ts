export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  CUSTOMER: 'ROLE_CUSTOMER',
  STAFF: 'ROLE_STAFF'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];
