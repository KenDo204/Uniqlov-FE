import React from 'react';
import { ProductCard, type ProductCardProps } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { ProductResponse } from '@/types/product/responses';
import { Source } from '@/types/tracking/requests';

export interface ProductGridProps {
    products: ProductResponse[];
    
    // --- State ---
    isLoading?: boolean;
    skeletonCount?: number; 
    
    // --- Optional Rendering ---
    emptyContent?: React.ReactNode; 
    
    // --- Tailwind CSS Classes ---
    gridClassName?: string; // e.g. "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    gapClassName?: string;  // e.g. "gap-4 md:gap-6"
    className?: string;     // outer wrapper class
    
    // --- Recommendation ---
    isRecommendation?: boolean;
    aiModel?: string;
    source?: Source;

    // --- Misc ---
    onCardRef?: (index: number, element: HTMLDivElement | null) => void;
    cardProps?: Omit<ProductCardProps, 'product' | 'isRecommendation' | 'aiModel' | 'rankPosition'>;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
    products,
    isLoading = false,
    skeletonCount = 8,
    emptyContent = null,
    gridClassName = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    gapClassName = "gap-4 md:gap-6",
    className = "",
    isRecommendation,
    aiModel,
    source = Source.UNKNOWN,
    cardProps,
}) => {
    // Determine the classes for the grid
    const combinedGridClass = `grid ${gridClassName} ${gapClassName}`;

    if (isLoading) {
        return (
            <div className={`${combinedGridClass} ${className}`}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return emptyContent ? (
            <div className={className}>
                {emptyContent}
            </div>
        ) : null;
    }

    return (
        <div className={`${combinedGridClass} ${className}`}>
            {products.map((product, index) => (
                <ProductCard
                    key={product.productId}
                    product={product}
                    isRecommendation={isRecommendation}
                    aiModel={aiModel}
                    rankPosition={index + 1}
                    source={source}
                    {...cardProps}
                />
            ))}
        </div>
    );
};

export default ProductGrid;