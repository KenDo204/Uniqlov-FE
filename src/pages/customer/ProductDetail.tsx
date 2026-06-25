import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {  Star, Heart, ChevronRight  } from '@/components/ui/icons';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';
import { useProduct } from '@/hooks/useProduct';
import { mapProductResponseToProduct } from '@/utils/mappers';
import { ProductCard } from '@/components/shared/ProductCard';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const {
    products: rawProducts,
    productDetail,
    isFetching,
    error,
    fetchPublicProducts,
    fetchProductBySlug
  } = useProduct();

  // Fetch product detail and public products (for bundle items)
  useEffect(() => {
    if (id) {
      const cleanId = id.replace(/^"|"$/g, '');
      fetchProductBySlug(cleanId).catch((err) => {
        console.error('Error fetching product by slug:', err);
      });
    }
  }, [id, fetchProductBySlug]);

  useEffect(() => {
    if (!rawProducts || rawProducts.length === 0) {
      fetchPublicProducts().catch((err) => {
        console.error('Error fetching all products:', err);
      });
    }
  }, [rawProducts, fetchPublicProducts]);

  const product = useMemo(() => {
    if (!productDetail) return null;
    return mapProductResponseToProduct(productDetail);
  }, [productDetail]);

  // States
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Sync selected color if product changes
  useEffect(() => {
    if (product) {
      const defaultColor = product.options_config.colors[0]?.colorName || '';
      setSelectedColor(defaultColor);
      setSelectedSize('');
      setQuantity(1);
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
    return product.images.map((img) => img.image_url);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích cỡ.');
      return;
    }
    const itemPrice = activeVariant?.price || product.variants[0]?.price;
    const itemImage = activeVariant?.variant_image || galleryImages[0] || '';

    addItem({
      id: `${product.product_id}-${selectedColor}-${selectedSize}`,
      name: `${product.product_name} (${selectedColor} / ${selectedSize})`,
      price: itemPrice,
      image: itemImage,
    }, quantity);
    toast.success(`Đã thêm vào giỏ hàng.`);
  };

  const handleAddRelatedToCart = (prod: any, e: React.MouseEvent, selectedCol?: string) => {
    e.stopPropagation();
    const activeColor = selectedCol || prod.options_config.colors[0]?.colorName || 'Default';
    const activeVar = prod.variants.find((v: any) => v.variant_attributes.colorName === activeColor) || prod.variants[0];
    const size = activeVar?.variant_attributes.size || 'M';
    const price = activeVar?.price || prod.variants[0]?.price || 0;
    const image = activeVar?.variant_image || prod.images[0]?.image_url || '';

    addItem({
      id: `${prod.product_id}-${activeColor}-${size}`,
      name: `${prod.product_name} (${activeColor} / ${size})`,
      price: price,
      image: image
    }, 1);

    toast.success(`Đã thêm ${prod.product_name} vào giỏ hàng.`);
  };

  const averageRating = useMemo(() => {
    if (!product || !product.reviews || product.reviews.length === 0) return 5.0;
    const sum = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return parseFloat((sum / product.reviews.length).toFixed(1));
  }, [product]);

  const allProductsMapped = useMemo(() => {
    return (rawProducts || []).map(mapProductResponseToProduct);
  }, [rawProducts]);

  // Bundle Items cho mục Sản phẩm mua kèm
  const bundleItems = useMemo(() => {
    if (!product) return [];
    return allProductsMapped.filter((p) => p.category_id === product.category_id && p.product_id !== product.product_id).slice(0, 4);
  }, [allProductsMapped, product]);

  if (isFetching && !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-[#00927c] border-t-transparent rounded-full animate-spin"></div>
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs */}
        <div className="text-[12px] text-gray-500 mb-6 flex gap-1 uppercase tracking-wide">
          <span className="text-blue-700 cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span> /
          <span className="text-blue-700 cursor-pointer" onClick={() => navigate('/collections/men')}>Bộ sưu tập</span> /
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
              <button className="text-[14px] bg-transparent border-none flex items-center gap-1.5 cursor-pointer">
                <span className="text-lg">✎</span> <p className='text-blue-700'>Viết bài đánh giá</p>
              </button>
            </div>

            {/* Tổng quan đánh giá (Nằm full chiều ngang) */}
            <div className="mb-10 border-b border-gray-200 pb-12">
              
              {/* Số sao trung bình */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex text-black">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-[16px] font-bold">{averageRating}</span>
                <span className="text-[14px] text-blue-700">({product.reviews?.length || 0})</span>
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
                  <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-10" />
                </div>
                <div className="flex justify-between text-[13px] text-gray-800">
                  <span className="w-1/3 text-left">Chật</span>
                  <span className="w-1/3 text-center">Đúng với kích<br/>thước</span>
                  <span className="w-1/3 text-right">Rộng</span>
                </div>
              </div>

            </div>

            {/* Danh sách các review */}
            <div className="w-full space-y-12">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, index) => (
                  <div key={rev.review_id} className={`pb-12 ${index !== product.reviews.length - 1 ? 'border-b border-gray-200' : ''}`}>
                    
                    {/* Tiêu đề Review & Ngày tháng */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[18px] font-normal m-0 text-gray-900">
                        {rev.comment.length > 30 ? rev.comment.substring(0, 50) + "..." : "A Great Essential with Room for a More Signature Touch"}
                      </h4>
                      <span className="text-[13px] text-gray-500">{rev.created_at.split('T')[0]}</span>
                    </div>
                    
                    {/* Sao của Review */}
                    <div className="flex text-black mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>

                    {/* Thông tin thuộc tính đã mua */}
                    <div className="text-[13px] text-gray-900 space-y-1 mb-5 font-normal">
                      <p className="m-0">Kích cỡ đã mua: S</p>
                      <p className="m-0">Màu sắc đã mua: 00 WHITE</p>
                      <p className="m-0">Quần áo có vừa không: Đúng với kích thước</p>
                    </div>

                    {/* Nội dung Review */}
                    <p className="text-[14px] leading-relaxed text-gray-900 mb-5">{rev.comment}</p>
                    
                    {/* Nếu có ảnh đánh giá */}
                    {rev.review_images && rev.review_images.length > 0 && (
                      <div className="flex gap-2 mb-5">
                        {rev.review_images.map((img, i) => (
                          <img key={i} src={img} alt="review" className="w-16 h-20 object-cover bg-gray-100" />
                        ))}
                      </div>
                    )}

                    {/* Thông tin nhân khẩu học của User */}
                    <div className="text-[13px] text-gray-500 mb-2">
                      {rev.full_name}
                    </div>
                  </div>
                ))
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
              <p className="text-[13px] text-gray-600 mb-3">
                Màu sắc: <span className="font-medium text-black uppercase">{selectedColor}</span>
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.options_config.colors.map((color) => (
                  <button
                    key={color.colorName}
                    onClick={() => setSelectedColor(color.colorName)}
                    style={{ backgroundColor: color.colorCode }}
                    className={`w-10 h-10 rounded-full cursor-pointer relative transition-all ${
                      selectedColor === color.colorName 
                        ? 'ring-1 ring-offset-2 ring-black outline-none border border-gray-200' 
                        : 'border border-gray-300 hover:border-gray-500'
                    }`}
                    title={color.colorName}
                  />
                ))}
              </div>
            </div>

            {/* Kích cỡ */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[13px] text-gray-600 m-0">Kích cỡ: <span className="font-medium text-black">Nam {selectedSize}</span></p>
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
                            ? 'border-black border-[2px] text-black font-bold'
                            : 'border-gray-300 text-gray-800 hover:border-gray-500'
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
              <div className="text-[26px] font-bold tracking-tight">
                {formatVND(activeVariant?.price || product.variants[0]?.price || 0)}
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <div className="flex text-black">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-[13px] font-bold ml-1">{averageRating}</span>
                <span className="text-[13px] text-blue-700 cursor-pointer">({product.reviews?.length || 0})</span>
              </div>
            </div>

            {/* Controls Mua Hàng */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              {/* Box Tăng giảm số lượng */}
              <div className="flex items-center justify-between bg-[#f4f4f4] w-[140px] h-12 rounded-full px-1.5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full text-gray-600 hover:bg-gray-50 bg-transparent border-none cursor-pointer">
                  -
                </button>
                <span className="w-10 text-center text-[14px] font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full text-gray-600 hover:bg-gray-50 bg-transparent border-none cursor-pointer">
                  +
                </button>
              </div>

              {/* Nút Thêm vào giỏ hàng đen tuyền */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] h-12 bg-black text-white font-bold text-[14px] rounded-full hover:bg-gray-900 transition-colors border-none cursor-pointer"
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
            
            <p className="text-[12px] text-gray-500 mt-3">Còn hàng</p>

            {/* Các nút phụ trợ */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 h-8 rounded-full border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 bg-white cursor-pointer font-medium text-[13px] text-gray-700">
                <Heart className="w-4 h-4" strokeWidth={1.5} /> THÊM VÀO MỤC YÊU THÍCH
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative">
              {/* Nút mũi tên trái/phải (chỉ để trang trí cho giống hình) */}
              <button className="hidden md:flex absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm items-center justify-center z-10 cursor-pointer">
                 <ChevronRight className="w-5 h-5 rotate-180 text-gray-400" />
              </button>
              <button className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 shadow-sm items-center justify-center z-10 cursor-pointer">
                 <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {bundleItems.map((prod) => (
                <ProductCard
                  key={prod.product_id}
                  product={prod}
                  onAddToCart={handleAddRelatedToCart}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}