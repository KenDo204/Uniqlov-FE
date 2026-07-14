import { useNavigate } from 'react-router-dom';
import { ProductSwiper } from '@/components/shared/ProductSwiper';
import { buildCollectionUrl } from '@/utils/urlHelpers';
import { Source } from '@/types/tracking/requests';
import { useFetchProducts } from '@/hooks/useFetchProducts';

export function BestSellers() {
  const navigate = useNavigate();
  const { products: bestSellers, isLoading } = useFetchProducts({ collection: 'BEST_SELLERS', size: 10 });

  return (
    <section className="w-full py-4 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Sản phẩm bán chạy nhất
        </h2>

        <ProductSwiper
          products={bestSellers}
          isLoading={isLoading}
          skeletonCount={5}
          source={Source.HOME_BEST_SELLER}
          emptyContent={
            <div className="text-center py-12 text-gray-400">
              <p>Hiện chưa có sản phẩm bán chạy nào.</p>
            </div>
          }
        />

        {!isLoading && bestSellers.length > 0 && (
          <div className="text-center mt-10 md:mt-12">
            <button 
              onClick={() => navigate(buildCollectionUrl('BEST_SELLERS'))}
              className="px-10 py-3.5 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:border-theme hover:bg-theme hover:text-white transition-all duration-300 cursor-pointer rounded-[2px]"
            >
              Khám phá tất cả
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
