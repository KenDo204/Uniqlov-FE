import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star } from '@/components/ui/icons';
import { cn } from "@/lib/utils";
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';
import { getColorCode } from '@/utils/mappers';
import type { ProductResponse } from '@/types/product/responses';
import { toast } from 'react-toastify';
import { useWishlist } from '@/hooks/useWishlist';
import { useAppSelector } from '@/stores/hooks';
import { useCart } from '@/hooks/useCart';

export interface ProductCardProps {
  product: ProductResponse;
  isNewArrival?: boolean;
}

export function ProductCard({
  product,
  isNewArrival = false
}: ProductCardProps) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const isInWishlist = useMemo(() => {
    if (!wishlist || !product) return false;
    return wishlist.content.some((item) => item.productId === product.productId);
  }, [wishlist, product]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warn('Vui lòng đăng nhập để thêm sản phẩm vào mục yêu thích.');
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product.productId);
      toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật danh sách yêu thích');
    }
  };

  // Normalize a color item (string or object)
  const parseColor = (c: any) => {
    if (typeof c === 'string') return { name: c, code: getColorCode(c) };
    if (typeof c === 'object' && c !== null) {
      const name = c.colorName || c.name || '';
      return { name, code: c.colorCode || getColorCode(name) };
    }
    return { name: '', code: '#ccc' };
  };

  // Initialize selected color
  useEffect(() => {
    if (product?.optionsConfig?.colors?.length > 0) {
      setSelectedColor(parseColor(product.optionsConfig.colors[0]).name);
    }
  }, [product]);

  // Find active variant matching selected color
  const activeVariant = useMemo(() => {
    if (!product || !product.variants) return null;
    if (selectedColor) {
      return product.variants.find(
        (v) => Object.values(v.variantAttributes || {}).some(attr => 
          String(attr).toLowerCase() === selectedColor.toLowerCase()
        )
      ) || product.variants[0];
    }
    return product.variants[0];
  }, [product, selectedColor]);

  const activeImage = activeVariant?.variantImage || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80';
  const secondaryImage = product.images?.[1]?.imageUrl || '';

  // Determine stock status
  const totalStock = useMemo(() => {
    return product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
  }, [product]);
  const isOutOfStock = !product.inStock || totalStock === 0;

  const isBestSeller = product.inPopular;

  const productUrl = paths.customer.productDetail.replace(':id', product.productSlug || String(product.productId));

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOutOfStock || isAdding) return;
    
    // 1. Get the current active color string
    const activeColorStr = selectedColor || (product.optionsConfig?.colors?.length > 0 ? parseColor(product.optionsConfig.colors[0]).name : '');

    // 2. Lấy danh sách các variant thuộc về màu đang chọn
    const variantsForColor = product.variants?.filter((v) => {
      if (!activeColorStr) return true;
      const attrValues = Object.values(v.variantAttributes || {}).map(attr => String(attr).toLowerCase());
      return attrValues.includes(activeColorStr.toLowerCase());
    }) || [];

    let targetVariant = null;

    if (variantsForColor.length === 1) {
      // Chỉ có duy nhất 1 kích thước (hoặc sản phẩm chỉ có màu)
      targetVariant = variantsForColor[0];
    } else if (variantsForColor.length > 1) {
      // Có nhiều kích thước => Bắt buộc người dùng phải chọn => Chuyển sang trang Product Detail
      navigate(productUrl);
      return;
    } else {
      // variantsForColor.length === 0, dự phòng
      if (product.variants?.length === 1) {
        targetVariant = product.variants[0];
      } else {
        navigate(productUrl);
        return;
      }
    }

    if (!targetVariant || !targetVariant.variantId) {
      toast.error('Không tìm thấy thông tin biến thể hợp lệ.');
      return;
    }
    
    setIsAdding(true);
    try {
      await addItem({
        id: String(targetVariant.variantId),
        variantId: targetVariant.variantId,
        name: product.productName,
        price: targetVariant.price || product.minPrice || 0,
        variantImage: targetVariant.variantImage || activeImage,
        variantAttributes: targetVariant.variantAttributes
      }, 1);
      
      toast.success(`Đã thêm ${product.productName} vào giỏ hàng`);
      window.dispatchEvent(new CustomEvent('open-cart-drawer'));
    } catch (err: any) {
      toast.error(err || 'Thêm vào giỏ hàng thất bại');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={cn(
        "group cursor-pointer text-left flex flex-col h-full bg-white transition-all duration-300 rounded-[4px] border border-transparent",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
      )}
      onClick={() => navigate(productUrl)}
    >
      {/* Image Container */}
      <div className="w-full aspect-[3/4] bg-[#f7f7f7] rounded-t-[4px] overflow-hidden relative">
        {/* Main Image */}
        <img
          src={activeImage}
          alt={product.productName}
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
            alt={`${product.productName} secondary`}
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
        </div>
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-50 rounded-full transition-all border-none cursor-pointer shadow-sm active:scale-95
              ${isInWishlist ? 'text-red-500' : 'text-theme hover:text-red-500'}`}
          title="Yêu thích"
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Name */}
        <h4 className="text-[13px] md:text-[14px] font-heading font-bold text-gray-900 leading-snug m-0 group-hover:text-theme transition-colors line-clamp-2">
          {product.productName}
        </h4>

        {/* Rating & Reviews */}
        {(product.ratingCount || 0) > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[12px] font-medium text-gray-700">{product.ratingAvg?.toFixed(1) || 0}</span>
            <span className="text-[12px] text-gray-400">({product.ratingCount})</span>
          </div>
        )}

        {/* Color Swatches */}
        {product.optionsConfig?.colors?.length > 0 && (
          <div className="flex gap-1.5 pt-2" onClick={(e) => e.stopPropagation()}>
            {product.optionsConfig.colors.map((colorItem: any, index: number) => {
              const parsed = parseColor(colorItem);
              if (!parsed.name) return null;
              return (
                <button
                  key={parsed.name || index}
                  onClick={() => setSelectedColor(parsed.name)}
                  style={{ backgroundColor: parsed.code }}
                  className={cn(
                    "w-3.5 h-3.5 rounded-full border border-gray-300 cursor-pointer transition-all duration-200 outline-none",
                    (selectedColor || '').toLowerCase() === parsed.name.toLowerCase()
                      ? "ring-1 ring-offset-2 ring-theme scale-110"
                      : "hover:scale-110"
                  )}
                  title={parsed.name}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-unilo-border dark:border-gray-800 mt-auto">
        <div className="flex items-end gap-2 pt-1">
          {product.maxPrice && product.maxPrice > product.minPrice ? (
            <span className="text-[15px] font-bold tracking-tight text-accent text-theme">
              {formatVND(product.minPrice)} - {formatVND(product.maxPrice)}
            </span>
          ) : (
            <span className="text-[15px] font-bold tracking-tight text-accent text-theme">
              {formatVND(product.minPrice || 0)}
            </span>
          )}
        </div>
        {!isOutOfStock && (
          <button
            onClick={handleAddToCartClick}
            disabled={isAdding}
            className={`w-9 h-9 flex items-center justify-center text-gray-800 bg-white hover:text-theme rounded-full transition-colors shadow-sm border border-gray-200 ${isAdding ? 'opacity-50 cursor-wait' : ''}`}
            title="Thêm vào giỏ"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group text-left flex flex-col h-full bg-white transition-all duration-300 rounded-[4px] border border-transparent">
      <div className="w-full aspect-[3/4] bg-gray-200 rounded-t-[4px] animate-pulse relative">
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
           <div className="w-12 h-5 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse mt-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Color swatches skeleton */}
        <div className="flex gap-1.5 pt-2">
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-3.5 h-3.5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="flex items-center justify-between px-4 pb-4 pt-1 border-t border-unilo-border dark:border-gray-800 mt-auto">
        <div className="flex items-end gap-2 pt-1">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
