import React, { useState, useEffect, useMemo } from 'react';
import {
  CircularProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, IconButton, Typography, Chip, Card
} from '@mui/material';
import {
  Visibility, Close, LocalShipping, Payment, CheckCircle, Cancel, PendingActions, HelpOutlined
} from '@mui/icons-material';
import CustomPagination from '@/components/general/Pagination';
import { useOrder } from '@/hooks/useOrder';
import { toast } from 'react-toastify';
import type { OrderSummaryResponse } from '@/types/order/responses';
import { OrderStatus } from '@/types/enums/orderType';

const OrderList: React.FC = () => {
  const {
    orders,
    pagination,
    currentOrderDetail,
    isFetching: loading,
    isSubmitting: actionLoading,
    fetchAllOrders,
    fetchOrderDetail,
    updateOrderStatus,
    clearDetail
  } = useOrder();

  // Pagination State
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchOrderId, setSearchOrderId] = useState<string>('');

  // Modals State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PENDING);

  // Load orders list
  useEffect(() => {
    fetchAllOrders(page, size).catch(err => {
      console.error('Error fetching orders:', err);
      toast.error('Lỗi tải danh sách đơn hàng');
    });
  }, [page, size, fetchAllOrders]);

  // Handle open detail modal
  const handleOpenDetail = async (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsDetailModalOpen(true);
    try {
      const detail = await fetchOrderDetail(orderId);
      if (detail) {
        setNewStatus(detail.orderStatus);
      }
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      toast.error(err || 'Không thể tải chi tiết đơn hàng');
      setIsDetailModalOpen(false);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedOrderId(null);
    clearDetail();
  };

  // Handle status update
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    try {
      await updateOrderStatus(selectedOrderId, { newStatus });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
      // Refresh list
      fetchAllOrders(page, size);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error(err || 'Cập nhật trạng thái thất bại');
    }
  };

  // Helper formatters
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Helper for status badge styling
  const getStatusChip = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Chip label="Chờ xử lý" color="warning" variant="outlined" size="small" icon={<PendingActions />} />;
      case OrderStatus.PENDING_REVIEW:
        return <Chip label="Chờ duyệt" color="warning" variant="outlined" size="small" icon={<PendingActions />} />;
      case OrderStatus.PENDING_PAYMENT:
        return <Chip label="Chờ thanh toán" color="warning" variant="outlined" size="small" icon={<PendingActions />} />;
      case OrderStatus.AWAITING_SHIPMENT:
        return <Chip label="Chờ giao hàng" color="info" variant="outlined" size="small" icon={<LocalShipping />} />;
      case OrderStatus.SHIPPING:
        return <Chip label="Đang giao hàng" color="info" size="small" icon={<LocalShipping />} />;
      case OrderStatus.DELIVERED:
        return <Chip label="Đã giao hàng" color="success" variant="outlined" size="small" icon={<CheckCircle />} />;
      case OrderStatus.COMPLETED:
        return <Chip label="Hoàn thành" color="success" size="small" icon={<CheckCircle />} />;
      case OrderStatus.CANCELLED:
        return <Chip label="Đã hủy" color="error" size="small" icon={<Cancel />} />;
      case OrderStatus.RETURNED:
        return <Chip label="Trả hàng" color="error" variant="outlined" size="small" icon={<Cancel />} />;
      case OrderStatus.REFUND_FAILED:
        return <Chip label="Hoàn tiền lỗi" color="error" size="small" icon={<Cancel />} />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  // Local filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order: OrderSummaryResponse) => {
      const matchesStatus = statusFilter === '' || order.orderStatus === statusFilter;
      const matchesSearch = searchOrderId === '' || order.orderId.toString().includes(searchOrderId);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchOrderId]);

  const totalPages = pagination?.totalPages ?? 0;

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý Đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Duyệt đơn, thay đổi trạng thái giao nhận và quản lý thông tin thanh toán</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <TextField
              label="Tìm theo Mã đơn hàng"
              placeholder="VD: 102..."
              fullWidth
              size="small"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value.replace(/\D/g, ''))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </div>

          <div className="w-full sm:w-64">
            <TextField
              select
              label="Trạng thái đơn hàng"
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              <MenuItem value={OrderStatus.PENDING}>Chờ xử lý</MenuItem>
              <MenuItem value={OrderStatus.PENDING_REVIEW}>Chờ duyệt</MenuItem>
              <MenuItem value={OrderStatus.PENDING_PAYMENT}>Chờ thanh toán</MenuItem>
              <MenuItem value={OrderStatus.AWAITING_SHIPMENT}>Chờ giao hàng</MenuItem>
              <MenuItem value={OrderStatus.SHIPPING}>Đang giao hàng</MenuItem>
              <MenuItem value={OrderStatus.DELIVERED}>Đã giao hàng</MenuItem>
              <MenuItem value={OrderStatus.COMPLETED}>Hoàn thành</MenuItem>
              <MenuItem value={OrderStatus.CANCELLED}>Đã hủy</MenuItem>
              <MenuItem value={OrderStatus.RETURNED}>Đã trả hàng</MenuItem>
              <MenuItem value={OrderStatus.REFUND_FAILED}>Hoàn tiền lỗi</MenuItem>
            </TextField>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Mã đơn hàng</th>
                  <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                  <th className="px-6 py-4 font-semibold">Hình thức thanh toán</th>
                  <th className="px-6 py-4 font-semibold text-center">Số lượng SP</th>
                  <th className="px-6 py-4 font-semibold text-center">Tổng thanh toán</th>
                  <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải danh sách đơn hàng...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {order.paymentMethod === 'COD' ? 'Thanh toán COD' : 
                         order.paymentMethod === 'VNPAY' ? 'Ví VNPAY' : 'Ví MoMo'}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {order.itemCount}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-theme">
                        {formatCurrency(order.finalPaymentMoney)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusChip(order.orderStatus)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Tooltip title="Xem chi tiết & Cập nhật" arrow>
                          <IconButton
                            onClick={() => handleOpenDetail(order.orderId)}
                            size="small"
                            sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <HelpOutlined className="text-gray-300 mb-2" sx={{ fontSize: 40 }} />
                        <p className="text-gray-500 font-medium m-0">Không tìm thấy đơn hàng nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION UI */}
          <CustomPagination
            currentPage={page + 1}
            totalPages={totalPages}
            totalItems={pagination?.totalElements ?? 0}
            itemsPerPage={size}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        </div>
      </div>

      {/* DETAIL & STATUS UPDATE DIALOG */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseDetail}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <DialogTitle className="font-bold text-gray-850 border-b border-gray-100 pb-3 pt-4 px-6 m-0 flex justify-between items-center">
          <span>Chi tiết Đơn hàng #{selectedOrderId}</span>
          <IconButton onClick={handleCloseDetail} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="pt-6 pb-6 px-6 max-h-[75vh] overflow-y-auto">
          {loading && !currentOrderDetail ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CircularProgress size={32} sx={{ color: '#00927c' }} />
              <p className="mt-2 text-gray-500 text-sm">Đang tải thông tin đơn hàng...</p>
            </div>
          ) : currentOrderDetail ? (
            <div className="flex flex-col gap-6">
              {/* Order Status Summary */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Trạng thái hiện tại</div>
                  <div className="mt-1">{getStatusChip(currentOrderDetail.orderStatus)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ngày khởi tạo</div>
                  <div className="mt-1 font-bold text-gray-800">{formatDate(currentOrderDetail.orderDate)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Mã vận chuyển</div>
                  <div className="mt-1 font-mono font-bold text-[#00927c]">
                    {currentOrderDetail.trackingNumber || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>

              {/* Recipient and Payment Details (using Tailwind grid layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card variant="outlined" sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                    <Typography className="m-0 mb-3" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Thông tin nhận hàng
                    </Typography>
                    <div className="flex flex-col gap-1.5 text-sm">
                      <div className="font-semibold text-gray-800">{currentOrderDetail.address.recipientName}</div>
                      <div className="text-gray-600">SĐT: {currentOrderDetail.address.phone}</div>
                      <div className="text-gray-600">Địa chỉ: {currentOrderDetail.address.fullAddress}</div>
                      {currentOrderDetail.note && (
                        <div className="mt-2 p-2.5 bg-yellow-50 border-l-4 border-yellow-400 text-xs text-yellow-800 rounded">
                          <strong>Ghi chú:</strong> {currentOrderDetail.note}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div>
                  <Card variant="outlined" sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
                    <Typography className="m-0 mb-3" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Phương thức & Thanh toán
                    </Typography>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Payment fontSize="small" sx={{ color: '#4b5563' }} />
                        <span>
                          {currentOrderDetail.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 
                           currentOrderDetail.paymentMethod === 'VNPAY' ? 'Cổng thanh toán VNPAY' : 'Ví MoMo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocalShipping fontSize="small" sx={{ color: '#4b5563' }} />
                        <span>
                          {currentOrderDetail.shippingMethod === 'STANDARD' ? 'Giao hàng Tiêu chuẩn' : 'Giao hàng Hỏa tốc'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Items List */}
              <div>
                <Typography className="m-0 mb-3" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Danh sách sản phẩm ({currentOrderDetail.items.length})
                </Typography>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase">
                        <th className="px-4 py-3">Sản phẩm</th>
                        <th className="px-4 py-3 text-center">Đơn giá</th>
                        <th className="px-4 py-3 text-center">Số lượng</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {currentOrderDetail.items.map((item) => (
                        <tr key={item.orderDetailId}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-semibold text-gray-800">{item.productName}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">SKU: {item.skuCode}</div>
                              {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(item.variantAttributes).map(([key, val]) => (
                                    <span key={key} className="inline-block bg-gray-100 text-[10px] text-gray-600 px-1.5 py-0.5 rounded">
                                      {key}: {String(val)}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">
                            {formatCurrency(item.totalMoney)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="flex justify-end">
                <div className="w-full sm:w-80 bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Tổng tiền sản phẩm:</span>
                    <span>{formatCurrency(currentOrderDetail.totalProductMoney)}</span>
                  </div>
                  {currentOrderDetail.shopDiscountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Giảm giá từ shop:</span>
                      <span>-{formatCurrency(currentOrderDetail.shopDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(currentOrderDetail.originalShippingFee)}</span>
                  </div>
                  {currentOrderDetail.shippingDiscountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Giảm phí vận chuyển:</span>
                      <span>-{formatCurrency(currentOrderDetail.shippingDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="flex justify-between font-bold text-lg text-theme">
                    <span>Tổng thanh toán:</span>
                    <span>{formatCurrency(currentOrderDetail.finalPaymentMoney)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="border-t border-gray-150 pt-5 mt-2">
                <Typography sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 3 }}>
                  Cập nhật trạng thái đơn hàng (Admin)
                </Typography>
                <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <TextField
                      select
                      label="Trạng thái mới"
                      fullWidth
                      size="small"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    >
                      <MenuItem value={OrderStatus.PENDING}>Chờ xử lý (PENDING)</MenuItem>
                      <MenuItem value={OrderStatus.PENDING_REVIEW}>Chờ duyệt (PENDING_REVIEW)</MenuItem>
                      <MenuItem value={OrderStatus.PENDING_PAYMENT}>Chờ thanh toán (PENDING_PAYMENT)</MenuItem>
                      <MenuItem value={OrderStatus.AWAITING_SHIPMENT}>Chờ giao hàng (AWAITING_SHIPMENT)</MenuItem>
                      <MenuItem value={OrderStatus.SHIPPING}>Đang vận chuyển (SHIPPING)</MenuItem>
                      <MenuItem value={OrderStatus.DELIVERED}>Đã giao hàng (DELIVERED)</MenuItem>
                      <MenuItem value={OrderStatus.COMPLETED}>Hoàn tất đơn (COMPLETED)</MenuItem>
                      <MenuItem value={OrderStatus.CANCELLED}>Hủy bỏ đơn (CANCELLED)</MenuItem>
                      <MenuItem value={OrderStatus.RETURNED}>Đã trả hàng (RETURNED)</MenuItem>
                      <MenuItem value={OrderStatus.REFUND_FAILED}>Hoàn tiền lỗi (REFUND_FAILED)</MenuItem>
                    </TextField>
                  </div>
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    variant="contained"
                    sx={{
                      bgcolor: '#00927c', textTransform: 'none', px: 4, height: '40px',
                      fontWeight: 'bold', fontSize: '13px', borderRadius: '10px', boxShadow: 'none',
                      '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
                    }}
                  >
                    {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Cập nhật'}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">Không tìm thấy thông tin đơn hàng</div>
          )}
        </DialogContent>

        <DialogActions className="p-6 pt-2 border-t border-gray-100 flex justify-end">
          <Button
            onClick={handleCloseDetail}
            variant="outlined"
            sx={{
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
              '&:hover': { borderColor: '#9ca3af', backgroundColor: '#f9fafb' }
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderList;
