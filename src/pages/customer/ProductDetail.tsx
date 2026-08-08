import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from '@/components/general/ConfirmModal';
import { Star, Heart, ChevronRight } from '@/components/ui/icons';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';
import { useProduct } from '@/hooks/useProduct';
import { mapProductResponseToProduct } from '@/utils/mappers';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { useWishlist } from '@/hooks/useWishlist';
import { useReview } from '@/hooks/useReview';
import { useCategory } from '@/hooks/useCategory';
import { useAppSelector } from '@/stores/hooks';
import { useTracking } from '@/hooks/useTracking';
import { Source } from '@/types/tracking/requests';
import { SimilarProducts } from '@/components/customer/Recommendation/SimilarProducts';
import { BoughtTogether } from '@/components/customer/Recommendation/BoughtTogether';
import type { CategoryResponse } from '@/types/category/responses';
import { Container } from '@/components/shared/Container';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const originUrl = location.state?.from as string | undefined;
  const { addItem: addCartItem } = useCart();

  const {
    products: rawProducts,
    productDetail,
    isFetching,
    error,
    fetchPublicProducts,
    fetchProductBySlug
  } = useProduct();

  const product = useMemo(() => {
    if (!productDetail) return null;
    return mapProductResponseToProduct(productDetail);
  }, [productDetail]);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { categories: categoryTree } = useCategory();
  const { wishlist, fetchMyWishlist, toggleWishlist } = useWishlist();
  const {
    productReviews,
    productSummary,
    fetchProductReviews,
    fetchProductReviewSummary
  } = useReview();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { trackView, trackAddToCart, trackWishlist } = useTracking();

  // Tracking VIEW_ITEM
  useEffect(() => {
    if (product?.product_id) {
      const timer = setTimeout(() => {
        trackView(Number(product.product_id), Number(product.category_id) || undefined, Source.PRODUCT_MAIN_INFO, 3);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [product, trackView]);

  // Fetch product detail and public products (for bundle items)
  useEffect(() => {
    if (slug) {
      const cleanSlug = slug.replace(/^"|"$/g, '');
      fetchProductBySlug(cleanSlug).catch((err) => {
        console.error('Error fetching product by slug:', err);
      });
    }
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    if (!rawProducts || rawProducts.length === 0) {
      fetchPublicProducts().catch((err) => {
        console.error('Error fetching all products:', err);
      });
    }
  }, [rawProducts, fetchPublicProducts]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyWishlist(0, 50).catch((err) => console.error('Error fetching wishlist:', err));
    }
  }, [isAuthenticated, fetchMyWishlist]);

  useEffect(() => {
    if (product) {
      fetchProductReviews(product.product_id, 0, 10).catch((err) => {
        console.error('Error fetching product reviews:', err);
      });
      fetchProductReviewSummary(product.product_id).catch((err) => {
        console.error('Error fetching product review summary:', err);
      });
    }
  }, [product, fetchProductReviews, fetchProductReviewSummary]);

  // States
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantityInput, setQuantityInput] = useState<string>("1");

  // Sync selected color if product changes
  useEffect(() => {
    if (product) {
      const defaultColor = product.options_config.colors[0]?.colorName || '';
      setSelectedColor(defaultColor);
      setSelectedSize('');
      setQuantityInput("1");
    }
  }, [product]);

  // Get active variant price and details
  const activeVariant = useMemo(() => {
    if (!product) return null;
    if (selectedColor && selectedSize) {
      return product.variants.find(
        (v) => v.variant_attributes.colorName === selectedColor && v.variant_attributes.size === selectedSize
      ) || product.variants.find((v) => v.variant_attributes.colorName === selectedColor) || product.variants[0];
    }
    if (selectedColor) {
      return product.variants.find((v) => v.variant_attributes.colorName === selectedColor) || product.variants[0];
    }
    return product.variants[0];
  }, [product, selectedColor, selectedSize]);

  // Resolve sizes with stock for the selected color
  const sizeOptions = useMemo(() => {
    if (!product) return [];
    return product.options_config.sizes.map((sz) => {
      const variant = product.variants.find(
        (v) => v.variant_attributes.colorName === selectedColor && v.variant_attributes.size === sz
      );
      return {
        size: sz,
        inventory: variant ? variant.stock_quantity : 0,
      };
    });
  }, [product, selectedColor]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const baseImages = product.images.map((img) => img.image_url);
    if (activeVariant?.variant_image) {
      const variantImg = activeVariant.variant_image;
      const filtered = baseImages.filter((img) => img !== variantImg);
      return [variantImg, ...filtered];
    }
    return baseImages;
  }, [product, activeVariant]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!product) return;
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ.');
      return;
    }
    if (!activeVariant) {
      toast.error('Biến thể sản phẩm không khả dụng.');
      return;
    }
    try {
      await addCartItem({
        id: `${activeVariant.variant_id}`,
        variantId: activeVariant.variant_id,
        productId: product.product_id,
        name: product.product_name,
        price: activeVariant.price || product.variants[0]?.price,
        variantImage: activeVariant.variant_image || galleryImages[0] || '',
        color: selectedColor,
        size: selectedSize,
        variantAttributes: {
          'Màu sắc': selectedColor,
          'Kích cỡ': selectedSize
        }
      }, parseInt(quantityInput) || 1);
      trackAddToCart({
        productId: product.product_id,
        categoryId: Number(product.category_id),
        variantId: activeVariant.variant_id,
        quantity: parseInt(quantityInput) || 1,
        color: selectedColor,
        size: selectedSize,
        source: Source.PRODUCT_MAIN_INFO
      });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    } catch (err: any) {
      toast.error(err || 'Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  const averageRating = useMemo(() => {
    if (!product || !product.reviews || product.reviews.length === 0) return 5.0;
    const sum = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return parseFloat((sum / product.reviews.length).toFixed(1));
  }, [product]);

  const displayRating = useMemo(() => {
    if (productSummary && productSummary.averageRating !== undefined) {
      return productSummary.averageRating;
    }
    return averageRating;
  }, [productSummary, averageRating]);

  const displayReviewCount = useMemo(() => {
    if (productSummary && productSummary.totalReviews !== undefined) {
      return productSummary.totalReviews;
    }
    return productReviews?.totalElements ?? 0;
  }, [productSummary, productReviews]);

  const isInWishlist = useMemo(() => {
    if (!wishlist || !product) return false;
    return wishlist.content.some((item) => item.productId === product.product_id);
  }, [wishlist, product]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.warn('Vui lòng đăng nhập để thêm sản phẩm vào mục yêu thích.');
      navigate('/login');
      return;
    }
    if (!product) return;
    try {
      await toggleWishlist(product.product_id);
      if (!isInWishlist) {
        trackWishlist(product.product_id, Number(product.category_id), selectedColor, selectedSize, 'product_page', Source.PRODUCT_MAIN_INFO);
      }
      toast.success(isInWishlist ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật danh sách yêu thích');
    }
  };


  // Bundle Items cho mục Sản phẩm mua kèm
  const bundleItems = useMemo(() => {
    if (!product) return [];
    return (rawProducts || []).filter((p) => String(p.categoryId) === String(product.category_id) && String(p.productId) !== String(product.product_id)).slice(0, 4);
  }, [rawProducts, product]);

  if (isFetching && !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-[theme] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl font-bold font-sans">!</div>
        <h3 className="text-lg font-bold text-gray-800">Không tìm thấy sản phẩm</h3>
        <p className="text-sm text-gray-500 max-w-md">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-black text-white font-bold rounded-full hover:bg-gray-900 border-none cursor-pointer"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  // Determine Breadcrumb Text based on Origin
  const getBreadcrumbLabel = (url: string) => {
    if (url === '/' || url === '/home') return 'Trang chủ';
    if (url.includes('?keyword=')) return 'Kết quả tìm kiếm';
    if (url.includes('?collection=')) return 'Bộ sưu tập';
    if (url.includes('/cart')) return 'Giỏ hàng';
    if (url.includes('/account/orders')) return 'Lịch sử mua hàng';
    if (url.includes('/account/wishlists')) return 'Danh sách yêu thích';
    return 'Danh sách sản phẩm';
  };

  // Recursively find category by ID
  const findCategory = (categories: CategoryResponse[], id: string | number): CategoryResponse | null => {
    for (const cat of categories) {
      if (String(cat.categoryId) === String(id)) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategory(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const isFromHome = originUrl === '/' || originUrl === '/home' || originUrl === '/customer/home';

  const categoryInfo = product ? findCategory(categoryTree || [], product.category_id) : null;

  const handleBreadcrumbBack = () => {
    if (originUrl && !isFromHome) {
      navigate(originUrl);
    } else if (categoryInfo) {
      navigate(`/products?categoryCode=${categoryInfo.categoryCode}`);
    } else {
      navigate('/products');
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white">
        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50" />
        <h3 className="text-lg font-bold text-gray-800">Sản phẩm không tồn tại</h3>
        <p className="text-sm text-gray-500">Chúng tôi không tìm thấy thông tin sản phẩm bạn yêu cầu.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-black text-white font-bold rounded-full hover:bg-gray-900 border-none cursor-pointer"
        >
          Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-gray-900">
      <Container className="pt-6">

        {/* Breadcrumbs */}
        <div className="text-[12px] text-gray-500 mb-6 flex gap-1 uppercase tracking-wide">
          <span className="text-theme cursor-pointer hover:underline" onClick={() => navigate('/')}>Trang chủ</span> /
          {!isFromHome && (
            <>
              <span className="text-theme cursor-pointer hover:underline" onClick={handleBreadcrumbBack}>
                {originUrl ? getBreadcrumbLabel(originUrl) : (categoryInfo?.categoryName || 'Danh mục')}
              </span> /
            </>
          )}
          <span className="text-gray-800">{product.product_name}</span>
        </div>

        {/* ========================================== */}
        {/* KHỐI 2 CỘT CHÍNH (ẢNH & THÔNG TIN)         */}
        {/* ========================================== */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start relative">

          {/* CỘT TRÁI: Thư viện ảnh + Mô tả chi tiết */}
          <div className="flex-1 w-full">

            {/* Lưới ảnh sản phẩm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="w-full bg-[#f4f4f4] aspect-[3/4] relative">
                  <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              ))}
            </div>

            {/* Phần Mô Tả Dài (Trải dọc, không dùng Tab) */}
            <div className="border-t border-gray-200 pt-10 pr-0 md:pr-10">
              <h2 className="text-[20px] font-medium mb-6">Mô tả</h2>
              <p className="text-[14px] text-gray-600 mb-8">Mã sản phẩm: {activeVariant?.sku_code || 'N/A'}</p>

              <div className="mb-10">
                <h3 className="text-[16px] font-medium mb-4">Điểm nổi bật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fake ảnh mô tả tính năng */}
                  <div className="flex gap-4 items-start">
                    <img src={galleryImages[0]} className="w-24 h-24 object-cover bg-gray-100" alt="feature" />
                    <p className="text-[14px] leading-relaxed text-gray-700">Chất liệu vải siêu mềm mịn, giữ form tốt sau nhiều lần giặt.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <img src={galleryImages[1] || galleryImages[0]} className="w-24 h-24 object-cover bg-gray-100" alt="feature" />
                    <p className="text-[14px] leading-relaxed text-gray-700">Tích hợp công nghệ chống tia UV và thấm hút mồ hôi vượt trội.</p>
                  </div>
                </div>
              </div>

              <div className="mb-10 border-t border-gray-200 pt-8">
                <h3 className="text-[16px] font-medium mb-4">Chi Tiết</h3>
                <p className="text-[14px] text-gray-700 leading-relaxed mb-4">{product.product_description}</p>
                <ul className="list-none p-0 m-0 text-[14px] text-gray-700 space-y-2">
                  <li>- Thiết kế gọn gàng, phù hợp mặc hàng ngày.</li>
                  <li>- Dáng: Dáng suông (Regular Fit)</li>
                  <li>- Túi: Không túi</li>
                </ul>
              </div>

              <div className="mb-10 border-t border-gray-200 pt-8">
                <h3 className="text-[16px] font-medium mb-4">Chất liệu / Cách chăm sóc</h3>
                <div className="text-[14px] text-gray-700 space-y-4">
                  <div>
                    <strong>Vải</strong>
                    <p>60% Bông (Cotton Supima), 40% Polyester</p>
                  </div>
                  <div>
                    <strong>Hướng dẫn giặt</strong>
                    <p>Giặt máy nước lạnh, giặt nhẹ, Không sấy khô. *Nên lộn trái sản phẩm và cho vào túi lưới khi giặt.</p>
                  </div>
                </div>
              </div>

              <section id="reviews-section" className="mt-10 pt-4 border-t border-gray-200 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[24px] font-medium m-0">Đánh giá</h2>
                  {/* Nút Viết đánh giá đã bị ẩn (Option 3) */}
                </div>

                {/* Tổng quan đánh giá (Nằm full chiều ngang) */}
                <div className="mb-10 border-b border-gray-200 pb-12">

                  {/* Số sao trung bình */}
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex text-black">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 text-yellow ${i < Math.floor(displayRating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-[16px] font-bold">{displayRating}</span>
                    <span className="text-[14px] text-theme">({displayReviewCount})</span>
                  </div>

                  {/* Thanh biểu thị độ vừa vặn (Fit Slider) */}
                  <div className="w-full max-w-[400px]">
                    <div className="relative h-[2px] bg-gray-200 w-full flex items-center mb-3">
                      {/* 5 vạch chia (notches) */}
                      <div className="absolute left-0 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <div className="absolute left-1/4 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <div className="absolute left-1/2 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <div className="absolute left-3/4 w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <div className="absolute right-0 w-1.5 h-1.5 bg-gray-300 rounded-full" />

                      {/* Chấm đen chỉ định (Đang đặt ở giữa) */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-theme rounded-full z-10" />
                    </div>
                    <div className="flex justify-between text-[13px] text-gray-800">
                      <span className="w-1/3 text-left">Chật</span>
                      <span className="w-1/3 text-center">Đúng với kích<br />thước</span>
                      <span className="w-1/3 text-right">Rộng</span>
                    </div>
                  </div>

                </div>

                {/* Danh sách các review */}
                <div className="w-full space-y-12">
                  {productReviews && productReviews.content.length > 0 ? (
                    productReviews.content.map((rev, index) => {
                      const attributeEntries = rev.variantAttributes ? Object.entries(rev.variantAttributes) : [];

                      return (
                        <div key={rev.reviewId} className={`pb-12 ${index !== productReviews.content.length - 1 ? 'border-b border-gray-200' : ''}`}>

                          {/* Tiêu đề Review & Ngày tháng */}
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-[18px] font-normal m-0 text-gray-900 line-clamp-1">
                              {rev.comment ? (rev.comment.length > 50 ? rev.comment.substring(0, 50) + "..." : rev.comment) : '(Không có tiêu đề)'}
                            </h4>
                            <span className="text-[13px] text-gray-500">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                          </div>

                          {/* Sao của Review */}
                          <div className="flex text-black mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 text-yellow ${i < rev.rating ? 'fill-current' : ''}`} />
                            ))}
                          </div>

                          {/* Biến thể đã mua */}
                          {(rev.variantImage || attributeEntries.length > 0) && (
                            <div className="flex items-center gap-3 mb-4 bg-gray-50 p-2.5 rounded border border-gray-100 text-[13px] text-gray-600">
                              {rev.variantImage && (
                                <img src={rev.variantImage} alt="Variant" className="w-10 h-12 object-cover rounded border border-gray-200" />
                              )}
                              {attributeEntries.length > 0 && (
                                <div className="space-y-0.5">
                                  {attributeEntries.map(([k, v]) => (
                                    <div key={k} className="capitalize">
                                      <span className="font-medium text-gray-700">{k}:</span> {v || 'N/A'}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Nội dung Review */}
                          <p className="text-[14px] leading-relaxed text-gray-950 mb-5">{rev.comment || '(Không có nội dung)'}</p>

                          {/* Nếu có ảnh đánh giá */}
                          {rev.images && rev.images.length > 0 && (
                            <div className="flex gap-2 mb-5">
                              {rev.images.map((img) => (
                                <img key={img.reviewImageId} src={img.imageUrl} alt="review attachment" className="w-16 h-20 object-cover bg-gray-100 border border-gray-100 rounded" />
                              ))}
                            </div>
                          )}

                          {/* Thông tin người dùng */}
                          <div className="text-[13px] text-gray-500 mb-2">
                            {rev.userFullName || 'Anonymous User'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[14px] text-gray-500">Chưa có đánh giá nào.</p>
                  )}
                </div>
              </section>

            </div>
          </div>

          {/* CỘT PHẢI: Thông tin mua hàng (Sticky) */}
          <div className="w-full lg:w-[380px] shrink-0 sticky top-24 pb-12">

            {/* Header info */}
            <h1 className="text-[20px] font-light m-0 leading-tight">{product.product_name}</h1>

            {/* Màu sắc */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[13px] text-gray-600 m-0">Màu sắc: <span className="font-medium text-black uppercase">{selectedColor}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.options_config.colors.map((color) => {
                  const isColorOutOfStock = product.variants
                    .filter((v) => v.variant_attributes.colorName === color.colorName)
                    .every((v) => v.stock_quantity === 0);
                  
                  return (
                    <button
                      key={color.colorName}
                      disabled={isColorOutOfStock}
                      onClick={() => setSelectedColor(color.colorName)}
                      className={`min-w-[48px] h-10 px-3 text-[13px] font-medium border flex items-center justify-center transition-all cursor-pointer bg-white
                        ${isColorOutOfStock
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 bg-[url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><line x1=\'0\' y1=\'100%\' x2=\'100%\' y2=\'0\' stroke=\'%23d1d5db\' stroke-width=\'1\'/></svg>")]'
                          : selectedColor === color.colorName
                            ? 'border-theme border-[2px] text-theme font-bold'
                            : 'border-gray-500 text-gray-800 hover:border-theme-hover hover:text-theme-hover'
                        }`}
                    >
                      {color.colorName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kích cỡ */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[13px] text-gray-600 m-0">Kích cỡ: <span className="font-medium text-black">{selectedSize}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((s) => {
                  const isOutOfStock = s.inventory === 0;
                  return (
                    <button
                      key={s.size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`min-w-[48px] h-10 text-[13px] font-medium border flex items-center justify-center transition-all cursor-pointer bg-white
                        ${isOutOfStock
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 bg-[url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><line x1=\'0\' y1=\'100%\' x2=\'100%\' y2=\'0\' stroke=\'%23d1d5db\' stroke-width=\'1\'/></svg>")]'
                          : selectedSize === s.size
                            ? 'border-theme border-[2px] text-theme font-bold'
                            : 'border-gray-500 text-gray-800 hover:border-theme-hover hover:text-theme-hover'
                        }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Giá & Đánh giá (Nằm ngang nhau) */}
            <div className="flex justify-between items-end mt-6">
              <div className="text-[26px] font-bold tracking-tight text-black">
                {formatVND(activeVariant?.price || product.variants[0]?.price || 0)}
              </div>
              <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                <div className="flex text-black">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 text-yellow ${i < Math.floor(displayRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-[13px] font-bold ml-1">{displayRating}</span>
                <span className="text-[13px] text-theme">({displayReviewCount})</span>
              </div>
            </div>

            {/* Controls Mua Hàng */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              {/* Box Tăng giảm số lượng */}
              <div className="flex items-center justify-between bg-[#f4f4f4] w-[140px] h-12 rounded-full px-1.5">
                <button onClick={() => {
                  const currentQty = parseInt(quantityInput) || 1;
                  const newQty = Math.max(1, currentQty - 1);
                  setQuantityInput(String(newQty));
                }} className="w-10 h-full text-gray-600 hover:bg-gray-50 bg-transparent border-none cursor-pointer">
                  -
                </button>
                <input
                  type="text"
                  value={quantityInput}
                  onChange={(e) => {
                    setQuantityInput(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      let val = parseInt(quantityInput);
                      const maxQty = activeVariant ? (activeVariant.stock_quantity ?? 999) : 999;
                      if (isNaN(val) || quantityInput === '') {
                        toast.error("Số lượng không được để trống.");
                        setQuantityInput("1");
                      } else if (val < 1) {
                        toast.error("Số lượng tối thiểu là 1.");
                        setQuantityInput("1");
                      } else if (val > maxQty) {
                        toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                        setQuantityInput(String(maxQty));
                      } else {
                        setQuantityInput(String(val));
                      }
                    }
                  }}
                  onBlur={() => {
                    let val = parseInt(quantityInput);
                    const maxQty = activeVariant ? (activeVariant.stock_quantity ?? 999) : 999;
                    if (isNaN(val) || quantityInput === '') {
                      toast.error("Số lượng không được để trống.");
                      setQuantityInput("1");
                    } else if (val < 1) {
                      toast.error("Số lượng tối thiểu là 1.");
                      setQuantityInput("1");
                    } else if (val > maxQty) {
                      toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                      setQuantityInput(String(maxQty));
                    } else {
                      setQuantityInput(String(val));
                    }
                  }}
                  className="w-10 text-center text-[14px] font-medium bg-transparent border-none outline-none hide-spin-button"
                />
                <button onClick={() => {
                  const currentQty = parseInt(quantityInput) || 1;
                  const maxQty = activeVariant ? (activeVariant.stock_quantity ?? 999) : 999;
                  if (currentQty >= maxQty) {
                    toast.error(`Chỉ được mua tối đa ${maxQty} sản phẩm.`);
                    setQuantityInput(String(maxQty));
                  } else {
                    setQuantityInput(String(currentQty + 1));
                  }
                }} className="w-10 h-full text-gray-600 hover:bg-gray-50 bg-transparent border-none cursor-pointer">
                  +
                </button>
              </div>
              
              {activeVariant && (
                <div className="text-[13px] text-gray-500 font-medium">
                  Kho còn: {activeVariant.stock_quantity} sản phẩm
                </div>
              )}

              {/* Nút Thêm vào giỏ hàng đen tuyền */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] h-12 bg-theme text-white font-bold text-[14px] rounded-full hover:bg-theme-hover transition-colors border-none cursor-pointer"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            <p className="text-[12px] text-gray-500 mt-3">Còn hàng</p>

            {/* Các nút phụ trợ */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleToggleWishlist}
                className={`flex-1 h-10 rounded-full border flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold text-[13px]
                  ${isInWishlist
                    ? 'border-red-200 bg-red-55/60 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Heart
                  className={`w-4 h-4 ${isInWishlist ? 'fill-red-600 text-red-650' : 'text-gray-500'}`}
                  strokeWidth={1.5}
                />
                {isInWishlist ? 'ĐÃ THÊM VÀO YÊU THÍCH' : 'THÊM VÀO MỤC YÊU THÍCH'}
              </button>
            </div>

          </div>
        </div>

        {/* ========================================== */}
        {/* CROSS-SELL CAROUSEL (Sản Phẩm Mua Kèm)     */}
        {/* ========================================== */}
        {bundleItems.length > 0 && (
          <section className="mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-[20px] font-medium mb-8">Sản Phẩm Thường Được Mua Kèm</h2>
            <div className="relative">
              {/* Nút mũi tên trái/phải (chỉ để trang trí cho giống hình) */}
              <button className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm items-center justify-center z-10 cursor-pointer">
                <ChevronRight className="w-5 h-5 rotate-180 text-gray-400" />
              </button>
              <button className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm items-center justify-center z-10 cursor-pointer">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <ProductGrid
                products={bundleItems}
                gridClassName="grid-cols-2 md:grid-cols-4"
                source={Source.PRODUCT_REC_BOUGHT_TOGETHER}
              />
            </div>
          </section>
        )}

        {/* AI Recommendations */}
        {product && (
          <div className="mt-20 pt-16 border-t border-gray-200 flex flex-col gap-12">
            <SimilarProducts productId={product.product_id} />
            <BoughtTogether productId={product.product_id} />
          </div>
        )}

      </Container>


      <ConfirmModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onConfirm={() => {
          setIsLoginModalOpen(false);
          navigate('/login', { state: { from: location.pathname } });
        }}
        title="Yêu cầu đăng nhập"
        content="Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn chuyển đến trang đăng nhập không?"
        confirmText="Đăng nhập ngay"
        cancelText="Hủy"
      />
    </div>
  );
}