import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2 } from '@/components/ui/icons';
import { toast } from 'react-toastify';
import BackHome from '@/components/general/BackHomeButton';
import { formatVND } from '../../utils/formatters';
import { useOrder } from '@/hooks/useOrder';
import { useCoupon } from '@/hooks/useCoupon';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { checkout } = useOrder();
  const { previewApplyCoupon } = useCoupon();
  const { user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [zip, setZip] = useState('70000');

  React.useEffect(() => {
    if (user) {
      setEmail(prev => prev || user.email || '');
      setPhone(prev => prev || user.phone || '');
      if (user.fullName) {
        const nameParts = user.fullName.trim().split(/\s+/);
        const first = nameParts[nameParts.length - 1] || '';
        const last = nameParts.slice(0, nameParts.length - 1).join(' ') || '';
        setFirstName(prev => prev || first);
        setLastName(prev => prev || last);
      }
    }
  }, [user]);
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay' | 'momo'>('cod');
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [fixedDiscount, setFixedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thực hiện thanh toán.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Address suggestions list for Vietnam
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const mockSuggestedAddresses = [
    'Số 123, Đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh',
    'Chung cư Sunrise City, Block A, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh',
    'Số 1, Đường Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
    'Khu đô thị Phú Mỹ Hưng, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh'
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (val.length > 3) {
      setAddressSuggestions(mockSuggestedAddresses.filter(a => a.toLowerCase().includes(val.toLowerCase())));
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectSuggestedAddress = (addr: string) => {
    setAddress(addr);
    setAddressSuggestions([]);
    if (addr.includes('Hà Nội')) {
      setCity('Hà Nội');
      setZip('10000');
    } else {
      setCity('TP. Hồ Chí Minh');
      setZip('70000');
    }
  };

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    try {
      const result = await previewApplyCoupon({ couponCode: code, orderAmount: rawSubtotal });
      if (result) {
        setFixedDiscount(result.discountAmount);
        setDiscountPercent(0);
        toast.success(`Áp dụng thành công mã: ${result.description || code}`);
      }
    } catch (err: any) {
      toast.error(err || 'Mã giảm giá không hợp lệ cho đơn hàng này.');
    }
  };

  // Financial calculations
  const rawSubtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  
  const discountAmount = useMemo(() => {
    if (fixedDiscount > 0) return fixedDiscount;
    return Math.round(rawSubtotal * discountPercent);
  }, [rawSubtotal, discountPercent, fixedDiscount]);

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const shippingCost = rawSubtotal >= 1500000 || rawSubtotal === 0 ? 0 : 35000;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !city || !phone) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cartItemIds = items.map(item => item.cartItemId).filter(Boolean) as number[];
      if (cartItemIds.length === 0) {
        toast.error('Không tìm thấy sản phẩm hợp lệ trong giỏ hàng.');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        cartItemIds,
        addressId: 1,
        couponCode: coupon.trim() || undefined,
        paymentMethod: paymentMethod.toUpperCase() as any, // 'COD' | 'VNPAY' | 'MOMO'
        shippingMethod: 'STANDARD' as const,
        note: `Tên: ${lastName} ${firstName}. Địa chỉ: ${address}, ${city}`
      };

      const res = await checkout(payload);
      if (res) {
        toast.success('Đặt đơn hàng thành công!');
        clearCart();
        
        if (res.paymentUrl) {
          window.location.href = res.paymentUrl;
        } else {
          setOrderSuccess(true);
        }
      }
    } catch (err: any) {
      toast.error(err || 'Đặt hàng thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty state if cart is empty and order is not successful
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex flex-col items-center justify-center text-center px-4 font-sans">
        <div className="max-w-md bg-white border border-gray-200 p-8 rounded-[4px] shadow-sm space-y-6">
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Giỏ hàng trống" className="w-20 h-20 opacity-50 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 m-0">Giỏ hàng của bạn đang trống</h2>
          <p className="text-sm text-gray-500 m-0">Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.</p>
          <div className="flex justify-center">
            <BackHome className="px-8 py-3 !rounded-full text-sm uppercase bg-theme hover:bg-theme-hover text-white transition-colors border-none cursor-pointer font-bold" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen pb-20 pt-8 font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Title & Secure Connection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-8 gap-4">
          <h1 className="text-[28px] md:text-[32px] font-medium m-0 tracking-tight">Thanh toán</h1>
        </div>

        {orderSuccess ? (
          <div className="max-w-md mx-auto bg-white border border-gray-200 p-8 rounded-[4px] text-center space-y-6 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 m-0">Cảm ơn bạn đã đặt hàng!</h2>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Xác nhận đơn hàng đã được gửi tới địa chỉ email của bạn. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc.
              </p>
            </div>
            <div className="flex justify-center w-full">
              <BackHome className="w-full justify-center !py-3 !rounded-full bg-theme hover:bg-theme-hover text-white transition-colors border-none cursor-pointer font-bold" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
            
            {/* Left column: Contact, Delivery details, and Payment choices */}
            <div className="flex-1 w-full space-y-8">
              
              {/* Step 1: Customer Contact Info */}
              <div className="bg-white border border-gray-200 p-6 rounded-[4px] space-y-5 shadow-sm">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-800 m-0 border-b border-gray-100 pb-3 flex items-center gap-2">
                  1. Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Địa chỉ Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xxxxxxxx"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping details */}
              <div className="bg-white border border-gray-200 p-6 rounded-[4px] space-y-5 shadow-sm">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-800 m-0 border-b border-gray-100 pb-3 flex items-center gap-2">
                  2. Địa chỉ giao hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Tên</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nhập tên"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Họ & Tên đệm</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nhập họ và tên đệm"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Auto-suggest Address Input */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[12px] font-medium text-gray-700">Địa chỉ cụ thể (Số nhà, tên đường, phường/xã, quận/huyện)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    placeholder="Nhập địa chỉ của bạn..."
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                    required
                  />
                  {addressSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-[4px] shadow-lg z-25 overflow-hidden divide-y divide-gray-100 text-sm">
                      {addressSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectSuggestedAddress(suggestion)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 transition-colors"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. TP. Hồ Chí Minh"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-gray-700">Mã Bưu điện</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="e.g. 70000"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[4px] text-sm focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Options */}
              <div className="bg-white border border-gray-200 p-6 rounded-[4px] space-y-5 shadow-sm">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-800 m-0 border-b border-gray-100 pb-3 flex items-center gap-2">
                  3. Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* COD Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    // Added 'group' here
                    className={`group py-4 px-2 rounded-[4px] text-[13px] font-bold border cursor-pointer transition-all flex flex-col items-center gap-2 bg-white ${
                      paymentMethod === 'cod'
                        ? 'border-theme border-[2px] text-theme font-extrabold shadow-sm'
                        : 'border-gray-300 text-gray-500 hover:border-theme'
                    }`}
                  >
                    <CreditCard
                      className={`w-5 h-5 transition-colors ${
                        paymentMethod === 'cod'
                          ? 'text-black'
                          // Added group-hover to target the icon
                          : 'text-gray-700 group-hover:text-theme'
                      }`}
                    />
                    {/* Added transition and group-hover to target the text */}
                    <span className={`transition-colors ${paymentMethod !== 'cod' ? 'group-hover:text-theme' : ''}`}>
                      COD (Tiền mặt)
                    </span>
                  </button>

                  {/* VNPay Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vnpay')}
                    // Added 'group' here
                    className={`group py-4 px-2 rounded-[4px] text-[13px] font-bold border cursor-pointer transition-all flex flex-col items-center gap-2 bg-white ${
                      paymentMethod === 'vnpay'
                        ? 'border-theme border-[2px] text-theme font-extrabold shadow-sm'
                        : 'border-gray-300 text-gray-500 hover:border-theme' // Changed hover to border-theme for consistency
                    }`}
                  >
                    <span className="font-heading font-black text-sm text-blue-600">VNPay</span>
                    {/* Added transition and group-hover to target the text */}
                    <span className={`transition-colors ${paymentMethod !== 'vnpay' ? 'group-hover:text-theme' : ''}`}>
                      VNPay / Thẻ
                    </span>
                  </button>

                  {/* MoMo Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    // Added 'group' here
                    className={`group py-4 px-2 rounded-[4px] text-[13px] font-bold border cursor-pointer transition-all flex flex-col items-center gap-2 bg-white ${
                      paymentMethod === 'momo'
                        ? 'border-theme border-[2px] text-theme font-extrabold shadow-sm'
                        : 'border-gray-300 text-gray-500 hover:border-theme' // Changed hover to border-theme for consistency
                    }`}
                  >
                    <span className="font-heading font-black text-sm text-pink-600">MoMo</span>
                    {/* Added transition and group-hover to target the text */}
                    <span className={`transition-colors ${paymentMethod !== 'momo' ? 'group-hover:text-theme' : ''}`}>
                      Ví MoMo
                    </span>
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-[4px] text-center text-xs text-gray-600 font-light py-5">
                  {paymentMethod === 'cod'
                    ? 'Thanh toán trực tiếp bằng tiền mặt khi nhận hàng (COD).'
                    : 'Xác thực thanh toán qua ứng dụng quét mã bảo mật sau khi bấm nút Đặt Hàng.'}
                </div>
              </div>
            </div>

            {/* Right column: Sticky Order summary card */}
            <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24 space-y-6">
              
              <div className="bg-[#f4f4f4] p-6 border border-gray-200 rounded-[4px] space-y-6">
                <h3 className="font-bold text-[16px] text-gray-900 m-0 border-b border-gray-300 pb-3">
                  Sản phẩm đặt mua
                </h3>

                <div className="max-h-72 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-2 border-b border-gray-300 last:border-none">
                      <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-white border border-gray-300 shrink-0" />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-[13px] text-gray-900 truncate m-0 leading-snug">{item.name}</h4>
                          {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 ? (
                            <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-2">
                              {Object.entries(item.variantAttributes).map(([k, v]) => (
                                <span key={k}>{k}: <span className="text-gray-700 font-medium">{v}</span></span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-2">
                              {item.color && <span>Màu: <span className="text-gray-700 font-medium">{item.color}</span></span>}
                              {item.size && <span>Size: <span className="text-gray-700 font-medium">{item.size}</span></span>}
                            </div>
                          )}
                          <div className="text-[11px] text-gray-500 mt-1">Số lượng: {item.quantity}</div>
                        </div>
                        <div className="text-[13px] font-bold text-theme mt-1">{formatVND(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2 pt-2 border-t border-gray-300">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-[4px] text-xs focus:outline-none focus:border-black uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-theme text-white font-bold text-xs rounded-[4px] hover:bg-theme-hover transition-colors cursor-pointer border-none"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Pricing summary details */}
                <div className="space-y-3 text-xs md:text-sm border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center text-gray-750">
                    <span>Tạm tính</span>
                    <span>{formatVND(rawSubtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-red-650 font-medium">
                      <span>Mã giảm giá</span>
                      <span>-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-gray-750">
                    <span>Phí giao hàng</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Miễn phí</span>
                    ) : (
                      <span>{formatVND(shippingCost)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center font-bold text-sm md:text-base border-t border-gray-300 pt-3 text-gray-900">
                    <span>Tổng đơn đặt hàng</span>
                    <span className="text-theme text-lg font-black">{formatVND(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-theme hover:bg-theme-hover text-white py-4 rounded-full font-bold text-[14px] uppercase border-none cursor-pointer tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ĐANG XỬ LÝ...</span>
                    </>
                  ) : (
                    <>
                      <span>ĐẶT HÀNG</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

                <div className="text-[10px] text-gray-500 font-medium text-center space-y-1">
                  <p className="m-0 flex items-center justify-center gap-1.5">
                    {/* <ShieldCheck className="w-4 h-4 text-green-600" /> Hệ thống bảo mật thông tin an toàn */}
                  </p>
                </div>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
