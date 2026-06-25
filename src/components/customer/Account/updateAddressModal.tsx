// import React, { useState, useEffect, type Dispatch, type SetStateAction, type FormEvent } from 'react';
// import type { UpdateAddressRequest, Address } from '@/types/addressesTypes';
// import type { Province, District, Ward } from '@/types/ghnTypes';
// import { ghnService } from '@/services/ghnService';
// import { useDispatch } from 'react-redux';
// import { fetchAddresses, fetchDefaultAddress, updateAddress } from '@/redux/slices/addressesSlice';
// import { addressSchema } from '@/schema/addressSchema';
// import { toast } from 'react-toastify';
// import { hasBadWords } from '@/util/profanity';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     FormControlLabel,
//     Checkbox,
//     MenuItem,
//     Stack,
//     Box
// } from '@mui/material';

// interface UpdateAddressModalProps {
//     open: boolean;
//     setOpen: Dispatch<SetStateAction<boolean>>;
//     address: Address | null;
// }

// const UpdateAddressModal = ({ open, setOpen, address }: UpdateAddressModalProps) => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const dispatch = useDispatch<any>();

//     const [recipientName, setRecipientName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [addressDetail, setAddressDetail] = useState('');
//     const [isDefault, setIsDefault] = useState(false);

//     const [provinces, setProvinces] = useState<Province[]>([]);
//     const [districts, setDistricts] = useState<District[]>([]);
//     const [wards, setWards] = useState<Ward[]>([]);

//     const [selectedProvince, setSelectedProvince] = useState<number | ''>('');
//     const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('');
//     const [selectedWard, setSelectedWard] = useState<string | ''>('');

//     const [errors, setErrors] = useState<Record<string, string>>({});

//     useEffect(() => {
//         if (open && address) {
//             fetchProvinces();
//             fetchDistricts(address.provinceId);
//             fetchWards(address.districtId);

//             setRecipientName(address.recipientName);
//             setPhone(address.phone);
//             setAddressDetail(address.addressDetail);
//             setIsDefault(address.isDefault);
//             setSelectedProvince(address.provinceId);
//             setSelectedDistrict(address.districtId);
//             setSelectedWard(address.wardCode);
//             setErrors({});
//         } else if (!open) {
//             setRecipientName('');
//             setPhone('');
//             setAddressDetail('');
//             setIsDefault(false);
//             setSelectedProvince('');
//             setSelectedDistrict('');
//             setSelectedWard('');
//             setDistricts([]);
//             setWards([]);
//             setErrors({});
//         }
//     }, [open, address]);

//     const fetchProvinces = async () => {
//         try {
//             // @ts-ignore
//             const response = await ghnService.getProvinces();
//             setProvinces(response?.data || response || []);
//         } catch (error) {
//             console.error(error);
//             toast.error("Lỗi khi tải danh sách Tỉnh/Thành phố");
//         }
//     };

//     const fetchDistricts = async (provinceId: number) => {
//         try {
//             // @ts-ignore
//             const response = await ghnService.getDistricts(provinceId);
//             setDistricts(response?.data || response || []);
//         } catch (error) {
//             console.error(error);
//             toast.error("Lỗi khi tải danh sách Quận/Huyện");
//         }
//     };

//     const fetchWards = async (districtId: number) => {
//         try {
//             // @ts-ignore
//             const response = await ghnService.getWards(districtId);
//             setWards(response?.data || response || []);
//         } catch (error) {
//             console.error(error);
//             toast.error("Lỗi khi tải danh sách Phường/Xã");
//         }
//     };

//     const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const pId = Number(e.target.value);
//         setSelectedProvince(pId);
//         setSelectedDistrict('');
//         setSelectedWard('');
//         setWards([]);
//         fetchDistricts(pId);
//     };

//     const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const dId = Number(e.target.value);
//         setSelectedDistrict(dId);
//         setSelectedWard('');
//         fetchWards(dId);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();

//         if (!address?.addressId) return;

//         if (hasBadWords(recipientName || "")) {
//             toast.error("Tên người nhận chứa từ ngữ không phù hợp!");
//             return;
//         }

//         if (hasBadWords(addressDetail || "")) {
//             toast.error("Địa chỉ chi tiết chứa từ ngữ không phù hợp!");
//             return;
//         }

//         setErrors({});

//         const validationResult = addressSchema.safeParse({
//             recipientName,
//             phone,
//             provinceId: selectedProvince === '' ? undefined : Number(selectedProvince),
//             districtId: selectedDistrict === '' ? undefined : Number(selectedDistrict),
//             wardCode: selectedWard === '' ? undefined : String(selectedWard),
//             addressDetail
//         });

//         if (!validationResult.success) {
//             const formattedErrors: Record<string, string> = {};
//             validationResult.error.issues.forEach(issue => {
//                 formattedErrors[String(issue.path[0])] = issue.message;
//             });
//             setErrors(formattedErrors);
//             toast.warning("Vui lòng kiểm tra lại thông tin");
//             return;
//         }

//         const data: UpdateAddressRequest = {
//             recipientName,
//             phone,
//             provinceId: Number(selectedProvince),
//             districtId: Number(selectedDistrict),
//             wardCode: String(selectedWard),
//             addressDetail,
//             isDefault
//         };

//         const result = await dispatch(updateAddress({ id: address.addressId, data }));
//         if (updateAddress.fulfilled.match(result)) {
//             setOpen(false);
//         }
//         dispatch(fetchDefaultAddress());
//         dispatch(fetchAddresses());
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//             <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', mb: 2 }}>
//                 Cập nhật địa chỉ
//             </DialogTitle>
//             <form onSubmit={handleSubmit}>
//                 <DialogContent sx={{ pt: 1 }}>
//                     <Stack spacing={3}>
//                         <Box sx={{ display: 'flex', gap: 2 }}>
//                             <TextField
//                                 label="Họ và tên"
//                                 value={recipientName}
//                                 onChange={(e) => setRecipientName(e.target.value)}
//                                 fullWidth
//                                 size="small"
//                                 error={!!errors.recipientName}
//                                 helperText={errors.recipientName}
//                             />
//                             <TextField
//                                 label="Số điện thoại"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 fullWidth
//                                 size="small"
//                                 type="tel"
//                                 error={!!errors.phone}
//                                 helperText={errors.phone}
//                             />
//                         </Box>

//                         <TextField
//                             select
//                             label="Tỉnh/Thành phố"
//                             value={provinces.some(p => p.ProvinceID === selectedProvince) ? selectedProvince : ''}
//                             onChange={handleProvinceChange}
//                             fullWidth
//                             size="small"
//                             error={!!errors.provinceId}
//                             helperText={errors.provinceId}
//                         >
//                             <MenuItem value="" disabled>
//                                 Tỉnh/Thành phố
//                             </MenuItem>
//                             {Array.isArray(provinces) && provinces.map((p) => (
//                                 <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
//                                     {p.ProvinceName}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         <TextField
//                             select
//                             label="Quận/Huyện"
//                             value={districts.some(d => d.DistrictID === selectedDistrict) ? selectedDistrict : ''}
//                             onChange={handleDistrictChange}
//                             fullWidth
//                             size="small"
//                             disabled={!selectedProvince}
//                             error={!!errors.districtId}
//                             helperText={errors.districtId}
//                         >
//                             <MenuItem value="" disabled>
//                                 Quận/Huyện
//                             </MenuItem>
//                             {Array.isArray(districts) && districts.map((d) => (
//                                 <MenuItem key={d.DistrictID} value={d.DistrictID}>
//                                     {d.DistrictName}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         <TextField
//                             select
//                             label="Phường/Xã"
//                             value={wards.some(w => w.WardCode === selectedWard) ? selectedWard : ''}
//                             onChange={(e) => setSelectedWard(e.target.value)}
//                             fullWidth
//                             size="small"
//                             disabled={!selectedDistrict}
//                             error={!!errors.wardCode}
//                             helperText={errors.wardCode}
//                         >
//                             <MenuItem value="" disabled>
//                                 Phường/Xã
//                             </MenuItem>
//                             {Array.isArray(wards) && wards.map((w) => (
//                                 <MenuItem key={w.WardCode} value={w.WardCode}>
//                                     {w.WardName}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         <TextField
//                             label="Địa chỉ cụ thể"
//                             value={addressDetail}
//                             onChange={(e) => setAddressDetail(e.target.value)}
//                             fullWidth
//                             multiline
//                             rows={3}
//                             size="small"
//                             placeholder="Số nhà, đường, ngõ..."
//                             error={!!errors.addressDetail}
//                             helperText={errors.addressDetail}
//                         />

//                         <FormControlLabel
//                             control={
//                                 <Checkbox
//                                     checked={isDefault}
//                                     onChange={(e) => setIsDefault(e.target.checked)}
//                                     color="primary"
//                                     sx={{
//                                         color: 'rgba(0, 0, 0, 0.6)',
//                                         '&.Mui-checked': {
//                                             color: '#ee4d2d',
//                                         },
//                                     }}
//                                 />
//                             }
//                             label="Đặt làm địa chỉ mặc định"
//                         />
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions sx={{ px: 3, pb: 2 }}>
//                     <Button
//                         onClick={handleClose}
//                         color="inherit"
//                         sx={{ textTransform: 'uppercase', minWidth: 140 }}
//                     >
//                         Trở lại
//                     </Button>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         disableElevation
//                         sx={{
//                             textTransform: 'uppercase',
//                             bgcolor: '#ee4d2d',
//                             minWidth: 140,
//                             '&:hover': { bgcolor: '#d73211' }
//                         }}
//                     >
//                         Hoàn thành
//                     </Button>
//                 </DialogActions>
//             </form>
//         </Dialog>
//     );
// }

// export default UpdateAddressModal;
