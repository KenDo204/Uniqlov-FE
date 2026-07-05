import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Tooltip, Button, IconButton
} from '@mui/material';
import {
  Edit, Block, Add, CheckCircle
} from '@mui/icons-material';
import CustomPagination from '@/components/general/Pagination';
import { Ticket } from '@/components/ui/icons';
import ConfirmModal from '@/components/general/ConfirmModal';
import { useCoupon } from '@/hooks/useCoupon';
import { toast } from 'react-toastify';
import type { CouponResponse } from '@/types/coupon/responses';
import AddCoupon from './AddCoupon';
import EditCoupon from './EditCoupon';

const CouponList: React.FC = () => {
  const {
    coupons,
    pagination,
    fetchAllCoupons,
    deactivateCoupon,
    isFetching: loading
  } = useCoupon();

  // Pagination State
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponResponse | null>(null);
  const [couponToDeactivate, setCouponToDeactivate] = useState<number | null>(null);
  // Load Data on Mount and Page Change
  useEffect(() => {
    fetchAllCoupons(page, size).catch(err => {
      console.error('Error fetching coupons:', err);
      toast.error('Lỗi tải danh sách mã giảm giá');
    });
  }, [page, size, fetchAllCoupons]);

  // Helper formatters
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Open Modals
  const handleOpenAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleOpenDeactivate = (couponId: number) => {
    setCouponToDeactivate(couponId);
    setIsDeactivateConfirmOpen(true);
  };

  const handleExecuteDeactivate = async () => {
    if (!couponToDeactivate) return;
    try {
      await deactivateCoupon(couponToDeactivate);
      toast.success('Vô hiệu hóa mã giảm giá thành công!');
      setIsDeactivateConfirmOpen(false);
      setCouponToDeactivate(null);
      fetchAllCoupons(page, size);
    } catch (error: any) {
      toast.error(error || 'Vô hiệu hóa thất bại');
    }
  };

  const totalPages = pagination?.totalPages ?? 0;

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý Mã giảm giá</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Tạo mã ưu đãi, kiểm tra lượt sử dụng và cấu hình điều kiện áp dụng</p>
          </div>
          <Button
            onClick={handleOpenAdd}
            variant="contained"
            sx={{
              bgcolor: 'theme', textTransform: 'none', px: 3, py: 1.2,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: 'theme-hover', boxShadow: 'none' }
            }}
          >
            <Add fontSize="medium" />
            Thêm mã giảm giá
          </Button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Mã ưu đãi</th>
                  <th className="px-6 py-4 font-semibold">Loại / Phân loại</th>
                  <th className="px-6 py-4 font-semibold text-center">Mức giảm</th>
                  <th className="px-6 py-4 font-semibold text-center">Đơn tối thiểu</th>
                  <th className="px-6 py-4 font-semibold text-center">Lượt dùng</th>
                  <th className="px-6 py-4 font-semibold">Hạn dùng</th>
                  <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: 'theme' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải danh sách coupon...</p>
                    </td>
                  </tr>
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => {
                    const isExpired = new Date(coupon.endDate) < new Date();
                    return (
                      <tr key={coupon.couponId} className={`hover:bg-gray-50/50 transition-colors ${isExpired ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[theme]/10 text-[theme] flex items-center justify-center">
                              <Ticket size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 tracking-wider">{coupon.code}</div>
                              {coupon.description && (
                                <div className="text-xs text-gray-400 max-w-[200px] truncate">{coupon.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[12px] font-semibold text-gray-800">
                              {coupon.couponType === 'SHOP_VOUCHER' ? 'Voucher Cửa hàng' :
                                coupon.couponType === 'FREE_SHIPPING' ? 'Miễn phí vận chuyển' : 'Voucher Thanh toán'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {coupon.discountType === 'PERCENTAGE' ? 'Tính theo %' : 'Số tiền cố định'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-[theme]">
                          {coupon.discountType === 'PERCENTAGE'
                            ? `${coupon.discountValue}%`
                            : formatCurrency(coupon.discountValue)}
                          {coupon.discountType === 'PERCENTAGE' && coupon.maxDiscountAmount ? (
                            <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                              Tối đa {formatCurrency(coupon.maxDiscountAmount)}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">
                          {formatCurrency(coupon.minOrderAmount)}
                        </td>
                        <td className="px-6 py-4 text-center text-xs">
                          <div className="font-semibold text-gray-800">Tối đa: {coupon.maxUsage ?? 'Vô hạn'}</div>
                          <div className="text-gray-400">Giới hạn/User: {coupon.userUsageLimit ?? 1}</div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <div className="text-gray-600">Từ: {formatDate(coupon.startDate)}</div>
                          <div className={`font-semibold ${isExpired ? 'text-red-500' : 'text-gray-600'}`}>
                            Đến: {formatDate(coupon.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${coupon.isActive && !isExpired
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-100'}`}
                          >
                            {coupon.isActive && !isExpired ? (
                              <>
                                <CheckCircle className="text-emerald-500" sx={{ fontSize: 12 }} />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <Block className="text-red-500" sx={{ fontSize: 12 }} />
                                {isExpired ? 'Hết hạn' : 'Đã khóa'}
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip title="Chỉnh sửa mã ưu đãi" arrow>
                              <IconButton
                                onClick={() => handleOpenEdit(coupon)}
                                size="small"
                                sx={{ color: 'theme', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {coupon.isActive && !isExpired && (
                              <Tooltip title="Vô hiệu hóa mã giảm giá" arrow>
                                <IconButton
                                  onClick={() => handleOpenDeactivate(coupon.couponId)}
                                  size="small"
                                  sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                                >
                                  <Block fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                        <p className="text-gray-500 font-medium m-0">Không tìm thấy mã giảm giá nào</p>
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

      {/* ADD MODAL */}
      <AddCoupon
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchAllCoupons(page, size)}
      />

      {/* EDIT MODAL */}
      <EditCoupon
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchAllCoupons(page, size)}
        coupon={selectedCoupon}
      />

      {/* CONFIRM DEACTIVATE MODAL */}
      <ConfirmModal
        open={isDeactivateConfirmOpen}
        setOpen={setIsDeactivateConfirmOpen}
        title="Xác nhận vô hiệu hóa"
        content="Bạn có chắc chắn muốn ngừng kích hoạt mã giảm giá này? Mã sẽ không thể sử dụng cho các đơn hàng mới nữa."
        onConfirm={handleExecuteDeactivate}
        confirmText="Vô hiệu hóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CouponList;
