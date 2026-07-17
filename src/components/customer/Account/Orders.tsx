import React, { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { useCart } from '@/hooks/useCart';
import { FiPackage as Package, FiMapPin as MapPin, FiCreditCard as CreditCard, FiShoppingCart as ShoppingCart } from 'react-icons/fi';
import { formatVND } from '@/utils/formatters';
import { CircularProgress } from '@mui/material';
import ConfirmCancelOrderModal from '@/components/general/ConfirmCancelOrderModal';
import { toast } from 'react-toastify';
import type { OrderResponse } from '@/types/order/responses';

const getOrderStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Chờ xử lý',
    'PENDING_REVIEW': 'Chờ duyệt',
    'PENDING_PAYMENT': 'Chờ thanh toán',
    'AWAITING_SHIPMENT': 'Chờ giao hàng',
    'SHIPPING': 'Đang giao hàng',
    'DELIVERED': 'Đã giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
    'RETURNED': 'Đã trả hàng',
    'REFUND_FAILED': 'Hoàn tiền lỗi'
  };
  return statusMap[status] || status;
};

export function Orders() {
  const {
    orders,
    isFetching,
    fetchMyOrders,
    fetchMyOrderDetail,
    cancelMyOrder
  } = useOrder();

  const { addItem } = useCart();

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<number, OrderResponse>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({});

  // Cancel order modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchMyOrders(0, 10).catch(err => {
      console.error('Error fetching my orders:', err);
      toast.error('Không thể tải lịch sử mua hàng.');
    });
  }, [fetchMyOrders]);

  const handleToggleDetails = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // If detail is not fetched yet, fetch it
    if (!orderDetails[orderId]) {
      setLoadingDetails(prev => ({ ...prev, [orderId]: true }));
      try {
        const res = await fetchMyOrderDetail(orderId);
        if (res) {
          setOrderDetails(prev => ({ ...prev, [orderId]: res }));
        }
      } catch (err: any) {
        toast.error(err || 'Không thể tải chi tiết đơn hàng.');
      } finally {
        setLoadingDetails(prev => ({ ...prev, [orderId]: false }));
      }
    }
  };

  const handleOpenCancel = (orderId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding/collapsing card
    setCancelOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!cancelOrderId || !reason.trim()) {
      toast.warn('Vui lòng nhập lý do hủy đơn.');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelMyOrder(cancelOrderId, { reason: reason.trim() });
      toast.success('Hủy đơn hàng thành công!');

      // Update local state status to CANCELLED
      if (orderDetails[cancelOrderId]) {
        setOrderDetails(prev => ({
          ...prev,
          [cancelOrderId]: {
            ...prev[cancelOrderId],
            orderStatus: 'CANCELLED'
          }
        }));
      }

      // Reload list
      fetchMyOrders(0, 10);
      setIsCancelModalOpen(false);
      setCancelOrderId(null);
    } catch (err: any) {
      toast.error(err || 'Không thể hủy đơn hàng lúc này.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRepurchase = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addItem({
        id: String(item.variantId),
        name: item.productName,
        price: item.price,
        variantImage: item.variantImage,
        variantId: item.variantId,
        variantAttributes: item.variantAttributes
      }, item.quantity);
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (err: any) {
      toast.error(String(err) || 'Không thể mua lại sản phẩm này.');
    }
  };

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Lịch sử mua hàng</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {isFetching && orders.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress sx={{ color: 'theme' }} />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => {
            const isExpanded = expandedOrderId === ord.orderId;
            const details = orderDetails[ord.orderId];
            const isLoading = loadingDetails[ord.orderId];

            return (
              <div key={ord.orderId} className="border border-gray-200 p-0 rounded-lg overflow-hidden shadow-sm bg-white">
                {/* Header của Đơn hàng */}
                <div
                  onClick={() => handleToggleDetails(ord.orderId)}
                  className="bg-white px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-theme-light)] flex items-center justify-center text-[var(--color-theme)]">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-gray-900">
                        Đơn hàng ngày {new Date(ord.orderDate).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-[13px] text-gray-500 mt-0.5 flex items-center gap-2">
                        <span>{ord.itemCount} Sản phẩm</span>
                        <span>•</span>
                        <span className="font-semibold text-gray-700">{formatVND(ord.finalPaymentMoney)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${
                      ord.orderStatus === 'CANCELLED' ? 'bg-red-50 text-red-600' : 
                      ord.orderStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                      'bg-[var(--color-theme-light)] text-[var(--color-theme)]'
                    }`}>
                      {getOrderStatusLabel(ord.orderStatus)}
                    </span>
                    {['PENDING', 'PENDING_PAYMENT', 'PENDING_REVIEW'].includes(ord.orderStatus) && (
                      <button
                        onClick={(e) => handleOpenCancel(ord.orderId, e)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded border-none font-bold text-[12px] cursor-pointer transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                    <button className="px-3 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-bold uppercase rounded cursor-pointer transition-colors">
                      {isExpanded ? 'Đóng' : 'Chi tiết'}
                    </button>
                  </div>
                </div>

                {/* Phần chi tiết (hiển thị khi expand) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 bg-white animate-fade-in">
                    {isLoading ? (
                      <div className="flex justify-center py-6">
                        <CircularProgress size={24} sx={{ color: 'theme' }} />
                      </div>
                    ) : details ? (
                      <div className="space-y-6">
                        {/* 1. Thông tin giao hàng & Thanh toán */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-[4px] mb-6 text-[13px] border border-gray-100">
                          <div className="space-y-2">
                            <h5 className="font-bold text-gray-900 m-0 flex items-center gap-2"><MapPin size={16} className="text-[var(--color-theme)]" /> Thông tin nhận hàng</h5>
                            <div className="text-gray-600 ml-6">
                              <p className="m-0 font-medium text-gray-800">{details.address.recipientName} - {details.address.phone}</p>
                              <p className="m-0 mt-1">{details.address.fullAddress}</p>
                              {details.note && <p className="m-0 mt-2 italic text-gray-500">Ghi chú: {details.note}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-bold text-gray-900 m-0 flex items-center gap-2"><CreditCard size={16} className="text-[var(--color-theme)]" /> Thanh toán & Vận chuyển</h5>
                            <div className="text-gray-600 ml-6 space-y-1">
                              <p className="m-0">Phương thức: <span className="font-medium text-gray-800">{details.paymentMethod}</span></p>
                              <p className="m-0">Vận chuyển: <span className="font-medium text-gray-800">{details.shippingMethod}</span></p>
                              {details.trackingNumber && (
                                <p className="m-0">Mã vận đơn: <span className="font-bold text-[var(--color-theme)]">{details.trackingNumber}</span></p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Danh sách sản phẩm */}
                        <div className="space-y-4">
                          <h5 className="font-bold text-gray-900 m-0 text-[14px]">Sản phẩm đã mua</h5>
                          <div className="space-y-4">
                            {details.items.map((item) => (
                              <div key={item.orderDetailId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-[4px] hover:border-gray-200 transition-colors">
                                <div className="flex gap-4">
                                  <div className="w-[80px] h-[100px] bg-gray-50 shrink-0 rounded overflow-hidden border border-gray-100">
                                    <img
                                      src={item.variantImage || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 text-[13px] flex flex-col justify-center">
                                    <h4 className="font-semibold text-gray-900 m-0 text-[14px] leading-snug">{item.productName}</h4>
                                    <p className="text-gray-400 text-[11px] mt-1 mb-2">SKU: {item.skuCode}</p>
                                    <div className="text-gray-600 flex flex-wrap gap-x-4">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded-sm text-[11px] font-medium">Phân loại: {typeof item.variantAttributes === 'string' ? item.variantAttributes : JSON.stringify(item.variantAttributes)}</span>
                                      <span className="font-medium">SL: {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-gray-100">
                                  <div className="text-[14px] font-bold text-gray-900">
                                    {formatVND(item.price)}
                                  </div>
                                  <button
                                    onClick={(e) => handleRepurchase(item, e)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[var(--color-theme-light)] hover:bg-[var(--color-theme)] text-[var(--color-theme)] hover:text-white rounded-[4px] text-[11px] font-bold uppercase transition-colors border-none cursor-pointer"
                                  >
                                    <ShoppingCart size={14} /> Mua lại
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Tổng quan chi phí */}
                        <div className="border-t border-gray-100 pt-4 mt-6 text-[13px]">
                          <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 ml-auto space-y-2 font-medium text-gray-500">
                            <div className="flex justify-between gap-6">
                              <span>Tổng tiền hàng:</span>
                              <span className="text-gray-800">{formatVND(details.totalProductMoney)}</span>
                            </div>
                            <div className="flex justify-between gap-6">
                              <span>Phí vận chuyển:</span>
                              <span className="text-gray-800">{details.originalShippingFee === 0 ? 'Miễn phí' : formatVND(details.originalShippingFee)}</span>
                            </div>
                            {(details.shippingDiscountAmount > 0 || details.paymentDiscountAmount > 0) && (
                              <div className="flex justify-between gap-6 text-emerald-600">
                                <span>Giảm giá:</span>
                                <span>-{formatVND((details.shippingDiscountAmount || 0) + (details.paymentDiscountAmount || 0))}</span>
                              </div>
                            )}
                            <div className="flex justify-between gap-6 text-[15px] font-bold text-gray-900 border-t border-gray-100 pt-3 mt-3">
                              <span>Thành tiền:</span>
                              <span className="text-[var(--color-theme)]">{formatVND(details.finalPaymentMoney)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Không thể tải thông tin đơn hàng.</p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* POPUP HỦY ĐƠN HÀNG */}
      <ConfirmCancelOrderModal
        open={isCancelModalOpen}
        setOpen={setIsCancelModalOpen}
        title={`Hủy đơn hàng này`}
        content="Vui lòng nhập lý do bạn muốn hủy đơn hàng này. Hành động này sẽ hủy đơn hàng ngay lập tức và không thể hoàn tác."
        onConfirm={handleConfirmCancel}
        isSubmitting={isCancelling}
      />
    </div>
  );
}