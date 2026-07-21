import React, { useState, useEffect, useMemo } from 'react';
import {
  CircularProgress, Tooltip, Button, IconButton
} from '@mui/material';
import {
  Edit, Delete, Add, Lock, Search
} from '@mui/icons-material';
import { TextField, InputAdornment } from '@mui/material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'react-toastify';
import type { PermissionResponse } from '@/types/permission';
import CustomPagination from '@/components/general/Pagination';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import AddPermission from './AddPermission';
import EditPermission from './EditPermission';

const PermissionList: React.FC = () => {
  const {
    permissions,
    fetchAllPermissions,
    deletePermission,
    isFetching: loading
  } = usePermission();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<PermissionResponse | null>(null);

  // Delete state
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredPermissions = useMemo(() => {
    if (!permissions) return [];
    if (!debouncedSearchTerm.trim()) return permissions;
    const lowerQuery = debouncedSearchTerm.toLowerCase();
    return permissions.filter(
      p => p.permissionName.toLowerCase().includes(lowerQuery) ||
           (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
  }, [permissions, debouncedSearchTerm]);

  const paginatedPermissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPermissions.slice(start, start + itemsPerPage);
  }, [filteredPermissions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPermissions]);

  useEffect(() => {
    fetchAllPermissions().catch(err => {
      console.error('Error fetching permissions:', err);
      toast.error('Lỗi tải danh sách quyền hạn');
    });
  }, [fetchAllPermissions]);

  // Handle Add Permission
  const handleOpenAdd = () => {
    setIsAddModalOpen(true);
  };

  // Handle Edit Permission
  const handleOpenEdit = (permission: PermissionResponse) => {
    setSelectedPermission(permission);
    setIsEditModalOpen(true);
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
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý quyền hạn</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Định nghĩa các quyền thao tác trong hệ thống bảo mật cấp cơ sở dữ liệu</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm quyền..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                minWidth: { sm: '260px' }, width: { xs: '100%', sm: 'auto' },
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' }
              }}
            />
            <PermissionGuard permission="permission:create">
              <Button
                onClick={handleOpenAdd}
                variant="contained"
                sx={{
                  bgcolor: 'theme', textTransform: 'none', px: 3, py: 1.2,
                  fontWeight: 'bold', fontSize: '14px', borderRadius: '12px', boxShadow: 'none',
                  '&:hover': { bgcolor: 'theme-hover', boxShadow: 'none' },
                  whiteSpace: 'nowrap'
                }}
              >
                <Add fontSize="medium" />
                Thêm mã quyền
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
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
                      <CircularProgress size={32} sx={{ color: 'theme' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải danh sách quyền...</p>
                    </td>
                  </tr>
                ) : paginatedPermissions.length > 0 ? (
                  paginatedPermissions.map((perm) => (
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
                          <PermissionGuard permission="permission:update">
                            <Tooltip title="Chỉnh sửa mô tả quyền" arrow>
                              <IconButton
                                onClick={() => handleOpenEdit(perm)}
                                size="small"
                                sx={{ color: 'var(--color-theme)', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                          <PermissionGuard permission="permission:delete">
                            <Tooltip title="Xóa quyền hệ thống" arrow>
                              <IconButton
                                onClick={() => handleDeleteClick(perm.permissionId)}
                                size="small"
                                sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
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
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil((filteredPermissions?.length || 0) / itemsPerPage)}
            totalItems={filteredPermissions?.length || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* ADD MODAL */}
      <AddPermission
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchAllPermissions()}
      />

      {/* EDIT MODAL */}
      <EditPermission
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchAllPermissions()}
        permission={selectedPermission}
      />

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
