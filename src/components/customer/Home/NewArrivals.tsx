import { useNavigate } from 'react-router-dom';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';
import { ProductCard } from '@/components/shared/ProductCard';

interface NewArrivalsProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
  isLoading?: boolean;
}

export function NewArrivals({ products, onAddToCart, isLoading = false }: NewArrivalsProps) {
  const navigate = useNavigate();

  // For mock representation, we slice the first 8 products as new arrivals
  // In real case, filter by created_at or is_new flag
  const newArrivals = products?.slice(0, 8) || [];

  return (
    <section className="py-12 md:py-16 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Sản phẩm mới về
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] w-full rounded-[4px] mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  isNewArrival={true}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            <div className="text-center mt-10 md:mt-12">
              <button 
                onClick={() => navigate(paths.customer.newArrivals)}
                className="px-10 py-3.5 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:border-theme hover:bg-theme hover:text-white transition-all duration-300 cursor-pointer rounded-[2px]"
              >
                Khám phá tất cả
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Hiện chưa có sản phẩm mới nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
