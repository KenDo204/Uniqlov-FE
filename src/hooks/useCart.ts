import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  fetchCartDbThunk, 
  addItemDbThunk, 
  updateItemDbThunk, 
  removeItemDbThunk, 
  clearCartDbThunk 
} from '@/stores/slices/cartSlice';
import type { CartItem } from '@/stores/slices/cartSlice';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { items, totalAmount, isLoading, error } = useAppSelector((state) => state.cart);

  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        return await dispatch(fetchCartDbThunk()).unwrap();
      } catch (err) {
        console.error('Fetch cart DB error:', err);
      }
    }
    return null;
  }, [dispatch, isAuthenticated]);

  const addCartItem = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    if (isAuthenticated) {
      // Extract variantId. Sometimes it is stored in item.variantId or item.id
      const vId = item.variantId || Number(item.id) || 0;
      if (vId > 0) {
        return await dispatch(addItemDbThunk({ 
          variantId: vId, 
          quantity,
          note: item.note
        })).unwrap();
      }
    }
    // Fallback/Guest
    dispatch(addItem({ item, quantity }));
  }, [dispatch, isAuthenticated]);

  const updateCartItemQuantity = useCallback(async (id: string, quantity: number) => {
    if (isAuthenticated) {
      const vId = Number(id);
      if (!isNaN(vId)) {
        return await dispatch(updateItemDbThunk({ variantId: vId, quantity })).unwrap();
      }
    }
    dispatch(updateQuantity({ id, quantity }));
  }, [dispatch, isAuthenticated]);

  const removeCartItem = useCallback(async (id: string) => {
    if (isAuthenticated) {
      const vId = Number(id);
      if (!isNaN(vId)) {
        return await dispatch(removeItemDbThunk(vId)).unwrap();
      }
    }
    dispatch(removeItem(id));
  }, [dispatch, isAuthenticated]);

  const clearAllCart = useCallback(async () => {
    if (isAuthenticated) {
      return await dispatch(clearCartDbThunk()).unwrap();
    }
    dispatch(clearCart());
  }, [dispatch, isAuthenticated]);

  return useMemo(() => ({
    items,
    totalAmount,
    isLoading,
    error,
    fetchCart,
    addItem: addCartItem,
    removeItem: removeCartItem,
    updateQuantity: updateCartItemQuantity,
    clearCart: clearAllCart
  }), [items, totalAmount, isLoading, error, fetchCart, addCartItem, removeCartItem, updateCartItemQuantity, clearAllCart]);
};
