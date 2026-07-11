import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star } from '@/components/ui/icons';
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

  // Extract prices safely from the model
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

  // Calculate Ratings
  const reviewCount = product.reviews?.length || 0;
  const ratingAvg = reviewCount > 0 
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
    : 0;

  const isBestSeller = product.in_popular;

  const productUrl = paths.customer.productDetail.replace(':id', product.product_slug);

  return (
    <div
      className="group cursor-pointer text-left flex flex-col h-full bg-white transition-all duration-300 rounded-[4px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      onClick={() => navigate(productUrl)}
    >
      {/* Image Container */}
      <div className="w-full aspect-[3/4] bg-[#f7f7f7] rounded-t-[4px] overflow-hidden relative">
        {/* Main Image */}
        <img
          src={activeImage}
          alt={product.product_name}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
            secondaryImage ? "group-hover:opacity-0" : ""
          )}
        />
        {/* Hover Secondary Image */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.product_name} secondary`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
          {isOutOfStock && (
            <span className="px-2 py-1 bg-gray-900/80 text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              Hết hàng
            </span>
          )}
          {!isOutOfStock && isNewArrival && (
            <span className="px-2 py-1 bg-white/90 text-gray-900 text-[10px] font-bold uppercase tracking-widest border border-gray-200/50 shadow-sm backdrop-blur-sm">
              Mới
            </span>
          )}
          {!isOutOfStock && isBestSeller && !isNewArrival && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Bán chạy
            </span>
          )}
          {!isOutOfStock && showDiscount && (
            <span className="px-2 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action overlay buttons */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-100 shadow-sm
              ${isInWishlist ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
            title="Yêu thích"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>

          {onAddToCart && !isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, e, selectedColor);
              }}
              className="w-9 h-9 flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-full transition-colors shadow-sm"
              title="Thêm vào giỏ"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Name */}
        <h4 className="text-[13px] md:text-[14px] font-medium text-gray-700 leading-snug m-0 group-hover:text-black transition-colors line-clamp-2">
          {product.product_name}
        </h4>

        {/* Rating & Reviews */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[12px] font-medium text-gray-700">{ratingAvg}</span>
            <span className="text-[12px] text-gray-400">({reviewCount})</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-end gap-2 mt-auto pt-1">
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">
            {formatVND(salePrice)}
          </span>
          {showDiscount && (
            <span className="text-[12px] text-gray-400 line-through mb-0.5">
              {formatVND(originalPrice)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {product.options_config?.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-2" onClick={(e) => e.stopPropagation()}>
            {product.options_config.colors.map((color) => (
              <button
                key={color.colorName}
                onClick={() => setSelectedColor(color.colorName)}
                style={{ backgroundColor: color.colorCode }}
                className={cn(
                  "w-3.5 h-3.5 rounded-full border border-gray-300 cursor-pointer transition-all duration-200 outline-none",
                  selectedColor.toLowerCase() === color.colorName.toLowerCase()
                    ? "ring-1 ring-offset-2 ring-gray-900 scale-110"
                    : "hover:scale-110"
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
