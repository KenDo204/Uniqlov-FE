import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Heart, Star, Grid3X3, Grid2X2 } from 'lucide-react';
import { useFetchProducts, mockProducts, type Product } from '../../features/products';
import { useCartStore } from '../../stores/useCartStore';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';

export function Collection() {
  const location = useLocation();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { data: products } = useFetchProducts();

  // State
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [gridLayout, setGridLayout] = useState<3 | 4>(4);
  const [productColorPreviews, setProductColorPreviews] = useState<Record<string, string>>({});

  // Resolve collection type from URL path
  const collectionType = useMemo(() => {
    const path = location.pathname;
    if (path.includes('men')) return { title: "Men's Collection", tag: 'men', subtitle: 'Refined essential menswear engineered for daily functionality.' };
    if (path.includes('women')) return { title: "Women's Collection", tag: 'women', subtitle: 'Flowing shapes, advanced knit structures, and premium drapes.' };
    if (path.includes('new-arrivals')) return { title: 'New Arrivals', tag: 'new', subtitle: 'Explore the latest releases in our daily essential range.' };
    if (path.includes('best-sellers')) return { title: 'Best Sellers', tag: 'bestseller', subtitle: 'Apparel fundamentals loved most by our international community.' };
    if (path.includes('seasonal-essentials')) return { title: 'Seasonal Essentials', tag: 'seasonal', subtitle: 'Weather-ready fabrics crafted to insulate or cool naturally.' };
    return { title: 'Collections', tag: 'all', subtitle: 'Designed for everyday comfort, versatility, and longevity.' };
  }, [location.pathname]);

  // Filter raw catalog
  const filteredProducts = useMemo(() => {
    const raw = products || mockProducts;

    return raw.filter((product) => {
      // 1. URL Category filtering
      if (collectionType.tag === 'men' && product.category !== 'men' && !product.tags.includes('Men')) {
        // Fallback checks for shared items (e.g. essentials can apply to men/women)
        if (product.category !== 'essentials' && product.category !== 'outerwear' && product.category !== 'active') return false;
      }
      if (collectionType.tag === 'women' && product.category !== 'women') {
        if (product.category !== 'essentials' && product.category !== 'outerwear' && product.category !== 'active') return false;
      }
      if (collectionType.tag === 'new' && !product.isNewArrival) return false;
      if (collectionType.tag === 'bestseller' && !product.isBestSeller) return false;
      if (collectionType.tag === 'seasonal' && !product.isSeasonalEssential) return false;

      // 2. Sidebar categories checkboxes
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

      // 3. Size filters
      if (selectedSizes.length > 0) {
        const hasSize = product.variants.some((variant) =>
          variant.sizes.some((s) => selectedSizes.includes(s.size) && s.inventory > 0)
        );
        if (!hasSize) return false;
      }

      // 4. Color filters
      if (selectedColors.length > 0) {
        const hasColor = product.variants.some((variant) =>
          selectedColors.some(c => variant.colorName.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      return 0; // Default
    });
  }, [products, collectionType, selectedSizes, selectedColors, selectedCategories, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setSortBy('default');
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeColor = productColorPreviews[product.id] || product.variants[0]?.colorName || 'Default';
    const activeVariant = product.variants.find(v => v.colorName === activeColor) || product.variants[0];
    const size = activeVariant?.sizes.find(s => s.inventory > 0)?.size || 'M';

    addItem({
      id: `${product.id}-${activeColor}-${size}`,
      name: `${product.name} (${activeColor} / ${size})`,
      price: product.price,
      image: activeVariant?.images[0] || ''
    }, 1);

    toast.success(`Added ${product.name} to cart.`);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen">
      {/* Page Header */}
      <div className="border-b border-unilo-border dark:border-gray-800 pb-6">
        <div className="text-xs text-gray-400 mb-2">
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Home</span> / <span className="text-gray-600 font-medium">{collectionType.title}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-heading font-black m-0 tracking-tight">{collectionType.title}</h1>
        <p className="text-xs md:text-sm text-gray-500 m-0 mt-2 max-w-xl font-light">{collectionType.subtitle}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-unilo-border dark:border-gray-800">
            <span className="font-heading font-bold text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </span>
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedCategories.length > 0) && (
              <button onClick={clearAllFilters} className="text-xs text-accent font-semibold hover:underline bg-transparent border-none cursor-pointer">
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Category</h4>
            <div className="space-y-1.5">
              {[
                { key: 'essentials', label: 'Essentials' },
                { key: 'outerwear', label: 'Outerwear' },
                { key: 'active', label: 'Activewear' },
                { key: 'men', label: 'Mens' },
                { key: 'women', label: 'Womens' },
                { key: 'accessories', label: 'Accessories' }
              ].map((cat) => (
                <label key={cat.key} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.key)}
                    onChange={() => toggleCategory(cat.key)}
                    className="accent-primary w-4 h-4 border-unilo-border rounded cursor-pointer"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Sizes</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`py-2 text-xs font-bold border transition-all rounded-lg cursor-pointer ${selectedSizes.includes(size)
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-primary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'White', hex: '#FAF9F6' },
                { name: 'Black', hex: '#1C1C1C' },
                { name: 'Navy', hex: '#1B263B' },
                { name: 'Olive', hex: '#556B2F' },
                { name: 'Camel', hex: '#C19A6B' },
                { name: 'Cream', hex: '#F5EFEB' },
                { name: 'Khaki', hex: '#D2B48C' }
              ].map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  style={{ backgroundColor: color.hex }}
                  className={`w-6 h-6 rounded-full border cursor-pointer relative hover:scale-105 transition-transform ${selectedColors.includes(color.name) ? 'border-primary ring-1 ring-primary/40' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  title={color.name}
                >
                  {selectedColors.includes(color.name) && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${color.name === 'White' || color.name === 'Cream' ? 'text-primary' : 'text-white'}`}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products List section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 border border-unilo-border dark:border-gray-800 rounded-xl">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Showing {filteredProducts.length} items
            </span>

            <div className="flex items-center gap-4">
              {/* Layout Switcher */}
              <div className="hidden md:flex items-center gap-1 border-r border-unilo-border dark:border-gray-800 pr-4">
                <button
                  onClick={() => setGridLayout(3)}
                  className={`p-1.5 rounded cursor-pointer ${gridLayout === 3 ? 'bg-unilo-muted dark:bg-gray-800 text-primary dark:text-white' : 'text-gray-400 hover:text-primary'}`}
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridLayout(4)}
                  className={`p-1.5 rounded cursor-pointer ${gridLayout === 4 ? 'bg-unilo-muted dark:bg-gray-800 text-primary dark:text-white' : 'text-gray-400 hover:text-primary'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting Select */}
              <div className="flex items-center gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
                >
                  <option value="default">Default Sort</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-16 rounded-xl text-center">
              <p className="text-gray-400 font-light">No items match your filters. Reset parameters to keep browsing.</p>
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-primary hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer border-none shadow">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-${gridLayout} gap-6`}>
              {filteredProducts.map((product) => {
                const activeColor = productColorPreviews[product.id] || product.variants[0]?.colorName || '';
                const activeVariant = product.variants.find(v => v.colorName === activeColor) || product.variants[0];
                const activeImage = activeVariant?.images[0] || '';

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(paths.customer.productDetail.replace(':id', product.id))}
                    className="group flex flex-col h-full bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer text-left"
                  >
                    <div className="relative h-64 md:h-80 bg-unilo-muted dark:bg-gray-800 overflow-hidden">
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />

                      {product.isNewArrival && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-wider rounded">
                          New
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Added to Wishlist.');
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white dark:bg-black/40 backdrop-blur rounded-full text-gray-500 dark:text-gray-300 hover:text-accent border-none cursor-pointer shadow-sm transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-accent">
                          {product.category}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white m-0 group-hover:text-accent transition-colors line-clamp-1">
                          {product.name}
                        </h4>

                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold">({product.reviewsCount})</span>
                        </div>

                        {/* Color swatches */}
                        <div className="flex gap-1.5 pt-1.5" onClick={(e) => e.stopPropagation()}>
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setProductColorPreviews(prev => ({ ...prev, [product.id]: v.colorName }))}
                              style={{ backgroundColor: v.colorCode }}
                              className={`w-3.5 h-3.5 rounded-full border cursor-pointer hover:scale-110 transition-transform ${activeColor === v.colorName ? 'border-primary scale-110 ring-1 ring-primary/40' : 'border-gray-200 dark:border-gray-700'
                                }`}
                              title={v.colorName}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-unilo-border dark:border-gray-800">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          ${(product.price / 23000).toFixed(0)} USD
                        </span>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white hover:text-accent border-none bg-transparent cursor-pointer"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
