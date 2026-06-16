import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, Star, Heart } from 'lucide-react';
import { useFetchProducts, type Product } from '../../features/products';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const { data: products } = useFetchProducts({ search: query });
  const displayProducts = products || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const trendingSearches = ['Supima Cotton', 'Merino Wool', 'Linen Shirt', 'Chino Pants', 'Waterproof Coat'];

  const getProductAvgRating = (p: Product) => {
    if (!p.reviews || p.reviews.length === 0) return 5.0;
    const sum = p.reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / p.reviews.length).toFixed(1));
  };

  const sortedProducts = useMemo(() => {
    return [...displayProducts].sort((a, b) => {
      const aPrice = a.variants[0]?.price || 0;
      const bPrice = b.variants[0]?.price || 0;
      if (sortBy === 'price-low-high') return aPrice - bPrice;
      if (sortBy === 'price-high-low') return bPrice - aPrice;
      if (sortBy === 'rating') return getProductAvgRating(b) - getProductAvgRating(a);
      return 0;
    });
  }, [displayProducts, sortBy]);

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-heading font-black text-center m-0">Tìm kiếm thông minh</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm quần áo, chất liệu Supima, Merino, Linen..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Trending Searches */}
        {!query && (
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Từ khóa tìm kiếm phổ biến</span>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:border-primary transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {query && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-unilo-border dark:border-gray-800">
            <h2 className="text-xl font-heading font-black m-0">
              Kết quả cho "{query}" <span className="text-xs text-gray-400 font-normal ml-2">({sortedProducts.length} sản phẩm)</span>
            </h2>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-low-high">Giá: Thấp đến Cao</option>
              <option value="price-high-low">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-16 rounded-xl text-center">
              <p className="text-gray-400 font-light">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sortedProducts.map((product) => {
                const price = product.variants[0]?.price || 0;
                const image = product.variants[0]?.variant_image || product.images[0]?.image_url || '';
                const avgRating = getProductAvgRating(product);

                return (
                  <div
                    key={product.product_id}
                    onClick={() => navigate(paths.customer.productDetail.replace(':id', product.product_slug))}
                    className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className="relative h-64 md:h-80 bg-unilo-muted dark:bg-gray-800 overflow-hidden">
                      <img
                        src={image}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Đã thêm vào danh sách yêu thích.');
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-black/40 backdrop-blur rounded-full text-gray-500 dark:text-gray-300 hover:text-accent border-none cursor-pointer shadow-sm transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-accent">{product.category_id}</span>
                        <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-accent transition-colors line-clamp-1">{product.product_name}</h4>

                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < Math.floor(avgRating) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold">({product.reviews?.length || 0})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-unilo-border dark:border-gray-800">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{formatVND(price)}</span>
                        <span className="text-xs font-bold text-accent group-hover:underline flex items-center gap-1">Chi tiết <ArrowRight className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
