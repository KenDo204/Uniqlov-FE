import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, ArrowRight, ShieldCheck, Ticket, Sparkles, ChevronRight, Heart, Star } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { mockProducts, type Product } from '../../features/products';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';
import { mockCoupons } from '../../constants/mock-coupons';
import { mockDataCartCheckout } from '../../constants/mock-data-cart-checkout';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, addItem } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponDescription, setCouponDescription] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false); // State mở accordion mã giảm giá

  const scrollToRecommendations = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('recommendations-section');
    if (element) {
      // scroll-mt-24 trong tailwind sẽ giúp nó cách cái header một khoảng, không bị header che mất
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  // Seed cart with mock items if empty (Giữ nguyên logic của bạn)
  React.useEffect(() => {
    if (items.length === 0) {
      const seedItems = mockDataCartCheckout.data?.cart_items || [];
      seedItems.forEach((item) => {
        addItem({
          id: `${item.cart_item_id}-${item.variant_attributes.color}-${item.variant_attributes.size}`,
          name: item.product_name, // Tách tên gốc ra để hiển thị giống Uniqlo
          color: item.variant_attributes.color, // Giả sử ta lấy được màu
          size: item.variant_attributes.size,   // Giả sử ta lấy được size
          price: item.unit_price,
          image: item.thumbnail_url
        }, item.quantity);
      });
    }
  }, [items.length, addItem]);

  // Financial calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = useMemo(() => {
    if (discountType === 'PERCENTAGE') return Math.round(rawSubtotal * (discountValue / 100));
    if (discountType === 'FIXED_AMOUNT') return discountValue;
    return 0;
  }, [rawSubtotal, discountType, discountValue]);

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const FREE_SHIPPING_LIMIT = 1500000;
  const remainingForFree = Math.max(0, FREE_SHIPPING_LIMIT - rawSubtotal);
  const shippingCost = rawSubtotal >= FREE_SHIPPING_LIMIT || rawSubtotal === 0 ? 0 : 35000;
  const total = subtotal + shippingCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    const coupon = mockCoupons.find((c) => c.code === code);

    if (coupon) {
      setDiscountType(coupon.discount_type);
      setDiscountValue(coupon.discount_value);
      setCouponSuccess(true);
      setCouponDescription(coupon.description);
      toast.success(`Áp dụng mã thành công: ${coupon.description}`);
    } else {
      toast.error('Mã giảm giá không hợp lệ.');
    }
  };

  // Cross-sell recommendations
  const crossSellItems = useMemo(() => {
    return mockProducts.filter(p => !items.some(i => i.id.startsWith(p.product_id.toString()))).slice(0, 4); // Lấy 4 item cho đẹp
  }, [items]);

  const FreeShippingText = () => (
    <div className="text-[14px] mb-8 text-gray-800 leading-relaxed">
      {remainingForFree > 0 ? (
        <p className="m-0 mb-1">
          Bạn còn <span className="font-bold">{formatVND(remainingForFree)}</span> (bao gồm VAT) nữa là được miễn phí vận chuyển tiêu chuẩn.
        </p>
      ) : (
        <p className="m-0 mb-1 text-green-600 font-bold">
          Chúc mừng! Bạn đã đủ điều kiện nhận MIỄN PHÍ giao hàng.
        </p>
      )}
      <a 
        href="#recommendations-section" 
        onClick={scrollToRecommendations}
        className="text-[#0000EE] hover:underline hover:text-[#0000EE] decoration-solid cursor-pointer inline-block mt-1"
      >
        Xem những gì được đề xuất cho bạn
      </a>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Tiêu đề & Thông báo vận chuyển (Theo chuẩn Uniqlo) */}
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-4 tracking-tight">Giỏ hàng</h1>
        <FreeShippingText />

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 border-t border-gray-200">
            <p className="text-gray-500 font-normal text-base">Giỏ hàng của bạn đang trống.</p>
            <button
              onClick={() => navigate('/collections/men')}
              className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm hover:bg-gray-800 transition-colors border-none cursor-pointer"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            
            {/* ========================================== */}
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM               */}
            {/* ========================================== */}
            <div className="flex-1 w-full border-t border-gray-200">
              {items.map((item) => (
                <div key={item.id} className="py-6 border-b border-gray-200 flex gap-4 md:gap-6">
                  
                  {/* Hình ảnh to, vuông vức */}
                  <div className="w-[120px] h-[150px] md:w-[150px] md:h-[180px] shrink-0 bg-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-medium text-[15px] md:text-[16px] m-0 leading-snug">
                        {item.name}
                      </h3>
                      <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer p-0 shrink-0">
                        <Heart className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    {/* Size & Màu (Phân tích chuỗi name nếu bạn nối nó trước đó, hoặc render trực tiếp) */}
                    <div className="text-[13px] text-gray-600 mt-2 space-y-0.5">
                      <div>Màu sắc: Đang cập nhật</div>
                      <div>Kích cỡ: Đang cập nhật</div>
                    </div>

                    <div className="text-[16px] font-bold mt-3">{formatVND(item.price)}</div>
                    <div className="text-[12px] text-gray-500 mt-1">Sản phẩm được làm từ chất liệu tái chế</div>

                    {/* Bộ tăng giảm số lượng & Xóa */}
                    <div className="mt-5 flex flex-col items-start gap-2">
                      <div className="flex items-center bg-[#f4f4f4] rounded-[4px]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 bg-transparent border-none cursor-pointer"
                        >
                          <Minus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <span className="px-4 py-2 text-[14px] font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 bg-transparent border-none cursor-pointer"
                        >
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#0000EE] hover:underline text-[13px] border-none bg-transparent cursor-pointer p-0 mt-1"
                      >
                        Xóa
                      </button>
                      
                      <div className="text-[14px] mt-2">
                        Tổng: <span className="font-bold">{formatVND(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ========================================== */}
            {/* CỘT PHẢI: KHUNG THANH TOÁN (ORDER SUMMARY) */}
            {/* ========================================== */}
            <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
              
              {/* Khung xám */}
              <div className="bg-[#f4f4f4] p-6">
                <div className="flex justify-between font-bold text-[16px] mb-5">
                  <span>Tổng đơn hàng</span>
                  <span>{items.length} Sản phẩm</span>
                </div>
                
                <div className="space-y-4 text-[14px] mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatVND(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Giảm giá</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{shippingCost === 0 ? 'Miễn phí' : 'Sẽ được quyết định sau'}</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mb-2 flex justify-between font-bold text-[16px]">
                  <span>Tổng đơn đặt hàng</span>
                  <span>{formatVND(total)}</span>
                </div>
                <div className="text-[12px] text-gray-600">Đã bao gồm thuế giá trị gia tăng</div>
              </div>

              {/* Accordions */}
              <div className="mt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className="w-full py-4 flex justify-between items-center text-[14px] font-medium border-b border-gray-200 bg-transparent cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-gray-500" strokeWidth={1.5} /> Phiếu giảm giá
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isCouponOpen ? 'rotate-90' : ''}`} strokeWidth={1.5} />
                </button>
                
                {/* Form nhập mã (ẩn/hiện) */}
                {isCouponOpen && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-none text-sm focus:outline-none focus:border-black uppercase"
                      />
                      <button type="submit" className="px-6 bg-black text-white font-bold text-[13px] uppercase rounded-none hover:bg-gray-800 cursor-pointer border-none">
                        Áp dụng
                      </button>
                    </form>
                    {couponSuccess && (
                      <p className="text-green-600 text-[12px] mt-2 mb-0 font-medium">{couponDescription}</p>
                    )}
                  </div>
                )}

                <button className="w-full py-4 flex justify-between items-center text-[14px] font-medium border-b border-gray-200 bg-transparent cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                     Tùy chọn quà tặng
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                </button>
              </div>

              {/* Nhắc lại dòng chữ giao hàng dưới accordion */}
              <div className="mt-6">
                <FreeShippingText />
                <p className="text-[14px] text-gray-800 mt-4 mb-6">
                  Các sản phẩm bạn chọn sẽ được đặt trước trong vòng 30 phút sau khi nhấn nút "Thanh toán".
                </p>
              </div>

              {/* Nút thanh toán bo tròn hình viên thuốc đặc trưng */}
              <button
                onClick={() => navigate(paths.customer.checkout)}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-[14px] tracking-wide hover:bg-gray-800 transition-colors border-none cursor-pointer"
              >
                THANH TOÁN
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* GỢI Ý MUA SẮM CROSS-SELL (Hình 2, 3, 4)    */}
        {/* ========================================== */}
        {crossSellItems.length > 0 && items.length > 0 && (
          <div id="recommendations-section" className="mt-24 pt-12 border-t border-gray-200 scroll-mt-24">
            <h2 className="text-[20px] font-medium mb-2">Có thể bạn sẽ thích</h2>
            <p className="text-[14px] text-gray-600 mb-8 border-b border-gray-200 pb-8">
              Bạn còn {formatVND(remainingForFree)} (bao gồm VAT) nữa là được miễn phí vận chuyển tiêu chuẩn.
            </p>
            
            <h3 className="text-[18px] font-medium mb-6">Sản Phẩm Gợi Ý Theo Giỏ Hàng</h3>
            
            {/* Lưới sản phẩm không viền */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {crossSellItems.map((prod) => (
                <div key={prod.product_id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-3">
                    <img src={prod.images[0]?.image_url} alt={prod.product_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  
                  {/* Swatches màu */}
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#3c4146] border border-gray-300" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1b344c] border border-gray-300" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#d0c9b9] border border-gray-300" />
                  </div>

                  {/* Chi tiết */}
                  <div className="space-y-1">
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide">Nam, XS-XXL</div>
                    <h4 className="text-[14px] font-medium text-gray-900 m-0 leading-snug">{prod.product_name}</h4>
                    <div className="text-[16px] font-bold text-gray-900 pt-1">{formatVND(prod.variants[0]?.price || 0)}</div>
                    <div className="text-[11px] text-gray-500">Sản phẩm được làm từ chất liệu tái chế</div>
                    
                    {/* Đánh giá sao */}
                    <div className="flex items-center gap-1 pt-1">
                      <Star className="w-3 h-3 fill-black text-black" />
                      <span className="text-[12px] font-bold">4.8</span>
                      <span className="text-[11px] text-gray-400">(140)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}