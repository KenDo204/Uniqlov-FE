import React from 'react';
import { Filter } from '@/components/ui/icons';
import { useCategory } from '@/hooks/useCategory';
import type { ProductFilterRequest } from '@/types/product';
import { Slider } from '@mui/material';

interface ProductListSidebarProps {
  filterRequest: ProductFilterRequest;
  updateQueryString: (key: string, value: string | null) => void;
  clearAllFilters: () => void;
  hasFilters: boolean;
}

export function ProductListSidebar({
  filterRequest,
  updateQueryString,
  clearAllFilters,
  hasFilters
}: ProductListSidebarProps) {
  const { categories, fetchPublicCategories } = useCategory();

  React.useEffect(() => {
    if (categories.length === 0) {
      fetchPublicCategories();
    }
  }, [categories.length, fetchPublicCategories]);

  // Handle Price Change (Debounced via onchange committed or just simple MUI onChangeCommitted)
  const handlePriceChangeCommitted = (_event: Event | React.SyntheticEvent<Element, Event>, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      updateQueryString('minPrice', newValue[0] > 0 ? newValue[0].toString() : null);
      updateQueryString('maxPrice', newValue[1] < 2000000 ? newValue[1].toString() : null);
    }
  };

  const currentPriceRange = [
    filterRequest.minPrice || 0,
    filterRequest.maxPrice || 2000000
  ];

  const renderCategoryNode = (node: any, visualIndent = 0) => {
    // Bỏ qua level 1, duyệt thẳng vào mảng con (level 2)
    if (node.level === 1) {
      if (!node.children || node.children.length === 0) return null;
      return (
        <React.Fragment key={node.categoryId}>
          {node.children.map((child: any) => renderCategoryNode(child, 0))}
        </React.Fragment>
      );
    }

    // Chỉ hiển thị level 2 và 3
    if (node.level !== 2 && node.level !== 3) {
      return null;
    }

    const isActive = filterRequest.categoryCode === node.categoryCode;
    return (
      <div key={node.categoryId} style={{ marginLeft: `${visualIndent * 12}px` }} className="space-y-1">
        <label className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => updateQueryString('categoryCode', isActive ? null : node.categoryCode)}
            className="accent-theme w-4 h-4 border-unilo-border rounded cursor-pointer"
          />
          <span>{node.categoryName}</span>
        </label>
        {node.children && node.children.length > 0 && node.level < 3 && (
          <div className="mt-1 space-y-1">
            {node.children.map((child: any) => renderCategoryNode(child, visualIndent + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-unilo-border dark:border-gray-800">
        <span className="font-heading font-bold text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" /> Bộ lọc
        </span>
        {hasFilters && (
          <button onClick={clearAllFilters} className="text-xs text-[var(--color-theme)] font-semibold bg-transparent border-none cursor-pointer">
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Category Tree */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Danh mục</h4>
        <div className="space-y-1.5">
          {categories.map((cat: any) => renderCategoryNode(cat))}
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Bộ sưu tập</h4>
        <div className="space-y-1.5">
          {[
            { key: 'NEW_ARRIVALS', label: 'Hàng mới về' },
            { key: 'BEST_SELLERS', label: 'Bán chạy nhất' },
            { key: 'POPULAR', label: 'Xu hướng' }
          ].map((col) => (
            <label key={col.key} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterRequest.collection === col.key}
                onChange={() => updateQueryString('collection', filterRequest.collection === col.key ? null : col.key)}
                className="accent-theme w-4 h-4 border-unilo-border rounded cursor-pointer"
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Giới tính</h4>
        <div className="space-y-1.5">
          {[
            { key: 0, label: 'Nữ' },
            { key: 1, label: 'Nam' },
            { key: 2, label: 'Unisex' }
          ].map((gen) => (
            <label key={gen.key} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer select-none">
              <input
                type="radio"
                name="targetGender"
                checked={filterRequest.targetGender === gen.key}
                onChange={() => updateQueryString('targetGender', filterRequest.targetGender === gen.key ? null : gen.key.toString())}
                onClick={(e: any) => {
                  if (filterRequest.targetGender === gen.key) {
                    e.preventDefault();
                    updateQueryString('targetGender', null);
                  }
                }}
                className="accent-theme w-4 h-4 border-unilo-border cursor-pointer"
              />
              <span>{gen.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2 pt-2 pr-2">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Khoảng giá</h4>
        <div className="px-2">
          <Slider
            value={currentPriceRange}
            onChangeCommitted={handlePriceChangeCommitted}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${(v / 1000).toFixed(0)}k`}
            min={0}
            max={2000000}
            step={100000}
            sx={{ color: 'var(--color-theme)' }}
          />
          <div className="flex justify-between text-[11px] text-gray-500 font-semibold mt-1">
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPriceRange[0])}</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPriceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Đánh giá tối thiểu</h4>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => updateQueryString('minRating', filterRequest.minRating === star ? null : star.toString())}
              className={`text-xl cursor-pointer hover:scale-110 transition-transform bg-transparent border-none ${
                (filterRequest.minRating || 0) >= star ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
