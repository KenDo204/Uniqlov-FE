import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';
import { mockCoupons } from '../../constants/mock-coupons';
import { mockDataCartCheckout } from '../../constants/mock-data-cart-checkout';
import { mockCurrentUser } from '../../constants/mock-users';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  // Pre-fill fields from default address/user mock constants
  const defaultAddress = useMemo(() => {
    return mockDataCartCheckout.data?.addresses.find(a => a.is_default) || mockDataCartCheckout.data?.addresses[0];
  }, []);

  const [email, setEmail] = useState(mockCurrentUser.email);
  const [phone, setPhone] = useState(defaultAddress?.phone || mockCurrentUser.phone);
  
  const [firstName, setFirstName] = useState(() => {
    const nameParts = (defaultAddress?.recipient_name || mockCurrentUser.full_name).split(' ');
    return nameParts[nameParts.length - 1] || '';
  });
  
  const [lastName, setLastName] = useState(() => {
    const nameParts = (defaultAddress?.recipient_name || mockCurrentUser.full_name).split(' ');
    return nameParts.slice(0, nameParts.length - 1).join(' ') || '';
  });

  const [address, setAddress] = useState(defaultAddress?.full_address || '');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [zip, setZip] = useState('70000');
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay' | 'momo'>('cod');
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [fixedDiscount, setFixedDiscount] = useState(0);

  // Redirect if cart is empty
  React.useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      toast.info('Giỏ hàng trống. Đang chuyển về trang chủ.');
      navigate('/');
    }
  }, [items.length, navigate]);

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

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const matchedCoupon = mockCoupons.find(c => c.code === code);

    if (matchedCoupon) {
      if (matchedCoupon.discount_type === 'PERCENTAGE') {
        setDiscountPercent(matchedCoupon.discount_value / 100);
        setFixedDiscount(0);
      } else {
        setFixedDiscount(matchedCoupon.discount_value);
        setDiscountPercent(0);
      }
      toast.success(`Áp dụng thành công mã: ${matchedCoupon.description}`);
    } else {
      toast.error('Mã giảm giá không hợp lệ.');
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

  // Checkout process simulation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !city || !phone) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart();
      toast.success('Đặt hàng thành công!');
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left bg-unilo-muted min-h-screen pb-12">
      {/* Checkout Progress Header */}
      <div className="flex justify-between items-center border-b border-unilo-border dark:border-gray-800 pb-4">
        <h1 className="text-2xl md:text-3xl font-heading font-black m-0">Thanh toán an toàn</h1>
        <div className="flex items-center gap-1.5 text-xs text-green-500 font-bold uppercase tracking-wider bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-lg border border-green-200/40">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL Encryption Active</span>
        </div>
      </div>

      {orderSuccess ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-8 rounded-2xl text-center space-y-6 shadow-md animate-fade-in">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-black m-0">Cảm ơn bạn đã đặt hàng!</h2>
            <p className="text-xs md:text-sm text-gray-500 font-light">
              Xác nhận đơn hàng đã được gửi tới địa chỉ email của bạn. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary border-none cursor-pointer"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Customer Info */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                1. Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xxxxxxxx"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Shipping Info */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                2. Địa chỉ giao hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tên</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Khoi"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Họ & Tên đệm</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Do Tien Anh"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Address Auto Complete */}
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Địa chỉ cụ thể (Số nhà, tên đường, phường/xã, quận/huyện)</label>
                <input
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Nhập địa chỉ của bạn..."
                  className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                  required
                />

                {addressSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-gray-850 border border-unilo-border dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-unilo-border dark:divide-gray-800 text-xs">
                    {addressSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => selectSuggestedAddress(suggestion)}
                        className="px-4 py-3 hover:bg-unilo-muted dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-200"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. TP. Hồ Chí Minh"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Mã Bưu điện</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="e.g. 70000"
                    className="w-full px-4 py-3 bg-unilo-muted dark:bg-gray-800 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent text-primary dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Options */}
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-heading font-bold uppercase tracking-wider text-gray-400 m-0 border-b border-unilo-border dark:border-gray-850 pb-2 flex items-center gap-2">
                3. Phương thức thanh toán
              </h3>

              {/* Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'cod'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>COD (Tiền mặt)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'vnpay'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <span className="font-heading font-black text-xs text-blue-500">VNPay</span>
                  <span>Ví VNPay / Thẻ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all flex flex-col items-center gap-1.5 ${paymentMethod === 'momo'
                      ? 'bg-primary border-primary text-white'
                      : 'border-unilo-border text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
                    }`}
                >
                  <span className="font-heading font-black text-xs text-pink-500">MoMo</span>
                  <span>Ví MoMo</span>
                </button>
              </div>

              <div className="p-4 bg-unilo-muted dark:bg-gray-800 rounded-xl text-center text-xs text-gray-500 font-light border border-dashed border-unilo-border dark:border-gray-700 py-6">
                {paymentMethod === 'cod' 
                  ? 'Thanh toán trực tiếp bằng tiền mặt khi nhận hàng (COD).' 
                  : 'Xác thực thanh toán qua ứng dụng quét mã bảo mật sau khi bấm nút Đặt Hàng.'
                }
              </div>
            </div>
          </div>

          {/* Sidebar calculations */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-unilo-border dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-6">
              <h3 className="font-heading font-bold text-base m-0 border-b border-unilo-border dark:border-gray-850 pb-3">
                Sản phẩm đặt mua
              </h3>

              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate text-primary dark:text-white m-0">{item.name}</h4>
                      <span className="text-gray-400">Số lượng: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Sidebar Coupon code input */}
              <div className="flex gap-2 pt-2 border-t border-unilo-border dark:border-gray-850">
                <input
                  type="text"
                  placeholder="Mã giảm giá"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-2 bg-unilo-muted dark:bg-gray-850 border-none rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer border-none"
                >
                  Áp dụng
                </button>
              </div>

              {/* Pricing metrics */}
              <div className="space-y-3 text-xs md:text-sm border-t border-unilo-border dark:border-gray-850 pt-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Tạm tính</span>
                  <span>{formatVND(rawSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-accent">
                    <span>Mã giảm giá</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-500">
                  <span>Phí giao hàng</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px]">Miễn phí</span>
                  ) : (
                    <span>{formatVND(shippingCost)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center font-black text-sm md:text-base border-t border-unilo-border dark:border-gray-850 pt-3 text-primary dark:text-white">
                  <span>Tổng thanh toán</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary border-none cursor-pointer flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                {isSubmitting ? 'Đang xử lý đặt hàng...' : `Đặt hàng • ${formatVND(total)}`}
                {!isSubmitting && <ArrowRight className="w-4 h-4 text-white" />}
              </button>

              <div className="text-[10px] text-gray-400 font-medium text-center space-y-1.5">
                <p className="m-0 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Hệ thống thanh toán bảo mật an toàn cao
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
