import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, Ticket, ChevronRight, Heart, Star } from '@/components/ui/icons';
import { useCartStore } from '../../stores/useCartStore';
import { mockProducts } from '../../features/products';
import { paths } from '../../config/paths';
import { toast } from 'react-toastify';
import { formatVND } from '../../utils/formatters';
import { useAppSelector } from '@/stores/hooks';
import { useCoupon } from '@/hooks/useCoupon';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProduct';
import BackHome from '@/components/general/BackHomeButton';
import type { CartItem } from '@/stores/slices/cartSlice';
import type { ProductVariantResponse } from '@/types/product';
import { useAddress } from '@/hooks/useAddress';
import { useGhn } from '@/hooks/useGhn';
import type { AddressResponse } from '@/types/address';



export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity } = useCartStore();
  const { fetchCart, changeVariant } = useCart();
  const { fetchProductVariants, products, fetchPublicProducts } = useProduct();
  const { previewApplyCoupon } = useCoupon();
  const { addresses, fetchAddresses } = useAddress();
  const { shippingFee, calculateShippingFee } = useGhn();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [couponDescription, setCouponDescription] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false); // State mở accordion mã giảm giá

  // States for changing variants
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [itemVariants, setItemVariants] = useState<ProductVariantResponse[]>([]);
  const [tempAttributes, setTempAttributes] = useState<Record<string, string>>({});

  // Address selection states
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [isAddressListOpen, setIsAddressListOpen] = useState(false);

  const scrollToRecommendations = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('recommendations-section');
    if (element) {
      // scroll-mt-24 trong tailwind sẽ giúp nó cách cái header một khoảng, không bị header che mất
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fetch cart if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Fetch addresses if authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses().then((addrs) => {
        if (addrs && addrs.length > 0) {
          const def = addrs.find(a => a.isDefault) || addrs[0];
          setSelectedAddress(def);
        }
      }).catch(err => {
        console.error('Error fetching addresses:', err);
      });
    }
  }, [isAuthenticated, fetchAddresses]);

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
        serviceId: 53320 // Standard GHN Express service
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

  React.useEffect(() => {
    if (products.length === 0) {
      fetchPublicProducts().catch((err) => {
        console.error('Error fetching public products:', err);
      });
    }
  }, [products.length, fetchPublicProducts]);

  // Extract attribute keys from variants
  const attributeKeys = useMemo(() => {
    if (itemVariants.length === 0) return [];
    const keysSet = new Set<string>();
    itemVariants.forEach(v => {
      if (v.variantAttributes) {
        Object.keys(v.variantAttributes).forEach(k => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [itemVariants]);

  // Extract all unique values for each key
  const attributeValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    attributeKeys.forEach(key => {
      const valsSet = new Set<string>();
      itemVariants.forEach(v => {
        if (v.variantAttributes && v.variantAttributes[key]) {
          valsSet.add(v.variantAttributes[key]);
        }
      });
      values[key] = Array.from(valsSet);
    });
    return values;
  }, [attributeKeys, itemVariants]);

  // Find variant matching tempAttributes
  const matchingVariant = useMemo(() => {
    if (itemVariants.length === 0) return null;
    return itemVariants.find(v => {
      return attributeKeys.every(key => v.variantAttributes?.[key] === tempAttributes[key]);
    }) || null;
  }, [itemVariants, tempAttributes, attributeKeys]);

  const handleOpenVariantModal = async (item: CartItem) => {
    setSelectedCartItem(item);
    setIsVariantModalOpen(true);
    setLoadingVariants(true);

    const vId = item.variantId || Number(item.id);
    const product = products.find(p => p.variants.some(v => v.variantId === vId));
    if (product) {
      try {
        const variantsData = await fetchProductVariants(product.productId);
        setItemVariants(variantsData || []);
        
        const initialAttrs: Record<string, string> = {};
        if (item.variantAttributes && Object.keys(item.variantAttributes).length > 0) {
          Object.assign(initialAttrs, item.variantAttributes);
        } else {
          if (item.color) {
            const colorKey = variantsData && variantsData.length > 0 
              ? Object.keys(variantsData[0].variantAttributes).find(k => k.toLowerCase().includes('color') || k.toLowerCase().includes('màu')) 
              : null;
            if (colorKey) initialAttrs[colorKey] = item.color;
          }
          if (item.size) {
            const sizeKey = variantsData && variantsData.length > 0 
              ? Object.keys(variantsData[0].variantAttributes).find(k => k.toLowerCase().includes('size') || k.toLowerCase().includes('kích')) 
              : null;
            if (sizeKey) initialAttrs[sizeKey] = item.size;
          }
        }
        setTempAttributes(initialAttrs);
      } catch (err) {
        console.error("Failed to fetch variants:", err);
        toast.error("Không thể tải danh sách thuộc tính sản phẩm.");
      } finally {
        setLoadingVariants(false);
      }
    } else {
      toast.error("Không tìm thấy thông tin sản phẩm.");
      setLoadingVariants(false);
      setIsVariantModalOpen(false);
    }
  };

  const handleConfirmVariant = async () => {
    if (!selectedCartItem || !matchingVariant) return;
    try {
      const oldVariantId = selectedCartItem.variantId || Number(selectedCartItem.id);
      await changeVariant(oldVariantId, matchingVariant, selectedCartItem.quantity, selectedCartItem.note);
      toast.success("Thay đổi phân loại thành công.");
      setIsVariantModalOpen(false);
    } catch (err: any) {
      toast.error(err || "Không thể cập nhật phân loại sản phẩm.");
    }
  };


  // Financial calculations
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = useMemo(() => {
    if (discountType === 'PERCENTAGE') return Math.round(rawSubtotal * (discountValue / 100));
    if (discountType === 'FIXED_AMOUNT') return discountValue;
    return 0;
  }, [rawSubtotal, discountType, discountValue]);

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const FREE_SHIPPING_LIMIT = 1500000;
  // const remainingForFree = Math.max(0, FREE_SHIPPING_LIMIT - rawSubtotal);
  const shippingCost = useMemo(() => {
    if (rawSubtotal >= FREE_SHIPPING_LIMIT || rawSubtotal === 0) return 0;
    return shippingFee?.total || 35000;
  }, [rawSubtotal, shippingFee]);
  const total = subtotal + shippingCost;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (isAuthenticated) {
      try {
        const result = await previewApplyCoupon({ couponCode: code, orderAmount: rawSubtotal });
        if (result) {
          setDiscountType('FIXED_AMOUNT');
          setDiscountValue(result.discountAmount);
          setCouponSuccess(true);
          setCouponDescription(result.description || `Mã giảm giá ${code} đã được áp dụng`);
          toast.success(`Áp dụng mã thành công: ${result.description || code}`);
        }
      } catch (err: any) {
        toast.error(err || 'Mã giảm giá không hợp lệ cho đơn hàng này.');
      }
    } else {
      toast.info('Vui lòng đăng nhập để sử dụng mã giảm giá.');
    }
  };

  // Cross-sell recommendations
  const crossSellItems = useMemo(() => {
    return mockProducts.filter(p => !items.some(i => i.id.startsWith(p.product_id.toString()))).slice(0, 4); // Lấy 4 item cho đẹp
  }, [items]);

  const FreeShippingText = () => (
    <div className="text-[14px] mb-8 text-gray-800 leading-relaxed">
      {/* {remainingForFree > 0 ? (
        <p className="m-0 mb-1">
          Bạn còn <span className="font-bold">{formatVND(remainingForFree)}</span> (bao gồm VAT) nữa là được miễn phí vận chuyển tiêu chuẩn.
        </p>
      ) : (
        <p className="m-0 mb-1 text-green-600 font-bold">
          Chúc mừng! Bạn đã đủ điều kiện nhận MIỄN PHÍ giao hàng.
        </p>
      )} */}
      <a
        href="#recommendations-section"
        onClick={scrollToRecommendations}
        className="text-theme decoration-solid cursor-pointer inline-block mt-1"
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
            <div className="flex justify-center">
              <BackHome className="px-8 py-3 !rounded-full text-sm uppercase" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">

            {/* ========================================== */}
            {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM               */}
            {/* ========================================== */}
            <div className="flex-1 w-full border-t border-gray-200">
              {/* Shipping Address Selection Section */}
              {isAuthenticated && (
                <div className="py-4 border-b border-gray-200 text-left">
                  <div className="bg-gray-50 p-4 border border-gray-200 rounded-[4px] relative">
                    <h4 className="text-sm font-bold text-gray-800 m-0 mb-2 uppercase tracking-wide">
                      Địa chỉ nhận hàng
                    </h4>
                    {selectedAddress ? (
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
                    ) : (
                      <div className="text-sm text-gray-500">
                        Bạn chưa có địa chỉ nhận hàng. 
                        <Link to="/account/addresses" className="text-theme font-medium hover:underline ml-1">
                          Thêm địa chỉ mới
                        </Link>
                      </div>
                    )}

                    {/* Address Selection List */}
                    {isAddressListOpen && addresses.length > 1 && (
                      <div className="mt-3 border-t border-gray-200 pt-3 space-y-2 max-h-48 overflow-y-auto">
                        {addresses
                          .filter(addr => addr.addressId !== selectedAddress?.addressId)
                          .map(addr => (
                            <div 
                              key={addr.addressId}
                              onClick={() => {
                                setSelectedAddress(addr);
                                setIsAddressListOpen(false);
                              }}
                              className="p-2.5 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-[4px] cursor-pointer text-xs transition-colors text-left"
                            >
                              <div className="font-bold text-gray-900 mb-1">
                                {addr.recipientName} ({addr.phone})
                              </div>
                              <div className="text-gray-600 leading-tight">{addr.fullAddress}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {items.map((item) => (
                <div key={item.id} className="py-6 border-b border-gray-200 flex gap-4 md:gap-6">

                  {/* Hình ảnh to, vuông vức */}
                  <div className="w-[120px] h-[150px] md:w-[150px] md:h-[180px] shrink-0 bg-gray-50">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-medium text-[15px] md:text-[16px] m-0 leading-snug">
                        <Link to={`/product/${item.id}`} className="text-gray-900 hover:text-theme no-underline">
                          {item.name}
                        </Link>
                      </h3>
                      <button className="text-gray-400 hover:text-black bg-transparent border-none cursor-pointer p-0 shrink-0">
                        <Heart className="w-5 h-5" strokeWidth={1.5} />
                      </button>
                    </div>

                    {/* Size & Màu / Thuộc tính sản phẩm */}
                    <div className="mt-2 text-left">
                      {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 ? (
                        <div className="text-[13px] text-gray-600 space-y-1">
                          {Object.entries(item.variantAttributes).map(([key, value]) => (
                            <div key={key} className="flex gap-1">
                              <span className="text-gray-500">{key}:</span>
                              <span className="text-gray-900 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[13px] text-gray-600 space-y-1">
                          {item.color && (
                            <div className="flex gap-1">
                              <span className="text-gray-500">Màu sắc:</span>
                              <span className="text-gray-900 font-medium">{item.color}</span>
                            </div>
                          )}
                          {item.size && (
                            <div className="flex gap-1">
                              <span className="text-gray-500">Kích cỡ:</span>
                              <span className="text-gray-900 font-medium">{item.size}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleOpenVariantModal(item)}
                        className="text-[12px] text-theme font-medium hover:underline mt-1.5 bg-transparent border-none cursor-pointer p-0 inline-flex items-center gap-1"
                      >
                        Thay đổi phân loại
                      </button>
                    </div>

                    <div className="text-[16px] font-bold mt-3 text-theme">{formatVND(item.price)}</div>
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
                        className="text-[#0000EE]  text-[13px] border-none bg-transparent cursor-pointer p-0 mt-1"
                      >
                        Xóa
                      </button>

                      <div className="text-[14px] mt-2">
                        Tổng: <span className="font-bold text-theme">{formatVND(item.price * item.quantity)}</span>
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
                    <span>{shippingCost === 0 ? 'Miễn phí' : formatVND(shippingCost)}</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mb-2 flex justify-between font-bold text-[16px]">
                  <span>Tổng đơn đặt hàng</span>
                  <span className='text-theme'>{formatVND(total)}</span>
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

                {/* <button className="w-full py-4 flex justify-between items-center text-[14px] font-medium border-b border-gray-200 bg-transparent cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    Tùy chọn quà tặng
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                </button> */}
              </div>

              {/* Nhắc lại dòng chữ giao hàng dưới accordion */}
              {/* <div className="mt-6">
                <FreeShippingText />
                <p className="text-[14px] text-gray-800 mt-4 mb-6">
                  Các sản phẩm bạn chọn sẽ được đặt trước trong vòng 30 phút sau khi nhấn nút "Thanh toán".
                </p>
              </div> */}

              {/* Nút thanh toán bo tròn hình viên thuốc đặc trưng */}
              <button
                onClick={() => navigate(paths.customer.checkout)}
                className="w-full bg-theme text-white py-4 rounded-full font-bold text-[14px] tracking-wide hover:bg-theme-hover transition-colors border-none cursor-pointer"
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
            {/* <h2 className="text-[20px] font-medium mb-2">Có thể bạn sẽ thích</h2>
            <p className="text-[14px] text-gray-600 mb-8 border-b border-gray-200 pb-8">
              Bạn còn {formatVND(remainingForFree)} (bao gồm VAT) nữa là được miễn phí vận chuyển tiêu chuẩn.
            </p> */}

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

      {/* Modal thay đổi phân loại */}
      {isVariantModalOpen && selectedCartItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[500px] shadow-xl animate-fade-in text-left">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-150 pb-3">
              <h3 className="text-[18px] font-bold m-0 text-black">Thay đổi phân loại</h3>
              <button 
                onClick={() => setIsVariantModalOpen(false)}
                className="bg-transparent border-none text-[20px] font-light cursor-pointer text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {loadingVariants ? (
              <div className="py-12 text-center text-gray-500">Đang tải phân loại sản phẩm...</div>
            ) : (
              <div className="space-y-4">
                {/* Product Info */}
                <div className="flex gap-4 items-start border-b border-gray-150 pb-4">
                  <img 
                    src={matchingVariant?.variantImage || selectedCartItem.image} 
                    alt={selectedCartItem.name} 
                    className="w-20 h-24 object-cover bg-gray-50"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[15px] m-0 leading-snug">{selectedCartItem.name}</h4>
                    <div className="mt-2 space-y-1">
                      {matchingVariant ? (
                        <>
                          <div className="text-[16px] font-bold text-theme">{formatVND(matchingVariant.price)}</div>
                          <div className="text-[12px] text-gray-500">Sku: {matchingVariant.skuCode}</div>
                          <div className="text-[12px] text-gray-600 font-medium">
                            Còn lại: {matchingVariant.stockQuantity > 0 ? `${matchingVariant.stockQuantity} sản phẩm` : <span className="text-red-500 font-bold">Hết hàng</span>}
                          </div>
                        </>
                      ) : (
                        <div className="text-[13px] text-red-500 font-semibold">Tổ hợp phân loại này không khả dụng.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attribute Selectors */}
                <div className="space-y-4">
                  {attributeKeys.map(key => (
                    <div key={key}>
                      <span className="block text-[13px] font-semibold mb-2 text-gray-700">{key}</span>
                      <div className="flex flex-wrap gap-2">
                        {attributeValues[key]?.map(val => {
                          const isSelected = tempAttributes[key] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => setTempAttributes(prev => ({ ...prev, [key]: val }))}
                              className={`px-4 py-2 text-[13px] font-medium border flex items-center justify-center transition-all cursor-pointer bg-white rounded
                                ${isSelected 
                                  ? 'border-theme border-[2px] text-theme font-bold bg-theme/5' 
                                  : 'border-gray-300 text-gray-800 hover:border-black'
                                }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status indicator / warnings */}
                {matchingVariant && matchingVariant.stockQuantity <= 0 && (
                  <div className="p-3 bg-red-50 text-red-700 text-[13px] rounded font-medium">
                    Sản phẩm với phân loại này đã hết hàng. Vui lòng chọn phân loại khác.
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-150 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsVariantModalOpen(false)}
                    className="px-5 py-2 border border-gray-300 rounded-full text-[13px] font-bold bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmVariant}
                    disabled={!matchingVariant || matchingVariant.stockQuantity <= 0}
                    className="px-6 py-2 rounded-full text-[13px] font-bold bg-theme hover:bg-theme-hover text-white cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}