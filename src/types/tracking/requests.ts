export type TrackingActionType = 
  | 'VIEW_ITEM' 
  | 'SEARCH' 
  | 'ADD_TO_CART' 
  | 'ADD_WISHLIST' 
  | 'PURCHASE' 
  | 'CLICK_REC';

export interface TrackingEventRequest {
  userId?: number | null;
  sessionId: string;
  productId?: number;
  categoryId?: number;
  actionType: TrackingActionType;
  keyword?: string;
  contextData?: string;
  variantId?: number;
  durationSeconds?: number;
  source?: string;
}
