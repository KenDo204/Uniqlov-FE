import { useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { useFetchProducts } from '@/hooks/useFetchProducts';
import { buildCategoryUrl } from '@/utils/urlHelpers';

export function AccessorySection() {
  const navigate = useNavigate();
  // Fetch data directly using the new custom hook
  const { products, isLoading } = useFetchProducts({ categoryCode: 'phu-kien', size: 8 });

  return (
    <section className="w-full py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        
        {/* Tiêu đề Section (Section Header) */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-black uppercase mb-4 tracking-tight text-gray-900">
            Phụ Kiện
          </h2>
          <p className="text-sm md:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Hoàn thiện phong cách với các phụ kiện thời trang mới nhất.
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          skeletonCount={4}
          gridClassName="grid-cols-2 lg:grid-cols-4"
          emptyContent={
            <div className="text-center py-12 text-gray-400">
              <p>Hiện chưa có phụ kiện nào.</p>
            </div>
          }
        />

        {/* Nút Xem Tất Cả */}
        {!isLoading && products.length > 0 && (
          <div className="text-center mt-12 md:mt-16">
            <button 
              onClick={() => navigate(buildCategoryUrl('phu-kien'))}
              className="px-12 py-3.5 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:border-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer rounded-[2px]"
            >
              XEM TẤT CẢ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
