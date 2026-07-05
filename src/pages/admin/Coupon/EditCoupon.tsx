import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { useCoupon } from '@/hooks/useCoupon';
import type { CouponResponse } from '@/types/coupon/responses';

interface EditCouponProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon: CouponResponse | null;
}

const EditCoupon: React.FC<EditCouponProps> = ({ open, onClose, onSuccess, coupon }) => {
  const { updateCoupon, isSubmitting: actionLoading } = useCoupon();

  // Form Fields State
  const [description, setDescription] = useState('');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [userUsageLimit, setUserUsageLimit] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [applicableConditions, setApplicableConditions] = useState('');

  // Set initial data when modal opens or coupon changes
  useEffect(() => {
    if (open && coupon) {
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
    }
  }, [open, coupon]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupon) return;

    if (discountValue <= 0) {
      toast.error('Giá trị giảm giá phải lớn hơn 0');
      return;
    }

    if (coupon.discountType === 'PERCENTAGE' && discountValue > 100) {
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
      await updateCoupon(coupon.couponId, {
        description: description.trim() || undefined,
        discountValue,
        maxDiscountAmount: coupon.discountType === 'PERCENTAGE' ? maxDiscountAmount || undefined : undefined,
        minOrderAmount: minOrderAmount || undefined,
        maxUsage: maxUsage || undefined,
        userUsageLimit: userUsageLimit || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        applicableConditions: applicableConditions.trim() || undefined
      });
      toast.success('Cập nhật mã giảm giá thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Cập nhật mã giảm giá thất bại');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { if (!actionLoading) onClose(); }}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
    >
      <form onSubmit={handleSaveEdit}>
        <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
          Chỉnh sửa coupon: {coupon?.code}
        </DialogTitle>

        <DialogContent className="pt-6 pb-6 px-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-5 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label="Mã Code"
                disabled
                fullWidth
                value={coupon?.code || ''}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f3f4f6' } }}
              />

              <TextField
                label="Phân loại Coupon"
                disabled
                fullWidth
                value={coupon?.couponType === 'SHOP_VOUCHER' ? 'Voucher Cửa hàng' :
                  coupon?.couponType === 'FREE_SHIPPING' ? 'Miễn phí vận chuyển' : 'Voucher Thanh toán'}
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
                value={coupon?.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền cố định (₫)'}
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
                        {coupon?.discountType === 'PERCENTAGE' ? '%' : '₫'}
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
                disabled={coupon?.discountType === 'FIXED_AMOUNT'}
                value={coupon?.discountType === 'FIXED_AMOUNT' ? '' : (maxDiscountAmount || '')}
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
            onClick={onClose}
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
              bgcolor: 'theme', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Lưu lại'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCoupon;
