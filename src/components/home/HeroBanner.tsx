import { Link } from "react-router";
import { Button } from "@/components/ui/button";
// 1. Import các component và module của Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// 2. Import CSS bắt buộc của Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';

export function HeroBanner() {

  const bannerImages = [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
  ];

  return (
    <section className="relative w-full h-[70vh] md:h-[100vh] bg-muted overflow-hidden object-cover object-center">
      {/* Background Image Placeholder */}
      {/* LỚP 1: BACKGROUND SWIPER */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ 
            delay: 4000, // Chuyển ảnh sau mỗi 4 giây
            disableOnInteraction: false // Tiếp tục tự động chạy kể cả khi user click
          }}
          loop={true}
          className="w-full h-full"
        >
          {bannerImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <img 
                src={imgSrc} 
                alt={`Hero Banner ${index + 1}`} 
                className="w-full h-full object-cover object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LỚP 2: LỚP PHỦ MỜ (OVERLAY) */}
      <div className="absolute inset-0 bg-black/30 z-[5] pointer-events-none"></div>
      
      {/* LỚP 3: NỘI DUNG CHỮ & NÚT (STATIC) */}
      {/* Dùng pointer-events-none cho container để user có thể lướt (swipe) background */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto pt-20 pointer-events-none">
        <h1 className="text-white text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 uppercase drop-shadow-lg">
          Lifewear
        </h1>
        <p className="text-white text-lg md:text-2xl font-medium mb-8 max-w-2xl drop-shadow-md">
          Simple made better. Designed for everyday comfort and versatility.
        </p>

        {/* Khôi phục pointer-events-auto cho các nút để user có thể click được */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pointer-events-auto">
          <Button render={<Link to="/women" />} size="lg" className="rounded-none bg-white text-primary hover:bg-gray-100 font-bold px-10 h-14 text-sm md:text-base tracking-widest">
            SHOP WOMEN
          </Button>
          <Button render={<Link to="/men" />} size="lg" className="rounded-none bg-white text-primary hover:bg-gray-100 font-bold px-10 h-14 text-sm md:text-base tracking-widest">
            SHOP MEN
          </Button>
        </div>
      </div>
    </section>
  );
}
