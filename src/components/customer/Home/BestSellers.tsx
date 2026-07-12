import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/config/paths';
import { ProductCard } from '@/components/shared/ProductCard';
import { productService } from '@/services/productService';
import type { ProductResponse } from '@/types/product/responses';

export function BestSellers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getPublicProducts({ collection: 'BEST_SELLERS', size: 8 });
        if (isMounted && response.result) {
          setProducts(response.result.content);
        }
      } catch (error) {
        console.error('Failed to fetch best sellers', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchBestSellers();
    return () => { isMounted = false; };
  }, []);

  const bestSellers = products;

  return (
    <section className="w-full py-8 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Sản phẩm bán chạy nhất
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
        ) : bestSellers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                />
              ))}
            </div>

            <div className="text-center mt-10 md:mt-12">
              <button 
                onClick={() => navigate(`${paths.customer.products}?collection=BEST_SELLERS`)}
                className="px-10 py-3.5 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:border-theme hover:bg-theme hover:text-white transition-all duration-300 cursor-pointer rounded-[2px]"
              >
                Khám phá tất cả
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Hiện chưa có sản phẩm bán chạy nào.</p>
          </div>
        )}
      </div>
    </section>
  );
}
