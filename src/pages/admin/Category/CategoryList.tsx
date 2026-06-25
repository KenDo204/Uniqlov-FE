import React, { useState, useEffect, useMemo } from 'react';
import { 
  IconButton, CircularProgress, Tooltip,
  Dialog, DialogTitle, Switch, DialogContent, DialogActions, 
  Button, Typography 
} from '@mui/material';
import { 
  Add, Edit, Delete, FolderOpen, Folder, 
  KeyboardArrowRight, KeyboardArrowDown, Segment, WarningAmber 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '@/hooks/useCategory';
import type { CategoryResponse } from '@/types/category';
import { toast } from 'react-toastify';
import CustomPagination from '@/components/general/Pagination';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const { 
    categories, 
    isFetching: loading, 
    fetchAdminCategories, 
    deleteCategory, 
    updateCategory 
  } = useCategory();

  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdminCategories().catch((err) => {
      console.error('Lỗi fetch danh mục:', err);
      toast.error('Không thể tải danh sách danh mục');
    });
  }, [fetchAdminCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categories]);

  const handleToggleExpand = (categoryId: number) => {
    setExpandedIds((prev) => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const sortCategoryTree = (nodes: CategoryResponse[]): CategoryResponse[] => {
    return [...nodes]
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.categoryId - b.categoryId)
      .map(cat => ({
        ...cat,
        children: cat.children ? sortCategoryTree(cat.children) : []
      }));
  };

  const sortedCategoryTree = sortCategoryTree(categories || []);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCategoryTree.slice(start, start + itemsPerPage);
  }, [sortedCategoryTree, currentPage]);

  const CategoryRow = ({ 
    category, 
    level = 0, 
    index
  }: { 
    category: CategoryResponse; 
    level?: number; 
    index?: number;
  }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.categoryId);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggleStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setIsUpdating(true);
      try {
        await updateCategory(category.categoryId, {
          categoryName: category.categoryName,
          categoryStatus: isChecked ? 1 : 0,
          iconUrl: category.iconUrl,
          targetDemographic: category.targetDemographic,
          categoryType: category.categoryType,
          displayOrder: category.displayOrder
        });
        toast.success(`Đã cập nhật trạng thái hoạt động: ${category.categoryName}`);
        fetchAdminCategories();
      } catch (error: any) {
        toast.error(error || 'Cập nhật trạng thái thất bại');
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <React.Fragment>
        <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
          <td className="px-6 py-4 font-medium text-gray-500 w-24 text-center">
            {level === 0 && index !== undefined ? index + 1 : ""}
          </td>

          <td className="px-6 py-4">
            <div 
              className="flex items-center"
              style={{ paddingLeft: `${level * 2}rem` }}
            >
              <div className="w-8 flex justify-center">
                {hasChildren ? (
                  <IconButton 
                    size="small" 
                    onClick={() => handleToggleExpand(category.categoryId)}
                    sx={{ p: 0.5 }}
                  >
                    {isExpanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
                  </IconButton>
                ) : (
                  <span className="w-8"></span> 
                )}
              </div>

              {level === 0 ? (
                <FolderOpen className="text-blue-500 mr-2" fontSize="small" />
              ) : level === 1 ? (
                <Folder className="text-emerald-500 mr-2" fontSize="small" />
              ) : (
                <Segment className="text-amber-500 mr-2" fontSize="small" />
              )}
              
              <span 
                className={`${level === 0 ? 'font-semibold text-gray-800' : 'text-gray-600'} cursor-pointer hover:text-[#00927c] transition-colors`}
                onClick={() => hasChildren && handleToggleExpand(category.categoryId)}
              >
                {category.categoryName}
              </span>
            </div>
          </td>

          <td className="px-6 py-4 text-center w-32">
            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border
              ${level === 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                level === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                'bg-amber-50 text-amber-700 border-amber-100'}`}
            >
              Cấp {level + 1}
            </span>
          </td>

          <td className="px-6 py-4 text-center w-40">
            <div className="flex items-center justify-center gap-2">
              <Switch 
                checked={category.categoryStatus === 1} 
                onChange={handleToggleStatus}
                disabled={isUpdating}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#00927c' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00927c' },
                }}
              />
              {isUpdating && <CircularProgress size={14} sx={{ color: '#00927c' }} />}
            </div>
          </td>

          <td className="px-6 py-4 text-center w-32">
            <div className="flex items-center justify-center gap-1">
              <Tooltip title="Chỉnh sửa" arrow>
                <IconButton 
                  onClick={() => navigate(`/admin/categories/edit/${category.categoryId}`)}
                  size="small"
                  sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa" arrow>
                <IconButton 
                  onClick={() => handleDeleteClick(category.categoryId)}
                  size="small"
                  sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </td>
        </tr>

        {hasChildren && isExpanded && (
          <React.Fragment>
            {category.children.map((child: CategoryResponse) => (
              <CategoryRow 
                key={child.categoryId} 
                category={child} 
                level={level + 1} 
              />
            ))}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      await deleteCategory(itemToDelete);
      toast.success("Xóa danh mục thành công!");
      fetchAdminCategories();
    } catch (error: any) {
      console.error('Lỗi xóa', error);
      toast.error(error || "Không thể xóa danh mục lúc này!");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý danh mục</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Xem, thêm, sửa, xóa cấu trúc danh mục sản phẩm của hệ thống</p>
          </div>
          <button
            onClick={() => navigate('/admin/categories/add')}
            className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium border-none cursor-pointer transition-colors shadow-sm"
          >
            <Add fontSize="small" />
            Thêm danh mục
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-24 text-center">STT</th>
                  <th className="px-6 py-4 font-semibold">Tên Danh Mục</th>
                  <th className="px-6 py-4 font-semibold w-32 text-center text-nowrap">Cấp Độ</th>
                  <th className="px-6 py-4 font-semibold w-40 text-center text-nowrap">Hoạt động</th>
                  <th className="px-6 py-4 font-semibold w-32 text-center text-nowrap">Thao Tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat, index) => (
                    <CategoryRow 
                      key={cat.categoryId} 
                      category={cat} 
                      level={0} 
                      index={(currentPage - 1) * itemsPerPage + index} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                        <p className="text-gray-500 font-medium m-0">Chưa có danh mục nào</p>
                        <p className="text-gray-400 text-sm mt-1 m-0">Bấm "Thêm danh mục" để bắt đầu cấu trúc gian hàng của bạn.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(sortedCategoryTree.length / itemsPerPage)}
            totalItems={sortedCategoryTree.length}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* POPUP XÁC NHẬN XÓA */}
      <Dialog 
        open={deleteModalOpen} 
        onClose={() => { if (!isDeleting) setDeleteModalOpen(false); }} 
        fullWidth 
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <WarningAmber sx={{ fontSize: 48, color: '#ef4444' }} />
          <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
            Xác nhận xóa danh mục
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Bạn có chắc chắn muốn xóa danh mục này khỏi hệ thống không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button 
            onClick={() => setDeleteModalOpen(false)} 
            variant="outlined"
            disabled={isDeleting}
            sx={{ 
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '14px',
              '&:hover': { 
                borderColor: "#9ca3af",
                bgcolor: "#f9fafb" }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={executeDelete} 
            variant="contained" 
            disabled={isDeleting}
            sx={{ 
              backgroundColor: '#ef4444', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '14px',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            {isDeleting ? <CircularProgress size={20} color="inherit" /> : "Xóa ngay"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryList;