import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ProductCard, type ProductCardProps } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { ProductResponse } from '@/types/product/responses';
import { Source } from '@/types/tracking/requests';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface ProductSwiperProps {
    products: ProductResponse[];
    
    // --- State ---
    isLoading?: boolean;
    skeletonCount?: number; 
    
    // --- Optional Rendering ---
    emptyContent?: React.ReactNode; 
    
    // --- Tailwind CSS Classes ---
    className?: string;     // outer wrapper class
    
    // --- Recommendation ---
    isRecommendation?: boolean;
    aiModel?: string;
    source?: Source;

    // --- Misc ---
    cardProps?: Omit<ProductCardProps, 'product' | 'isRecommendation' | 'aiModel' | 'rankPosition'>;
}

export const ProductSwiper: React.FC<ProductSwiperProps> = ({
    products,
    isLoading = false,
    skeletonCount = 5, // Default to 5 skeletons for desktop view
    emptyContent = null,
    className = "",
    isRecommendation,
    aiModel,
    source = Source.UNKNOWN,
    cardProps,
}) => {
    // Show max 10 products
    const displayProducts = products.slice(0, 10);

    const swiperBreakpoints = {
        0: { slidesPerView: 2, spaceBetween: 12 },     // Mobile
        768: { slidesPerView: 3, spaceBetween: 16 },   // Tablet
        1024: { slidesPerView: 4, spaceBetween: 20 },  // Laptop
        1280: { slidesPerView: 5, spaceBetween: 24 },  // Desktop
        1536: { slidesPerView: 6, spaceBetween: 24 },  // Large Desktop
    };

    if (isLoading) {
        return (
            <div className={`w-full ${className}`}>
                <Swiper
                    modules={[Navigation]}
                    navigation={true}
                    breakpoints={swiperBreakpoints}
                    className="product-swiper"
                >
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <SwiperSlide key={`skeleton-${i}`}>
                            <ProductCardSkeleton />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }

    if (displayProducts.length === 0) {
        return emptyContent ? (
            <div className={className}>
                {emptyContent}
            </div>
        ) : null;
    }

    return (
        <div className={`w-full ${className}`}>
            <Swiper
                style={{
                    "--swiper-navigation-color": "var(--color-theme)", // Thay mã màu HEX theo ý muốn của bạn
                    "--swiper-navigation-size": "24px",     // Thu nhỏ/phóng to mũi tên nếu cần
                    "--swiper-pagination-color": "var(--color-theme)", // Sẵn tiện đổi luôn màu cho các dấu chấm tròn
                } as React.CSSProperties}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={swiperBreakpoints}
                loop={false}
                className="product-swiper pb-10" // Padding bottom for pagination
            >
                {displayProducts.map((product, index) => (
                    <SwiperSlide key={product.productId} className="h-full">
                        <ProductCard
                            product={product}
                            isRecommendation={isRecommendation}
                            aiModel={aiModel}
                            rankPosition={index + 1}
                            source={source}
                            {...cardProps}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSwiper;
