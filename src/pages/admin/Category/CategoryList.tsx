// import React, { useState, useEffect } from 'react';
// import { IconButton, CircularProgress, Tooltip, Collapse,
//   Dialog, DialogTitle, Switch,
//   DialogContent,  DialogActions, Button, Typography
//  } from '@mui/material';
// import { Add, Edit, Delete, FolderOpen, Folder, KeyboardArrowRight, KeyboardArrowDown, Segment, WarningAmber, Checkroom } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
// import { fetchCategories, deleteCategorySlice, updateCategorySlice } from '@/redux/slices/categorySlice';
// import type { CategoryResponse } from '@/types/categoryTypes';
// import { toast } from 'react-toastify';

// interface FlatCategory extends CategoryResponse {
//   displayLevel: number;
// }

// const CategoryList = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { categoryTree, loading } = useAppSelector((state) => state.categoryReducer);

//   const [expandedIds, setExpandedIds] = useState<number[]>([]);

//   // --- THÊM STATE QUẢN LÝ POPUP XÓA ---
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleToggleExpand = (categoryId: number) => {
//     setExpandedIds((prev) => 
//       prev.includes(categoryId) 
//         ? prev.filter(id => id !== categoryId) 
//         : [...prev, categoryId]
//     );
//   };

//   const sortCategoryTree = (categories: CategoryResponse[]): CategoryResponse[] => {
//     return [...categories]
//       .sort((a, b) => a.categoryId - b.categoryId)
//       .map(cat => ({
//         ...cat,
//         children: cat.children ? sortCategoryTree(cat.children) : []
//       }));
//   };

//   const sortedCategoryTree = sortCategoryTree(categoryTree);

//   const CategoryRow = ({ category, level = 0, index, parentId = null }: { category: CategoryResponse, level?: number, index?: number; parentId?: number | null}) => {
//     const hasChildren = category.children && category.children.length > 0;
//     const isExpanded = expandedIds.includes(category.categoryId);
//     const [isUpdating, setIsUpdating] = useState(false);

//     const handleToggleTryOn = async (e: React.ChangeEvent<HTMLInputElement>) => {
//       const newValue = e.target.checked;
//       setIsUpdating(true);
//       try {
//         await dispatch(updateCategorySlice({
//           id: category.categoryId,
//           data: {
//             name: category.name,
//             parentId: parentId, 
//             isTryOnSupported: newValue,
//           }
//         })).unwrap();
//         // Cập nhật lại list sau khi đổi thành công
//         dispatch(fetchCategories());
//       } catch (error) {
//         // Lỗi đã có toast trong thunk xử lý
//       } finally {
//         setIsUpdating(false);
//       }
//     };

//     return (
//       <React.Fragment>
//         <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
//           <td className="px-6 py-4 font-medium text-gray-500 w-24 text-center">
//             {level === 0 && index !== undefined ? index + 1 : ""}
//           </td>

//           <td className="px-6 py-4">
//             <div 
//               className="flex items-center"
//               style={{ paddingLeft: `${level * 2}rem` }}
//             >
//               <div className="w-8 flex justify-center">
//                 {hasChildren ? (
//                   <IconButton 
//                     size="small" 
//                     onClick={() => handleToggleExpand(category.categoryId)}
//                     sx={{ p: 0.5 }}
//                   >
//                     {isExpanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
//                   </IconButton>
//                 ) : (
//                   <span className="w-8"></span> 
//                 )}
//               </div>

//               {level === 0 ? (
//                 <FolderOpen className="text-blue-500 mr-2" fontSize="small" />
//               ) : level === 1 ? (
//                 <Folder className="text-emerald-500 mr-2" fontSize="small" />
//               ) : (
//                 <Segment className="text-amber-500 mr-2" fontSize="small" />
//               )}
              
//               <span className={`${level === 0 ? 'font-semibold text-gray-800' : 'text-gray-600'} cursor-pointer`}
//                     onClick={() => hasChildren && handleToggleExpand(category.categoryId)}>
//                 {category.name}
//               </span>
//             </div>
//           </td>

//           <td className="px-6 py-4 text-center w-32">
//             <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border
//               ${level === 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 
//                 level === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
//                 'bg-amber-50 text-amber-700 border-amber-100'}`}
//             >
//               Cấp {level + 1}
//             </span>
//           </td>

//           <td className="px-6 py-4 text-center w-40">
//             {level === 2 ? (
//               <div className="flex items-center justify-center gap-2">
//                 <Switch 
//                   checked={category.isTryOnSupported} 
//                   onChange={handleToggleTryOn}
//                   disabled={isUpdating}
//                   size="small"
//                   sx={{
//                     '& .MuiSwitch-switchBase.Mui-checked': { color: '#00927c' },
//                     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00927c' },
//                   }}
//                 />
//                 {isUpdating && <CircularProgress size={14} sx={{ color: '#00927c' }} />}
//               </div>
//             ) : (
//               <span className="text-gray-300">-</span>
//             )}
//           </td>

//           <td className="px-6 py-4 text-center w-32">
//             <div className="flex items-center justify-center gap-1">
//               <Tooltip title="Chỉnh sửa" arrow>
//                 <IconButton 
//                   onClick={() => navigate(`/admin/categories/edit/${category.categoryId}`)}
//                   size="small"
//                   sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
//                 >
//                   <Edit fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Xóa" arrow>
//                 <IconButton 
//                   onClick={() => handleDeleteClick(category.categoryId)}
//                   size="small"
//                   sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
//                 >
//                   <Delete fontSize="small" />
//                 </IconButton>
//               </Tooltip>
//             </div>
//           </td>
//         </tr>

//         {hasChildren && (
//           <tr>
//             <td colSpan={5} className="p-0 border-0">
//               <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                 <table className="w-full text-left border-collapse">
//                   <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
//                     {category.children.map((child: CategoryResponse) => (
//                       <CategoryRow key={child.categoryId} category={child} level={level + 1} />
//                     ))}
//                   </tbody>
//                 </table>
//               </Collapse>
//             </td>
//           </tr>
//         )}
//       </React.Fragment>
//     );
//   };

// // Mở popup xác nhận thay vì dùng window.confirm
//   const handleDeleteClick = (id: number) => {
//     setItemToDelete(id);
//     setDeleteModalOpen(true);
//   };

//   const executeDelete = async () => {
//     if (!itemToDelete) return;
//     setIsDeleting(true);

//     try {
//       // Sử dụng Redux Thunk
//       await dispatch(deleteCategorySlice(itemToDelete));
//       // toast.success("Đã gỡ danh mục khỏi trang chủ");
//       dispatch(fetchCategories());
//     } catch (error) {
//       console.error('Lỗi xóa', error);
//       toast.error("Không thể gỡ danh mục lúc này!");
//     } finally {
//       setIsDeleting(false);
//       setDeleteModalOpen(false);
//       setItemToDelete(null);
//     }
//   };

//   return (
//     <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
//             <p className="text-sm text-gray-500 mt-1">Xem, thêm, sửa, xóa cấu trúc danh mục sản phẩm của hệ thống</p>
//           </div>
//           <button
//             onClick={() => navigate('/admin/categories/add')}
//             className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
//           >
//             <Add fontSize="small" />
//             Thêm danh mục
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
//                   <th className="px-6 py-4 font-semibold w-24 text-center">STT</th>
//                   <th className="px-6 py-4 font-semibold">Tên Danh Mục</th>
//                   <th className="px-6 py-4 font-semibold w-32 text-center">Cấp Độ</th>
//                   <th className="px-6 py-4 font-semibold w-40 text-center">Tính Năng</th>
//                   <th className="px-6 py-4 font-semibold w-32 text-center">Thao Tác</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={4} className="px-6 py-12 text-center">
//                       <CircularProgress size={32} sx={{ color: '#00927c' }} />
//                       <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
//                     </td>
//                   </tr>
//                 ) : sortedCategoryTree.length > 0 ? (
//                   sortedCategoryTree.map((cat, index) => (
//                     <CategoryRow key={cat.categoryId} category={cat} level={0} index={index} />
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
//                         <p className="text-gray-500 font-medium">Chưa có danh mục nào</p>
//                         <p className="text-gray-400 text-sm mt-1">Bấm "Thêm danh mục" để bắt đầu cấu trúc gian hàng của bạn.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* POPUP XÁC NHẬN XÓA */}
//       <Dialog 
//         open={deleteModalOpen} 
//         onClose={() => !isDeleting && setDeleteModalOpen(false)} 
//         fullWidth 
//         maxWidth="xs"
//         PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
//       >
//         <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
//           <WarningAmber sx={{ fontSize: 48, color: '#ef4444' }} />
//           <Typography variant="h6" fontWeight="bold" color="text.primary">
//             Xác nhận gỡ danh mục
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary" textAlign="center">
//             Bạn có chắc chắn muốn gỡ danh mục này khỏi Trang chủ không?
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
//           <Button 
//             onClick={() => setDeleteModalOpen(false)} 
//             variant="outlined"
//             disabled={isDeleting}
//             sx={{ 
//               color: '#FFFFFF', borderColor: '#d1d5db', textTransform: 'none', px: 3,
//               fontWeight: 'bold', fontSize: '14px',
//               '&:hover': { 
//                 borderColor: "#007a68",
//                 bgcolor:"#007a68" }
//             }}
//           >
//             Hủy
//           </Button>
//           <Button 
//             onClick={executeDelete} 
//             variant="contained" 
//             disabled={isDeleting}
//             sx={{ 
//               backgroundColor: '#ef4444', textTransform: 'none', px: 3,
//               fontWeight: 'bold', fontSize: '14px',
//               '&:hover': { backgroundColor: '#dc2626' }
//             }}
//           >
//             {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Xóa ngay"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//     </div>
//   );
// };

// export default CategoryList;