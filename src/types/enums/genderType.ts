export const Gender = {
  FEMALE: 'FEMALE',
  MALE: 'MALE',
  OTHER: 'OTHER',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];