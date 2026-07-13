import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, ChevronLeft, Ticket, CheckCircle2 } from '@/components/ui/icons';
import { toast } from 'react-toastify';
import BackHome from '@/components/general/BackHomeButton';
import { formatVND, translateAttribute } from '@/utils/formatters';
import { useOrder } from '@/hooks/useOrder';
import { useCoupon } from '@/hooks/useCoupon';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAddress } from '@/hooks/useAddress';
import { useGhn } from '@/hooks/useGhn';
import { useProduct } from '@/hooks/useProduct';
import { useTracking } from '@/hooks/useTracking';
import type { AddressResponse } from '@/types/address';
import AddressSelectionModal from '@/components/customer/Account/AddressSelectionModal';
import CreateAddressModal from '@/components/customer/Account/createAdressModal';
import OrderSuccess from '@/components/customer/Checkout/OrderSuccess';
import { calculateOrderFinancials } from '@/utils/couponUtils';
import type { CouponResponse } from '@/types/coupon/responses';

export function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { checkout } = useOrder();
  const { availableCoupons, fetchAvailableCoupons, isFetching } = useCoupon();
  const { user, isAuthenticated } = useAuth();
  const { addresses, fetchAddresses } = useAddress();
  const { shippingFee, calculateShippingFee } = useGhn();
  const { products, fetchPublicProducts } = useProduct();
  const { trackPurchase } = useTracking();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('TP. Hồ Chí Minh');

  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);
  const [isCreateAddressOpen, setIsCreateAddressOpen] = useState(false);

  React.useEffect(() => {
    if (user) {
      setEmail(prev => prev || user.email || '');
    }
  }, [user]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses().then((addrs) => {
        if (addrs && addrs.length > 0) {
          const def = addrs.find(a => a.isDefault) || addrs[0];
          setSelectedAddress(def);
        } else {
          setSelectedAddress(null);
        }
      }).catch(err => {
        console.error('Error fetching addresses:', err);
      });
    }
  }, [isAuthenticated, fetchAddresses]);

  React.useEffect(() => {
    if (products.length === 0) {
      fetchPublicProducts().catch(err => console.error("Error fetching products:", err));
    }
  }, [products.length, fetchPublicProducts]);

  // Sync state variables with selected address
  React.useEffect(() => {
    if (selectedAddress) {
      setPhone(selectedAddress.phone);
      setAddress(selectedAddress.fullAddress);
      setCity(selectedAddress.provinceName);
      
      const nameParts = selectedAddress.recipientName.trim().split(/\s+/);
      const first = nameParts[nameParts.length - 1] || '';
      const last = nameParts.slice(0, nameParts.length - 1).join(' ') || '';
      setFirstName(first);
      setLastName(last);
    } else {
      // Clear if no address
      if (!user) {
        setPhone('');
        setAddress('');
        setFirstName('');
        setLastName('');
      }
    }
  }, [selectedAddress, user]);

  // Helper to calculate shipping fee via GHN
  const calculateFeeForAddress = React.useCallback(async (addr: AddressResponse) => {
    if (!addr) return;
    
    // Calculate total weight of cart
    const totalWeightKg = items.reduce((sum, item) => {
      const product = products.find(p => p.variants.some(v => v.variantId === item.variantId));
      const itemWeight = product ? (product.weightKg || 0.2) : 0.2;
      return sum + itemWeight * item.quantity;
    }, 0);
    const totalWeightGram = Math.max(100, Math.round(totalWeightKg * 1000));
    
    try {
      await calculateShippingFee({
        toDistrictId: addr.districtId,
        toWardCode: addr.wardCode,
        weightGram: totalWeightGram,
      });
    } catch (err) {
      console.error("Failed to calculate shipping fee:", err);
    }
  }, [items, products, calculateShippingFee]);

  // Recalculate shipping fee when selected address or items change
  React.useEffect(() => {
    if (selectedAddress && items.length > 0 && products.length > 0) {
      calculateFeeForAddress(selectedAddress);
    }
  }, [selectedAddress, items, products, calculateFeeForAddress]);
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay' | 'momo'>('cod');
  const [appliedCoupons, setAppliedCoupons] = useState<CouponResponse[]>([]);

  const [isAutoApplied, setIsAutoApplied] = useState(false);
  const [hasUserInteractedWithCoupon, setHasUserInteractedWithCoupon] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thực hiện thanh toán.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch available coupons on mount if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableCoupons().catch(err => {
        console.error('Error fetching available coupons:', err);
        toast.error('Không thể tải danh sách mã giảm giá.');
      });
    }
  }, [isAuthenticated, fetchAvailableCoupons]);

  // Financial calculations
  const rawSubtotal = useMemo(() => items.reduce((sum, item) => sum + (typeof item.totalMoney === 'number' ? item.totalMoney : item.price * item.quantity), 0), [items]);

  const rawShippingCost = useMemo(() => {
    if (rawSubtotal >= 1500000 || rawSubtotal === 0) return 0;
    return shippingFee?.total || 35000;
  }, [rawSubtotal, shippingFee]);

  const financials = useMemo(() => {
    return calculateOrderFinancials(items, rawShippingCost, appliedCoupons, paymentMethod);
  }, [items, rawShippingCost, appliedCoupons, paymentMethod]);

  // Handle errors from financial calculations (e.g., payment method changed)
  React.useEffect(() => {
    if (financials.errors.length > 0) {
      financials.errors.forEach(err => toast.error(err));
      // Remove invalid coupons
      setAppliedCoupons(financials.validCoupons);
    }
  }, [financials.errors, financials.validCoupons]);

  // Auto-suggest optimal coupon (Simplified to first applicable)
  React.useEffect(() => {
    if (availableCoupons.length > 0 && rawSubtotal > 0 && !hasUserInteractedWithCoupon) {
      const applicableOrderCoupons = availableCoupons.filter(c => 
        (c.couponType === 'SHOP_VOUCHER' || c.couponType === 'PAYMENT_VOUCHER') &&
        (!c.minOrderAmount || rawSubtotal >= c.minOrderAmount) &&
        c.couponType !== 'PAYMENT_VOUCHER' // Không auto-apply mã thanh toán
      );
      const applicableShippingCoupons = availableCoupons.filter(c => 
        c.couponType === 'FREE_SHIPPING' &&
        (!c.minOrderAmount || rawSubtotal >= c.minOrderAmount)
      );

      const autoSelected: CouponResponse[] = [];
      if (applicableOrderCoupons.length > 0) autoSelected.push(applicableOrderCoupons[0]);
      if (applicableShippingCoupons.length > 0) autoSelected.push(applicableShippingCoupons[0]);

      if (autoSelected.length > 0) {
        setAppliedCoupons(autoSelected);
        setIsAutoApplied(true);
      } else {
        setAppliedCoupons([]);
        setIsAutoApplied(false);
      }
    }
  }, [availableCoupons, rawSubtotal, hasUserInteractedWithCoupon]);



  const handleSelectCoupon = (coupon: CouponResponse) => {
    if (coupon.minOrderAmount && rawSubtotal < coupon.minOrderAmount) {
      toast.error(`Đơn hàng chưa đạt giá trị tối thiểu ${formatVND(coupon.minOrderAmount)}`);
      return;
    }
    
    setAppliedCoupons(prev => {
      if (coupon.couponType === 'FREE_SHIPPING') {
        const others = prev.filter(c => c.couponType !== 'FREE_SHIPPING');
        return [...others, coupon];
      }
      
      // Nếu là SHOP_VOUCHER hoặc PAYMENT_VOUCHER (thay thế lẫn nhau)
      const others = prev.filter(c => c.couponType === 'FREE_SHIPPING');
      return [...others, coupon];
    });
    
    setHasUserInteractedWithCoupon(true);
    setIsAutoApplied(false);
    toast.success(`Đã chọn mã: ${coupon.code}`);
  };

  const handleCancelCoupon = (couponId: number) => {
    setAppliedCoupons(prev => prev.filter(c => c.couponId !== couponId));
    setHasUserInteractedWithCoupon(true);
    setIsAutoApplied(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error('Vui lòng chọn hoặc thêm địa chỉ nhận hàng.');
      return;
    }
    if (!email || !phone) {
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
        addressId: selectedAddress.addressId,
        couponCode: appliedCoupons.length > 0 ? appliedCoupons.map(c => c.code).join(',') : undefined,
        paymentMethod: paymentMethod.toUpperCase() as any, // 'COD' | 'VNPAY' | 'MOMO'
        shippingMethod: 'STANDARD' as const,
        note: `Tên: ${lastName} ${firstName}. Địa chỉ: ${address}, ${city}`
      };

      const res = await checkout(payload);
      if (res) {
        toast.success('Đặt đơn hàng thành công!');
        clearCart();
        trackPurchase(res.orderId, paymentMethod);
        
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

  const renderCouponItem = (coupon: CouponResponse) => {
    const isApplicable = !coupon.minOrderAmount || financials.subtotal >= coupon.minOrderAmount;
    const isSelected = appliedCoupons.some(c => c.couponId === coupon.couponId);
    
    return (
      <div 
        key={coupon.couponId} 
        className={`border rounded-[4px] p-3 transition-colors ${
          isSelected ? 'border-theme bg-[rgba(0,146,124,0.02)]' :
          isApplicable ? 'border-gray-200 bg-white hover:border-gray-400' : 
          'border-gray-100 bg-gray-50 opacity-60'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Ticket className={`w-4 h-4 ${isApplicable ? 'text-gray-700' : 'text-gray-400'}`} />
              <span className={`font-bold ${isApplicable ? 'text-gray-900' : 'text-gray-500'} uppercase`}>{coupon.code}</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm ml-2">
                {coupon.couponType === 'FREE_SHIPPING' ? 'Vận chuyển' : coupon.couponType === 'PAYMENT_VOUCHER' ? 'Thanh toán' : 'Sản phẩm'}
              </span>
            </div>
            <p className={`text-xs ${isApplicable ? 'text-gray-600' : 'text-gray-400'} m-0 leading-snug`}>{coupon.description}</p>
            
            {coupon.minOrderAmount && !isApplicable && (
              <p className="text-[11px] text-red-500 m-0 mt-1.5">
                Cần mua thêm {formatVND(coupon.minOrderAmount - financials.subtotal)} để sử dụng
              </p>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => handleSelectCoupon(coupon)}
            disabled={!isApplicable || isSelected}
            className={`shrink-0 px-3 py-1.5 rounded-[4px] text-[11px] font-bold uppercase transition-colors border-none ${
              isSelected ? 'bg-theme text-white' :
              isApplicable ? 'bg-white text-theme cursor-pointer hover:border-theme' :
              'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSelected ? 'Đang dùng' : 'Chọn'}
          </button>
        </div>
      </div>
    );
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
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="bg-transparent border-none p-0 cursor-pointer text-gray-500 hover:text-theme transition-colors flex items-center"
              title="Quay lại giỏ hàng"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <h1 className="text-[28px] md:text-[32px] font-medium m-0 tracking-tight">Thanh toán</h1>
          </div>
        </div>

        {orderSuccess ? (
          <OrderSuccess />
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

              {/* Step 2: Shipping details (Address Selection) */}
              <div className="bg-white border border-gray-200 p-6 rounded-[4px] space-y-5 shadow-sm text-left">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-800 m-0 border-b border-gray-100 pb-3 flex items-center gap-2">
                  2. Địa chỉ giao hàng
                </h3>
                
                {selectedAddress ? (
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-[4px] relative">
                    <div className="space-y-1 text-sm font-light">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-gray-900">{selectedAddress.recipientName}</span>
                          <span className="text-gray-500 mx-2">|</span>
                          <span className="font-medium text-gray-900">{selectedAddress.phone}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddressListOpen(!isAddressListOpen)}
                          className="text-theme font-medium text-xs hover:underline bg-transparent border-none cursor-pointer p-0"
                        >
                          {isAddressListOpen ? 'Đóng' : 'Thay đổi'}
                        </button>
                      </div>
                      <p className="m-0 text-gray-600 text-[13px]">{selectedAddress.fullAddress}</p>
                    </div>

                    {/* Address Selection Modal */}
                    <AddressSelectionModal
                      open={isAddressListOpen}
                      onClose={() => setIsAddressListOpen(false)}
                      addresses={addresses}
                      selectedAddressId={selectedAddress?.addressId || null}
                      onSelect={(addr) => {
                        setSelectedAddress(addr);
                        setIsAddressListOpen(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="p-5 border border-red-200 bg-red-50 text-red-700 text-sm rounded-[4px] flex flex-col items-center gap-3">
                    <span className="font-medium">Bạn chưa có địa chỉ nhận hàng nào được lưu.</span>
                    <button
                      type="button"
                      onClick={() => setIsCreateAddressOpen(true)}
                      className="px-5 py-2 bg-theme text-white text-xs font-bold rounded-full hover:bg-theme-hover transition-colors border-none cursor-pointer uppercase"
                    >
                      + Thêm địa chỉ mới
                    </button>
                  </div>
                )}

                {selectedAddress && (
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsAddressListOpen(true)}
                      className="text-theme font-medium text-xs hover:underline inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                    >
                      Quản lý sổ địa chỉ / Thêm địa chỉ mới
                    </button>
                  </div>
                )}
                
                {/* For handling "Thêm địa chỉ mới" directly from the empty state */}
                <CreateAddressModal 
                  open={isCreateAddressOpen} 
                  setOpen={setIsCreateAddressOpen} 
                />
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
                      VNPay
                    </span>
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-[4px] text-center text-xs text-gray-600 font-light py-5">
                  {paymentMethod === 'cod'
                    ? 'Thanh toán trực tiếp bằng tiền mặt khi nhận hàng (COD).'
                    : 'Xác thực thanh toán qua ứng dụng VNPAY sau khi bấm nút Đặt Hàng.'}
                </div>
              </div>

              {/* Step 4: Mã giảm giá */}
              <div className="bg-white border border-gray-200 p-6 rounded-[4px] space-y-5 shadow-sm">
                <h3 className="text-base font-bold uppercase tracking-wider text-gray-800 m-0 border-b border-gray-100 pb-3 flex items-center gap-2">
                  4. Mã giảm giá
                </h3>
                
                {/* Auto Suggest Message */}
                {isAutoApplied && appliedCoupons.length > 0 && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-[4px] text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <span>
                      Đã tự động chọn mã giảm giá giúp bạn tiết kiệm nhiều nhất.
                    </span>
                  </div>
                )}

                {/* Selected Coupon Info */}
                {appliedCoupons.length > 0 ? (
                  <div className="space-y-3">
                    {appliedCoupons.map(c => (
                      <div key={c.couponId} className="border border-theme bg-[rgba(0,146,124,0.05)] rounded-[4px] p-4 relative flex flex-col justify-between items-start">
                        <div className="flex justify-between w-full">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Ticket className="w-4 h-4 text-theme" />
                              <span className="font-bold text-gray-900 uppercase">{c.code}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ml-2 ${financials.warnings[c.couponId] ? 'bg-gray-400 text-white' : 'bg-theme text-white'}`}>
                                {c.couponType === 'FREE_SHIPPING' ? 'Vận chuyển' : c.couponType === 'PAYMENT_VOUCHER' ? 'Thanh toán' : 'Sản phẩm'}
                              </span>
                            </div>
                            <p className={`text-sm m-0 ${financials.warnings[c.couponId] ? 'text-gray-400 line-through' : 'text-gray-600'}`}>{c.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCancelCoupon(c.couponId)}
                            className="text-xs font-medium text-gray-500 hover:text-red-600 bg-transparent border-none p-1 cursor-pointer transition-colors"
                          >
                            Hủy bỏ
                          </button>
                        </div>
                        
                        {financials.warnings[c.couponId] && (
                          <div className="mt-2 w-full">
                            <p className="text-[11px] text-red-600 font-medium m-0 bg-red-50 p-2 rounded border border-red-100 flex items-center gap-1.5">
                              {financials.warnings[c.couponId]}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic m-0">Bạn chưa chọn mã giảm giá nào.</p>
                )}

                {/* Available coupons list */}
                {isFetching ? (
                  <div className="mt-4 flex flex-col items-center justify-center p-6 border border-gray-200 border-dashed rounded-[4px] bg-gray-50">
                    <div className="w-6 h-6 border-2 border-theme border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-sm text-gray-500">Đang tải mã giảm giá...</span>
                  </div>
                ) : availableCoupons.length > 0 ? (
                  <div className="mt-4 space-y-6">
                    {/* Nhóm 1: Mã giảm giá đơn hàng */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3">Mã giảm giá đơn hàng (Tối đa 1 mã)</h4>
                      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {availableCoupons.filter(c => c.couponType === 'SHOP_VOUCHER' || c.couponType === 'PAYMENT_VOUCHER').length > 0 ? (
                          availableCoupons.filter(c => c.couponType === 'SHOP_VOUCHER' || c.couponType === 'PAYMENT_VOUCHER').map(renderCouponItem)
                        ) : (
                          <p className="text-xs text-gray-500 italic">Không có mã nào.</p>
                        )}
                      </div>
                    </div>

                    {/* Nhóm 2: Mã miễn phí vận chuyển */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3">Mã miễn phí vận chuyển (Tối đa 1 mã)</h4>
                      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {availableCoupons.filter(c => c.couponType === 'FREE_SHIPPING').length > 0 ? (
                          availableCoupons.filter(c => c.couponType === 'FREE_SHIPPING').map(renderCouponItem)
                        ) : (
                          <p className="text-xs text-gray-500 italic">Không có mã nào.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 border border-gray-200 border-dashed rounded-[4px] bg-gray-50 text-center">
                    <p className="text-sm text-gray-500 m-0">Hiện tại không có mã giảm giá nào khả dụng cho bạn.</p>
                  </div>
                )}
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
                      <img src={item.variantImage} alt={item.name} className="w-14 h-18 object-cover bg-white border border-gray-300 shrink-0" />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium text-[13px] text-gray-900 truncate m-0 leading-snug">{item.name}</h4>
                          {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 ? (
                            <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-x-2">
                              {Object.entries(item.variantAttributes).map(([k, v]) => (
                                <span key={k}>{translateAttribute(k)}: <span className="text-gray-700 font-medium">{String(v)}</span></span>
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

                {/* Pricing summary details */}
                <div className="space-y-3 text-xs md:text-sm border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center text-gray-750">
                    <span>Tạm tính</span>
                    <span>{formatVND(financials.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-gray-750">
                    <span>Phí giao hàng</span>
                    {financials.shippingFee === 0 ? (
                      <span className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Miễn phí</span>
                    ) : (
                      <span>{formatVND(financials.shippingFee)}</span>
                    )}
                  </div>

                  {financials.shopDiscount > 0 && (
                    <div className="flex justify-between items-center text-red-650 font-medium">
                      <span>Giảm giá sản phẩm</span>
                      <span>-{formatVND(financials.shopDiscount)}</span>
                    </div>
                  )}

                  {financials.shippingDiscount > 0 && (
                    <div className="flex justify-between items-center text-red-650 font-medium">
                      <span>Giảm phí vận chuyển</span>
                      <span>-{formatVND(financials.shippingDiscount)}</span>
                    </div>
                  )}

                  {financials.paymentDiscount > 0 && (
                    <div className="flex justify-between items-center text-red-650 font-medium">
                      <span>Giảm giá thanh toán</span>
                      <span>-{formatVND(financials.paymentDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center font-bold text-sm md:text-base border-t border-gray-300 pt-3 text-gray-900">
                    <span>Tổng đơn đặt hàng</span>
                    <span className="text-theme text-lg font-black">{formatVND(financials.grandTotal)}</span>
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
