import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Heart } from '@/components/ui/icons';
import { cn } from "@/lib/utils";
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';
import { toast } from 'react-toastify';

export interface ProductCardProps {
  product: Product;
  isNewArrival?: boolean;
  onAddToCart?: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
}

export function ProductCard({
  product,
  isNewArrival = false,
  onAddToCart
}: ProductCardProps) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  // Initialize selected color
  useEffect(() => {
    if (product?.options_config?.colors?.length > 0) {
      setSelectedColor(product.options_config.colors[0].colorName);
    }
  }, [product]);

  // Find active variant matching selected color
  const activeVariant = useMemo(() => {
    if (!product) return null;
    if (selectedColor) {
      return product.variants.find(
        (v) => v.variant_attributes.colorName.toLowerCase() === selectedColor.toLowerCase()
      ) || product.variants[0];
    }
    return product.variants[0];
  }, [product, selectedColor]);

  const activeImage = activeVariant?.variant_image || product.images[0]?.image_url || '';
  const secondaryImage = product.images[1]?.image_url || '';

  // Determine stock status
  const totalStock = useMemo(() => {
    return product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
  }, [product]);
  const isOutOfStock = !product.in_stock || totalStock === 0;

  // Determine sale and mock discount pricing
  const isSale = product.in_popular || (product.product_id % 3 === 0);
  const currentPrice = activeVariant?.price || product.variants[0]?.price || 0;
  const originalPrice = isSale ? Math.round((currentPrice / 0.8) / 1000) * 1000 : undefined;
  const discountPercent = isSale ? 20 : 0;

  // Ratings calculation
  const avgRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) {
      return parseFloat((4.3 + (product.product_id % 8) * 0.1).toFixed(1));
    }
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / product.reviews.length).toFixed(1));
  }, [product]);

  const reviewCount = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) {
      return (product.product_id * 13) % 45 + 5;
    }
    return product.reviews.length;
  }, [product]);

  const productUrl = paths.customer.productDetail.replace(':id', product.product_slug);

  return (
    <div
      className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer text-left relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(productUrl)}
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-80 bg-unilo-muted dark:bg-gray-800 overflow-hidden">
        {/* Main Image */}
        <img
          src={activeImage}
          alt={product.product_name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isHovered && secondaryImage ? "opacity-0" : "opacity-100"
          )}
        />
        {/* Hover Secondary Image */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.product_name} secondary`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNewArrival && (
            <span className="px-2.5 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-md">
              Mới
            </span>
          )}
          {isSale && (
            <span className="px-2.5 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-wider rounded-md">
              Giảm {discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 bg-gray-500 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
              Hết hàng
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.success('Đã thêm vào danh sách yêu thích.');
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur rounded-full text-gray-500 dark:text-gray-300 hover:text-accent border-none cursor-pointer shadow-sm transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Info Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <span className="text-[9px] uppercase font-bold tracking-widest text-accent">
            {product.category_id}
          </span>
          {/* Product Name */}
          <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-theme transition-colors line-clamp-1">
            {product.product_name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-3 h-3", i < Math.floor(avgRating) ? "fill-current" : "fill-gray-200 text-gray-200")}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-semibold">({reviewCount})</span>
          </div>

          {/* Color Swatches */}
          {product.options_config.colors.length > 0 && (
            <div className="flex gap-1.5 pt-1.5" onClick={(e) => e.stopPropagation()}>
              {product.options_config.colors.map((color) => (
                <button
                  key={color.colorName}
                  onClick={() => setSelectedColor(color.colorName)}
                  style={{ backgroundColor: color.colorCode }}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border cursor-pointer hover:scale-110 transition-transform",
                    selectedColor.toLowerCase() === color.colorName.toLowerCase()
                      ? "border-primary scale-110 ring-1 ring-primary/40"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                  title={color.colorName}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price and Buttons */}
        <div className="space-y-3 pt-1 border-t border-unilo-border dark:border-gray-800">
          {/* Pricing Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900 dark:text-white">
              {formatVND(currentPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2 w-full" onClick={(e) => e.stopPropagation()}>
            <Link
              to={productUrl}
              className="flex-1 py-2 text-center text-[11px] font-bold uppercase tracking-wider border border-gray-300 hover:border-black transition-colors rounded-lg bg-white text-gray-800 hover:text-black no-underline"
            >
              Chi tiết
            </Link>
            <button
              onClick={(e) => {
                if (onAddToCart) {
                  onAddToCart(product, e, selectedColor);
                }
              }}
              disabled={isOutOfStock}
              className={cn(
                "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors border-none",
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 cursor-pointer"
              )}
            >
              {isOutOfStock ? "Hết hàng" : "+ Mua nhanh"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
