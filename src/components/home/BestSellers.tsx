import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { paths } from '@/config/paths';
import type { Product } from '@/features/products';

interface BestSellersProps {
  products: Product[];
  onAddToCart: (product: Product, e: React.MouseEvent, selectedColor?: string) => void;
}

export function BestSellers({ products, onAddToCart }: BestSellersProps) {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <section className="space-y-6 max-w-[1400px] mx-auto px-4 lg:px-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black m-0">Best Sellers</h2>
        </div>
        <button
          onClick={() => navigate(paths.customer.bestSellers)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent border-none bg-transparent cursor-pointer hover:underline"
        >
          View All Best Sellers <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {bestSellers.map((product) => {
          const activeColor = selectedColors[product.id] || product.variants[0]?.colorName || '';
          const activeVariant = product.variants.find((v) => v.colorName === activeColor) || product.variants[0];
          const activeImage = activeVariant?.images[0] || '';

          return (
            <div
              key={product.id}
              onClick={() => navigate(paths.customer.productDetail.replace(':id', product.id))}
              className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
            >
              {/* Image Wrap */}
              <div className="relative h-64 md:h-80 bg-unilo-muted dark:bg-gray-800 overflow-hidden">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />

                {/* Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-accent text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                  Bestseller
                </span>

                {/* Wishlist Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Saved to Wishlist.');
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 backdrop-blur rounded-full text-gray-500 dark:text-gray-300 hover:text-accent border-none cursor-pointer shadow-sm transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Info Wrap */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-accent">
                    {product.category}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-accent transition-colors line-clamp-1">
                    {product.name}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-semibold">({product.reviewsCount})</span>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex gap-1.5 pt-1.5" onClick={(e) => e.stopPropagation()}>
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedColors((prev) => ({ ...prev, [product.id]: v.colorName }))}
                        style={{ backgroundColor: v.colorCode }}
                        className={`w-3.5 h-3.5 rounded-full border cursor-pointer hover:scale-110 transition-transform ${
                          activeColor === v.colorName ? 'border-primary scale-110 ring-1 ring-primary/40' : 'border-gray-200 dark:border-gray-700'
                        }`}
                        title={v.colorName}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-unilo-border dark:border-gray-800">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    ${(product.price / 23000).toFixed(0)} USD
                  </span>
                  <button
                    onClick={(e) => onAddToCart(product, e, activeColor)}
                    className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white hover:text-accent border-none bg-transparent cursor-pointer"
                  >
                    Quick Add +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
