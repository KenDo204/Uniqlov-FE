import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Star } from '@/components/ui/icons';
import { cn } from "@/lib/utils";
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';
import { getColorCode } from '@/utils/mappers';
import type { ProductResponse } from '@/types/product/responses';
import { toast } from 'react-toastify';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAppSelector } from '@/stores/hooks';
import { useTracking } from '@/hooks/useTracking';
import { Source } from '@/types/tracking/requests';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export interface ProductCardProps {
  product: ProductResponse;
  isNewArrival?: boolean;
  isRecommendation?: boolean;
  aiModel?: string;
  rankPosition?: number;
  source?: Source;
}

export function ProductCard({
  product,
  isNewArrival = false,
  isRecommendation = false,
  aiModel,
  rankPosition,
  source = Source.UNKNOWN
}: ProductCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { trackClickRecommendation, trackAddToCart, trackWishlist } = useTracking();

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
      if (!isInWishlist) {
        trackWishlist(product.productId, selectedColor, '', 'product_card', source);
      }
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

  const colorImages = useMemo(() => {
    const results: { colorName: string; code: string; image: string }[] = [];
    const availableColors = product.optionsConfig?.colors || [];

    availableColors.forEach((c: any) => {
      const parsed = parseColor(c);
      if (!parsed.name) return;

      const matchingVariant = product.variants?.find((v) => {
        const attrs = Object.values(v.variantAttributes || {}).map(attr => String(attr).toLowerCase());
        return attrs.includes(parsed.name.toLowerCase()) && v.variantImage;
      });

      const image = matchingVariant?.variantImage || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80';

      if (!results.some(r => r.colorName.toLowerCase() === parsed.name.toLowerCase())) {
        results.push({ colorName: parsed.name, code: parsed.code, image });
      }
    });

    if (results.length === 0) {
      const defaultImage = product.variants?.[0]?.variantImage || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80';
      results.push({ colorName: 'Default', code: '#ccc', image: defaultImage });
    }
    return results;
  }, [product]);

  useEffect(() => {
    if (swiperInstance && colorImages.length > 0) {
      const index = colorImages.findIndex(c => c.colorName.toLowerCase() === (selectedColor || '').toLowerCase());
      if (index !== -1 && swiperInstance.activeIndex !== index) {
        swiperInstance.slideTo(index);
      }
    }
  }, [selectedColor, colorImages, swiperInstance]);

  const sizeInfo = useMemo(() => {
    let sizes = product.variants?.map(v => v.variantAttributes?.size || v.variantAttributes?.['Kích cỡ'])
      .filter(Boolean) as string[];
    sizes = Array.from(new Set(sizes));
    
    const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
    sizes.sort((a, b) => {
      const idxA = sizeOrder.indexOf(a.toUpperCase());
      const idxB = sizeOrder.indexOf(b.toUpperCase());
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    let sizeStr = '';
    if (sizes.length === 1) {
      sizeStr = sizes[0];
    } else if (sizes.length > 1) {
      sizeStr = `${sizes[0]}-${sizes[sizes.length - 1]}`;
    }

    let genderStr = '';
    if (product.targetGender === 0) {
      genderStr = 'Nữ';
    } else if (product.targetGender === 1) {
      genderStr = 'Nam';
    } else if (product.targetGender === 2) {
      genderStr = 'Unisex';
    } else {
      genderStr = 'Unisex';
    }

    if (sizeStr) return `${genderStr}, ${sizeStr}`;
    return genderStr;
  }, [product]);

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

    const activeColorStr = selectedColor || (product.optionsConfig?.colors?.length > 0 ? parseColor(product.optionsConfig.colors[0]).name : '');
    const variantsForColor = product.variants?.filter((v) => {
      if (!activeColorStr) return true;
      const attrValues = Object.values(v.variantAttributes || {}).map(attr => String(attr).toLowerCase());
      return attrValues.includes(activeColorStr.toLowerCase());
    }) || [];

    let targetVariant = null;

    if (variantsForColor.length === 1) {
      targetVariant = variantsForColor[0];
    } else if (variantsForColor.length > 1) {
      navigate(productUrl);
      return;
    } else {
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
        variantImage: targetVariant.variantImage || colorImages[0]?.image,
        variantAttributes: targetVariant.variantAttributes
      }, 1);

      const attrSize = targetVariant.variantAttributes?.size || targetVariant.variantAttributes?.['Kích cỡ'] || '';
      trackAddToCart(targetVariant.variantId, 1, activeColorStr, String(attrSize), source);

      toast.success(`Đã thêm ${product.productName} vào giỏ hàng`);
      window.dispatchEvent(new CustomEvent('open-cart-drawer'));
    } catch (err: any) {
      toast.error(err || 'Thêm vào giỏ hàng thất bại');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.quick-add-btn, .wishlist-btn, .color-swatch, .swiper-button-prev, .swiper-button-next')) {
      return;
    }
    if (isRecommendation && aiModel && rankPosition) {
      trackClickRecommendation(product.productId, aiModel, 'similar_or_bought_together', rankPosition, source);
    }
    navigate(productUrl, { state: { from: location.pathname } });
  };

  return (
    <div
      className={cn(
        "group cursor-pointer text-left flex flex-col h-full bg-white transition-all duration-300 rounded-[4px] border border-transparent",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1"
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="w-full aspect-[263/350] lg:aspect-[290/450] bg-[#f7f7f7] rounded-t-[4px] overflow-hidden relative">
        <Swiper
          style={{
            "--swiper-navigation-color": "var(--color-theme)",
            "--swiper-navigation-size": "24px",
          } as React.CSSProperties}
          modules={[Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={colorImages.length > 1}
          className={cn(
            "w-full h-full",
            // Base state (Mobile & Desktop non-hover): invisible, 0 opacity, unclickable
            "[&_.swiper-button-next]:opacity-0 [&_.swiper-button-prev]:opacity-0",
            "[&_.swiper-button-next]:invisible [&_.swiper-button-prev]:invisible",
            "[&_.swiper-button-next]:pointer-events-none [&_.swiper-button-prev]:pointer-events-none",
            
            // Hover state (Desktop only): visible, 100 opacity, clickable
            "md:group-hover:[&_.swiper-button-next]:opacity-100 md:group-hover:[&_.swiper-button-prev]:opacity-100",
            "md:group-hover:[&_.swiper-button-next]:visible md:group-hover:[&_.swiper-button-prev]:visible",
            "md:group-hover:[&_.swiper-button-next]:pointer-events-auto md:group-hover:[&_.swiper-button-prev]:pointer-events-auto",
            
            // Transition and Hover colors
            "[&_.swiper-button-next]:transition-all [&_.swiper-button-prev]:transition-all",
            "[&_.swiper-button-next]:duration-300 [&_.swiper-button-prev]:duration-300",
            "[&_.swiper-button-next]:hover:!text-theme [&_.swiper-button-prev]:hover:!text-theme"
          )}
          allowTouchMove={colorImages.length > 1}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => {
            const newIndex = swiper.activeIndex;
            if (colorImages[newIndex]) {
              const newColor = colorImages[newIndex].colorName;
              if (newColor !== 'Default' && newColor.toLowerCase() !== (selectedColor || '').toLowerCase()) {
                setSelectedColor(newColor);
              }
            }
          }}
        >
          {colorImages.map((item, index) => (
            <SwiperSlide key={`${item.colorName}-${index}`}>
              <img
                src={item.image}
                alt={`${product.productName} - ${item.colorName}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col items-start gap-1 md:gap-1.5 z-10">
          {isOutOfStock && (
            <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-900/80 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
              Hết hàng
            </span>
          )}
          {!isOutOfStock && isNewArrival && (
            <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/90 text-gray-900 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-gray-200/50 shadow-sm backdrop-blur-sm">
              Mới
            </span>
          )}
          {!isOutOfStock && isBestSeller && !isNewArrival && (
            <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-100 text-gray-800 text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-sm">
              Bán chạy
            </span>
          )}
        </div>

        {/* Floating Add to Cart Button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCartClick}
            disabled={isAdding}
            className={cn(
              "quick-add-btn absolute bottom-3 right-3 w-9 h-9 md:w-10 md:h-10 flex shrink-0 items-center justify-center text-gray-800 bg-white hover:bg-theme hover:text-white rounded-full transition-all duration-300 shadow-md border border-gray-100 z-20",
              "opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0",
              isAdding ? "opacity-50 cursor-wait md:opacity-50" : ""
            )}
            title="Thêm vào giỏ"
          >
            <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 pt-3 pb-2 gap-1 px-1 relative">
        <div className="flex flex-col px-1 pb-2 md:pb-3 mt-auto">
        {/* Color Swatches */}
        {product.optionsConfig?.colors?.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-1.5 pt-0.5" onClick={(e) => e.stopPropagation()}>
            {product.optionsConfig.colors.map((colorItem: any, index: number) => {
              const parsed = parseColor(colorItem);
              if (!parsed.name) return null;
              return (
                <button
                  key={parsed.name || index}
                  onClick={() => setSelectedColor(parsed.name)}
                  style={{ backgroundColor: parsed.code }}
                  className={cn(
                    "color-swatch w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border border-gray-300 cursor-pointer transition-all duration-200 outline-none shrink-0",
                    (selectedColor || '').toLowerCase() === parsed.name.toLowerCase()
                      ? "ring-1 ring-offset-1 ring-theme scale-110"
                      : "hover:scale-110"
                  )}
                  title={parsed.name}
                />
              );
            })}
          </div>
        )}
        <button
            onClick={handleToggleWishlist}
            className={cn(
              "wishlist-btn absolute top-1.5 right-1 p-1.5 flex items-center justify-center transition-all duration-300 border-none cursor-pointer bg-white/40 hover:bg-white rounded-full z-10",
              isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            )}
            title="Yêu thích"
          >
            <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${isInWishlist ? 'fill-current scale-110' : 'hover:scale-110'}`} />
          </button>
        
        {/* Gender & Size Info */}
        <div className="flex items-center justify-between min-h-[16px] mt-1.5">
          <span className="text-[11px] md:text-[12px] text-gray-500 font-medium truncate pr-2">
            {sizeInfo}
          </span>
          
        </div>

        {/* Name */}
        <h4 className="text-[13px] sm:text-[14px] md:text-[15px] font-primary text-gray-900 leading-snug m-0 group-hover:text-theme transition-colors line-clamp-2 mt-0.5">
          {product.productName}
        </h4>

        {/* Price */}
        <div className="flex items-end gap-1 md:gap-2 pt-1">
          {product.maxPrice && product.maxPrice > product.minPrice ? (
            <span className="text-[13px] sm:text-[14px] md:text-[15px] font-secondary font-bold tracking-tight text-gray-900">
              {formatVND(product.minPrice)} - {formatVND(product.maxPrice)}
            </span>
          ) : (
            <span className="text-[13px] sm:text-[14px] md:text-[15px] font-secondary font-bold tracking-tight text-gray-900">
              {formatVND(product.minPrice || 0)}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
        {/* Rating & Reviews */}
        {(product.ratingCount || 0) > 0 && (
          <div className="flex items-center gap-1 md:gap-1.5 mt-1 px-1 pb-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
            </div>
            <span className="text-[11px] md:text-[12px] font-medium text-gray-700">{product.ratingAvg?.toFixed(1) || 0}</span>
            <span className="text-[11px] md:text-[12px] text-gray-400">({product.ratingCount})</span>
          </div>
        )}
      </div>
    </div>
  );
}

