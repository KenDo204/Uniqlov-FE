import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, MenuItem, InputAdornment
} from '@mui/material';
import { toast } from 'react-toastify';
import { useCoupon } from '@/hooks/useCoupon';
import { couponCreateSchema } from '@/schemas';
import { validateCouponInputs } from '@/utils/validationHelpers';
import type { DiscountType } from '@/types/enums/discountType';
import type { CouponType } from '@/types/enums/couponType';

interface AddCouponProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCoupon: React.FC<AddCouponProps> = ({ open, onClose, onSuccess }) => {
  const { createCoupon, isSubmitting: actionLoading } = useCoupon();

  // Form Fields State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('');
  const [maxUsage, setMaxUsage] = useState<string>('100');
  const [userUsageLimit, setUserUsageLimit] = useState<string>('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [couponType, setCouponType] = useState<CouponType>('SHOP_VOUCHER');
  const [applicableConditions, setApplicableConditions] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or set defaults when modal opens
  useEffect(() => {
    if (open) {
      setCode('');
      setDescription('');
      setDiscountType('PERCENTAGE');
      setDiscountValue('');
      setMaxDiscountAmount('');
      setMinOrderAmount('');
      setMaxUsage('100');
      setUserUsageLimit('1');
      setErrors({});

      // Set default times (start: now, end: next week)
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      const tzOffset = now.getTimezoneOffset() * 60000;
      const localNow = new Date(now.getTime() - tzOffset);
      const localNextWeek = new Date(nextWeek.getTime() - tzOffset);

      setStartDate(localNow.toISOString().substring(0, 16));
      setEndDate(localNextWeek.toISOString().substring(0, 16));
      setCouponType('SHOP_VOUCHER');
      setApplicableConditions('');
    }
  }, [open]);

  // Realtime validation runner
  const validateFieldValues = (overrides?: Partial<{
    discountType: DiscountType;
    discountValue: string;
    maxDiscountAmount: string;
    minOrderAmount: string;
    maxUsage: string;
    userUsageLimit: string;
  }>) => {
    const inputs = {
      discountType: overrides?.discountType ?? discountType,
      discountValue: overrides?.discountValue ?? discountValue,
      maxDiscountAmount: overrides?.maxDiscountAmount ?? maxDiscountAmount,
      minOrderAmount: overrides?.minOrderAmount ?? minOrderAmount,
      maxUsage: overrides?.maxUsage ?? maxUsage,
      userUsageLimit: overrides?.userUsageLimit ?? userUsageLimit,
    };
    const errs = validateCouponInputs(inputs);
    setErrors(errs);
    return errs;
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = validateFieldValues();
    if (Object.keys(fieldErrors).length > 0) {
      const firstError = Object.values(fieldErrors)[0];
      toast.error(`Dữ liệu không hợp lệ: ${firstError}`);
      return;
    }

    const parsedDiscountValue = Number(discountValue) || 0;

    const payload = {
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: parsedDiscountValue,
      maxDiscountAmount: discountType === 'PERCENTAGE' ? (Number(maxDiscountAmount) || undefined) : undefined,
      minOrderAmount: Number(minOrderAmount) || undefined,
      maxUsage: Number(maxUsage) || undefined,
      userUsageLimit: Number(userUsageLimit) || undefined,
      startDate,
      endDate,
      couponType,
      applicableConditions: applicableConditions.trim() || undefined,
    };

    const validationResult = couponCreateSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
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
        ...payload,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      toast.success('Tạo mã giảm giá thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Tạo mã giảm giá thất bại');
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
                    setMaxDiscountAmount('0');
                  }
                  validateFieldValues({ discountType: type });
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
                value={discountValue}
                error={!!errors.discountValue}
                helperText={errors.discountValue}
                onChange={(e) => {
                  setDiscountValue(e.target.value);
                  validateFieldValues({ discountValue: e.target.value });
                }}
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
                value={minOrderAmount}
                error={!!errors.minOrderAmount}
                helperText={errors.minOrderAmount}
                onChange={(e) => {
                  setMinOrderAmount(e.target.value);
                  validateFieldValues({ minOrderAmount: e.target.value });
                }}
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
                value={discountType === 'FIXED_AMOUNT' ? '' : maxDiscountAmount}
                error={!!errors.maxDiscountAmount}
                helperText={errors.maxDiscountAmount}
                onChange={(e) => {
                  setMaxDiscountAmount(e.target.value);
                  validateFieldValues({ maxDiscountAmount: e.target.value });
                }}
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
                value={maxUsage}
                error={!!errors.maxUsage}
                helperText={errors.maxUsage}
                onChange={(e) => {
                  setMaxUsage(e.target.value);
                  validateFieldValues({ maxUsage: e.target.value });
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                select
                label="Lượt dùng tối đa / 1 Khách hàng"
                fullWidth
                value={userUsageLimit}
                error={!!errors.userUsageLimit}
                helperText={errors.userUsageLimit}
                onChange={(e) => {
                  setUserUsageLimit(e.target.value);
                  validateFieldValues({ userUsageLimit: e.target.value });
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value="1">1 lượt</MenuItem>
                <MenuItem value="2">2 lượt</MenuItem>
                <MenuItem value="3">3 lượt</MenuItem>
                <MenuItem value="4">4 lượt</MenuItem>
                <MenuItem value="5">5 lượt</MenuItem>
              </TextField>
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

            {/* <TextField
              label="Điều kiện áp dụng khác (ghi chú)"
              placeholder="VD: Không áp dụng kèm các chương trình khuyến mãi khác..."
              fullWidth
              value={applicableConditions}
              onChange={(e) => setApplicableConditions(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            /> */}
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
              bgcolor: 'var(--color-theme)', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--color-theme-hover)', boxShadow: 'none' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCoupon;
