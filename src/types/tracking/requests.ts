export const Source = {
  // Home
  HOME_HERO_BANNER: 'HOME_HERO_BANNER',
  HOME_CATEGORY_LIST: 'HOME_CATEGORY_LIST',
  HOME_BEST_SELLER: 'HOME_BEST_SELLER',
  HOME_NEW_ARRIVAL: 'HOME_NEW_ARRIVAL',
  HOME_REC_FOR_YOU: 'HOME_REC_FOR_YOU',

  // Product Detail
  PRODUCT_MAIN_INFO: 'PRODUCT_MAIN_INFO',
  PRODUCT_REC_SIMILAR: 'PRODUCT_REC_SIMILAR',
  PRODUCT_REC_BOUGHT_TOGETHER: 'PRODUCT_REC_BOUGHT_TOGETHER',

  // Search & Category
  CATEGORY_GRID: 'CATEGORY_GRID',
  SEARCH_RESULT: 'SEARCH_RESULT',
  HEADER_MEGA_MENU: 'HEADER_MEGA_MENU',

  // Cart & Checkout
  CART_DRAWER: 'CART_DRAWER',
  CART_PAGE: 'CART_PAGE',
  CHECKOUT_PAGE: 'CHECKOUT_PAGE',

  // User
  WISHLIST_PAGE: 'WISHLIST_PAGE',
  ORDER_HISTORY: 'ORDER_HISTORY',

  // Default
  UNKNOWN: 'UNKNOWN'
} as const;

export type Source = typeof Source[keyof typeof Source];

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
  source?: Source;
}
