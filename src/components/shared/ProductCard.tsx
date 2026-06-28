import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from '@/components/ui/icons';
import { cn } from "@/lib/utils";
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';
import { toast } from 'react-toastify';
import { useWishlist } from '@/hooks/useWishlist';
import { useAppSelector } from '@/stores/hooks';

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

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { wishlist, toggleWishlist } = useWishlist();

  const isInWishlist = useMemo(() => {
    if (!wishlist || !product) return false;
    return wishlist.content.some((item) => item.productId === product.product_id);
  }, [wishlist, product]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warn('Vui lòng đăng nhập để thêm sản phẩm vào mục yêu thích.');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product.product_id);
      toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật danh sách yêu thích');
    }
  };

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

  // Extract prices safely from the model (active variant or fallback to product)
  const salePrice = activeVariant?.price || product.variants?.[0]?.price || (product as any)?.price || 0;
  const originalPrice = 
    (activeVariant as any)?.originalPrice || 
    (activeVariant as any)?.original_price || 
    (product as any)?.originalPrice || 
    (product as any)?.original_price || 
    activeVariant?.cost_price || 
    product.variants?.[0]?.cost_price || 
    (activeVariant as any)?.costPrice;

  // Calculate discount percentage
  const hasDiscount = originalPrice && originalPrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const showDiscount = hasDiscount && discountPercent > 0;

  const productUrl = paths.customer.productDetail.replace(':id', product.product_slug);

  return (
    <div
      className="group cursor-pointer text-left flex flex-col h-full bg-transparent"
      onClick={() => navigate(productUrl)}
    >
      {/* Image Container */}
      <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4 relative">
        {/* Main Image */}
        <img
          src={activeImage}
          alt={product.product_name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
            secondaryImage ? "group-hover:opacity-0" : ""
          )}
        />
        {/* Hover Secondary Image */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.product_name} secondary`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isNewArrival && (
            <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold uppercase tracking-wider">
              Mới
            </span>
          )}
          {showDiscount && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-gray-500 text-white text-[9px] font-bold uppercase tracking-wider">
              Hết hàng
            </span>
          )}
        </div>

        {/* Action overlay buttons (Wishlist & Add to Cart) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-10">
          <button
            onClick={handleToggleWishlist}
            className={`p-1.5 bg-white/95 dark:bg-black/75 hover:bg-white dark:hover:bg-black rounded-full transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border-none cursor-pointer shadow-sm flex items-center justify-center
              ${isInWishlist ? 'text-red-500' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'}`}
            title="Yêu thích"
          >
            <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) {
                  onAddToCart(product, e, selectedColor);
                }
              }}
              disabled={isOutOfStock}
              className={cn(
                "p-1.5 bg-white/95 dark:bg-black/75 hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-300 rounded-full transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border-none shadow-sm flex items-center justify-center",
                isOutOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-theme dark:hover:text-white"
              )}
              title={isOutOfStock ? "Hết hàng" : "Mua nhanh"}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Name */}
      <h4 className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-snug mb-2 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2">
        {product.product_name}
      </h4>

      {/* Pricing and Colors */}
      <div className="flex flex-col gap-1.5 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-theme dark:text-white">
            {formatVND(salePrice)}
          </span>
          {showDiscount && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {product.options_config?.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {product.options_config.colors.map((color) => (
              <button
                key={color.colorName}
                onClick={() => setSelectedColor(color.colorName)}
                style={{ backgroundColor: color.colorCode }}
                className={cn(
                  "w-3 h-3 rounded-full border cursor-pointer hover:scale-110 transition-all duration-200",
                  selectedColor.toLowerCase() === color.colorName.toLowerCase()
                    ? "border-theme dark:border-white ring-1 ring-black/20 dark:ring-white/20 scale-110"
                    : "border-gray-200 dark:border-gray-800"
                )}
                title={color.colorName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
