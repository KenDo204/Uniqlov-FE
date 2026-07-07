import React, { useState, useEffect, useMemo } from 'react';
import {
  CircularProgress, Tooltip, IconButton, Button, Chip
} from '@mui/material';
import {
  Edit, Delete, Add, Shield
} from '@mui/icons-material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { useRole } from '@/hooks/useRole';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'react-toastify';
import type { RoleResponse } from '@/types/role';
import CustomPagination from '@/components/general/Pagination';
import AddRole from './AddRole';
import EditRole from './EditRole';

const RoleList: React.FC = () => {
  const {
    roles,
    fetchAllRoles,
    deleteRole,
    isFetching: loading
  } = useRole();

  const { permissions, fetchAllPermissions } = usePermission();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);

  // Delete state
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedRoles = useMemo(() => {
    if (!roles) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return roles.slice(start, start + itemsPerPage);
  }, [roles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roles]);

  useEffect(() => {
    fetchAllRoles().catch(err => {
      console.error('Error fetching roles:', err);
      toast.error('Lỗi tải danh sách vai trò');
    });
    fetchAllPermissions().catch(err => {
      console.error('Error fetching permissions:', err);
    });
  }, [fetchAllRoles, fetchAllPermissions]);

  // Handle Add Role
  const handleOpenAdd = () => {
    setIsAddModalOpen(true);
  };

  // Handle Edit Role
  const handleOpenEdit = (role: RoleResponse) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  // Handle Delete Role
  const handleDeleteClick = (roleId: number) => {
    setRoleToDelete(roleId);
    setIsDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete);
      toast.success('Xóa vai trò thành công!');
      setIsDeleteConfirmOpen(false);
      setRoleToDelete(null);
      fetchAllRoles();
    } catch (error: any) {
      toast.error(error || 'Xóa vai trò thất bại');
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý vai trò</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Cấp nhóm quyền, mô tả vai trò và cấu trúc phân quyền hệ thống</p>
          </div>
          <Button
            onClick={handleOpenAdd}
            variant="contained"
            sx={{
              bgcolor: 'theme', textTransform: 'none', px: 3, py: 1.2,
              fontWeight: 'bold', fontSize: '14px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: 'theme-hover', boxShadow: 'none' }
            }}
          >
            <Add fontSize="medium" />
            Thêm vai trò
          </Button>
        </div>

        {/* ROLE LIST (CARDS) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <CircularProgress size={40} sx={{ color: 'theme' }} />
            <p className="mt-3 text-gray-500 font-medium m-0">Đang tải danh sách vai trò...</p>
          </div>
        ) : paginatedRoles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedRoles.map(role => (
                <div
                  key={role.roleId}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Shield fontSize="small" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 m-0">{role.roleName}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 m-0">ID: {role.roleId}</p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Tooltip title="Chỉnh sửa vai trò & quyền" arrow>
                          <IconButton
                            onClick={() => handleOpenEdit(role)}
                            size="small"
                            sx={{ color: 'theme', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa vai trò" arrow>
                          <IconButton
                            onClick={() => handleDeleteClick(role.roleId)}
                            size="small"
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4 mb-4 leading-relaxed">
                      {role.description || <span className="italic text-gray-400">Không có mô tả chi tiết cho vai trò này.</span>}
                    </p>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quyền hạn gán ({role.permissions?.length || 0})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map(p => (
                            <Chip
                              key={p.permissionId}
                              label={p.permissionName}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '11px',
                                color: '#4b5563',
                                borderColor: '#e5e7eb',
                                bgcolor: '#f9fafb'
                              }}
                            />
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">Chưa được gán quyền nào.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil((roles?.length || 0) / itemsPerPage)}
              totalItems={roles?.length || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
              <p className="text-gray-500 font-medium m-0">Chưa có vai trò nào</p>
              <p className="text-gray-400 text-sm mt-1 m-0">Bấm nút "Thêm vai trò mới" để định nghĩa chức vụ trong hệ thống.</p>
            </div>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      <AddRole
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchAllRoles()}
        permissions={permissions}
      />

      {/* EDIT MODAL */}
      <EditRole
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchAllRoles()}
        role={selectedRole}
        permissions={permissions}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Xác nhận xóa vai trò"
        content="Bạn có chắc chắn muốn xóa vai trò này không? Mọi người dùng thuộc vai trò này có thể bị ảnh hưởng. Hành động không thể khôi phục."
        onConfirm={handleExecuteDelete}
        confirmText="Xóa ngay"
        cancelText="Hủy"
      />
    </div>
  );
};

export default RoleList;
