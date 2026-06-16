import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../apis/axiosClient';
import {
  type Product as ConstProduct,
  type ProductVariant as ConstProductVariant,
  type ProductImage as ConstProductImage,
  type ProductReview as ConstProductReview,
  mockProducts as constantsMockProducts
} from '@/constants/mock-products';

// Re-export type definitions matching database mock schemas
export type ProductImage = ConstProductImage;
export type ProductVariant = ConstProductVariant;
export type Review = ConstProductReview;
export type Product = ConstProduct;

// Export the complete mock catalog
export const mockProducts = constantsMockProducts;

export function useFetchProducts(filters?: { category?: string; search?: string; tag?: string }) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<Product[]>('/products', { params: filters });
        return response.data;
      } catch {
        console.warn('API /products offline. Returning fallback mock products.');
        return mockProducts.filter((product) => {
          if (filters?.category && product.category_id !== filters.category) return false;
          if (filters?.search) {
            const query = filters.search.toLowerCase();
            const matchesName = product.product_name.toLowerCase().includes(query);
            const matchesDesc = product.product_description.toLowerCase().includes(query);
            const matchesTags = product.product_tags.some(t => t.toLowerCase().includes(query));
            if (!matchesName && !matchesDesc && !matchesTags) return false;
          }
          if (filters?.tag && !product.product_tags.includes(filters.tag)) return false;
          return true;
        });
      }
    },
  });
}
