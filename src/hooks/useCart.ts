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
    try {
      if (isAuthenticated) {
        const vId = Number(id);
        if (!isNaN(vId)) {
          await dispatch(updateItemDbThunk({ variantId: vId, quantity })).unwrap();
        }
      } else {
        dispatch(updateQuantity({ id, quantity }));
      }
      // Không nên toast success khi tăng giảm số lượng quá nhiều để tránh spam UX, nhưng theo yêu cầu:
      toast.success('Đã cập nhật số lượng sản phẩm.');
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật số lượng sản phẩm.');
    }
  }, [dispatch, isAuthenticated]);

  const removeCartItem = useCallback(async (id: string) => {
    try {
      if (isAuthenticated) {
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
  }, [dispatch, isAuthenticated]);

  const clearAllCart = useCallback(async () => {
    if (isAuthenticated) {
      return await dispatch(clearCartDbThunk()).unwrap();
    }
    dispatch(clearCart());
  }, [dispatch, isAuthenticated]);

  const changeCartItemVariant = useCallback(async (oldVariantId: number, newVariant: ProductVariantResponse, quantity: number, note?: string) => {
    if (isAuthenticated) {
      return await dispatch(changeItemVariantDbThunk({ 
        oldVariantId, 
        newVariantId: newVariant.variantId, 
        quantity, 
        note 
      })).unwrap();
    }
    dispatch(changeVariant({ oldVariantId, newVariant }));
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
    clearCart: clearAllCart,
    changeVariant: changeCartItemVariant
  }), [items, totalAmount, isLoading, error, fetchCart, addCartItem, removeCartItem, updateCartItemQuantity, clearAllCart, changeCartItemVariant]);
};
