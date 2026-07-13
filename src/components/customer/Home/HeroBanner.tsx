import { useEffect } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useSlider } from "@/hooks/useSlider";

import 'swiper/css';
import 'swiper/css/effect-fade';

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

  const resolveImageUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (isFetching) {
    return (
      <section className="relative w-full h-[70vh] md:h-[100vh] bg-gray-200 animate-pulse overflow-hidden">
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

  // Nếu không có slider nào, có thể render placeholder hoặc không render. 
  // Requirement: "Empty: nếu không có slider nào thì hiển thị banner mặc định hoặc không render Hero Banner."
  if (!activeSliders.length) {
    return null;
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[90vh] bg-muted overflow-hidden object-cover object-center">
      {/* LỚP 1: BACKGROUND SWIPER / IMAGE */}
      <div className="absolute inset-0 w-full h-full z-0">
        {activeSliders.length > 1 ? (
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ 
              delay: 4000, 
              disableOnInteraction: false 
            }}
            loop={true}
            className="w-full h-full"
          >
            {activeSliders.map((slider) => {
              const slideContent = (
                <img 
                  src={resolveImageUrl(slider.imageUrl)} 
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
        ) : (
          (() => {
            const slider = activeSliders[0];
            const slideContent = (
              <img 
                src={resolveImageUrl(slider.imageUrl)} 
                alt={`Hero Banner ${slider.sliderId}`} 
                className="w-full h-full object-cover object-center"
              />
            );
            return slider.targetUrl ? (
              <Link to={slider.targetUrl} className="block w-full h-full">
                {slideContent}
              </Link>
            ) : (
              slideContent
            );
          })()
        )}
      </div>

      {/* LỚP 2: LỚP PHỦ MỜ (OVERLAY) */}
      <div className="absolute inset-0 bg-black/30 z-[5] pointer-events-none"></div>
    </section>
  );
}
