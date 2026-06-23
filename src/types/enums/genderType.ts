export const Gender = {
  FEMALE: 0,
  MALE: 1,
  OTHER: 2,
} as const;

export type TGender = typeof Gender[keyof typeof Gender];