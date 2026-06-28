export const ShippingMethod = {
  STANDARD: 'STANDARD',
  EXPRESS: 'EXPRESS',
} as const;

export type ShippingMethod = typeof ShippingMethod[keyof typeof ShippingMethod];