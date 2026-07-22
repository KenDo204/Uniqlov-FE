import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ProductSwiper } from '@/components/shared/ProductSwiper';
import { buildCategoryUrl } from '@/utils/urlHelpers';
import { Source } from '@/types/tracking/requests';
import { useSlider } from '@/hooks/useSlider';
import { useFetchProducts } from '@/hooks/useFetchProducts';
import type { SliderResponse } from '@/types/slider/responses';
import { Container } from '@/components/shared/Container';

// --- Helpers ---
const extractCategoryCode = (url: string | null): string | null => {
  if (!url) return null;
  const match = url.match(/categoryCode=([^&]+)/);
  if (match) return match[1];
  const cleanUrl = url.trim();
  if (cleanUrl && !cleanUrl.includes('/') && !cleanUrl.includes('?')) {
    return cleanUrl;
  }
  return null;
};

const resolveImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// --- Sub-component: CampaignBlock ---
interface CampaignBlockProps {
  slider: SliderResponse;
}

const CampaignBlock = React.memo(function CampaignBlock({ slider }: CampaignBlockProps) {
  const navigate = useNavigate();

  const categoryCode = useMemo(() => {
    return extractCategoryCode(slider.targetUrl);
  }, [slider.targetUrl]);

  // Fetch products directly according to categoryCode
  const productFilter = useMemo(() => {
    return { 
      categoryCode: categoryCode || '', 
      size: 10 
    };
  }, [categoryCode]);

  const { products: campaignProducts, isLoading: isProductsLoading } = useFetchProducts(
    productFilter,
    { skip: !categoryCode }
  );

  const targetCategoryUrl = useMemo(() => {
    if (slider.targetUrl) return slider.targetUrl;
    if (categoryCode) return buildCategoryUrl(categoryCode);
    return '/products';
  }, [slider.targetUrl, categoryCode]);

  return (
    <section className="w-full bg-white py-4 md:py-8">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[65vh] overflow-hidden">
        {slider.targetUrl ? (
          <Link to={slider.targetUrl} className="block w-full h-full">
            <img src={resolveImageUrl(slider.imageUrl)} alt="Campaign Banner" className="w-full h-full object-cover" />
          </Link>
        ) : (
          <img src={resolveImageUrl(slider.imageUrl)} alt="Campaign Banner" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Product List Section */}
      <Container className="py-8 md:py-12">
        <div className="min-h-[300px]">
          <ProductSwiper 
            products={campaignProducts} 
            isLoading={isProductsLoading}
            skeletonCount={5}
            source={Source.HOME_CATEGORY_LIST}
            emptyContent={
              <div className="text-center text-gray-500 py-10">Không có sản phẩm nào cho danh mục này.</div>
            }
          />
        </div>

        {(!isProductsLoading && campaignProducts.length > 0) && (
          <div className="text-center mt-8 md:mt-12">
            <button 
              onClick={() => navigate(targetCategoryUrl)}
              className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:border-theme hover:bg-theme hover:text-white transition-all duration-300 cursor-pointer rounded-[2px]"
            >
              XEM TẤT CẢ
            </button>
          </div>
        )}
      </Container>
    </section>
  );
});

// --- Main Component: CampaignSection ---
export function CampaignSection() {
  const { publicSliders, loadPublicSliders } = useSlider();

  // Fetch data on mount if empty
  useEffect(() => {
    if (!publicSliders || publicSliders.length === 0) {
      loadPublicSliders().catch(console.error);
    }
  }, [publicSliders, loadPublicSliders]);

  // Extract displayOrder === 2 sliders
  const campaignSliders = useMemo(() => {
    return (publicSliders || [])
      .filter((s) => s.isActive && s.displayOrder === 2)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [publicSliders]);

  if (campaignSliders.length === 0) return null;

  return (
    <>
      {campaignSliders.map((slider) => (
        <CampaignBlock 
          key={slider.sliderId} 
          slider={slider} 
        />
      ))}
    </>
  );
}
