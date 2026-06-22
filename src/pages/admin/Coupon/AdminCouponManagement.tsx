// import React, { useState, useEffect } from 'react';
// import {
//     Button, Chip, CircularProgress, Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem, Switch, IconButton, InputAdornment
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Block as BlockIcon } from '@mui/icons-material';
// import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// import {
//     fetchAllAdminCoupons,
//     createAdminCoupon, // Ghi chú: Bạn cần thêm createAdminCoupon vào file Slice tương tự như createAdminCoupon
//     toggleAdminCouponActive,
//     updateAdminCoupon,
//     getAdminCouponById,
//     toggleAdminCouponDeactivate
// } from '@/redux/slices/couponSlice';
// import type { CreateCouponRequest, CouponResponse } from '@/types/couponTypes';
// import { toast } from 'react-toastify';
// import ConfirmModal from '@/components/general/ConfirmModal';
// import { hasBadWords } from '@/util/profanity';

// const INITIAL_FORM_DATA: CreateCouponRequest = {
//     code: '',
//     discountType: 'FIXED',
//     discountValue: 0,
//     minOrderAmount: 0,
//     maxDiscountAmount: 0,
//     maxUsagePerUser: 0,
//     maxUsage: 1,
//     startDate: '',
//     endDate: ''
// };

// const AdminCouponManagement = () => {
//     const dispatch = useAppDispatch();
//     const { adminCoupons, isLoading, isActionLoading } = useAppSelector(state => state.couponReducer);

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [formData, setFormData] = useState<CreateCouponRequest>(INITIAL_FORM_DATA);

//     // State cho việc ngừng kích hoạt
//     const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//     const [couponToDeactivate, setCouponToDeactivate] = useState<number | null>(null);

//     useEffect(() => {
//         dispatch(fetchAllAdminCoupons());
//     }, [dispatch]);

//     // Format tiền và ngày tháng
//     const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
//     const formatDate = (dateString: string) => new Date(dateString).toLocaleString('vi-VN');



//     // Mở modal Thêm mới
//     const handleOpenAdd = () => {
//         const now = new Date();
//         now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
//         const defaultStartDate = now.toISOString().slice(0, 16);

//         setFormData({
//             ...INITIAL_FORM_DATA,
//             startDate: defaultStartDate
//         });
//         setIsEditing(false);
//         setEditingId(null);
//         setIsModalOpen(true);
//     };

//     // Mở modal Cập nhật (Nếu bạn có thunk updateAdminCoupon)
//     const handleOpenEdit = (coupon: CouponResponse) => {
//         // Strip the 4-char prefix if it exists to show only the user-input part
//         const userPart = coupon.code;

//         setFormData({
//             code: userPart,
//             discountType: coupon.discountType,
//             discountValue: coupon.discountValue,
//             minOrderAmount: coupon.minOrderAmount,
//             maxDiscountAmount: coupon.maxDiscountAmount || 0,
//             maxUsage: coupon.maxUsage,
//             maxUsagePerUser: coupon.maxUsagePerUser,
//             startDate: coupon.startDate.substring(0, 16), // Cắt lấy YYYY-MM-DDThh:mm cho thẻ input datetime-local
//             endDate: coupon.endDate.substring(0, 16)
//         });
//         setIsEditing(true);
//         setEditingId(coupon.couponId);
//         setIsModalOpen(true);
//     };

//     const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const rawValue = e.target.value.replace(/[^\d]/g, '');
//         let numValue = rawValue === '' ? 0 : Number(rawValue);
//         const max = formData.discountType === 'PERCENT' ? 100 : 120000000;
//         if (numValue > max) numValue = max;
//         setFormData({ ...formData, discountValue: numValue });
//     };

//     const handleGenericNumberChange = (field: keyof CreateCouponRequest, max: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const rawValue = e.target.value.replace(/[^\d]/g, '');
//         let numValue = rawValue === '' ? 0 : Number(rawValue);
//         if (numValue > max) numValue = max;
//         setFormData({ ...formData, [field]: numValue });
//     };

//     // Xử lý Submit Form
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (hasBadWords(formData.code)) {
//             toast.error("Mã giảm giá chứa từ ngữ không phù hợp");
//             return;
//         }

//         if (hasBadWords(formData.code)) {
//             toast.error("Mã giảm giá chứa từ ngữ không phù hợp");
//             return;
//         }

//         if (formData.maxUsage < 1) {
//             toast.error("Lượt sử dụng tối thiểu phải là 1");
//             return;
//         }

//         if (formData.discountType === 'PERCENT') {
//             if (formData.discountValue < 1) {
//                 toast.error("Phần trăm giảm phải từ 1%");
//                 return;
//             }
//         } else {
//             if (formData.discountValue < 1000) {
//                 toast.error("Số tiền giảm phải từ 1.000 VNĐ");
//                 return;
//             }
//         }

//         if (formData.minOrderAmount < 0) {
//             toast.error("Đơn tối thiểu không được âm");
//             return;
//         }

//         // Nghiệp vụ: Giảm giá không vượt quá 69% giá trị đơn tối thiểu
//         if (formData.minOrderAmount > 0) {
//             const maxAllowedDiscount = formData.minOrderAmount * 0.69;
//             if (formData.discountType === 'FIXED') {
//                 if (formData.discountValue > maxAllowedDiscount) {
//                     toast.error(`Số tiền giảm không được vượt quá 69% giá trị đơn tối thiểu (${formatCurrency(maxAllowedDiscount)})`);
//                     return;
//                 }
//             } else {
//                 if (formData.discountValue > 69) {
//                     toast.error("Phần trăm giảm không được vượt quá 69%");
//                     return;
//                 }
//                 // Kiểm tra giới hạn giảm tối đa nếu có
//                 if (formData.maxDiscountAmount && formData.maxDiscountAmount > maxAllowedDiscount) {
//                     toast.error(`Số tiền giảm tối đa không được vượt quá 69% giá trị đơn tối thiểu (${formatCurrency(maxAllowedDiscount)})`);
//                     return;
//                 }
//             }
//         }

//         // Kiểm tra logic ngày
//         const now = new Date();
//         now.setSeconds(0, 0);
//         if (new Date(formData.startDate) < now) {
//             toast.error("Thời gian bắt đầu phải lớn hơn thời gian hiện tại");
//             return;
//         }

//         const start = new Date(formData.startDate);
//         const end = new Date(formData.endDate);
//         if (end.getTime() < start.getTime() + 3600000) {
//             toast.error("Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 giờ");
//             return;
//         }

//         const payloadData = { ...formData, code: formData.code };
//         if (payloadData.discountType === 'FIXED') {
//             payloadData.maxDiscountAmount = payloadData.discountValue;
//         }

//         try {
//             if (isEditing && editingId) {
//                 await dispatch(updateAdminCoupon({ id: editingId, data: payloadData })).unwrap();
//                 dispatch(fetchAllAdminCoupons());
//             } else {
//                 await dispatch(createAdminCoupon(payloadData)).unwrap();
//                 dispatch(fetchAllAdminCoupons());
//             }
//             setIsModalOpen(false);
//         } catch (error) {
//             // Lỗi đã được xử lý ở Slice
//         }
//     };

//     const handleToggleActive = (couponId: number) => {
//         dispatch(toggleAdminCouponActive(couponId));
//     };

//     const handleDeactivateClick = (couponId: number) => {
//         setCouponToDeactivate(couponId);
//         setIsConfirmOpen(true);
//     };

//     const handleConfirmDeactivate = async () => {
//         if (couponToDeactivate) {
//             try {
//                 await dispatch(toggleAdminCouponDeactivate(couponToDeactivate)).unwrap();
//                 dispatch(fetchAllAdminCoupons());
//             } catch (error) {
//                 // Lỗi đã báo trong slice
//             } finally {
//                 setIsConfirmOpen(false);
//                 setCouponToDeactivate(null);
//             }
//         }
//     };

//     return (
//         <div className="p-4 lg:p-8 bg-gray-50 min-h-screen animate-fade-in">
//             <div className="max-w-7xl mx-auto">
//                 {/* HEADER */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Mã giảm giá của Shop</h1>
//                         <p className="text-sm text-gray-500 mt-1">Quản lý các chương trình khuyến mãi cho khách hàng</p>
//                     </div>
//                     <Button
//                         variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}
//                         sx={{ bgcolor: '#00927c', '&:hover': { bgcolor: '#007a68' }, borderRadius: '10px', px: 3, py: 1 }}
//                     >
//                         Thêm mã mới
//                     </Button>
//                 </div>

//                 {/* TABLE LIST */}
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
//                                 <th className="px-6 py-4 font-semibold whitespace-nowrap">Mã Code</th>
//                                 <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Giảm giá</th>
//                                 <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Đơn tối thiểu</th>
//                                 <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Thời gian áp dụng</th>
//                                 <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">Tổng số lượt</th>
//                                 <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Lượt đã dùng</th>
//                                 <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Trạng thái</th>
//                                 <th className="px-6 py-4 font-semibold text-center whitespace-nowrap">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {isLoading ? (
//                                 <tr><td colSpan={7} className="text-center py-10"><CircularProgress sx={{ color: '#00927c' }} /></td></tr>
//                             ) : adminCoupons.length === 0 ? (
//                                 <tr><td colSpan={7} className="text-center py-10 text-gray-500">Chưa có mã giảm giá nào</td></tr>
//                             ) : (
//                                 adminCoupons.map((coupon: CouponResponse) => {
//                                     const now = new Date();
//                                     const isStarted = new Date(coupon.startDate) <= now;
//                                     const isExpired = new Date(coupon.endDate) < now;
//                                     return (
//                                         <tr key={coupon.couponId} className={`hover:bg-gray-50 transition-colors ${isExpired ? 'opacity-50 grayscale' : ''}`}>
//                                             <td className="px-6 py-4 whitespace-nowrap font-bold text-[#00927c] text-lg">
//                                                 {coupon.code}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
//                                                 {coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
//                                                 {coupon.discountType === 'PERCENT' && coupon.maxDiscountAmount && (
//                                                     <div className="text-xs text-gray-500 font-normal mt-0.5">
//                                                         (Tối đa {formatCurrency(coupon.maxDiscountAmount)})
//                                                     </div>
//                                                 )}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
//                                                 {formatCurrency(coupon.minOrderAmount)}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
//                                                 <div className="text-gray-900">{formatDate(coupon.startDate)}</div>
//                                                 <div className="text-gray-400">đến</div>
//                                                 <div className={`font-medium ${isExpired ? 'text-gray-500' : 'text-red-600'}`}>
//                                                     {formatDate(coupon.endDate)}
//                                                     {isExpired && <div className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Hết hạn</div>}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <span className="font-bold text-gray-800">{coupon.maxUsage}</span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <span className="font-bold text-gray-800">{coupon.usedCount}</span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 {isStarted && !isExpired ? (
//                                                     <Switch 
//                                                         checked={coupon.isActive} 
//                                                         onChange={() => handleToggleActive(coupon.couponId)} 
//                                                         color="success"
//                                                         disabled={isActionLoading}
//                                                         sx={{
//                                                             '& .MuiSwitch-switchBase.Mui-checked': { color: '#00927c' },
//                                                             '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00927c' },
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     ""
//                                                 )}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                 <IconButton
//                                                     color="primary"
//                                                     onClick={() => !isExpired && handleOpenEdit(coupon)}
//                                                     disabled={isExpired}
//                                                     sx={{
//                                                         color: isExpired ? 'gray' : '#00927c',
//                                                         '&:hover': { bgcolor: isExpired ? 'transparent' : '#ccfbf1' }
//                                                     }}
//                                                 >
//                                                     <EditIcon fontSize="small" />
//                                                 </IconButton>
//                                                 <IconButton
//                                                     color="error"
//                                                     onClick={() => !isExpired && handleDeactivateClick(coupon.couponId)}
//                                                     disabled={isActionLoading || isExpired}
//                                                     title={isExpired ? "Đã hết hạn" : "Ngừng kích hoạt"}
//                                                 >
//                                                     <BlockIcon fontSize="small" />
//                                                 </IconButton>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* MODAL THÊM/SỬA */}
//                 <Dialog
//                     open={isModalOpen}
//                     onClose={() => setIsModalOpen(false)}
//                     fullWidth
//                     maxWidth="sm"
//                     PaperProps={{
//                         sx: {
//                             borderRadius: '20px', // Bo góc mềm mại cho toàn bộ Modal
//                             padding: '4px'        // Tạo độ sâu nhẹ
//                         }
//                     }}
//                 >
//                     <form onSubmit={handleSubmit}>
//                         <DialogTitle className="font-bold text-gray-800 text-xl border-b border-gray-100 pb-4 pt-5 px-6">
//                             {isEditing ? 'Cập nhật mã giảm giá' : 'Thêm mã giảm giá mới'}
//                         </DialogTitle>

//                         <DialogContent className="pt-6 pb-8 px-6">
//                             {/* Sử dụng flex flex-col và gap-6 để ép khoảng cách đều nhau tuyệt đối */}
//                             <div className="flex flex-col gap-6 mt-2">

//                                 {/* Dòng 1: Mã Code */}
//                                 <TextField
//                                     label="Mã giảm giá" fullWidth required
//                                     value={formData.code}
//                                     onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 9) })}
//                                     helperText="Nhập mã giảm giá (tối đa 9 ký tự, chỉ chữ và số)"
//                                     InputProps={{
//                                         sx: { borderRadius: '12px' }
//                                     }}
//                                 />

//                                 {/* Dòng 2: Loại giảm giá & Giá trị */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <TextField
//                                         select label="Loại giảm giá" fullWidth required
//                                         value={formData.discountType}
//                                         onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
//                                         InputProps={{ sx: { borderRadius: '12px' } }}
//                                     >
//                                         <MenuItem value="FIXED">Giảm số tiền cố định</MenuItem>
//                                         <MenuItem value="PERCENT">Giảm theo %</MenuItem>
//                                     </TextField>

//                                     <TextField
//                                         label={formData.discountType === 'PERCENT' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (VNĐ)'}
//                                         type="text" fullWidth required
//                                         value={formData.discountValue === 0 ? '' : (formData.discountType === 'PERCENT' ? formData.discountValue : new Intl.NumberFormat('vi-VN').format(formData.discountValue))}
//                                         onChange={handleDiscountValueChange}
//                                         error={
//                                             formData.discountType === 'PERCENT'
//                                                 ? (formData.discountValue < 1) || formData.discountValue > 69
//                                                 : (formData.discountValue > 120000000 && formData.discountValue < 1000) || (formData.minOrderAmount > 0 && formData.discountValue > formData.minOrderAmount * 0.69)
//                                         }
//                                         helperText={
//                                             formData.discountType === 'PERCENT'
//                                                 ? (formData.discountValue > 69 ? "Tối đa 69% giá trị đơn" : "Phần trăm từ 1% đến 69%")
//                                                 : (formData.minOrderAmount > 0 && formData.discountValue > formData.minOrderAmount * 0.69
//                                                     ? `Tối đa 69% đơn tối thiểu (${formatCurrency(formData.minOrderAmount * 0.69)})`
//                                                     : "Số tiền giảm (tối đa 69% đơn tối thiểu)")
//                                         }
//                                         InputProps={{
//                                             sx: { borderRadius: '12px' },
//                                             endAdornment: formData.discountType === 'PERCENT' ? <InputAdornment position="end">%</InputAdornment> : <InputAdornment position="end">VNĐ</InputAdornment>
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Dòng 3: Đơn tối thiểu & Giảm tối đa */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <TextField
//                                         label="Đơn tối thiểu (VNĐ)" type="text" fullWidth required
//                                         value={new Intl.NumberFormat('vi-VN').format(formData.minOrderAmount)}
//                                         onChange={handleGenericNumberChange('minOrderAmount', 120000000)}
//                                         error={formData.minOrderAmount < 0}
//                                         helperText="Giá trị đơn hàng tối thiểu 0 VNĐ"
//                                         InputProps={{
//                                             sx: { borderRadius: '12px' },
//                                             endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>
//                                         }}
//                                     />
//                                     <TextField
//                                         label="Giảm tối đa (VNĐ)" type="text" fullWidth
//                                         placeholder={formData.discountType === 'PERCENT' ? 'Áp dụng cho giảm %' : 'Không cần nhập'}
//                                         value={!formData.maxDiscountAmount ? '' : new Intl.NumberFormat('vi-VN').format(formData.maxDiscountAmount)}
//                                         onChange={handleGenericNumberChange('maxDiscountAmount', 120000000)}
//                                         disabled={formData.discountType === 'FIXED'}
//                                         error={!!formData.maxDiscountAmount && formData.maxDiscountAmount > 0 && formData.maxDiscountAmount < 1000}
//                                         helperText={formData.discountType === 'PERCENT' ? "Giới hạn số tiền giảm từ 1.000đ" : ""}
//                                         InputProps={{
//                                             sx: { borderRadius: '12px', bgcolor: formData.discountType === 'FIXED' ? '#f3f4f6' : 'transparent' },
//                                             endAdornment: formData.discountType === 'PERCENT' ? <InputAdornment position="end">VNĐ</InputAdornment> : null
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Dòng 4: Cấu hình số lượng */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <TextField
//                                         label="Tổng số lượt sử dụng" type="text" fullWidth required
//                                         value={formData.maxUsage === 0 ? '' : new Intl.NumberFormat('vi-VN').format(formData.maxUsage)}
//                                         onChange={handleGenericNumberChange('maxUsage', 200000)}
//                                         error={formData.maxUsage > 0 && formData.maxUsage < 1}
//                                         helperText="Số lượng mã phát hành từ 1 đến 200.000"
//                                         InputProps={{ sx: { borderRadius: '12px' } }}
//                                     />
//                                     <TextField
//                                         label="Lượt dùng mỗi người" type="number" fullWidth required
//                                         value={formData.maxUsagePerUser === 0 ? '' : formData.maxUsagePerUser}
//                                         onChange={(e) => {
//                                             const val = Number(e.target.value.replace(/[^\d]/g, ''));
//                                             setFormData({ ...formData, maxUsagePerUser: val > 5 ? 5 : val }); // Giới hạn nhập nhanh
//                                         }}
//                                         error={formData.maxUsagePerUser > 0 && (formData.maxUsagePerUser < 1 || formData.maxUsagePerUser > 5)}
//                                         helperText="Mỗi người dùng tối thiểu 1, tối đa 5 lần"
//                                         InputProps={{
//                                             sx: { borderRadius: '12px' },
//                                             inputProps: { min: 1, max: 5 }
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Dòng 5: Thời gian */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <TextField
//                                         label="Ngày bắt đầu" type="datetime-local" fullWidth required
//                                         InputLabelProps={{ shrink: true }}
//                                         value={formData.startDate}
//                                         onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                                         error={formData.startDate !== '' && new Date(formData.startDate) < new Date(new Date().setSeconds(0, 0))}
//                                         helperText={formData.startDate !== '' && new Date(formData.startDate) < new Date(new Date().setSeconds(0, 0)) ? "Thời gian bắt đầu phải lớn hơn thời gian hiện tại" : ""}
//                                         InputProps={{ sx: { borderRadius: '12px' } }}
//                                         inputProps={{
//                                             min: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
//                                         }}
//                                     />
//                                     <TextField
//                                         label="Ngày kết thúc" type="datetime-local" fullWidth required
//                                         InputLabelProps={{ shrink: true }}
//                                         value={formData.endDate}
//                                         onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                                         error={formData.startDate !== '' && formData.endDate !== '' && new Date(formData.endDate).getTime() < new Date(formData.startDate).getTime() + 3600000}
//                                         helperText={formData.startDate !== '' && formData.endDate !== '' && new Date(formData.endDate).getTime() < new Date(formData.startDate).getTime() + 3600000 ? "Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 1 giờ" : ""}
//                                         InputProps={{ sx: { borderRadius: '12px' } }}
//                                         inputProps={{
//                                             min: formData.startDate
//                                                 ? new Date(new Date(formData.startDate).getTime() + 3600000 - new Date(formData.startDate).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
//                                                 : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
//                                         }}
//                                     />
//                                 </div>

//                             </div>
//                         </DialogContent>

//                         <DialogActions className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
//                             <Button
//                                 onClick={() => setIsModalOpen(false)}
//                                 variant="contained"
//                                 sx={{
//                                     color: '#FFFFFF',
//                                     textTransform: 'none', px: 3,
//                                     backgroundColor: '#ef4444',
//                                     borderRadius: '12px',
//                                     py: 1.2,
//                                     fontWeight: 600,
//                                     boxShadow: 'none',
//                                     '&:hover': { backgroundColor: '#dc2626' }
//                                 }}
//                             >
//                                 Hủy bỏ
//                             </Button>
//                             <Button
//                                 type="submit" variant="contained" disabled={isActionLoading}
//                                 sx={{
//                                     bgcolor: '#00927c',
//                                     borderRadius: '12px',
//                                     px: 3,
//                                     py: 1.2,
//                                     textTransform: 'none',
//                                     fontWeight: 600,
//                                     boxShadow: 'none',
//                                     '&:hover': { bgcolor: '#007a68', boxShadow: '0 4px 6px -1px rgb(0 146 124 / 0.2)' }
//                                 }}
//                             >
//                                 {isActionLoading ? <CircularProgress size={24} color="inherit" /> : 'Lưu lại'}
//                             </Button>
//                         </DialogActions>
//                     </form>
//                 </Dialog>

//                 <ConfirmModal
//                     open={isConfirmOpen}
//                     setOpen={setIsConfirmOpen}
//                     title="Xác nhận ngừng kích hoạt"
//                     content="Bạn có chắc chắn muốn ngừng kích hoạt mã giảm giá này? Mã sẽ không thể sử dụng được nữa nhưng lịch sử vẫn được giữ trọn vẹn."
//                     onConfirm={handleConfirmDeactivate}
//                     confirmText="Ngừng kích hoạt"
//                 />
//             </div>
//         </div>
//     );
// };

// export default AdminCouponManagement;