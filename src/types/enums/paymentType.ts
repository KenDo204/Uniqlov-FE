export const PaymentMethod = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];