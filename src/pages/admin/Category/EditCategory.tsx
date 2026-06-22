// import React, { useEffect, useState } from 'react';
// import {
//   TextField, MenuItem, FormControl, InputLabel,
//   Select, Button, CircularProgress, Box, Switch, FormControlLabel
// } from '@mui/material';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowBack, KeyboardArrowRight, Save } from '@mui/icons-material';
// import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// import { fetchCategories, updateCategorySlice } from '@/redux/slices/categorySlice';
// import type { CategoryResponse } from '@/types/categoryTypes';
// import { toast } from 'react-toastify';
// import ParentCategoryPicker from '@/components/admin/Category/ParentCategoryPicker';
// import { hasBadWords } from '@/util/profanity';

// interface FlatCategory extends CategoryResponse {
//   displayLevel: number;
// }

// const EditCategory = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { categoryId } = useParams<{ categoryId: string }>();

//   const { categoryTree } = useAppSelector((state) => state.categoryReducer);

//   const [name, setName] = useState('');
//   const [parentId, setParentId] = useState<number | null>(null);
//   const [parentPathText, setParentPathText] = useState<string>('Đang tải...');
//   const [isPickerOpen, setIsPickerOpen] = useState(false);

//   const [isTryOnSupported, setIsTryOnSupported] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isPageLoading, setIsPageLoading] = useState(true);

//   useEffect(() => {
//     if (categoryTree.length === 0) {
//       dispatch(fetchCategories());
//     }
//   }, [dispatch, categoryTree.length]);

//   useEffect(() => {
//     if (categoryTree.length > 0 && categoryId) {
//       let found = false;

//       // Hàm tìm đường dẫn chuỗi (VD: Thời trang > Áo nam) của một ID
//       const findParentPath = (nodes: CategoryResponse[], targetId: string, currentPath = ""): string | null => {
//         for (const node of nodes) {
//           if (node.categoryId.toString() === targetId) {
//             return currentPath ? `${currentPath} > ${node.name}` : node.name;
//           }
//           if (node.children && node.children.length > 0) {
//             const foundChild = findParentPath(node.children, targetId, currentPath ? `${currentPath} > ${node.name}` : node.name);
//             if (foundChild) return foundChild;
//           }
//         }
//         return null;
//       };

//       const findCategoryData = (nodes: CategoryResponse[], currentParentId: string | null = null) => {
//         for (const node of nodes) {
//           if (node.categoryId.toString() === categoryId) {
//             setName(node.name);
//             setParentId(currentParentId ? Number(currentParentId) : null);

//             // Lấy chuỗi hiển thị của danh mục cha
//             if (currentParentId) {
//               const pathString = findParentPath(categoryTree, currentParentId);
//               setParentPathText(pathString || 'Không xác định');
//             } else {
//               setParentPathText('Không có (Làm danh mục gốc)');
//             }

//             setIsTryOnSupported(node.isTryOnSupported);
//             found = true;
//             return;
//           }
//           if (node.children && node.children.length > 0) {
//             findCategoryData(node.children, node.categoryId.toString());
//             if (found) return;
//           }
//         }
//       };

//       findCategoryData(categoryTree);

//       if (!found) {
//         toast.error("Không tìm thấy danh mục này!");
//         navigate('/admin/categories');
//       } else {
//         setIsPageLoading(false);
//       }
//     }
//   }, [categoryTree, categoryId, navigate]);

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

//   // Tính toán cấp độ hiện tại để quyết định có hiện nút Switch "Hỗ trợ thử đồ" không
//   const myLevel = parentId === null ? 0 : getCategoryLevel(categoryTree, parentId) + 1;
//   const isLevel3 = myLevel === 2;

//   const handleConfirmParent = (selectedId: number | null, pathText: string) => {
//     // Chặn không cho danh mục làm cha của chính nó
//     if (selectedId === Number(categoryId)) {
//       toast.error('Danh mục không thể làm cha của chính nó!');
//       return;
//     }
//     setParentId(selectedId);
//     setParentPathText(pathText);

//     // Tự động tắt Try-On nếu danh mục cha mới không làm cho danh mục này thành Cấp 3 nữa
//     const futureLevel = selectedId === null ? 0 : getCategoryLevel(categoryTree, selectedId) + 1;
//     if (futureLevel !== 2) setIsTryOnSupported(false);
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
//       await dispatch(updateCategorySlice({
//         id: Number(categoryId),
//         data: {
//           name: name.trim(),
//           parentId: parentId,
//           isTryOnSupported: isLevel3 ? isTryOnSupported : false,
//         }
//       })).unwrap();

//       dispatch(fetchCategories());
//       navigate('/admin/categories');
//     } catch (error) {
//       // Lỗi đã được xử lý bằng toast trong Thunk
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isPageLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <CircularProgress sx={{ color: '#00927c' }} />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-3xl mx-auto">

//         <div className="flex items-center gap-4 mb-8">
//           <IconButton onClick={() => navigate('/admin/categories')} className="bg-white shadow-sm border border-gray-100 hover:bg-gray-100">
//             <ArrowBack fontSize="small" className="text-gray-600" />
//           </IconButton>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa danh mục</h1>
//             <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cho danh mục</p>
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

//             <Box
//               className="opacity-70"
//             >
//               <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Danh mục cha (Không thể thay đổi)</label>
//               <div
//                 onClick={() => setIsPickerOpen(false)}
//                 className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl cursor-not-allowed transition-colors bg-white"
//               >
//                 <span className={parentId === null ? 'text-gray-800 font-medium' : 'text-[#00927c] font-medium'}>
//                   {parentPathText}
//                 </span>
//                 <KeyboardArrowRight className="text-gray-400" />
//               </div>
//               <p className="text-xs text-gray-400 mt-2 ml-1">Chỉ cho phép đổi tên.</p>
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
//                   color: '#FFFFFF', borderRadius: '0.75rem',
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
//                 {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
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

// export default EditCategory;