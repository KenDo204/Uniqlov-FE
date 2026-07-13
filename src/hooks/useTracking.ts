import { useCallback, useRef, useEffect } from 'react';
import { useAppSelector } from '@/stores/hooks';
import { trackingService } from '@/services/trackingService';

import type { TrackingActionType, TrackingEventRequest } from '@/types/tracking';

export const useTracking = () => {
  const user = useAppSelector(state => state.auth.user);
  
  // Singleton cho Session ID
  const sessionId = useRef<string>('');

  useEffect(() => {
    let sid = localStorage.getItem('sessionId');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('sessionId', sid);
    }
    sessionId.current = sid;
  }, []);

  const trackEvent = useCallback((actionType: TrackingActionType, payload: Partial<TrackingEventRequest> = {}) => {
    const sid = sessionId.current || localStorage.getItem('sessionId');
    if (!sid) return; // Không có session id thì bỏ qua (hiếm khi xảy ra)
    
    // Gửi Tracking dưới nền, không block UI
    trackingService.trackEvent({
      userId: user?.userId || null,
      sessionId: sid,
      actionType,
      ...payload,
    });
  }, [user]);

  // Các hàm tiện ích (Wrapper)
  const trackView = useCallback((productId: number, categoryId?: number) => {
    trackEvent('VIEW_ITEM', { productId, categoryId, source: window.location.pathname });
  }, [trackEvent]);

  const trackSearch = useCallback((keyword: string) => {
    trackEvent('SEARCH', { keyword, source: window.location.pathname });
  }, [trackEvent]);

  const trackAddToCart = useCallback((variantId: number, quantity: number) => {
    trackEvent('ADD_TO_CART', { variantId, contextData: JSON.stringify({ quantity }), source: window.location.pathname });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderId: number, paymentMethod: string) => {
    trackEvent('PURCHASE', { 
      contextData: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }),
      source: window.location.pathname 
    });
  }, [trackEvent]);

  const trackWishlist = useCallback((productId: number, location: string = 'product_page') => {
    trackEvent('ADD_WISHLIST', { 
      productId, 
      contextData: JSON.stringify({ location }),
      source: window.location.pathname 
    });
  }, [trackEvent]);

  const trackClickRecommendation = useCallback((productId: number, aiModel: string, rankPosition: number) => {
    trackEvent('CLICK_REC', { 
      productId,
      contextData: JSON.stringify({ ai_model: aiModel, rank_position: rankPosition }),
      source: window.location.pathname 
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackView,
    trackSearch,
    trackAddToCart,
    trackPurchase,
    trackWishlist,
    trackClickRecommendation
  };
};
