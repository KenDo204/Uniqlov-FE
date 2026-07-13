import { useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProduct';
import type { ProductFilterRequest, ProductResponse } from '@/types/product';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { ProductListSidebar } from '@/components/customer/Product/ProductListSidebar';

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { publicProductsData, isFetching, fetchPublicProducts } = useProduct();

  // Local State for UI only

  const filterRequest: ProductFilterRequest & { page?: number; size?: number; sort?: string; colors?: string[]; sizes?: string[] } = useMemo(() => {
    const keyword = searchParams.get('q') || searchParams.get('keyword') || undefined;
    const categoryCode = searchParams.get('categoryCode') || undefined;
    const collection = searchParams.get('collection') || undefined;
    const targetGenderStr = searchParams.get('targetGender');
    const targetGender = targetGenderStr ? Number(targetGenderStr) : undefined;

    const minPriceStr = searchParams.get('minPrice');
    const minPrice = minPriceStr ? Number(minPriceStr) : undefined;
    
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? Number(maxPriceStr) : undefined;

    // FE filter state only
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || undefined;
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || undefined;

    // Pagination/Sort
    const pageStr = searchParams.get('page');
    const page = pageStr ? Number(pageStr) : 0;
    const sort = searchParams.get('sort') || undefined;
    const size = searchParams.get('size') ? Number(searchParams.get('size')) : undefined;
    
    const minRatingStr = searchParams.get('minRating');
    const minRating = minRatingStr ? Number(minRatingStr) : undefined;

    const inStockStr = searchParams.get('inStock');
    const inStock = inStockStr ? inStockStr === 'true' : undefined;

    const inPopularStr = searchParams.get('inPopular');
    const inPopular = inPopularStr ? inPopularStr === 'true' : undefined;
    
    const variantSize = searchParams.get('variantSize') || undefined;

    return {
      keyword,
      categoryCode,
      collection,
      minPrice,
      maxPrice,
      targetGender,
      minRating,
      inStock,
      inPopular,
      variantSize,
      sizes,
      colors,
      sort,
      page,
      size
    };
  }, [searchParams]);

  // Fetch when filter changes
  useEffect(() => {
    fetchPublicProducts(filterRequest).catch(err => {
      console.error("Lỗi lấy danh sách sản phẩm", err);
    });
  }, [filterRequest, fetchPublicProducts]);

  // Derived Title & Subtitle based on URL
  const collectionInfo = useMemo(() => {
    if (filterRequest.keyword) return { title: `Kết quả tìm kiếm: "${filterRequest.keyword}"`, subtitle: 'Các sản phẩm phù hợp với từ khóa của bạn.' };
    if (filterRequest.targetGender === 1) return { title: "Thời trang Nam", subtitle: 'Thiết kế tối giản, chất liệu cao cấp mang lại sự thoải mái tối đa.' };
    if (filterRequest.targetGender === 0) return { title: "Thời trang Nữ", subtitle: 'Phom dáng thanh lịch, chất liệu mềm mại tôn vinh vóc dáng tự nhiên.' };
    if (filterRequest.collection === 'NEW_ARRIVALS') return { title: 'Sản phẩm mới', subtitle: 'Khám phá các thiết kế mới nhất trong bộ sưu tập Lifewear hàng ngày.' };
    if (filterRequest.collection === 'BEST_SELLERS') return { title: 'Bán chạy nhất', subtitle: 'Những sản phẩm được yêu thích và đánh giá cao nhất bởi cộng đồng.' };
    if (filterRequest.categoryCode) return { title: `Danh mục: ${filterRequest.categoryCode}`, subtitle: 'Sản phẩm được chọn lọc theo danh mục.' };
    return { title: 'Tất cả sản phẩm', subtitle: 'Các sản phẩm Lifewear tối giản, chất lượng cao và bền vững.' };
  }, [filterRequest]);

  // Toggle Filters and update URL
  const updateQueryString = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Always reset to page 1 on filter change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // The actual products array (fallback if not paginated)
  // Use publicProductsData for Storefront which is PageResponse<ProductResponse>
  const productList: ProductResponse[] = publicProductsData?.content || [];

  return (
    <div className="space-y-8 text-left bg-white min-h-screen">
      {/* Page Header (Banner) */}
      <div className="bg-white border-b border-unilo-border dark:border-gray-800 py-10 mb-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="text-xs text-gray-400 mb-2 text-center tracking-widest font-semibold">
            <span className="hover:text-theme cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span> / <span className="text-theme font-bold">{collectionInfo.title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black m-0 tracking-tight text-center text-gray-900">{collectionInfo.title}</h1>
          <p className="mt-4 text-center text-gray-500 max-w-xl mx-auto text-sm font-medium">
            {collectionInfo.subtitle || "Khám phá bộ sưu tập mới nhất với mức giá hấp dẫn. Dành riêng cho bạn."}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Sidebar Filters */}
        <ProductListSidebar 
          filterRequest={filterRequest}
          updateQueryString={updateQueryString}
          clearAllFilters={clearAllFilters}
          hasFilters={!!(filterRequest.categoryCode || filterRequest.collection || filterRequest.targetGender !== undefined || filterRequest.minPrice || filterRequest.maxPrice || filterRequest.minRating || filterRequest.variantSize)}
        />

        {/* Products List section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 border border-unilo-border dark:border-gray-800 rounded-xl">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Hiển thị {productList.length} sản phẩm
            </span>

            <div className="flex items-center gap-4">
              {/* Sorting Select */}
              <div className="flex items-center gap-1">
                <select
                  value={filterRequest.sort || 'default'}
                  onChange={(e) => updateQueryString('sort', e.target.value === 'default' ? null : e.target.value)}
                  className="bg-transparent border-none text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sắp xếp mặc định</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="best_seller">Bán chạy nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <ProductGrid 
            products={productList}
            isLoading={isFetching}
            skeletonCount={8}
            gridClassName="grid-cols-2 md:grid-cols-3"
            emptyContent={
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-unilo-border dark:bg-gray-900 dark:border-gray-800 rounded-xl text-center shadow-sm">
                <img
                  className="w-48 opacity-80 mb-6"
                  src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
                  alt="Not Found"
                />
                <h2 className="font-bold text-2xl text-gray-800 dark:text-white m-0">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-500 mt-2 font-medium">Vui lòng thử lại với danh mục khác hoặc xóa bộ lọc hiện tại.</p>
                <button onClick={clearAllFilters} className="mt-6 px-8 py-3 bg-primary hover:bg-black text-white text-sm font-bold uppercase tracking-wider rounded-full cursor-pointer border-none shadow-md transition-colors">
                  Xóa tất cả bộ lọc
                </button>
              </div>
            }
          />
          
          {/* Phân trang (Pagination) */}
          {publicProductsData && publicProductsData.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button 
                disabled={publicProductsData.number === 0}
                onClick={() => updateQueryString('page', String(publicProductsData.number - 1))}
                className="px-3 py-1.5 border border-unilo-border rounded bg-white text-xs disabled:opacity-50 cursor-pointer"
              >
                Trang trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: publicProductsData.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateQueryString('page', String(i))}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold cursor-pointer border ${publicProductsData.number === i ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={publicProductsData.number === publicProductsData.totalPages - 1}
                onClick={() => updateQueryString('page', String(publicProductsData.number + 1))}
                className="px-3 py-1.5 border border-unilo-border rounded bg-white text-xs disabled:opacity-50 cursor-pointer"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
