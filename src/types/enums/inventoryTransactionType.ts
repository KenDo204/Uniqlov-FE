export const InventoryTransactionType = {
  IMPORT: 'IMPORT',
  ORDER: 'ORDER',
  RETURN: 'RETURN',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export type InventoryTransactionType = typeof InventoryTransactionType[keyof typeof InventoryTransactionType];