export const OtpType = {
  ACTIVATION: 'ACTIVATION',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type OtpType = typeof OtpType[keyof typeof OtpType];