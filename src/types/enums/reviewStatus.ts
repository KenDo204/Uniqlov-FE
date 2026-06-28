export const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  HIDDEN: 'HIDDEN',
} as const;

export type ReviewStatus = typeof ReviewStatus[keyof typeof ReviewStatus];