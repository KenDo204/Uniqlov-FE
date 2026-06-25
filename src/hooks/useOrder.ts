import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  checkoutThunk, 
  fetchMyOrdersThunk, 
  fetchMyOrderDetailThunk, 
  cancelMyOrderThunk, 
  fetchAllOrdersThunk, 
  fetchOrderDetailThunk, 
  updateOrderStatusThunk,
  clearOrderError,
  clearCheckoutResult,
  clearOrderDetail
} from '@/stores/slices/orderSlice';
import type { CheckoutRequest, OrderCancelRequest, OrderStatusUpdateRequest } from '@/types/order/requests';

export const useOrder = () => {
  const dispatch = useAppDispatch();
  const { 
    ordersList, 
    currentOrderDetail, 
    checkoutResult, 
    isFetching, 
    isSubmitting, 
    error 
  } = useAppSelector((state) => state.order);

  // --- USER API ---
  const checkout = useCallback(async (payload: CheckoutRequest) => {
    return await dispatch(checkoutThunk(payload)).unwrap();
  }, [dispatch]);

  const fetchMyOrders = useCallback(async (page: number = 0, size: number = 10) => {
    return await dispatch(fetchMyOrdersThunk({ page, size })).unwrap();
  }, [dispatch]);

  const fetchMyOrderDetail = useCallback(async (orderId: number) => {
    return await dispatch(fetchMyOrderDetailThunk(orderId)).unwrap();
  }, [dispatch]);

  const cancelMyOrder = useCallback(async (orderId: number, payload: OrderCancelRequest) => {
    return await dispatch(cancelMyOrderThunk({ orderId, data: payload })).unwrap();
  }, [dispatch]);

  // --- ADMIN API ---
  const fetchAllOrders = useCallback(async (page: number = 0, size: number = 20) => {
    return await dispatch(fetchAllOrdersThunk({ page, size })).unwrap();
  }, [dispatch]);

  const fetchOrderDetail = useCallback(async (orderId: number) => {
    return await dispatch(fetchOrderDetailThunk(orderId)).unwrap();
  }, [dispatch]);

  const updateOrderStatus = useCallback(async (orderId: number, payload: OrderStatusUpdateRequest) => {
    return await dispatch(updateOrderStatusThunk({ orderId, data: payload })).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const clearCheckout = useCallback(() => {
    dispatch(clearCheckoutResult());
  }, [dispatch]);

  const clearDetail = useCallback(() => {
    dispatch(clearOrderDetail());
  }, [dispatch]);

  return useMemo(() => ({
    orders: ordersList?.content || [],
    pagination: ordersList,
    currentOrderDetail,
    checkoutResult,
    isFetching,
    isSubmitting,
    error,
    checkout,
    fetchMyOrders,
    fetchMyOrderDetail,
    cancelMyOrder,
    fetchAllOrders,
    fetchOrderDetail,
    updateOrderStatus,
    clearError,
    clearCheckout,
    clearDetail
  }), [
    ordersList, 
    currentOrderDetail, 
    checkoutResult, 
    isFetching, 
    isSubmitting, 
    error, 
    checkout, 
    fetchMyOrders, 
    fetchMyOrderDetail, 
    cancelMyOrder, 
    fetchAllOrders, 
    fetchOrderDetail, 
    updateOrderStatus, 
    clearError, 
    clearCheckout, 
    clearDetail
  ]);
};
