import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  changeVariant,
  fetchCartDbThunk, 
  addItemDbThunk, 
  updateItemDbThunk, 
  removeItemDbThunk, 
  clearCartDbThunk,
  changeItemVariantDbThunk
} from '@/stores/slices/cartSlice';
import type { CartItem } from '@/stores/slices/cartSlice';
import { toast } from 'react-toastify';
import type { ProductVariantResponse } from '@/types/product';

import { useAuth } from '@/hooks/useAuth';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isCustomer } = useAuth();
  const { items, totalAmount, isLoading, error } = useAppSelector((state) => state.cart);

  const fetchCart = useCallback(async () => {
    // Chỉ gọi API giỏ hàng đối với khách hàng (Customer)
    if (isAuthenticated && isCustomer) {
      try {
        return await dispatch(fetchCartDbThunk()).unwrap();
      } catch (err) {
        console.error('Fetch cart DB error:', err);
      }
    }
    return null;
  }, [dispatch, isAuthenticated, isCustomer]);

  const addCartItem = useCallback(async (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    if (isAuthenticated) {
      if (!isCustomer) return; // Non-customers can't add to cart
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
  }, [dispatch, isAuthenticated, isCustomer]);

  const updateCartItemQuantity = useCallback(async (id: string, quantity: number, note?: string) => {
    try {
      if (isAuthenticated) {
        if (!isCustomer) return;
        const vId = Number(id);
        if (!isNaN(vId)) {
          await dispatch(updateItemDbThunk({ variantId: vId, quantity, note })).unwrap();
        }
      } else {
        dispatch(updateQuantity({ id, quantity, note }));
      }
      toast.success('Đã cập nhật số lượng sản phẩm.');
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật số lượng sản phẩm.');
    }
  }, [dispatch, isAuthenticated, isCustomer]);

  const removeCartItem = useCallback(async (id: string) => {
    try {
      if (isAuthenticated) {
        if (!isCustomer) return;
        const vId = Number(id);
        if (!isNaN(vId)) {
          await dispatch(removeItemDbThunk(vId)).unwrap();
        }
      } else {
        dispatch(removeItem(id));
      }
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng.');
    } catch (err: any) {
      toast.error(err || 'Không thể xóa sản phẩm khỏi giỏ hàng.');
    }
  }, [dispatch, isAuthenticated, isCustomer]);

  const clearAllCart = useCallback(async () => {
    if (isAuthenticated) {
      if (!isCustomer) return;
      return await dispatch(clearCartDbThunk()).unwrap();
    }
    dispatch(clearCart());
  }, [dispatch, isAuthenticated, isCustomer]);

  const changeCartItemVariant = useCallback(async (oldVariantId: number, newVariant: ProductVariantResponse, quantity: number, note?: string) => {
    if (isAuthenticated) {
      if (!isCustomer) return;
      return await dispatch(changeItemVariantDbThunk({ 
        oldVariantId, 
        newVariantId: newVariant.variantId, 
        quantity, 
        note 
      })).unwrap();
    }
    dispatch(changeVariant({ oldVariantId, newVariant }));
  }, [dispatch, isAuthenticated, isCustomer]);

  return useMemo(() => ({
    items,
    totalAmount,
    isLoading,
    error,
    fetchCart,
    addItem: addCartItem,
    removeItem: removeCartItem,
    updateQuantity: updateCartItemQuantity,
    clearCart: clearAllCart,
    changeVariant: changeCartItemVariant
  }), [items, totalAmount, isLoading, error, fetchCart, addCartItem, removeCartItem, updateCartItemQuantity, clearAllCart, changeCartItemVariant]);
};
