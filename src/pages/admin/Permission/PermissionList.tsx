import React, { useState, useEffect } from 'react';
import { 
  CircularProgress, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TextField, IconButton
} from '@mui/material';
import { 
  Edit, Delete, Add, Lock
} from '@mui/icons-material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'react-toastify';
import type { PermissionResponse } from '@/types/permission';

const PermissionList: React.FC = () => {
  const { 
    permissions, 
    isFetching: loading, 
    isSubmitting: actionLoading, 
    fetchAllPermissions, 
    createPermission, 
    updatePermission, 
    deletePermission 
  } = usePermission();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionResponse | null>(null);

  // Add Form state
  const [addPermissionName, setAddPermissionName] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Edit Form state
  const [editDescription, setEditDescription] = useState('');

  // Delete state
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAllPermissions().catch(err => {
      console.error('Error fetching permissions:', err);
      toast.error('Lỗi tải danh sách quyền hạn');
    });
  }, [fetchAllPermissions]);

  // Handle Add Permission
  const handleOpenAdd = () => {
    setAddPermissionName('');
    setAddDescription('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addPermissionName.trim()) {
      toast.error('Vui lòng nhập tên định danh quyền');
      return;
    }

    try {
      await createPermission({
        permissionName: addPermissionName.trim().toUpperCase(),
        description: addDescription.trim() || undefined
      });
      toast.success('Thêm mới quyền hạn thành công!');
      setIsAddModalOpen(false);
      fetchAllPermissions();
    } catch (error: any) {
      toast.error(error || 'Thêm quyền hạn thất bại');
    }
  };

  // Handle Edit Permission
  const handleOpenEdit = (permission: PermissionResponse) => {
    setSelectedPermission(permission);
    setEditDescription(permission.description || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermission) return;

    try {
      await updatePermission(selectedPermission.permissionId, {
        description: editDescription.trim() || undefined
      });
      toast.success('Cập nhật mô tả quyền hạn thành công!');
      setIsEditModalOpen(false);
      fetchAllPermissions();
    } catch (error: any) {
      toast.error(error || 'Cập nhật thất bại');
    }
  };

  // Handle Delete Permission
  const handleDeleteClick = (permissionId: number) => {
    setPermissionToDelete(permissionId);
    setIsDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!permissionToDelete) return;
    try {
      await deletePermission(permissionToDelete);
      toast.success('Xóa quyền hạn thành công!');
      setIsDeleteConfirmOpen(false);
      setPermissionToDelete(null);
      fetchAllPermissions();
    } catch (error: any) {
      toast.error(error || 'Xóa quyền hạn thất bại');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý quyền hạn (Permissions)</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Định nghĩa các quyền thao tác trong hệ thống bảo mật cấp cơ sở dữ liệu</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium border-none cursor-pointer transition-colors shadow-sm"
          >
            <Add fontSize="small" />
            Định nghĩa quyền mới
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold w-24 text-center">ID</th>
                  <th className="px-6 py-4 font-semibold">Tên định danh quyền</th>
                  <th className="px-6 py-4 font-semibold">Mô tả chức năng</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap w-44">Ngày tạo</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap w-32">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải danh sách quyền...</p>
                    </td>
                  </tr>
                ) : permissions && permissions.length > 0 ? (
                  permissions.map((perm) => (
                    <tr key={perm.permissionId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-gray-500">{perm.permissionId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Lock className="text-gray-400" sx={{ fontSize: 16 }} />
                          <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                            {perm.permissionName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 leading-relaxed">
                        {perm.description || <span className="text-gray-300 italic">Không có mô tả</span>}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">{formatDate(perm.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip title="Chỉnh sửa mô tả quyền" arrow>
                            <IconButton 
                              onClick={() => handleOpenEdit(perm)}
                              size="small"
                              sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa quyền hệ thống" arrow>
                            <IconButton 
                              onClick={() => handleDeleteClick(perm.permissionId)}
                              size="small"
                              sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                        <p className="text-gray-500 font-medium m-0">Chưa có quyền hạn nào được định nghĩa</p>
                        <p className="text-gray-400 text-sm mt-1 m-0">Bấm nút "Định nghĩa quyền mới" để bắt đầu thiết kế hệ thống.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      <Dialog 
        open={isAddModalOpen} 
        onClose={() => { if (!actionLoading) setIsAddModalOpen(false); }}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveAdd}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Định nghĩa quyền mới
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Mã quyền định danh"
                placeholder="VD: PRODUCT_CREATE, ORDER_DELETE"
                fullWidth
                required
                value={addPermissionName}
                onChange={(e) => setAddPermissionName(e.target.value.toUpperCase().replace(/[^A-Z_]/g, ''))}
                helperText="Chỉ cho phép nhập chữ hoa viết liền cách nhau bằng dấu gạch dưới"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'monospace' } }}
              />

              <TextField
                label="Mô tả chức năng quyền"
                placeholder="VD: Cho phép tạo mới sản phẩm và lưu nháp..."
                fullWidth
                multiline
                rows={2}
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
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
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo quyền'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={() => { if (!actionLoading) setIsEditModalOpen(false); }}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveEdit}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Chỉnh sửa quyền: {selectedPermission?.permissionName}
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Mô tả chức năng quyền"
                placeholder="Mô tả chi tiết chức năng thao tác của quyền này..."
                fullWidth
                multiline
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
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
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Cập nhật'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Xác nhận xóa quyền hạn"
        content="Bạn có chắc chắn muốn xóa quyền hạn này không? Xóa quyền sẽ gỡ bỏ quyền khỏi tất cả các vai trò hiện tại. Hành động không thể khôi phục."
        onConfirm={handleExecuteDelete}
        confirmText="Xóa ngay"
        cancelText="Hủy"
      />
    </div>
  );
};

export default PermissionList;
