export type InventoryTransactionType = 
  | 'IMPORT'     // Nhập kho từ nhà cung cấp / phiếu nhập thủ công
  | 'ORDER'      // Xuất kho do đơn hàng
  | 'RETURN'     // Hoàn trả hàng từ khách
  | 'ADJUSTMENT';