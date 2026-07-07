export const Gender = {
  FEMALE: 0,
  MALE: 1,
  UNISEX: 2,
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.FEMALE]: 'Nữ',
  [Gender.MALE]: 'Nam',
  [Gender.UNISEX]: 'Unisex (Cả nam và nữ)',
};

// Mảng danh sách dùng để map thẳng vào Dropdown/Select Component
export const GENDER_OPTIONS = [
  { value: Gender.MALE, label: GENDER_LABELS[Gender.MALE] },     // { value: 1, label: 'Nam' }
  { value: Gender.FEMALE, label: GENDER_LABELS[Gender.FEMALE] }, // { value: 0, label: 'Nữ' }
  { value: Gender.UNISEX, label: GENDER_LABELS[Gender.UNISEX] }, // { value: 2, label: 'Unisex' }
];