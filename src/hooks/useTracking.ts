import { useCallback, useRef, useEffect } from 'react';
import { useAppSelector } from '@/stores/hooks';
import { trackingService } from '@/services/trackingService';

import { Source, type TrackingActionType, type TrackingEventRequest } from '@/types/tracking/requests';

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'other';
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) browser = 'chrome';
  else if (ua.includes('Firefox')) browser = 'firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari';
  else if (ua.includes('Edg')) browser = 'edge';
  else if (ua.includes('OPR')) browser = 'opera';

  let device = 'desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    device = 'mobile';
  }
  return { browser, device };
};

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
  const trackView = useCallback((productId: number, categoryId?: number, source: Source = Source.PRODUCT_MAIN_INFO, durationSeconds?: number) => {
    const { device, browser } = getDeviceInfo();
    trackEvent('VIEW_ITEM', { 
      productId, 
      categoryId, 
      source,
      durationSeconds,
      contextData: JSON.stringify({ 
        current_url: window.location.pathname,
        device,
        browser
      })
    });
  }, [trackEvent]);

  const trackSearch = useCallback((keyword: string, resultCount: number = 0, source: Source = Source.HEADER_MEGA_MENU) => {
    trackEvent('SEARCH', { 
      keyword, 
      source,
      contextData: JSON.stringify({ 
        keyword,
        result_count: resultCount,
        current_url: window.location.pathname
      })
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((variantId: number, quantity: number, color: string, size: string, source: Source = Source.UNKNOWN) => {
    trackEvent('ADD_TO_CART', { 
      variantId, 
      source,
      contextData: JSON.stringify({ quantity, color, size })
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderId: number, paymentMethod: string, totalAmount: number, couponCode: string = '', source: Source = Source.CHECKOUT_PAGE) => {
    trackEvent('PURCHASE', { 
      source,
      contextData: JSON.stringify({ 
        order_id: orderId, 
        payment_method: paymentMethod,
        total_amount: totalAmount,
        coupon_code: couponCode
      })
    });
  }, [trackEvent]);

  const trackWishlist = useCallback((productId: number, color: string = '', size: string = '', location: string = '', source: Source = Source.UNKNOWN) => {
    trackEvent('ADD_WISHLIST', { 
      productId, 
      source,
      contextData: JSON.stringify({ location, color, size })
    });
  }, [trackEvent]);

  const trackClickRecommendation = useCallback((productId: number, aiModel: string, recommendationType: string, rankPosition: number, source: Source = Source.PRODUCT_REC_SIMILAR) => {
    trackEvent('CLICK_REC', { 
      productId,
      source,
      contextData: JSON.stringify({ 
        algorithm: aiModel, 
        recommendation_type: recommendationType,
        rank_position: rankPosition 
      })
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
