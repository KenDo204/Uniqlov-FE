// import React, { useEffect, useState } from 'react';
// import {
//   TextField, MenuItem, FormControl, InputLabel,
//   Select, Button, CircularProgress, Box, Switch, FormControlLabel
// } from '@mui/material';
// import type { SelectChangeEvent } from '@mui/material/Select';
// import { useNavigate } from 'react-router-dom';
// import { ArrowBack, KeyboardArrowRight, Save } from '@mui/icons-material';
// import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// import { fetchCategories, createCategorySlice } from '@/redux/slices/categorySlice';
// import type { CategoryResponse } from '@/types/categoryTypes';
// import { toast } from 'react-toastify';
// import ParentCategoryPicker from '@/components/admin/Category/ParentCategoryPicker';
// import { hasBadWords } from '@/util/profanity';

// interface FlatCategory extends CategoryResponse {
//   displayLevel: number;
// }

// const AddCategory = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const { categoryTree } = useAppSelector((state) => state.categoryReducer);

//   const [name, setName] = useState('');
//   const [parentId, setParentId] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isPickerOpen, setIsPickerOpen] = useState(false);
//   const [parentPathText, setParentPathText] = useState<string>('Không có (Làm danh mục gốc)');
//   const [isTryOnSupported, setIsTryOnSupported] = useState(false);

//   useEffect(() => {
//     if (categoryTree.length === 0) {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categoryTree.length]);

//   const getCategoryLevel = (categories: any[], id: number | null, currentLevel = 0): number => {
//     if (id === null) return 0;
//     for (const cat of categories) {
//       if (cat.categoryId === id) return currentLevel;
//       if (cat.children && cat.children.length > 0) {
//         const childLevel = getCategoryLevel(cat.children, id, currentLevel + 1);
//         if (childLevel !== -1) return childLevel;
//       }
//     }
//     return -1;
//   };

//   const myLevel = parentId === null ? 0 : getCategoryLevel(categoryTree, parentId) + 1;
//   const isLevel3 = myLevel === 2;

//   const handleConfirmParent = (selectedId: number | null, pathText: string) => {
//     setParentId(selectedId);
//     setParentPathText(pathText);
//     if (!isLevel3) setIsTryOnSupported(false); // Reset try-on nếu không còn là cấp 3
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!name.trim()) {
//       toast.error('Vui lòng nhập tên danh mục');
//       return;
//     }

//     if (hasBadWords(name)) {
//       toast.error('Tên danh mục chứa từ ngữ không phù hợp');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       // Sử dụng Redux Thunk
//       await dispatch(createCategorySlice({
//         name: name.trim(),
//         parentId: parentId,
//         isTryOnSupported: isTryOnSupported,
//       })).unwrap();

//       dispatch(fetchCategories());
//       navigate('/admin/categories');
//     } catch (error) {
//       // Lỗi đã được xử lý trong Thunk bằng toast
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-3xl mx-auto">

//         <div className="flex items-center gap-4 mb-8">
//           <IconButton onClick={() => navigate('/admin/categories')} className="bg-white shadow-sm border border-gray-100 hover:bg-gray-100">
//             <ArrowBack fontSize="small" className="text-gray-600" />
//           </IconButton>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Thêm danh mục mới</h1>
//             <p className="text-sm text-gray-500 mt-1">Tạo một danh mục để phân loại sản phẩm của bạn</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <Box>
//               <TextField
//                 fullWidth
//                 label="Tên danh mục"
//                 variant="outlined"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="VD: Thời trang Nam, Áo sơ mi, Laptop..."
//                 required
//                 sx={{
//                   backgroundColor: 'white',
//                   borderRadius: '0.75rem',
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: '0.75rem',
//                     transition: 'all 0.3s ease',
//                     cursor: 'pointer',

//                     '&:hover fieldset': {
//                       borderColor: '#00927c',
//                     },

//                     '&.Mui-focused fieldset': {
//                       borderColor: '#00927c',
//                       borderWidth: '2px',
//                     },
//                   },
//                   '& .MuiInputLabel-root.Mui-focused': {
//                     color: '#00927c',
//                   },
//                 }}
//               />
//             </Box>

//             <Box>
//               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Danh mục cha</label>
//               <div
//                 onClick={() => setIsPickerOpen(true)}
//                 className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-[#00927c] transition-colors bg-white"
//               >
//                 <span className={parentId === null ? 'text-gray-800 font-medium' : 'text-[#00927c] font-medium'}>
//                   {parentPathText}
//                 </span>
//                 <KeyboardArrowRight className="text-gray-400" />
//               </div>
//               <p className="text-xs text-gray-400 mt-2 ml-1">Nhấp vào khung trên để mở bảng chọn danh mục.</p>
//             </Box>

//             {isLevel3 && (
//               <Box className="ml-1">
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={isTryOnSupported}
//                       onChange={(e) => setIsTryOnSupported(e.target.checked)}
//                       color="primary"
//                       sx={{
//                         '& .MuiSwitch-switchBase.Mui-checked': {
//                           color: '#00927c',
//                         },
//                         '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                           backgroundColor: '#00927c',
//                         },
//                       }}
//                     />
//                   }
//                   label={
//                     <div>
//                       <span className="text-gray-800 font-medium">Hỗ trợ thử đồ</span>
//                       <p className="text-xs text-gray-500 m-0">Kích hoạt tính năng ướm thử sản phẩm cho danh mục này</p>
//                     </div>
//                   }
//                 />
//               </Box>
//             )}

//             <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
//               <Button
//                 variant="outlined"
//                 onClick={() => navigate('/admin/categories')}
//                 sx={{
//                   color: '#FFFFFF',
//                   borderColor: '#d1d5db', textTransform: 'none', px: 3,
//                   backgroundColor: '#ef4444',
//                   fontWeight: 'bold', fontSize: '14px',
//                   '&:hover': { backgroundColor: '#dc2626' }
//                 }}
//               >
//                 Hủy bỏ
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={isSubmitting}
//                 startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
//                 sx={{
//                   bgcolor: '#00927c', borderRadius: '0.75rem',
//                   textTransform: 'none', px: 4, boxShadow: 'none',
//                   fontWeight: 'bold', fontSize: '14px',
//                   '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
//                 }}
//               >
//                 {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <ParentCategoryPicker
//         open={isPickerOpen}
//         onClose={() => setIsPickerOpen(false)}
//         categoryTree={categoryTree}
//         onConfirm={handleConfirmParent}
//       />

//     </div>
//   );
// };

// const IconButton = ({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${className}`}
//   >
//     {children}
//   </button>
// );

// export default AddCategory;