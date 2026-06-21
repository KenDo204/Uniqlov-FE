import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '@/components/ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { paths } from '@/config/paths';
import { formatVND } from '@/utils/formatters';
import type { Product } from '@/features/products';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface NewArrivalsProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
}

export function NewArrivals({ products, onAddToCart }: NewArrivalsProps) {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  // For mock representation, use the popular items as new arrivals as well
  const newArrivals = products.filter((p) => p.in_popular);

  return (
    <section className="space-y-6 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black m-0">Sản phẩm mới về</h2>
        </div>
        <button
          onClick={() => navigate(paths.customer.newArrivals)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent border-none bg-transparent cursor-pointer "
        >
          Khám phá tất cả <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {newArrivals.map((product) => {
          const activeColor = selectedColors[`new-${product.product_id}`] || product.options_config.colors[0]?.colorName || '';
          const activeVariant = product.variants.find((v) => v.variant_attributes.colorName === activeColor) || product.variants[0];
          const activeImage = activeVariant?.variant_image || product.images[0]?.image_url || '';
          const productPrice = activeVariant?.price || product.variants[0]?.price || 0;

          return (
            <SwiperSlide key={product.product_id}>
              <div
                onClick={() => navigate(paths.customer.productDetail.replace(':id', product.product_slug))}
                className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div className="relative h-64 md:h-80 bg-unilo-muted dark:bg-gray-800 overflow-hidden">
                  <img
                    src={activeImage}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                    Mới
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-accent">
                      {product.category_id}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-accent transition-colors line-clamp-1">
                      {product.product_name}
                    </h4>

                    <div className="flex gap-1.5 pt-1.5" onClick={(e) => e.stopPropagation()}>
                      {product.options_config.colors.map((color) => (
                        <button
                          key={color.colorName}
                          onClick={() => setSelectedColors((prev) => ({ ...prev, [`new-${product.product_id}`]: color.colorName }))}
                          style={{ backgroundColor: color.colorCode }}
                          className={`w-3.5 h-3.5 rounded-full border cursor-pointer hover:scale-110 transition-transform ${activeColor === color.colorName ? 'border-primary scale-110 ring-1 ring-primary/40' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          title={color.colorName}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-unilo-border dark:border-gray-800">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {formatVND(productPrice)}
                    </span>
                    <button
                      onClick={(e) => onAddToCart(product, e, activeColor)}
                      className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white hover:text-accent border-none bg-transparent cursor-pointer"
                    >
                      + Mua nhanh
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
