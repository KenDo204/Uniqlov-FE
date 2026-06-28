import { useEffect, useMemo } from 'react';
import {
  HeroBanner,
  BestSellers,
  NewArrivals,
  CategorySection,
  CampaignSection,
  AccessorySection,
  AboutSection,
} from '@/components/customer/Home';
import { mockDataHome } from '@/constants/mock-data-home';
import { useProduct } from '@/hooks/useProduct';
import { mapProductResponseToProduct } from '@/utils/mappers';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'react-toastify';

export function Home() {
  const data = mockDataHome.data;
  const { products: rawProducts, isFetching, error, fetchPublicProducts } = useProduct();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchPublicProducts().catch((err) => {
      console.error('Error fetching home products:', err);
    });
  }, [fetchPublicProducts]);

  const mappedProducts = useMemo(() => {
    return (rawProducts || []).map(mapProductResponseToProduct);
  }, [rawProducts]);

  const handleAddToCart = (product: any, e: React.MouseEvent, selectedColor?: string) => {
    e.stopPropagation();
    const activeColor = selectedColor || product.options_config.colors[0]?.colorName || 'Default';
    const activeVariant = product.variants.find((v: any) => v.variant_attributes.colorName === activeColor) || product.variants[0];
    const size = activeVariant?.variant_attributes.size || 'M';
    const price = activeVariant?.price || product.variants[0]?.price || 0;
    const image = activeVariant?.variant_image || product.images[0]?.image_url || '';

    addItem({
      id: `${product.product_id}-${activeColor}-${size}`,
      name: `${product.product_name} (${activeColor} / ${size})`,
      price: price,
      image: image
    }, 1);

    toast.success(`Đã thêm ${product.product_name} vào giỏ hàng.`);
  };

  if (!data) return null;

  return (
    <div className="space-y-20 w-full text-left bg-unilo-muted">
      {/* SECTION 1: HERO */}
      <HeroBanner />

      {/* SECTION 3: BEST SELLERS */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <div className="w-8 h-8 border-3 border-[#00927c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Đang tải sản phẩm bán chạy...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-red-500 text-sm">Lỗi tải sản phẩm: {error}</p>
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-gray-400 text-sm">Chưa có sản phẩm nào nổi bật.</p>
        </div>
      ) : (
        <BestSellers products={mappedProducts} onAddToCart={handleAddToCart} />
      )}

      {/* SECTION 5: NEW ARRIVALS */}
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <div className="w-8 h-8 border-3 border-[#00927c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400">Đang tải sản phẩm mới...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-red-500 text-sm">Lỗi tải sản phẩm: {error}</p>
        </div>
      ) : mappedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl max-w-[1400px] mx-auto">
          <p className="text-gray-400 text-sm">Chưa có sản phẩm mới nào.</p>
        </div>
      ) : (
        <NewArrivals products={mappedProducts} onAddToCart={handleAddToCart} />
      )}

      {/* SECTION: CATEGORIES */}
      <CategorySection />

      {/* SECTION: CAMPAIGNS */}
      <CampaignSection campaignBlocks={data.campaignBlocks} />

      {/* SECTION: ACCESSORIES */}
      <AccessorySection />

      {/* SECTION: ABOUT & SEO */}
      <AboutSection />
    </div>
  );
}