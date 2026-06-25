export type OrderStatus = 
  | 'PENDING' 
  | 'PENDING_PAYMENT' 
  | 'AWAITING_SHIPMENT' 
  | 'SHIPPING' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'RETURNED' 
  | 'REFUND_FAILED';