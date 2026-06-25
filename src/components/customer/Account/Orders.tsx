import React, { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { formatVND } from '@/utils/formatters';
import { CircularProgress } from '@mui/material';
import ConfirmCancelOrderModal from '@/components/general/ConfirmCancelOrderModal';
import { toast } from 'react-toastify';
import type { OrderResponse } from '@/types/order/responses';

const getOrderStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Chờ thanh toán',
    'PAID': 'Đã thanh toán',
    'SHIPPING': 'Đang giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy'
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

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<number, OrderResponse>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({});

  // Cancel order modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);

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
    }
  };

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Lịch sử mua hàng</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {isFetching && orders.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress sx={{ color: '#00927c' }} />
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
                  className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 cursor-pointer hover:bg-gray-100/70 transition-colors"
                >
                  <div className="text-[14px] text-gray-600 space-x-3">
                    <span className="font-bold text-black">Đơn hàng #{ord.orderId}</span>
                    <span>|</span>
                    <span>Ngày đặt: {new Date(ord.orderDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-3">
                    <span className={ord.orderStatus === 'CANCELLED' ? 'text-red-500' : ord.orderStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-blue-600'}>
                      {getOrderStatusLabel(ord.orderStatus)}
                    </span>
                    {ord.orderStatus === 'PENDING' && (
                      <button 
                        onClick={(e) => handleOpenCancel(ord.orderId, e)}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded border-none font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* Phần chi tiết (hiển thị khi expand) */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 bg-white animate-fade-in">
                    {isLoading ? (
                      <div className="flex justify-center py-6">
                        <CircularProgress size={24} sx={{ color: '#00927c' }} />
                      </div>
                    ) : details ? (
                      <div className="space-y-6">
                        {/* Danh sách items */}
                        <div className="divide-y divide-gray-100">
                          {details.items.map((item) => (
                            <div key={item.orderDetailId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                              <div className="w-[70px] h-[90px] bg-gray-50 shrink-0 rounded overflow-hidden border border-gray-100">
                                <img 
                                  src={(item as any).variantImage || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'} 
                                  alt={item.productName} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              
                              <div className="flex-1 text-[13px]">
                                <h4 className="font-semibold text-gray-800 m-0 leading-snug">{item.productName}</h4>
                                <p className="text-gray-400 text-[11px] mt-0.5 mb-1">SKU: {item.skuCode}</p>
                                <div className="text-gray-500 flex flex-wrap gap-x-4 mt-2">
                                  <span>Màu/Size: {typeof item.variantAttributes === 'string' ? item.variantAttributes : JSON.stringify(item.variantAttributes)}</span>
                                  <span>Số lượng: <span className="font-bold text-gray-800">{item.quantity}</span></span>
                                </div>
                              </div>
                              
                              <div className="text-[13px] font-bold text-right shrink-0">
                                {formatVND(item.price)}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tổng quan tài chính & Vận đơn */}
                        <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                          <div className="text-gray-600 space-y-1">
                            <p className="m-0">Phương thức: <span className="font-bold text-gray-800">{details.paymentMethod}</span></p>
                            <p className="m-0">Vận chuyển: <span className="font-bold text-gray-800">{details.shippingMethod}</span></p>
                            {details.trackingNumber && (
                              <p className="m-0">Mã vận đơn: <span className="font-bold text-[#00927c]">{details.trackingNumber}</span> (GHN)</p>
                            )}
                            <p className="m-0">Địa chỉ giao: <span className="font-medium text-gray-800">{details.address.fullAddress}</span></p>
                            {details.note && <p className="m-0 italic text-gray-400">Ghi chú: "{details.note}"</p>}
                          </div>
                          
                          <div className="text-right space-y-1.5 font-medium text-gray-500">
                            <div className="flex justify-between md:justify-end gap-10">
                              <span>Tiền sản phẩm:</span>
                              <span className="text-gray-800">{formatVND(details.totalProductMoney)}</span>
                            </div>
                            {details.shopDiscountAmount > 0 && (
                              <div className="flex justify-between md:justify-end gap-10 text-red-500">
                                <span>Giảm giá coupon:</span>
                                <span>-{formatVND(details.shopDiscountAmount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between md:justify-end gap-10">
                              <span>Phí giao hàng:</span>
                              <span className="text-gray-800">{details.originalShippingFee === 0 ? 'Miễn phí' : formatVND(details.originalShippingFee)}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-10 text-[15px] font-bold text-gray-900 border-t border-gray-100 pt-2 mt-2">
                              <span>Tổng thanh toán:</span>
                              <span className="text-[#00927c]">{formatVND(details.finalPaymentMoney)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Không thể tải thông tin đơn hàng.</p>
                    )}
                  </div>
                )}

                {/* Footer tóm tắt (Tổng tiền & Bấm xem chi tiết) */}
                <div 
                  onClick={() => handleToggleDetails(ord.orderId)}
                  className="px-6 py-4 border-t border-gray-100 flex flex-row justify-between items-center gap-4 bg-white cursor-pointer hover:bg-gray-50/50"
                >
                  <div className="text-[13px] text-gray-400">
                    {ord.itemCount} Sản phẩm
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-[13px] text-gray-600">
                      Tổng tiền: <span className="text-[16px] font-bold text-black ml-1">{formatVND(ord.finalPaymentMoney)}</span>
                    </div>
                    <button className="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-[11px] font-bold uppercase tracking-wider rounded border-none cursor-pointer transition-colors">
                      {isExpanded ? 'Đóng' : 'Chi tiết'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP HỦY ĐƠN HÀNG */}
      <ConfirmCancelOrderModal
        open={isCancelModalOpen}
        setOpen={setIsCancelModalOpen}
        title={`Hủy đơn hàng #${cancelOrderId}`}
        content="Vui lòng nhập lý do bạn muốn hủy đơn hàng này. Hành động này sẽ hủy đơn hàng ngay lập tức và không thể hoàn tác."
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}