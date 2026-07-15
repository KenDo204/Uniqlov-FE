import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { ProductCard, type ProductCardProps } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { ProductResponse } from '@/types/product/responses';
import { Source } from '@/types/tracking/requests';
import { cn } from '@/lib/utils';

import 'swiper/css';
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

    const paginationClasses = cn(
        // Base state (Desktop non-hover): invisible, 0 opacity
        "md:[&_.swiper-pagination]:opacity-0 md:[&_.swiper-pagination]:invisible",
        
        // Hover state (Desktop only): visible, 100 opacity
        "md:group-hover/swiper:[&_.swiper-pagination]:opacity-100 md:group-hover/swiper:[&_.swiper-pagination]:visible",
        
        // Transitions
        "[&_.swiper-pagination]:transition-all [&_.swiper-pagination]:duration-300",
        
        // Bullet animations
        "[&_.swiper-pagination-bullet]:transition-transform [&_.swiper-pagination-bullet]:duration-300",
        "[&_.swiper-pagination-bullet-active]:scale-125"
    );

    const swiperStyle = {
        "--swiper-pagination-color": "var(--color-theme)",
        "--swiper-pagination-bullet-inactive-color": "#d1d5db",
        "--swiper-pagination-bullet-inactive-opacity": "1",
        "--swiper-pagination-bullet-size": "6px",
        "--swiper-pagination-bullet-horizontal-gap": "5px"
    } as React.CSSProperties;

    if (isLoading) {
        return (
            <div className={cn("w-full group/swiper", className)}>
                <Swiper
                    style={swiperStyle}
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ 
                    delay: 3000, 
                    disableOnInteraction: false ,
                    pauseOnMouseEnter: true
                    }}
                    loop={true}
                    breakpoints={swiperBreakpoints}
                    className={cn("product-swiper pb-10", paginationClasses)}
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
        <div className={cn("w-full group/swiper", className)}>
            <Swiper
                style={swiperStyle}
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={swiperBreakpoints}
                className={cn("product-swiper pb-10", paginationClasses)}
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
