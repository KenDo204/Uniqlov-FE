import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { addItem, removeItem, updateQuantity, clearCart } from './cartSlice';
import type { CartItem } from './cartSlice';

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export function useCartStore(): CartStore;
export function useCartStore<T>(selector: (state: CartStore) => T): T;
export function useCartStore<T>(selector?: (state: CartStore) => T): T | CartStore {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const store: CartStore = {
    items,
    addItem: (item, quantity = 1) => dispatch(addItem({ item, quantity })),
    removeItem: (id) => dispatch(removeItem(id)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart()),
  };

  if (selector) {
    return selector(store);
  }
  return store;
}
