export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleType = keyof typeof ROLES;
