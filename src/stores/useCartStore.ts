import { useCart } from '../hooks/useCart';

type UseCartReturn = ReturnType<typeof useCart>;

export function useCartStore(): UseCartReturn;
export function useCartStore<T>(selector: (state: UseCartReturn) => T): T;
export function useCartStore<T>(selector?: (state: UseCartReturn) => T): UseCartReturn | T {
  const cart = useCart();
  if (selector) {
    return selector(cart);
  }
  return cart;
}
