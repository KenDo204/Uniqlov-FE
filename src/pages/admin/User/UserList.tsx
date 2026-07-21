import React, { useState, useEffect, useMemo } from 'react';
import {
  CircularProgress, Button, Tooltip, IconButton
} from '@mui/material';
import {
  Search, CheckCircle, Add, Edit, Delete, Block
} from '@mui/icons-material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { useUser } from '@/hooks/useUser';
import { useRole } from '@/hooks/useRole';
import { toast } from 'react-toastify';
import type { UserDetailResponse } from '@/types/user';
import CustomPagination from '@/components/general/Pagination';
import { PermissionGuard } from '@/components/shared/PermissionGuard';
import AddUser from './AddUser';
import EditUser from './EditUser';

const UserList: React.FC = () => {
  const {
    users,
    isFetching: loading,
    fetchUsers,
    deleteUser
  } = useUser();

  const { roles, fetchAllRoles } = useRole();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Delete Confirm Modal State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Load Initial Data
  useEffect(() => {
    fetchUsers(page, size).catch(err => {
      console.error('Error fetching users:', err);
      toast.error('Lỗi tải danh sách người dùng');
    });
    fetchAllRoles().catch(err => {
      console.error('Error fetching roles:', err);
    });
  }, [page, size, fetchUsers, fetchAllRoles]);

  // Handle Edit Action
  const handleOpenEdit = (user: UserDetailResponse) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle Add Action
  const handleOpenAdd = () => {
    setIsAddModalOpen(true);
  };

  // Handle Delete Action
  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      toast.success('Xóa người dùng thành công!');
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers(page, size);
    } catch (error: any) {
      toast.error(error || 'Xóa người dùng thất bại');
    }
  };

  // Filtering users locally from fetched list
  const filteredUsers = useMemo(() => {
    if (!users || !users.content) return [];
    return users.content.filter(u => {
      const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === '' || u.roleName === roleFilter;
      const matchesStatus = statusFilter === '' ||
        (statusFilter === 'active' && u.isActive) ||
        (statusFilter === 'inactive' && !u.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = users?.totalPages ?? 0;

  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý người dùng</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Theo dõi, cấp quyền, vô hiệu hóa tài khoản và quản trị thành viên</p>
          </div>
          <PermissionGuard permission="user:create">
            <Button
              onClick={handleOpenAdd}
              variant="contained"
              sx={{
                bgcolor: 'var(--color-theme)', textTransform: 'none', px: 3, py: 1.2,
                fontWeight: 'bold', fontSize: '14px', borderRadius: '12px', boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--color-theme-hover)', boxShadow: 'none' }
              }}
            >
              <Add fontSize="medium" />
              Thêm người dùng
            </Button>
          </PermissionGuard>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3.5 text-gray-400" fontSize="small" />
            <input
              type="text"
              placeholder="Tìm kiếm theo họ tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-theme transition-colors text-[14px]"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-theme transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              {roles?.map(r => (
                <option key={r.roleId} value={r.roleName}>{r.roleName}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-theme transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Tên người dùng</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Số điện thoại</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Vai trò</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-center text-nowrap">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <CircularProgress size={32} sx={{ color: 'var(--color-theme)' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải dữ liệu người dùng...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-theme)]/10 text-theme flex items-center justify-center font-bold text-sm uppercase">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{user.fullName}</div>
                            <div className="text-xs text-gray-400">ID: {user.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone || <span className="text-gray-300">-</span>}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border
                          ${user.roleName === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            user.roleName === 'OWNER' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-gray-50 text-gray-700 border-gray-100'}`}
                        >
                          {user.roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'}`}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle className="text-emerald-500" sx={{ fontSize: 14 }} />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <Block className="text-red-500" sx={{ fontSize: 14 }} />
                              Vô hiệu hóa
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <PermissionGuard permission="user:update">
                            <Tooltip title="Chỉnh sửa quyền & thông tin" arrow>
                              <IconButton
                                onClick={() => handleOpenEdit(user)}
                                size="small"
                                sx={{ color: 'var(--color-theme)', bgcolor: '#f0fdfa', '&:hover': { bgcolor: 'var(--color-theme-light)' } }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </PermissionGuard>
                          <PermissionGuard permission="user:delete">
                            <Tooltip title="Xóa tài khoản" arrow>
                              <IconButton
                                onClick={() => handleDeleteClick(user.userId)}
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" className="w-20 h-20 opacity-50 mb-4" />
                        <p className="text-gray-500 font-medium m-0">Không tìm thấy người dùng phù hợp</p>
                        <p className="text-gray-400 text-sm mt-1 m-0">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION UI */}
          <CustomPagination
            currentPage={page + 1}
            totalPages={totalPages}
            totalItems={users?.totalElements ?? 0}
            itemsPerPage={size}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditUser
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => fetchUsers(page, size)}
        user={selectedUser}
        roles={roles}
      />

      {/* ADD MODAL */}
      <AddUser
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchUsers(page, size)}
        roles={roles}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Xác nhận xóa tài khoản"
        content="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này sẽ loại bỏ tài khoản vĩnh viễn khỏi hệ thống."
        onConfirm={handleExecuteDelete}
        confirmText="Xóa ngay"
        cancelText="Hủy"
      />
    </div>
  );
};

export default UserList;
