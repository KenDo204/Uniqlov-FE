import { useState, useRef, useEffect, useMemo } from 'react';
import { useCategory } from '@/hooks/useCategory';
import type { ProductFilterRequest } from '@/types/product';
import { Drawer } from '@mui/material';
import { Close as CloseIcon, FilterList as FilterIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { cn } from '@/lib/utils';

interface ProductFilterBarProps {
  filterRequest: ProductFilterRequest & { sort?: string; variantSize?: string };
  updateQueryString: (key: string, value: string | null) => void;
  clearAllFilters: () => void;
  hasFilters: boolean;
}

const COLLECTIONS = [
  { key: 'NEW_ARRIVALS', label: 'Hàng mới về' },
  { key: 'BEST_SELLERS', label: 'Bán chạy' },
  { key: 'POPULAR', label: 'Xu hướng' }
];

const GENDERS = [
  { key: 1, label: 'Nam' },
  { key: 0, label: 'Nữ' },
  { key: 2, label: 'Unisex' }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRICE_RANGES = [
  { label: 'Tất cả', min: null, max: null },
  { label: 'Dưới 199.000', min: 0, max: 199000 },
  { label: '199.000 - 299.000', min: 199000, max: 299000 },
  { label: '299.000 - 399.000', min: 299000, max: 399000 },
  { label: '399.000 - 499.000', min: 399000, max: 499000 },
  { label: '499.000 - 799.000', min: 499000, max: 799000 },
  { label: 'Trên 799.000', min: 799000, max: 9999999 }
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Tiêu biểu' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng' },
  { value: 'price_desc', label: 'Giá giảm' },
  { value: 'best_seller', label: 'Bán chạy nhất' }
];

const RATINGS = [5, 4, 3, 2, 1];

export function ProductFilterBar({
  filterRequest,
  updateQueryString,
  clearAllFilters,
  hasFilters
}: ProductFilterBarProps) {
  const { categories, fetchPublicCategories } = useCategory();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categories.length === 0) {
      fetchPublicCategories();
    }
  }, [categories.length, fetchPublicCategories]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    updateQueryString('minPrice', min !== null ? min.toString() : null);
    updateQueryString('maxPrice', max !== null ? max.toString() : null);
    setActiveDropdown(null);
  };

  // Helper tìm category context
  const categoryContext = useMemo(() => {
    const findCategoryPath = (cats: any[], targetCode: string, currentPath: any[] = []): any[] | null => {
      for (const cat of cats) {
        const path = [...currentPath, cat];
        if (cat.categoryCode === targetCode) return path;
        if (cat.children && cat.children.length > 0) {
          const found = findCategoryPath(cat.children, targetCode, path);
          if (found) return found;
        }
      }
      return null;
    };

    if (!filterRequest.categoryCode) {
      return { contextCat: null, displayItems: categories, currentName: null };
    }

    const path = findCategoryPath(categories, filterRequest.categoryCode);
    if (path && path.length > 0) {
      const currentCat = path[path.length - 1];
      const ancestors = path.slice(0, -1);
      const hasChildren = currentCat.children && currentCat.children.length > 0;
      
      const contextCat = (!hasChildren && ancestors.length > 0) ? ancestors[ancestors.length - 1] : currentCat;
      const displayItems = contextCat.children || [];
      return { contextCat, displayItems, currentName: currentCat.categoryName };
    }

    return { contextCat: null, displayItems: categories, currentName: filterRequest.categoryCode };
  }, [filterRequest.categoryCode, categories]);

  // Nhãn hiển thị cho các nút Filter
  const activeLabels = {
    category: categoryContext.currentName,
    collection: filterRequest.collection ? COLLECTIONS.find(c => c.key === filterRequest.collection)?.label : null,
    gender: filterRequest.targetGender !== undefined ? GENDERS.find(g => g.key === filterRequest.targetGender)?.label : null,
    size: filterRequest.variantSize ? `Kích cỡ: ${filterRequest.variantSize}` : null,
    price: filterRequest.minPrice !== undefined || filterRequest.maxPrice !== undefined 
      ? PRICE_RANGES.find(p => p.min === filterRequest.minPrice && p.max === filterRequest.maxPrice)?.label || 'Giá' 
      : null,
    rating: filterRequest.minRating ? `Từ ${filterRequest.minRating} sao` : null,
    sort: filterRequest.sort && filterRequest.sort !== 'default' 
      ? SORT_OPTIONS.find(s => s.value === filterRequest.sort)?.label 
      : 'Sắp xếp'
  };

  const renderContextCategoryList = () => {
    const { contextCat, displayItems } = categoryContext;

    return (
      <div className="flex flex-col">
        {contextCat && (
          <label className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors",
            filterRequest.categoryCode === contextCat.categoryCode ? "font-bold text-theme" : "font-medium text-gray-700"
          )}>
            <input
              type="radio"
              name="categorySelect"
              checked={filterRequest.categoryCode === contextCat.categoryCode}
              onChange={() => {
                updateQueryString('categoryCode', filterRequest.categoryCode === contextCat.categoryCode ? null : contextCat.categoryCode);
                setActiveDropdown(null);
              }}
              className="accent-theme w-4 h-4 cursor-pointer"
            />
            <span className="line-clamp-1">Tất cả {contextCat.categoryName}</span>
          </label>
        )}

        {displayItems.map((node: any) => {
          const isActive = filterRequest.categoryCode === node.categoryCode;
          return (
            <label key={node.categoryId} className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:text-theme transition-colors",
              isActive ? "font-bold text-theme" : "font-medium text-gray-700"
            )}>
              <input
                type="radio"
                name="categorySelect"
                checked={isActive}
                onChange={() => {
                  updateQueryString('categoryCode', isActive ? null : node.categoryCode);
                  setActiveDropdown(null);
                }}
                className="accent-theme w-4 h-4 cursor-pointer"
              />
              <span className="line-clamp-1">{node.categoryName}</span>
            </label>
          );
        })}
      </div>
    );
  };

  // Các Panels cho Desktop
  const renderPanelContent = () => {
    switch (activeDropdown) {
      case 'category':
        return (
          <div className="py-2">
            {renderContextCategoryList()}
          </div>
        );
      case 'collection':
        return (
          <div className="flex gap-8 py-4 px-6">
            {COLLECTIONS.map((col) => (
              <label key={col.key} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <input
                  type="radio"
                  name="collection"
                  checked={filterRequest.collection === col.key}
                  onChange={() => {
                    updateQueryString('collection', filterRequest.collection === col.key ? null : col.key);
                    setActiveDropdown(null);
                  }}
                  className="accent-theme w-4 h-4"
                />
                <span className={cn("text-sm", filterRequest.collection === col.key ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>{col.label}</span>
              </label>
            ))}
          </div>
        );
      case 'gender':
        return (
          <div className="flex gap-8 py-4 px-6">
            {GENDERS.map((gen) => (
              <label key={gen.key} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <input
                  type="radio"
                  name="gender"
                  checked={filterRequest.targetGender === gen.key}
                  onChange={() => {
                    updateQueryString('targetGender', filterRequest.targetGender === gen.key ? null : gen.key.toString());
                    setActiveDropdown(null);
                  }}
                  className="accent-theme w-4 h-4"
                />
                <span className={cn("text-sm", filterRequest.targetGender === gen.key ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>{gen.label}</span>
              </label>
            ))}
          </div>
        );
      case 'size':
        return (
          <div className="flex gap-4 py-4 px-6">
            {SIZES.map((size) => {
              const isActive = filterRequest.variantSize === size;
              return (
                <button
                  key={size}
                  onClick={() => {
                    updateQueryString('variantSize', isActive ? null : size);
                    setActiveDropdown(null);
                  }}
                  className={cn(
                    "w-14 h-14 text-sm font-bold border transition-all cursor-pointer rounded-sm flex items-center justify-center",
                    isActive ? "bg-white text-theme border-theme shadow-[inset_0_0_0_1px_#111827]" : "bg-white text-gray-600 border-gray-300 hover:border-theme hover:text-theme"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        );
      case 'price':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4 px-6">
            {PRICE_RANGES.map((range, idx) => {
              const isActive = filterRequest.minPrice === range.min && filterRequest.maxPrice === range.max;
              return (
                <label key={idx} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                  <input
                    type="radio"
                    name="price"
                    checked={isActive}
                    onChange={() => handlePriceChange(range.min, range.max)}
                    className="accent-theme w-4 h-4"
                  />
                  <span className={cn("text-sm", isActive ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>{range.label}</span>
                </label>
              );
            })}
          </div>
        );
      case 'rating':
        return (
          <div className="flex flex-col gap-4 py-4 px-6">
            {RATINGS.map((star) => (
              <label key={star} className="flex items-center gap-3 cursor-pointer hover:opacity-80 w-fit">
                <input
                  type="radio"
                  name="rating"
                  checked={filterRequest.minRating === star}
                  onChange={() => {
                    updateQueryString('minRating', filterRequest.minRating === star ? null : star.toString());
                    setActiveDropdown(null);
                  }}
                  className="accent-theme w-4 h-4"
                />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={cn("text-[18px]", i < star ? "text-yellow-400" : "text-gray-300")}>★</span>
                  ))}
                  <span className="text-sm font-medium text-gray-500 ml-2 mt-0.5 hover:text-theme">Trở lên</span>
                </div>
              </label>
            ))}
          </div>
        );
      case 'sort':
        return (
          <div className="flex gap-8 py-4 px-6">
            {SORT_OPTIONS.map((sort) => (
              <label key={sort.value} className="flex items-center gap-3 cursor-pointer hover:opacity-80">
                <input
                  type="radio"
                  name="sort"
                  checked={(filterRequest.sort || 'default') === sort.value}
                  onChange={() => {
                    updateQueryString('sort', sort.value === 'default' ? null : sort.value);
                    setActiveDropdown(null);
                  }}
                  className="accent-theme w-4 h-4"
                />
                <span className={cn("text-sm", (filterRequest.sort || 'default') === sort.value ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>{sort.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Nút Filter Button chung cho Desktop
  const FilterButton = ({ id, label, isActive }: { id: string, label: string, isActive: boolean }) => {
    const isOpen = activeDropdown === id;
    return (
      <button
        onClick={() => toggleDropdown(id)}
        className={cn(
          "flex items-center gap-2 h-10 px-4 rounded-none border transition-all duration-200 outline-none select-none whitespace-nowrap hover:text-theme cursor-pointer",
          isActive || isOpen
            ? "bg-white border-theme text-theme shadow-[inset_0_0_0_1px_#00927c] font-bold"
            : "bg-white border-gray-300 text-gray-700 hover:border-theme hover:text-theme font-semibold"
        )}
      >
        <span className="text-[13px]">{label}</span>
        <ExpandMoreIcon className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 hover:text-theme", isOpen && "rotate-180")} />
      </button>
    );
  };

  const renderMobileFilters = () => (
    // ... nội dung mobile như trước ...
    <div className="flex flex-col space-y-6 pb-24">
      {/* Category */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Danh mục</h4>
        <div className="space-y-1">
          {renderContextCategoryList()}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Sắp xếp */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Sắp xếp</h4>
        <div className="space-y-2">
          {SORT_OPTIONS.map((sort) => (
            <label key={sort.value} className="flex items-center gap-3 py-1 cursor-pointer">
              <input
                type="radio"
                name="mobileSort"
                checked={(filterRequest.sort || 'default') === sort.value}
                onChange={() => updateQueryString('sort', sort.value === 'default' ? null : sort.value)}
                className="accent-theme w-4 h-4 cursor-pointer"
              />
              <span className={cn("text-sm", (filterRequest.sort || 'default') === sort.value ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>
                {sort.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Collection */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Bộ sưu tập</h4>
        <div className="space-y-2">
          {COLLECTIONS.map((col) => (
            <label key={col.key} className="flex items-center gap-3 py-1 cursor-pointer">
              <input
                type="radio"
                name="mobileCollection"
                checked={filterRequest.collection === col.key}
                onChange={() => updateQueryString('collection', filterRequest.collection === col.key ? null : col.key)}
                className="accent-theme w-4 h-4 cursor-pointer"
              />
              <span className={cn("text-sm", filterRequest.collection === col.key ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>
                {col.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Size Grid Uniqlo Style */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Kích cỡ</h4>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {SIZES.map((size) => {
            const isActive = filterRequest.variantSize === size;
            return (
              <button
                key={size}
                onClick={() => updateQueryString('variantSize', isActive ? null : size)}
                className={cn(
                  "h-10 text-[13px] font-bold border transition-all cursor-pointer rounded-sm flex items-center justify-center",
                  isActive ? "bg-white text-theme border-theme shadow-[inset_0_0_0_1px_#00927c]" : "bg-white text-gray-600 border-gray-300 hover:border-theme hover:text-theme"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Price */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Khoảng giá</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, idx) => {
            const isActive = filterRequest.minPrice === range.min && filterRequest.maxPrice === range.max;
            return (
              <label key={idx} className="flex items-center gap-3 py-1 cursor-pointer">
                <input
                  type="radio"
                  name="mobilePrice"
                  checked={isActive}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="accent-theme w-4 h-4 cursor-pointer"
                />
                <span className={cn("text-sm", isActive ? "font-bold text-theme" : "font-medium text-gray-700 hover:text-theme")}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-40 bg-white" ref={barRef}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* === MOBILE FILTER BUTTON === */}
        <div className="flex md:hidden items-center justify-between py-3">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2 h-10 px-5 bg-white border border-gray-300 rounded-sm font-bold text-[13px] text-gray-800"
          >
            <FilterIcon className="w-4 h-4" />
            Bộ lọc & Sắp xếp {hasFilters && <span className="w-2 h-2 rounded-full bg-theme ml-1"></span>}
          </button>
          
          {hasFilters && (
            <button onClick={clearAllFilters} className="text-xs font-bold text-theme underline underline-offset-2 cursor-pointer">
              Xóa tất cả
            </button>
          )}
        </div>

        {/* === MOBILE DRAWER BOTTOM SHEET === */}
        <Drawer
          anchor="bottom"
          open={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        >
          <div className="flex flex-col h-full relative" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', maxHeight: '90vh', overflow: 'hidden' }}>
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <h3 className="font-primary font-black text-lg m-0 uppercase tracking-tight">Bộ lọc & Sắp xếp</h3>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {renderMobileFilters()}
            </div>
            {/* Mobile Footer Actions */}
            <div className="sticky bottom-0 z-10 px-6 py-4 bg-white border-t border-gray-100 flex gap-4">
              <button onClick={clearAllFilters} className="flex-1 h-12 border border-gray-300 bg-white text-gray-700 font-bold uppercase tracking-wider text-sm rounded-none">
                Làm mới
              </button>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="flex-1 h-12 border-none bg-theme text-white font-bold uppercase tracking-wider text-sm rounded-none shadow-md">
                Áp dụng
              </button>
            </div>
          </div>
        </Drawer>

        {/* === DESKTOP FILTER BAR === */}
        <div className="hidden md:flex items-center flex-wrap gap-2 py-2">
          
          <FilterButton id="category" label={activeLabels.category || 'Danh mục'} isActive={!!activeLabels.category} />
          <FilterButton id="collection" label={activeLabels.collection || 'Bộ sưu tập'} isActive={!!activeLabels.collection} />
          <FilterButton id="gender" label={activeLabels.gender || 'Giới tính'} isActive={!!activeLabels.gender} />
          <FilterButton id="size" label={activeLabels.size || 'Kích cỡ'} isActive={!!activeLabels.size} />
          <FilterButton id="price" label={activeLabels.price || 'Giá'} isActive={!!filterRequest.minPrice || !!filterRequest.maxPrice} />
          <FilterButton id="rating" label={activeLabels.rating || 'Đánh giá'} isActive={!!activeLabels.rating} />
          <FilterButton id="sort" label={activeLabels.sort || 'Sắp xếp'} isActive={(filterRequest.sort && filterRequest.sort !== 'default') as boolean} />

          {/* Nút Clear All nếu có filter */}
          {hasFilters && (
            <button 
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 h-10 px-4 text-[13px] font-bold text-gray-500 hover:text-theme transition-colors ml-2 cursor-pointer"
            >
              Xóa tất cả
            </button>
          )}
        </div>

      </div>

      {/* === DESKTOP DROPDOWN FULL WIDTH PANEL === */}
      {activeDropdown && (
        <div className="hidden md:block absolute top-full left-0 w-full bg-white border-y border-gray-200 shadow-md z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {renderPanelContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
