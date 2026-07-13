import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import type { ProductResponse, ProductFilterRequest } from '@/types/product';

export function useFetchProducts(
  filter: ProductFilterRequest & { size?: number, collection?: string },
  options?: { skip?: boolean }
) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Stringify the filter to use as dependency to prevent infinite loops 
  // when component passes a new object reference on every render
  const filterString = JSON.stringify(filter);

  useEffect(() => {
    let isMounted = true;
    
    // Skip fetching if no meaningful filter is provided (optional logic depending on use cases)
    // Here we allow fetching all if needed, but usually we pass specific filters.
    
    const fetchProducts = async () => {
      if (options?.skip) {
        setIsLoading(false);
        setProducts([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // We parse back the filter string to the object
        const activeFilter = JSON.parse(filterString);
        
        const response = await productService.getPublicProducts(activeFilter);
        
        if (isMounted) {
          // Xử lý các dạng trả về của Backend (response.result)
          if (response.result && response.result.content) {
            setProducts(response.result.content);
          } else {
            setProducts([]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to fetch products', err);
          setError(err);
          setProducts([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [filterString, options?.skip]);

  return { products, isLoading, error };
}
