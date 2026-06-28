export const SystemDecision = {
  APPROVE: 'APPROVE',
  REVIEW: 'REVIEW',
  DECLINE: 'DECLINE',
} as const;

export type SystemDecision = typeof SystemDecision[keyof typeof SystemDecision];
