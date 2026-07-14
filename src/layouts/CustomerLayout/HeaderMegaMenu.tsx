import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCategory } from '@/hooks/useCategory';
import { buildMegaMenuUrl } from '@/utils/urlHelpers';

export function HeaderMegaMenu() {
  const { categories, isFetching, fetchPublicCategories } = useCategory();
  const [activeCategory, setActiveCategory] = useState<any>(null);

  useEffect(() => {
    fetchPublicCategories().catch((err) => {
      console.error('Error fetching public categories for mega menu:', err);
    });
  }, [fetchPublicCategories]);

  // Filter out active categories at Level 0 (root level where parentId is null or level is 1)
  const activeCategoriesList = useMemo(() => {
    return (categories || []).filter((c: any) => c.categoryStatus === 1 && (c.parentId === null || c.level === 1)).slice(0, 12);
  }, [categories]);

  const closeMenu = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    setActiveCategory(null);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col bg-white border border-gray-100 rounded-lg shadow-sm"
      onMouseLeave={() => setActiveCategory(null)}
    >
      {/* HEADER DANH MỤC */}
      <div className="flex items-center gap-3 px-4 py-3 bg-theme text-white rounded-t-lg font-bold tracking-wide">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <span>DANH MỤC</span>
      </div>

      {/* DANH SÁCH DỌC */}
      <div className="flex flex-col py-2 relative h-[380px] overflow-y-auto scrollbar-hide">
        {isFetching ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-theme border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          activeCategoriesList.map((category) => (
            <div
              key={category.categoryId}
              className="w-full"
              onMouseEnter={() => setActiveCategory(category)}
            >
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] text-gray-700 hover:text-theme hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer text-left ${activeCategory?.categoryId === category.categoryId ? 'font-bold text-theme bg-gray-50' : ''
                  }`}
              >
                <img src={category.iconUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'} className="w-10 h-10 object-cover rounded-full" alt="" />
                <span className="flex-1 text-[17px]">{category.categoryName}</span>
                <span className="text-gray-400 text-[10px]">▶</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* 2. OVERLAY MEGA MENU KHI HOVER (FLYOUT) */}
      {activeCategory && activeCategory.children && activeCategory.children.filter((c: any) => c.categoryStatus === 1).length > 0 && (
        <div
          className="absolute top-0 left-full ml-1 w-[800px] min-h-full bg-white z-[99] shadow-2xl border border-gray-100 rounded-lg p-6 animate-in fade-in zoom-in-95 duration-200"
          onMouseEnter={() => setActiveCategory(activeCategory)}
        >
          <div className="mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-theme uppercase m-0">{activeCategory.categoryName}</h3>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 text-center">
            {activeCategory.children.filter((c: any) => c.categoryStatus === 1).map((item: any, itemIdx: number) => (
              <Link
                key={itemIdx}
                to={buildMegaMenuUrl(activeCategory, item)}
                onClick={closeMenu}
                className="flex flex-col items-center group decoration-none cursor-pointer"
              >
                {/* Ảnh sản phẩm */}
                <div className="w-16 h-16 mb-2 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                  <img
                    src={item.iconUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'}
                    alt={item.categoryName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Tên danh mục con */}
                <span className="text-[15px] font-normal uppercase text-gray-800 leading-snug px-1 group-hover:text-theme transition-colors line-clamp-2">
                  {item.categoryName}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}