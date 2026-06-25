import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { CustomPrevArrow } from '@/components/general/CustomPrevArrow';
import { CustomNextArrow } from '@/components/general/CustomNextArrow';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RecommendationProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  matchScore: number;
}

const mockRecommended: RecommendationProduct[] = [
  { id: 'p1', name: 'Đàn Guitar Classic Yamaha CG122MS', price: 6200000, image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80', matchScore: 98 },
  { id: 'p2', name: 'Đàn Piano Điện Roland RP-30', price: 18500000, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80', matchScore: 95 },
  { id: 'p3', name: 'Trống Điện Tử Roland TD-02K', price: 12000000, image: 'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=400&q=80', matchScore: 92 },
  { id: 'p4', name: 'Đàn Violin Kapok V182 Size 4/4', price: 2100000, image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80', matchScore: 88 },
];

export function AIRecommendations() {
  const [swiper, setSwiper] = useState<any>(null);

  return (
    <div className="py-6 w-full text-left">
      <div className="flex flex-col mb-4">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent m-0">
          Gợi ý dành riêng cho bạn (AI ALS/TF-IDF)
        </h3>
        <p className="text-xs text-gray-500 m-0 mt-1">Phân tích dựa trên lịch sử mua sắm và sở thích âm nhạc</p>
      </div>
      
      <div className="relative">
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full pb-8"
        >
          {mockRecommended.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                  Match {product.matchScore}%
                </div>
                <div className="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-gray-100 m-0">{product.name}</h4>
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-sm m-0">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <CustomPrevArrow onClick={() => swiper?.slidePrev()} />
        <CustomNextArrow onClick={() => swiper?.slideNext()} />
      </div>
    </div>
  );
}
