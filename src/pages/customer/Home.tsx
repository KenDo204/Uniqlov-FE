import React from 'react';
import { useFetchProducts, mockProducts, type Product } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';
import {
  HeroBanner,
  CategoryNavigation,
  BestSellers,
  ValueProposition,
  NewArrivals,
  LifestyleStory,
  CustomerReviews,
  Newsletter
} from '@/components/home';

export function Home() {
  const addItem = useCartStore((state) => state.addItem);
  const { data: products } = useFetchProducts();

  const displayProducts = products || mockProducts;

  const handleAddToCart = (product: Product, e: React.MouseEvent, selectedColor?: string) => {
    e.stopPropagation();
    const activeColor = selectedColor || product.variants[0]?.colorName || 'Default';
    const activeVariant = product.variants.find((v) => v.colorName === activeColor) || product.variants[0];
    const size = activeVariant?.sizes.find((s) => s.inventory > 0)?.size || 'M';

    addItem(
      {
        id: `${product.id}-${activeColor}-${size}`,
        name: `${product.name} (${activeColor} / ${size})`,
        price: product.price,
        image: activeVariant?.images[0] || '',
      },
      1
    );

    toast.success(`Added ${product.name} (${activeColor}/${size}) to cart.`);
  };

  return (
    <div className="space-y-20 w-full text-left bg-unilo-muted">
      {/* SECTION 1: HERO */}
      <HeroBanner />

      {/* SECTION 2: CATEGORY NAVIGATION */}
      <CategoryNavigation />

      {/* SECTION 3: BEST SELLERS */}
      <BestSellers products={displayProducts} onAddToCart={handleAddToCart} />

      {/* SECTION 5: NEW ARRIVALS */}
      <NewArrivals products={displayProducts} onAddToCart={handleAddToCart} />

      {/* SECTION 6: LIFESTYLE STORY */}
      {/* <LifestyleStory /> */}
      
      {/* SECTION 4: VALUE PROPOSITION */}
      {/* <ValueProposition /> */}

      {/* SECTION 7: CUSTOMER REVIEWS */}
      {/* <CustomerReviews /> */}

      {/* SECTION 8: NEWSLETTER */}
      {/* <Newsletter /> */}
    </div>
  );
}
