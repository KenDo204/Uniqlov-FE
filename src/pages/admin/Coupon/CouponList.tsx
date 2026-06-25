import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, IconButton, Typography, MenuItem, InputAdornment
} from '@mui/material';
import {
  Edit, Block, Add, CheckCircle, WarningAmber
} from '@mui/icons-material';
import { Ticket } from '@/components/ui/icons';
import { useCoupon } from '@/hooks/useCoupon';
import { toast } from 'react-toastify';
import type { CouponResponse } from '@/types/coupon/responses';
import type { DiscountType } from '@/types/enums/discountType';
import type { CouponType } from '@/types/enums/couponType';

const CouponList: React.FC = () => {
  const {
    coupons,
    pagination,
    isFetching: loading,
    isSubmitting: actionLoading,
    fetchAllCoupons,
    createCoupon,
    updateCoupon,
    deactivateCoupon
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

  // Form Fields State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [userUsageLimit, setUserUsageLimit] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [couponType, setCouponType] = useState<CouponType>('SHOP_VOUCHER');
  const [applicableConditions, setApplicableConditions] = useState('');

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
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(0);
    setMaxDiscountAmount(0);
    setMinOrderAmount(0);
    setMaxUsage(100);
    setUserUsageLimit(1);
    
    // Set default times (start: now, end: next week)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    // Format to yyyy-MM-ddThh:mm
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(now.getTime() - tzOffset);
    const localNextWeek = new Date(nextWeek.getTime() - tzOffset);
    
    setStartDate(localNow.toISOString().substring(0, 16));
    setEndDate(localNextWeek.toISOString().substring(0, 16));
    setCouponType('SHOP_VOUCHER');
    setApplicableConditions('');
    
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponResponse) => {
    setSelectedCoupon(coupon);
    setDescription(coupon.description || '');
    setDiscountValue(coupon.discountValue);
    setMaxDiscountAmount(coupon.maxDiscountAmount || 0);
    setMinOrderAmount(coupon.minOrderAmount || 0);
    setMaxUsage(coupon.maxUsage || 100);
    setUserUsageLimit(coupon.userUsageLimit || 1);
    
    // Format dates to ISO local for inputs
    const startStr = coupon.startDate ? coupon.startDate.substring(0, 16) : '';
    const endStr = coupon.endDate ? coupon.endDate.substring(0, 16) : '';
    setStartDate(startStr);
    setEndDate(endStr);
    setApplicableConditions(coupon.applicableConditions || '');
    setIsEditModalOpen(true);
  };

  const handleOpenDeactivate = (id: number) => {
    setCouponToDeactivate(id);
    setIsDeactivateConfirmOpen(true);
  };

  // Submit Actions
  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (discountValue <= 0) {
      toast.error('Giá trị giảm giá phải lớn hơn 0');
      return;
    }

    if (discountType === 'PERCENTAGE' && discountValue > 100) {
      toast.error('Phần trăm giảm giá tối đa là 100%');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    try {
      await createCoupon({
        code: code.trim().toUpperCase(),
        description: description.trim() || undefined,
        discountType,
        discountValue,
        maxDiscountAmount: discountType === 'PERCENTAGE' ? maxDiscountAmount || undefined : undefined,
        minOrderAmount: minOrderAmount || undefined,
        maxUsage: maxUsage || undefined,
        userUsageLimit: userUsageLimit || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        couponType,
        applicableConditions: applicableConditions.trim() || undefined
      });
      toast.success('Tạo mã giảm giá thành công!');
      setIsAddModalOpen(false);
      fetchAllCoupons(page, size);
    } catch (error: any) {
      toast.error(error || 'Tạo mã giảm giá thất bại');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoupon) return;

    if (discountValue <= 0) {
      toast.error('Giá trị giảm giá phải lớn hơn 0');
      return;
    }

    if (selectedCoupon.discountType === 'PERCENTAGE' && discountValue > 100) {
      toast.error('Phần trăm giảm giá tối đa là 100%');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    try {
      await updateCoupon(selectedCoupon.couponId, {
        description: description.trim() || undefined,
        discountValue,
        maxDiscountAmount: selectedCoupon.discountType === 'PERCENTAGE' ? maxDiscountAmount || undefined : undefined,
        minOrderAmount: minOrderAmount || undefined,
        maxUsage: maxUsage || undefined,
        userUsageLimit: userUsageLimit || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        applicableConditions: applicableConditions.trim() || undefined
      });
      toast.success('Cập nhật mã giảm giá thành công!');
      setIsEditModalOpen(false);
      fetchAllCoupons(page, size);
    } catch (error: any) {
      toast.error(error || 'Cập nhật mã giảm giá thất bại');
    }
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
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium border-none cursor-pointer transition-colors shadow-sm"
          >
            <Add fontSize="small" />
            Thêm Coupon mới
          </button>
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
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
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
                            <div className="w-9 h-9 rounded-full bg-[#00927c]/10 text-[#00927c] flex items-center justify-center">
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
                        <td className="px-6 py-4 text-center font-semibold text-[#00927c]">
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
                                sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
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
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Hiển thị trang <span className="font-medium text-gray-800">{page + 1}</span> / <span className="font-medium text-gray-800">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Trang trước
                </Button>
                <Button
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page === totalPages - 1}
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => { if (!actionLoading) setIsAddModalOpen(false); }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveAdd}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Tạo mới mã giảm giá (Coupon)
          </DialogTitle>

          <DialogContent className="pt-6 pb-6 px-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-5 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Mã Code"
                  placeholder="VD: SALE50K, FREESHIP..."
                  fullWidth
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  select
                  label="Phân loại Coupon"
                  fullWidth
                  required
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as CouponType)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                >
                  <MenuItem value="SHOP_VOUCHER">Voucher Cửa hàng</MenuItem>
                  <MenuItem value="FREE_SHIPPING">Miễn phí vận chuyển</MenuItem>
                  <MenuItem value="PAYMENT_VOUCHER">Voucher Thanh toán</MenuItem>
                </TextField>
              </div>

              <TextField
                label="Mô tả chương trình ưu đãi"
                placeholder="VD: Giảm ngay 50.000đ cho đơn hàng mua trực tuyến trên 500k..."
                fullWidth
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  select
                  label="Kiểu giảm giá"
                  fullWidth
                  required
                  value={discountType}
                  onChange={(e) => {
                    const type = e.target.value as DiscountType;
                    setDiscountType(type);
                    if (type === 'FIXED_AMOUNT') {
                      setMaxDiscountAmount(0); // Không cần giới hạn cho tiền mặt
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                >
                  <MenuItem value="PERCENTAGE">Phần trăm (%)</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">Số tiền cố định (₫)</MenuItem>
                </TextField>

                <TextField
                  label="Mức giảm giá"
                  type="number"
                  fullWidth
                  required
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {discountType === 'PERCENTAGE' ? '%' : '₫'}
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Giá trị đơn hàng tối thiểu"
                  type="number"
                  fullWidth
                  value={minOrderAmount || ''}
                  onChange={(e) => setMinOrderAmount(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Giảm tối đa (chỉ áp dụng cho giảm %)"
                  type="number"
                  fullWidth
                  disabled={discountType === 'FIXED_AMOUNT'}
                  value={discountType === 'FIXED_AMOUNT' ? '' : (maxDiscountAmount || '')}
                  onChange={(e) => setMaxDiscountAmount(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Tổng số lượt phát hành"
                  type="number"
                  fullWidth
                  value={maxUsage || ''}
                  onChange={(e) => setMaxUsage(Math.max(1, Number(e.target.value)))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Lượt dùng tối đa / 1 Khách hàng"
                  type="number"
                  fullWidth
                  value={userUsageLimit || ''}
                  onChange={(e) => setUserUsageLimit(Math.max(1, Number(e.target.value)))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Ngày bắt đầu"
                  type="datetime-local"
                  fullWidth
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Ngày kết thúc"
                  type="datetime-local"
                  fullWidth
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <TextField
                label="Điều kiện áp dụng khác (ghi chú)"
                placeholder="VD: Không áp dụng kèm các chương trình khuyến mãi khác..."
                fullWidth
                value={applicableConditions}
                onChange={(e) => setApplicableConditions(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </div>
          </DialogContent>

          <DialogActions className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button
              onClick={() => setIsAddModalOpen(false)}
              disabled={actionLoading}
              variant="outlined"
              sx={{
                color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
                fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
                '&:hover': { borderColor: '#9ca3af', backgroundColor: '#f9fafb' }
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={actionLoading}
              variant="contained"
              sx={{
                bgcolor: '#00927c', textTransform: 'none', px: 4,
                fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
                '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
              }}
            >
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => { if (!actionLoading) setIsEditModalOpen(false); }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveEdit}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Chỉnh sửa coupon: {selectedCoupon?.code}
          </DialogTitle>

          <DialogContent className="pt-6 pb-6 px-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-5 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Mã Code"
                  disabled
                  fullWidth
                  value={selectedCoupon?.code || ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f3f4f6' } }}
                />

                <TextField
                  label="Phân loại Coupon"
                  disabled
                  fullWidth
                  value={selectedCoupon?.couponType === 'SHOP_VOUCHER' ? 'Voucher Cửa hàng' :
                         selectedCoupon?.couponType === 'FREE_SHIPPING' ? 'Miễn phí vận chuyển' : 'Voucher Thanh toán'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f3f4f6' } }}
                />
              </div>

              <TextField
                label="Mô tả chương trình ưu đãi"
                placeholder="VD: Giảm ngay 50.000đ cho đơn hàng mua trực tuyến trên 500k..."
                fullWidth
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Kiểu giảm giá"
                  disabled
                  fullWidth
                  value={selectedCoupon?.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền cố định (₫)'}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f3f4f6' } }}
                />

                <TextField
                  label="Mức giảm giá"
                  type="number"
                  fullWidth
                  required
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {selectedCoupon?.discountType === 'PERCENTAGE' ? '%' : '₫'}
                        </InputAdornment>
                      ),
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Giá trị đơn hàng tối thiểu"
                  type="number"
                  fullWidth
                  value={minOrderAmount || ''}
                  onChange={(e) => setMinOrderAmount(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Giảm tối đa (chỉ áp dụng cho giảm %)"
                  type="number"
                  fullWidth
                  disabled={selectedCoupon?.discountType === 'FIXED_AMOUNT'}
                  value={selectedCoupon?.discountType === 'FIXED_AMOUNT' ? '' : (maxDiscountAmount || '')}
                  onChange={(e) => setMaxDiscountAmount(Math.max(0, Number(e.target.value)))}
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Tổng số lượt phát hành"
                  type="number"
                  fullWidth
                  value={maxUsage || ''}
                  onChange={(e) => setMaxUsage(Math.max(1, Number(e.target.value)))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Lượt dùng tối đa / 1 Khách hàng"
                  type="number"
                  fullWidth
                  value={userUsageLimit || ''}
                  onChange={(e) => setUserUsageLimit(Math.max(1, Number(e.target.value)))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="Ngày bắt đầu"
                  type="datetime-local"
                  fullWidth
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />

                <TextField
                  label="Ngày kết thúc"
                  type="datetime-local"
                  fullWidth
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </div>

              <TextField
                label="Điều kiện áp dụng khác (ghi chú)"
                placeholder="VD: Không áp dụng kèm các chương trình khuyến mãi khác..."
                fullWidth
                value={applicableConditions}
                onChange={(e) => setApplicableConditions(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </div>
          </DialogContent>

          <DialogActions className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button
              onClick={() => setIsEditModalOpen(false)}
              disabled={actionLoading}
              variant="outlined"
              sx={{
                color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
                fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
                '&:hover': { borderColor: '#9ca3af', backgroundColor: '#f9fafb' }
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={actionLoading}
              variant="contained"
              sx={{
                bgcolor: '#00927c', textTransform: 'none', px: 4,
                fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
                '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
              }}
            >
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Lưu lại'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* CONFIRM DEACTIVATE MODAL */}
      <Dialog
        open={isDeactivateConfirmOpen}
        onClose={() => { if (!actionLoading) setIsDeactivateConfirmOpen(false); }}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <WarningAmber sx={{ fontSize: 48, color: '#ef4444' }} />
          <Typography variant="h6" color="text.primary" className="m-0" sx={{ fontWeight: 'bold' }}>
            Xác nhận vô hiệu hóa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Bạn có chắc chắn muốn ngừng kích hoạt mã giảm giá này? Mã sẽ không thể sử dụng cho các đơn hàng mới nữa.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button
            onClick={() => setIsDeactivateConfirmOpen(false)}
            variant="outlined"
            disabled={actionLoading}
            sx={{
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
              '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleExecuteDeactivate}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: '#ef4444', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Vô hiệu hóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CouponList;
