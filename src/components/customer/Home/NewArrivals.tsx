import { useNavigate } from 'react-router-dom';
import { ProductSwiper } from '@/components/shared/ProductSwiper';
import { buildCollectionUrl } from '@/utils/urlHelpers';
import { Source } from '@/types/tracking/requests';
import { useFetchProducts } from '@/hooks/useFetchProducts';

export function NewArrivals() {
  const navigate = useNavigate();
  const { products: newArrivals, isLoading } = useFetchProducts({ collection: 'NEW_ARRIVALS', size: 10 });

  return (
    <section className="w-full py-4 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-black text-center mb-8 md:mb-12 m-0 uppercase tracking-tight text-gray-900">
          Sản phẩm mới về
        </h2>

        <ProductSwiper
          products={newArrivals}
          isLoading={isLoading}
          skeletonCount={5}
          cardProps={{ isNewArrival: true }}
          source={Source.HOME_NEW_ARRIVAL}
          emptyContent={
            <div className="text-center py-12 text-gray-400">
              <p>Hiện chưa có sản phẩm mới nào.</p>
            </div>
          }
        />

        {!isLoading && newArrivals.length > 0 && (
          <div className="text-center mt-10 md:mt-12">
            <button 
              onClick={() => navigate(buildCollectionUrl('NEW_ARRIVALS'))}
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
