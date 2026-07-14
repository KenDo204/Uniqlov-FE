import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '@/hooks/useCategory';
import { SearchBox } from '@/components/shared/SearchBox';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { CategoryCard } from './CategoryCard';
import 'swiper/css';
import 'swiper/css/free-mode';

// Helper đệ quy để tìm đường dẫn từ Root đến Category hiện tại
function findCategoryPath(categories: any[], targetCode: string, currentPath: any[] = []): any[] | null {
  for (const cat of categories) {
    const path = [...currentPath, cat];
    if (cat.categoryCode === targetCode) {
      return path;
    }
    if (cat.children && cat.children.length > 0) {
      const foundPath = findCategoryPath(cat.children, targetCode, path);
      if (foundPath) return foundPath;
    }
  }
  return null;
}

interface ProductListHeaderProps {
  keyword?: string;
  categoryCode?: string;
  totalElements: number;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export function ProductListHeader({ keyword, categoryCode, fallbackTitle, fallbackSubtitle }: ProductListHeaderProps) {
  const navigate = useNavigate();
  const { categories } = useCategory();

  // 1. Nếu đang Search
  if (keyword) {
    return (
      <div className="bg-white border-b border-unilo-border dark:border-gray-800 py-6 md:py-10 mb-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-primary font-black tracking-tight text-gray-900 mb-6 uppercase">
            Tìm kiếm
          </h1>
          <div className="w-full max-w-xl">
            <SearchBox 
              initialValue={keyword} 
              className="w-full h-12 md:h-14 border border-gray-300 rounded-full hover:bg-white bg-white focus-within:ring-1 focus-within:ring-gray-400 focus-within:border-gray-400 shadow-sm"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Nếu truy cập qua Category
  if (categoryCode && categories && categories.length > 0) {
    const path = findCategoryPath(categories, categoryCode);

    if (path && path.length > 0) {
      const currentCat = path[path.length - 1];
      const ancestors = path.slice(0, -1);
      
      const hasChildren = currentCat.children && currentCat.children.length > 0;
      
      // Xác định Context Category (danh mục dùng để render UI Header)
      // Nếu có children -> context là chính nó
      // Nếu không có children (leaf node) -> context là cha của nó (nếu có)
      const contextCat = (!hasChildren && ancestors.length > 0) ? ancestors[ancestors.length - 1] : currentCat;
      const contextSiblings = contextCat.children || [];
      
      // Xây dựng danh sách hiển thị: Gồm "Tất cả" (bản thân contextCat) + các danh mục con của contextCat
      let displayItems: any[] = [];
      if (contextSiblings.length > 0) {
        displayItems = [
          {
            ...contextCat,
            displayName: `Tất cả ${contextCat.categoryName}`
          },
          ...contextSiblings.filter((c: any) => c.categoryStatus === 1).map((c: any) => ({
            ...c,
            displayName: c.categoryName
          }))
        ];
      }

      return (
        <div className="bg-white border-b border-unilo-border dark:border-gray-800 pt-6 pb-6 mb-8 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            
            {/* Breadcrumb Động */}
            <div className="text-sm text-gray-500 mb-6 tracking-wide font-medium flex items-center space-x-2 flex-wrap gap-y-2">
              <span className="hover:text-theme cursor-pointer transition-colors" onClick={() => navigate('/')}>Trang chủ</span>
              
              {ancestors.map((ancestor) => (
                <React.Fragment key={ancestor.categoryId}>
                  <span className="text-gray-400">/</span>
                  <span 
                    className="hover:text-theme cursor-pointer transition-colors" 
                    onClick={() => navigate(`/products?categoryCode=${ancestor.categoryCode}`)}
                  >
                    {ancestor.categoryName}
                  </span>
                </React.Fragment>
              ))}
              
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">{currentCat.categoryName}</span>
            </div>

            {/* Title Động theo Context */}
            <h1 className="text-2xl md:text-3xl font-primary font-black m-0 tracking-tight text-gray-900 mb-6 uppercase">
              {contextCat.categoryName}
            </h1>

            {/* Category Cards Navigation */}
            {displayItems.length > 0 && (
              <div className="w-full -mx-4 px-4 md:mx-0 md:px-0">
                <Swiper
                  modules={[FreeMode]}
                  freeMode={true}
                  slidesPerView="auto"
                  spaceBetween={12}
                  breakpoints={{
                    768: { spaceBetween: 16 },
                    1024: { spaceBetween: 24 }
                  }}
                  className="w-full !pb-4"
                >
                  {displayItems.map((item: any) => {
                    // isActive: Khi click "Tất cả" thì URL categoryCode chính là currentCat.categoryCode
                    const isActive = currentCat.categoryCode === item.categoryCode;
                    
                    return (
                      <SwiperSlide key={item.categoryId} className="!w-[130px] sm:!w-[150px] lg:!w-[170px]">
                        <CategoryCard
                          displayName={item.displayName}
                          iconUrl={item.iconUrl}
                          isActive={isActive}
                          onClick={() => navigate(`/products?categoryCode=${item.categoryCode}`)}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // 3. Fallback (dành cho Collection, Target Gender, v.v.)
  return (
    <div className="bg-white border-b border-unilo-border dark:border-gray-800 py-10 mb-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-xs text-gray-400 mb-2 text-center tracking-widest font-semibold uppercase">
          <span className="hover:text-theme cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span> / <span className="text-theme font-bold">{fallbackTitle}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-primary font-black m-0 tracking-tight text-center text-gray-900 uppercase">
          {fallbackTitle}
        </h1>
        <p className="mt-4 text-center text-gray-500 max-w-xl mx-auto text-sm font-medium">
          {fallbackSubtitle || "Khám phá bộ sưu tập mới nhất với mức giá hấp dẫn. Dành riêng cho bạn."}
        </p>
      </div>
    </div>
  );
}
