import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ProductSwiper } from '@/components/shared/ProductSwiper';
import { buildCategoryUrl } from '@/utils/urlHelpers';
import { Source } from '@/types/tracking/requests';
import { useSlider } from '@/hooks/useSlider';
import { useCategory } from '@/hooks/useCategory';
import { useFetchProducts } from '@/hooks/useFetchProducts';
import type { CategoryResponse } from '@/types/category/responses';
import type { SliderResponse } from '@/types/slider/responses';

// --- Helpers ---
const extractCategoryCode = (url: string | null): string | null => {
  if (!url) return null;
  const match = url.match(/categoryCode=([^&]+)/);
  return match ? match[1] : null;
};

const findCategoryByCode = (categories: CategoryResponse[], code: string): CategoryResponse | null => {
  for (const cat of categories) {
    if (cat.categoryCode === code) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryByCode(cat.children, code);
      if (found) return found;
    }
  }
  return null;
};

const getLevel3Children = (category: CategoryResponse): CategoryResponse[] => {
  let results: CategoryResponse[] = [];
  if (category.level === 3) {
    results.push(category);
  } else if (category.children && category.children.length > 0) {
    category.children.forEach(child => {
      results = results.concat(getLevel3Children(child));
    });
  }
  return results;
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
  categories: CategoryResponse[];
}

const CampaignBlock = React.memo(function CampaignBlock({ slider, categories }: CampaignBlockProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CategoryResponse | null>(null);

  // Compute tabs only for this slider's targetUrl
  const campaignTabs = useMemo(() => {
    if (!categories || categories.length === 0 || !slider.targetUrl) return [];
    
    let allLevel3Tabs: CategoryResponse[] = [];
    const code = extractCategoryCode(slider.targetUrl);
    
    if (code) {
      const rootCategory = findCategoryByCode(categories, code);
      if (rootCategory) {
        allLevel3Tabs = getLevel3Children(rootCategory);
      }
    }
    
    // Remove duplicates by categoryId
    return Array.from(new Map(allLevel3Tabs.map(item => [item.categoryId, item])).values());
  }, [categories, slider.targetUrl]);

  // Set default active tab
  useEffect(() => {
    if (campaignTabs.length > 0 && !activeTab) {
      setActiveTab(campaignTabs[0]);
    }
  }, [campaignTabs, activeTab]);

  // Fetch products specific to this block's activeTab
  const activeTabFilter = useMemo(() => {
    return { 
      categoryCode: activeTab?.categoryCode || '', 
      size: 10 
    };
  }, [activeTab]);

  const { products: campaignProducts, isLoading: isProductsLoading } = useFetchProducts(
    activeTabFilter,
    { skip: !activeTab }
  );

  return (
    <section className="w-full mt-2 bg-[rgba(215, 222, 241, 1)] py-4 md:py-8 mb-8">
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

      {/* Tabs */}
      {campaignTabs.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-14">
            {campaignTabs.map((tab) => (
              <button
                key={tab.categoryId}
                onClick={() => setActiveTab(tab)}
                className={`px-5 md:px-6 py-2 md:py-2.5 text-[11px] md:text-[13px] rounded-full border transition-all cursor-pointer ${
                  activeTab?.categoryId === tab.categoryId
                    ? 'bg-black text-white border-black font-semibold shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black'
                }`}
              >
                {tab.categoryName}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="min-h-[300px]">
            {isProductsLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : campaignProducts.length > 0 ? (
              <ProductSwiper 
                products={campaignProducts} 
                skeletonCount={5}
                source={Source.HOME_CATEGORY_LIST}
              />
            ) : (
              <div className="text-center text-gray-500 py-10">Không có sản phẩm nào cho danh mục này.</div>
            )}
          </div>

          {activeTab && (
            <div className="text-center mt-12">
              <button 
                onClick={() => navigate(buildCategoryUrl(activeTab.categoryCode))}
                className="px-10 py-3 border border-gray-300 bg-transparent text-[13px] font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                XEM TẤT CẢ
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
});

// --- Main Component: CampaignSection ---
export function CampaignSection() {
  const { publicSliders, loadPublicSliders } = useSlider();
  const { categories, fetchPublicCategories } = useCategory();

  // Fetch data on mount if empty
  useEffect(() => {
    if (!publicSliders || publicSliders.length === 0) {
      loadPublicSliders().catch(console.error);
    }
    if (!categories || categories.length === 0) {
      fetchPublicCategories().catch(console.error);
    }
  }, [publicSliders, categories, loadPublicSliders, fetchPublicCategories]);

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
          categories={categories} 
        />
      ))}
    </>
  );
}
