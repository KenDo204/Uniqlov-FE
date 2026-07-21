import React, { useState, useEffect } from 'react';
import {
  IconButton, CircularProgress, Tooltip,
  Dialog, DialogTitle, Switch, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';
import { Add, Edit, Delete, WarningAmber, OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSlider } from '@/hooks/useSlider';
import { toast } from 'react-toastify';
import CustomPagination from '@/components/general/Pagination';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import { useAuth } from '@/hooks/useAuth';

const SliderList: React.FC = () => {
  const navigate = useNavigate();
  const {
    sliders,
    isFetching,
    loadAdminSliders,
    removeSlider,
    editSlider
  } = useSlider();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { hasPermission } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadAdminSliders({ page: currentPage - 1, size: itemsPerPage }).catch((err) => {
      console.error('Lỗi fetch slider:', err);
      toast.error('Không thể tải danh sách slider');
    });
  }, [loadAdminSliders, currentPage]);

  const confirmDelete = (sliderId: number) => {
    setItemToDelete(sliderId);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (itemToDelete === null) return;
    setIsDeleting(true);
    try {
      await removeSlider(itemToDelete);
      toast.success('Đã xóa slider thành công!');
      // Reload current page or previous page if empty
      loadAdminSliders({ page: currentPage - 1, size: itemsPerPage });
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error || 'Xóa slider thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (sliderId: number, currentData: any, isChecked: boolean) => {
    try {
      await editSlider(sliderId, {
        imageUrl: currentData.imageUrl,
        targetUrl: currentData.targetUrl,
        displayOrder: currentData.displayOrder,
        isActive: isChecked
      });
      toast.success('Đã cập nhật trạng thái hoạt động');
      loadAdminSliders({ page: currentPage - 1, size: itemsPerPage });
    } catch (error: any) {
      toast.error(error || 'Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý Slider</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">
              Cập nhật hình ảnh banner trình chiếu trên trang chủ
            </p>
          </div>
          <PermissionGuard permission="slider:create">
            <Button
              onClick={() => navigate('/admin/sliders/add')}
              variant="contained"
              sx={{
                bgcolor: 'var(--color-theme)', textTransform: 'none', px: 3, py: 1.2,
                fontWeight: 'bold', fontSize: '14px', borderRadius: '12px', boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--color-theme-hover)', boxShadow: 'none' }
              }}
            >
              <Add fontSize="medium" />
              Thêm Slider mới
            </Button>
          </PermissionGuard>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">STT</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Đường dẫn đích</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thứ tự</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Hiển thị</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isFetching && (!sliders || sliders.content.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <CircularProgress size={40} sx={{ color: 'var(--color-theme)' }} />
                      <p className="text-gray-500 mt-4 text-sm m-0">Đang tải dữ liệu...</p>
                    </td>
                  </tr>
                ) : !sliders || sliders.content.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <WarningAmber className="text-gray-400" fontSize="large" />
                        </div>
                        <p className="text-gray-500 font-medium m-0">Chưa có slider nào được cấu hình</p>
                        <p className="text-sm text-gray-400 m-0 mt-1">Bấm "Thêm Slider mới" để tạo slider đầu tiên.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sliders.content.map((slider, index) => (
                    <tr key={slider.sliderId} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-500 text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-40 h-16 rounded overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1 relative group">
                          <img 
                            src={slider.imageUrl} 
                            alt="Slider" 
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x150?text=No+Image';
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {slider.targetUrl ? (
                          <a 
                            href={slider.targetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-theme hover:underline flex items-center gap-1"
                          >
                            <span className="truncate max-w-[200px] inline-block" title={slider.targetUrl}>{slider.targetUrl}</span>
                            <OpenInNew fontSize="inherit" />
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Trống</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                          {slider.displayOrder}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center w-40">
                        <Switch
                          checked={slider.isActive}
                          disabled={!hasPermission('slider:update')}
                          onChange={(e) => handleToggleStatus(slider.sliderId, slider, e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-theme)' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--color-theme)' },
                          }}
                        />
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <PermissionGuard permission="slider:update">
                            <Tooltip title="Chỉnh sửa Slider" arrow>
                              <IconButton 
                                size="small" 
                                onClick={() => navigate(`/admin/sliders/edit/${slider.sliderId}`)}
                                sx={{ color: 'var(--color-theme)', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                          
                          <PermissionGuard permission="slider:delete">
                            <Tooltip title="Xóa slider" arrow>
                              <IconButton 
                                size="small" 
                                onClick={() => confirmDelete(slider.sliderId)}
                                sx={{ color: 'var(--color-cancel)', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isFetching && sliders && sliders.totalElements > itemsPerPage && (
            <div className="p-4 border-t border-gray-100">
              <CustomPagination
                currentPage={currentPage}
                totalPages={sliders.totalPages}
                totalItems={sliders.totalElements}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>

      <Dialog 
        open={deleteModalOpen} 
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        sx={{ '& .MuiDialog-paper': { borderRadius: '12px', minWidth: '400px', p: 1 } }}
      >
        <DialogTitle className="font-bold text-gray-800">
          Xóa Slider này?
        </DialogTitle>
        <DialogContent>
          <Typography className="text-gray-600 mt-2">
            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa slider này khỏi hệ thống không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteModalOpen(false)} 
            disabled={isDeleting}
            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}
          >
            Hủy
          </Button>
          <Button 
            onClick={executeDelete} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ textTransform: 'none', fontWeight: 600, px: 3, borderRadius: '8px', boxShadow: 'none' }}
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa Slider'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SliderList;
