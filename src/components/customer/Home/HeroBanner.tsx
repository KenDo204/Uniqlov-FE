import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import { useSlider } from "@/hooks/useSlider";
import { HeaderMegaMenu } from "@/layouts/CustomerLayout/HeaderMegaMenu";
import { Container } from "@/components/shared/Container";

import 'swiper/css';
import 'swiper/css/effect-fade';

import 'swiper/css/pagination';
import 'swiper/css/navigation';

export function HeroBanner() {
  const { publicSliders, isFetching, loadPublicSliders } = useSlider();

  useEffect(() => {
    loadPublicSliders().catch((err) => {
      console.error("Failed to load sliders:", err);
    });
  }, [loadPublicSliders]);

  const activeSliders = (publicSliders || [])
    .filter((s) => s.isActive && s.displayOrder === 1)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (isFetching) {
    return (
      <section className="relative w-full h-[70vh] md:h-[100vh] bg-white animate-pulse overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="w-64 h-16 bg-gray-300 rounded mb-4"></div>
          <div className="w-96 h-8 bg-gray-300 rounded mb-8"></div>
          <div className="flex gap-4">
            <div className="w-40 h-14 bg-gray-300 rounded-none"></div>
            <div className="w-40 h-14 bg-gray-300 rounded-none"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white pt-0 lg:pt-4">
      <Container className="!px-0 lg:!px-4 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR DANH MỤC (Chỉ hiện trên Desktop) */}
        <div className="hidden lg:block w-[240px] shrink-0">
          <HeaderMegaMenu />
        </div>

        {/* HERO BANNER SWIPER */}
        <div className="w-full lg:flex-1 relative h-[350px] md:h-[500px] lg:h-[600px] bg-muted overflow-hidden lg:rounded-xl">
          {/* LỚP 1: BACKGROUND SWIPER / IMAGE */}
          <div className="absolute inset-0 w-full h-full z-0">
            {activeSliders.length > 1 ? (
              <Swiper
                style={{
                  "--swiper-navigation-color": "var(--color-theme)", // Thay mã màu HEX theo ý muốn của bạn
                  "--swiper-navigation-size": "24px",     // Thu nhỏ/phóng to mũi tên nếu cần
                  "--swiper-pagination-color": "var(--color-theme)", // Sẵn tiện đổi luôn màu cho các dấu chấm tròn
                } as React.CSSProperties}
                modules={[Autoplay, EffectFade, Pagination, Navigation]}
                effect="fade"
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ 
                  delay: 5000, 
                  disableOnInteraction: false 
                }}
                loop={true}
                className="w-full h-full"
              >
                {activeSliders.map((slider) => {
                  const slideContent = (
                    <img 
                      src={slider.imageUrl} 
                      alt={`Hero Banner ${slider.sliderId}`} 
                      className="w-full h-full object-cover object-center"
                    />
                  );

                  return (
                    <SwiperSlide key={slider.sliderId}>
                      {slider.targetUrl ? (
                        <Link to={slider.targetUrl} className="block w-full h-full">
                          {slideContent}
                        </Link>
                      ) : (
                        slideContent
                      )}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : activeSliders.length === 1 ? (
              (() => {
                const slider = activeSliders[0];
                const slideContent = (
                  <img 
                    src={slider?.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop'} 
                    alt={`Hero Banner ${slider?.sliderId || 'default'}`} 
                    className="w-full h-full object-cover object-center"
                  />
                );
                return slider?.targetUrl ? (
                  <Link to={slider.targetUrl} className="block w-full h-full">
                    {slideContent}
                  </Link>
                ) : (
                  slideContent
                );
              })()
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <span className="text-lg">Banner Space</span>
              </div>
            )}
          </div>
          {/* LỚP 2: LỚP PHỦ MỜ (OVERLAY) */}
          {/* <div className="absolute inset-0 bg-black/20 z-[5] pointer-events-none"></div> */}
          
          {/* LỚP 3: NỘI DUNG CHỮ & NÚT (TEXT OVERLAY) */}
          {/* <div className="absolute inset-0 z-10 flex flex-col justify-end items-start px-6 pb-8 md:px-16 md:pb-12 pointer-events-none">
            <Link 
              to="/products" 
              className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-theme shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-theme hover:text-white hover:shadow-xl active:translate-y-0 md:px-10 md:py-3.5 md:text-base"
            >
              Mua Ngay
            </Link>
          </div> */}
        </div>
      </Container>
    </section>
  );
}
