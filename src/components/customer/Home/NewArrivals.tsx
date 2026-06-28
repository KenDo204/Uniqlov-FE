import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@/components/ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';
import { CustomPrevArrow } from '@/components/general/CustomPrevArrow';
import { CustomNextArrow } from '@/components/general/CustomNextArrow';
import { ProductCard } from '@/components/shared/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NewArrivalsProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
}

export function NewArrivals({ products, onAddToCart }: NewArrivalsProps) {
  const navigate = useNavigate();
  const [swiper, setSwiper] = useState<any>(null);

  // For mock representation, use the popular items as new arrivals as well
  const newArrivals = products.filter((p) => p.in_popular);

  return (
    <section className="py-12 md:py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* HEADER SECTION: Nâng cấp phân cấp thị giác */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
        <div className="space-y-1.5 text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black text-gray-900 tracking-tight m-0">
            Sản phẩm mới về
          </h2>
        </div>
        
        {/* Nút Khám phá tất cả: Thêm hiệu ứng trượt mượt mà */}
        <button
          onClick={() => navigate(paths.customer.newArrivals)}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-[var(--color-theme)] border-none bg-transparent cursor-pointer transition-colors duration-300 self-start sm:self-auto"
        >
          <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--color-theme)] after:transition-all after:duration-300 group-hover:after:w-full pb-0.5">
            Khám phá tất cả
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-gray-400 group-hover:text-[var(--color-theme)]" />
        </button>
      </div>

      {/* SLIDER CONTAINER: Định hình vùng an toàn cho layout */}
      <div className="relative group/slider">
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            540: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="mb-12 !overflow-visible" 
          style={{
            '--swiper-pagination-color': 'var(--color-theme)',
            '--swiper-pagination-bullet-inactive-color': '#e5e7eb',
            '--swiper-pagination-bullet-inactive-opacity': '1',
            '--swiper-pagination-bullet-size': '8px',
            '--swiper-pagination-bullet-horizontal-gap': '5px',
            '--swiper-pagination-bottom': '-32px',
          } as React.CSSProperties}
        >
          {newArrivals.map((product) => (
            <SwiperSlide key={product.product_id} className="h-auto !flex">
              {/* Thêm div bọc ngoài để tạo hiệu ứng hover shadow mượt mà cho từng card */}
              <div className="w-full h-full rounded-xl transition-all duration-300 hover:-translate-y-1">
                <ProductCard
                  product={product}
                  isNewArrival={true}
                  onAddToCart={onAddToCart}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <CustomPrevArrow onClick={() => swiper?.slidePrev()} />
        <CustomNextArrow onClick={() => swiper?.slideNext()} />
      </div>
    </section>
  );
}
