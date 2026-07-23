import { useCallback, useRef, useEffect } from 'react';
import { useAppSelector } from '@/stores/hooks';
import { trackingService } from '@/services/trackingService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';

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

export interface AddToCartTrackingOptions {
  productId?: number;
  categoryId?: number;
  variantId?: number;
  quantity?: number;
  color?: string;
  size?: string;
  source?: Source;
}

export interface PurchaseItemTracking {
  productId?: number;
  categoryId?: number;
  variantId?: number;
  quantity?: number;
  price?: number;
}

export interface PurchaseTrackingOptions {
  orderId: number;
  items?: PurchaseItemTracking[];
  paymentMethod?: string;
  totalAmount?: number;
  couponCode?: string;
  source?: Source;
}

export const useTracking = () => {
  const user = useAppSelector(state => state.auth.user);
  const currentProductDetail = useAppSelector(state => state.product.currentProductDetail);
  const publicProductsData = useAppSelector(state => state.product.publicProductsData);
  const productsList = useAppSelector(state => state.product.productsList);

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

  /**
   * Helper thu thập và giải quyết productId & categoryId tự động từ dữ liệu hệ thống (Redux Store / State)
   */
  const resolveProductAndCategory = useCallback((
    rawProductId?: number | string | null,
    rawCategoryId?: number | string | null,
    rawVariantId?: number | string | null
  ): { productId?: number; categoryId?: number } => {
    let productId = rawProductId ? Number(rawProductId) : undefined;
    let categoryId = rawCategoryId ? Number(rawCategoryId) : undefined;
    const variantId = rawVariantId ? Number(rawVariantId) : undefined;

    if (productId && isNaN(productId)) productId = undefined;
    if (categoryId && isNaN(categoryId)) categoryId = undefined;

    // 1. Tìm productId nếu thiếu nhưng có variantId
    if (!productId && variantId) {
      if (currentProductDetail?.variants?.some((v) => Number(v.variantId) === variantId)) {
        productId = Number(currentProductDetail.productId);
        if (!categoryId && currentProductDetail.categoryId) {
          categoryId = Number(currentProductDetail.categoryId);
        }
      } else if (publicProductsData?.content) {
        const found = publicProductsData.content.find((p) => p.variants?.some((v) => Number(v.variantId) === variantId));
        if (found) {
          productId = Number(found.productId);
          if (!categoryId && found.categoryId) categoryId = Number(found.categoryId);
        }
      } else if (productsList?.length) {
        const found = productsList.find((p) => p.variants?.some((v) => Number(v.variantId) === variantId));
        if (found) {
          productId = Number(found.productId);
          if (!categoryId && found.categoryId) categoryId = Number(found.categoryId);
        }
      }
    }

    // 2. Tìm categoryId nếu chưa có nhưng đã có productId
    if (productId && !categoryId) {
      if (currentProductDetail && Number(currentProductDetail.productId) === productId && currentProductDetail.categoryId) {
        categoryId = Number(currentProductDetail.categoryId);
      } else if (publicProductsData?.content) {
        const found = publicProductsData.content.find((p) => Number(p.productId) === productId);
        if (found?.categoryId) categoryId = Number(found.categoryId);
      } else if (productsList?.length) {
        const found = productsList.find((p) => Number(p.productId) === productId);
        if (found?.categoryId) categoryId = Number(found.categoryId);
      }
    }

    return { productId, categoryId };
  }, [currentProductDetail, publicProductsData, productsList]);

  const categoryCache = useRef<Map<number, number>>(new Map());

  /**
   * Helper giải quyết productId & categoryId bất đồng bộ (tự động fetch API nếu thiếu categoryId)
   */
  const resolveProductAndCategoryAsync = useCallback(async (
    rawProductId?: number | string | null,
    rawCategoryId?: number | string | null,
    rawVariantId?: number | string | null
  ): Promise<{ productId?: number; categoryId?: number }> => {
    let { productId, categoryId } = resolveProductAndCategory(rawProductId, rawCategoryId, rawVariantId);

    if (productId && categoryCache.current.has(productId)) {
      categoryId = categoryCache.current.get(productId);
    }

    if (productId && !categoryId) {
      try {
        const res = await productService.getPublicProductById(productId);
        if (res?.result?.categoryId) {
          categoryId = Number(res.result.categoryId);
          categoryCache.current.set(productId, categoryId);
        }
      } catch (err) {
        console.warn(`[Tracking] Không thể fetch categoryId cho productId ${productId}:`, err);
      }
    }

    return { productId, categoryId };
  }, [resolveProductAndCategory]);

  const trackEvent = useCallback((actionType: TrackingActionType, payload: Partial<TrackingEventRequest> = {}) => {
    const sid = sessionId.current || localStorage.getItem('sessionId');
    if (!sid) return;

    // Giải quyết tự động productId và categoryId
    const { productId, categoryId } = resolveProductAndCategory(
      payload.productId,
      payload.categoryId,
      payload.variantId
    );

    // Kiểm tra Guard với các action bắt buộc thu thập productId & categoryId
    const requiredActions: TrackingActionType[] = ['CLICK_REC', 'ADD_WISHLIST', 'ADD_TO_CART', 'PURCHASE', 'VIEW_ITEM'];
    if (requiredActions.includes(actionType)) {
      if (!productId || isNaN(productId)) {
        console.warn(`[Tracking Guard] Bỏ qua gửi request '${actionType}': Thiếu trường bắt buộc productId. Payload:`, payload);
        return;
      }
      if (!categoryId || isNaN(categoryId)) {
        console.warn(`[Tracking Guard] Bỏ qua gửi request '${actionType}': Thiếu trường bắt buộc categoryId (Sản phẩm #${productId}). Payload:`, payload);
        return;
      }
    }

    // Gửi Tracking dưới nền
    trackingService.trackEvent({
      userId: user?.userId || null,
      sessionId: sid,
      actionType,
      ...payload,
      productId,
      categoryId,
    });
  }, [user, resolveProductAndCategory]);

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

  /**
   * Track ADD_TO_CART
   * Hỗ trợ nhận cả object options hoặc danh sách tham số cũ
   */
  const trackAddToCart = useCallback((
    param1: number | AddToCartTrackingOptions,
    param2?: number | number,
    param3?: string | number,
    param4?: string | number,
    param5?: string | Source,
    param6?: Source
  ) => {
    let productId: number | undefined;
    let categoryId: number | undefined;
    let variantId: number | undefined;
    let quantity: number = 1;
    let color: string = '';
    let size: string = '';
    let source: Source = Source.UNKNOWN;

    if (typeof param1 === 'object' && param1 !== null) {
      productId = param1.productId;
      categoryId = param1.categoryId;
      variantId = param1.variantId;
      quantity = param1.quantity ?? 1;
      color = param1.color ?? '';
      size = param1.size ?? '';
      source = param1.source ?? Source.UNKNOWN;
    } else if (typeof param1 === 'number') {
      if (typeof param2 === 'number' && typeof param3 === 'number') {
        // Form: (productId, categoryId, variantId, quantity, color, size, source)
        productId = param1;
        categoryId = param2;
        variantId = param3;
        quantity = typeof param4 === 'number' ? param4 : 1;
        color = typeof param5 === 'string' ? param5 : '';
        size = typeof param6 === 'string' ? param6 : '';
        source = (typeof param6 === 'string' ? Source.UNKNOWN : param6) || Source.UNKNOWN;
      } else {
        // Form cũ: (variantId, quantity, color, size, source)
        variantId = param1;
        quantity = typeof param2 === 'number' ? param2 : 1;
        color = typeof param3 === 'string' ? param3 : '';
        size = typeof param4 === 'string' ? param4 : '';
        source = (param5 as Source) || Source.UNKNOWN;
      }
    }

    trackEvent('ADD_TO_CART', { 
      productId,
      categoryId,
      variantId, 
      source,
      contextData: JSON.stringify({ quantity, color, size })
    });
  }, [trackEvent]);

  /**
   * Track PURCHASE
   * Hỗ trợ truyền 1 đơn hàng chứa danh sách sản phẩm (items)
   * Đảm bảo duyệt toàn bộ OrderItems, giải quyết categoryId đầy đủ và chống trùng lặp (Deduplication)
   */
  const trackPurchase = useCallback(async (
    param1: number | PurchaseTrackingOptions,
    param2?: any,
    param3?: any,
    param4?: any,
    param5?: any
  ) => {
    let orderId: number = 0;
    let items: PurchaseItemTracking[] = [];
    let paymentMethod: string = '';
    let totalAmount: number = 0;
    let couponCode: string = '';
    let source: Source = Source.CHECKOUT_PAGE;

    if (typeof param1 === 'object' && param1 !== null) {
      orderId = param1.orderId;
      items = param1.items || [];
      paymentMethod = param1.paymentMethod || '';
      totalAmount = param1.totalAmount || 0;
      couponCode = param1.couponCode || '';
      source = param1.source || Source.CHECKOUT_PAGE;
    } else if (typeof param1 === 'number') {
      orderId = param1;
      if (Array.isArray(param2)) {
        items = param2;
        paymentMethod = String(param3 || '');
        totalAmount = Number(param4 || 0);
        couponCode = String(param5 || '');
      } else {
        paymentMethod = String(param2 || '');
        totalAmount = Number(param3 || 0);
        couponCode = String(param4 || '');
        source = (param5 as Source) || Source.CHECKOUT_PAGE;
      }
    }

    if (!orderId) return;

    // Nếu gọi trackPurchase không truyền items, tự động truy vấn chi tiết đơn hàng từ backend
    if (!items || items.length === 0) {
      try {
        const orderRes = await orderService.getMyOrderDetail(orderId);
        if (orderRes?.result?.items) {
          items = orderRes.result.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price
          }));
          if (!paymentMethod && orderRes.result.paymentMethod) {
            paymentMethod = orderRes.result.paymentMethod;
          }
          if (!totalAmount && orderRes.result.finalPaymentMoney) {
            totalAmount = orderRes.result.finalPaymentMoney;
          }
        }
      } catch (err) {
        console.warn(`[Tracking] Không thể lấy chi tiết đơn hàng #${orderId}:`, err);
      }
    }

    // Duyệt qua TẤT CẢ các sản phẩm trong đơn hàng
    if (items && items.length > 0) {
      await Promise.all(
        items.map(async (item) => {
          // Tự động giải quyết productId và categoryId (kể cả gọi API nếu chưa có)
          const { productId, categoryId } = await resolveProductAndCategoryAsync(
            item.productId,
            item.categoryId,
            item.variantId
          );

          if (!productId || !categoryId) {
            console.warn(`[Tracking Guard] Bỏ qua PURCHASE cho item trong đơn #${orderId}: Thiếu productId (${productId}) hoặc categoryId (${categoryId})`, item);
            return;
          }

          // Kiểm tra và phòng chống trùng lặp (Deduplication Check)
          const dedupeKey = `tracked_purchase_${orderId}_${productId}`;
          if (sessionStorage.getItem(dedupeKey)) {
            return;
          }

          // Đánh dấu đã tracking item này trong đơn hàng
          sessionStorage.setItem(dedupeKey, 'true');

          trackEvent('PURCHASE', {
            productId,
            categoryId,
            variantId: item.variantId,
            source,
            contextData: JSON.stringify({
              order_id: orderId,
              payment_method: paymentMethod,
              total_amount: totalAmount,
              coupon_code: couponCode,
              quantity: item.quantity,
              price: item.price
            })
          });
        })
      );
    }
  }, [trackEvent, resolveProductAndCategoryAsync]);

  /**
   * Track ADD_WISHLIST
   */
  const trackWishlist = useCallback((
    productId: number,
    param2?: number | string,
    param3?: string,
    param4?: string,
    param5?: string | Source,
    param6?: Source
  ) => {
    let categoryId: number | undefined;
    let color: string = '';
    let size: string = '';
    let location: string = '';
    let source: Source = Source.UNKNOWN;

    if (typeof param2 === 'number') {
      categoryId = param2;
      color = typeof param3 === 'string' ? param3 : '';
      size = typeof param4 === 'string' ? param4 : '';
      location = typeof param5 === 'string' ? param5 : '';
      source = (param6 as Source) || Source.UNKNOWN;
    } else {
      color = typeof param2 === 'string' ? param2 : '';
      size = typeof param3 === 'string' ? param3 : '';
      location = typeof param4 === 'string' ? param4 : '';
      source = (param5 as Source) || Source.UNKNOWN;
    }

    trackEvent('ADD_WISHLIST', { 
      productId, 
      categoryId,
      source,
      contextData: JSON.stringify({ location, color, size })
    });
  }, [trackEvent]);

  /**
   * Track CLICK_REC
   */
  const trackClickRecommendation = useCallback((
    productId: number,
    param2?: number | string,
    param3?: string,
    param4?: string | number,
    param5?: number | Source,
    param6?: Source
  ) => {
    let categoryId: number | undefined;
    let aiModel: string = '';
    let recommendationType: string = '';
    let rankPosition: number = 0;
    let source: Source = Source.PRODUCT_REC_SIMILAR;

    if (typeof param2 === 'number') {
      categoryId = param2;
      aiModel = typeof param3 === 'string' ? param3 : '';
      recommendationType = typeof param4 === 'string' ? param4 : '';
      rankPosition = typeof param5 === 'number' ? param5 : 0;
      source = param6 || Source.PRODUCT_REC_SIMILAR;
    } else {
      aiModel = typeof param2 === 'string' ? param2 : '';
      recommendationType = typeof param3 === 'string' ? param3 : '';
      rankPosition = typeof param4 === 'number' ? param4 : 0;
      source = (param5 as Source) || Source.PRODUCT_REC_SIMILAR;
    }

    trackEvent('CLICK_REC', { 
      productId,
      categoryId,
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

