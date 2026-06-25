import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircularProgress, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, IconButton
} from '@mui/material';
import { 
  Edit, Delete, Search, Block, CheckCircle, Add
} from '@mui/icons-material';
import ConfirmModal from '@/components/general/ConfirmModal';
import { useUser } from '@/hooks/useUser';
import { useRole } from '@/hooks/useRole';
import { toast } from 'react-toastify';
import type { UserDetailResponse } from '@/types/user';

const UserList: React.FC = () => {
  const { 
    users, 
    isFetching: loading, 
    isSubmitting: actionLoading, 
    fetchUsers, 
    createUser, 
    updateUser, 
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
  
  // Edit Form Fields
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRoleId, setEditRoleId] = useState<number>(0);
  const [editIsActive, setEditIsActive] = useState(true);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFullName, setAddFullName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRoleId, setAddRoleId] = useState<number>(0);

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

  // Set default role in add form when roles list loaded
  useEffect(() => {
    if (roles && roles.length > 0 && !addRoleId) {
      const customerRole = roles.find(r => r.roleName === 'CUSTOMER');
      setAddRoleId(customerRole ? customerRole.roleId : roles[0].roleId);
    }
  }, [roles, addRoleId]);

  // Handle Edit Action
  const handleOpenEdit = (user: UserDetailResponse) => {
    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditPhone(user.phone || '');
    setEditRoleId(user.roleId);
    setEditIsActive(user.isActive);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!editFullName.trim()) {
      toast.error('Vui lòng nhập tên người dùng');
      return;
    }

    try {
      await updateUser(selectedUser.userId, {
        fullName: editFullName.trim(),
        phone: editPhone.trim() || undefined,
        roleId: editRoleId,
        isActive: editIsActive
      });
      toast.success('Cập nhật người dùng thành công!');
      setIsEditModalOpen(false);
      fetchUsers(page, size);
    } catch (error: any) {
      toast.error(error || 'Cập nhật thất bại');
    }
  };

  // Handle Add Action
  const handleOpenAdd = () => {
    setAddFullName('');
    setAddEmail('');
    setAddPassword('');
    setAddPhone('');
    if (roles && roles.length > 0) {
      const customerRole = roles.find(r => r.roleName === 'CUSTOMER');
      setAddRoleId(customerRole ? customerRole.roleId : roles[0].roleId);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFullName.trim() || !addEmail.trim() || !addPassword.trim()) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (addPassword.length < 8) {
      toast.error('Mật khẩu tối thiểu phải 8 ký tự');
      return;
    }

    try {
      await createUser({
        fullName: addFullName.trim(),
        email: addEmail.trim(),
        password: addPassword,
        phone: addPhone.trim() || undefined,
        roleId: addRoleId
      });
      toast.success('Thêm mới thành viên thành công!');
      setIsAddModalOpen(false);
      fetchUsers(page, size);
    } catch (error: any) {
      toast.error(error || 'Thêm thành viên thất bại');
    }
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
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý người dùng</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Theo dõi, cấp quyền, vô hiệu hóa tài khoản và quản trị thành viên</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium border-none cursor-pointer transition-colors shadow-sm"
          >
            <Add fontSize="small" />
            Thêm người dùng
          </button>
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors text-[14px]"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              {roles?.map(r => (
                <option key={r.roleId} value={r.roleName}>{r.roleName}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#00927c] transition-colors bg-white text-[14px] flex-1 md:flex-none cursor-pointer"
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
            <table className="w-full text-left border-collapse">
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
                      <CircularProgress size={32} sx={{ color: '#00927c' }} />
                      <p className="mt-2 text-gray-500 m-0">Đang tải dữ liệu người dùng...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#00927c]/10 text-[#00927c] flex items-center justify-center font-bold text-sm uppercase">
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
                          <Tooltip title="Chỉnh sửa quyền & thông tin" arrow>
                            <IconButton 
                              onClick={() => handleOpenEdit(user)}
                              size="small"
                              sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa tài khoản" arrow>
                            <IconButton 
                              onClick={() => handleDeleteClick(user.userId)}
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
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Hiển thị trang <span className="font-medium text-gray-800">{page + 1}</span> / <span className="font-medium text-gray-800">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  variant="outlined" 
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Trang trước
                </Button>
                <Button 
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page === totalPages - 1}
                  variant="outlined" 
                  size="small"
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

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
            Cập nhật tài khoản người dùng
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Họ và tên"
                fullWidth
                required
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Số điện thoại"
                fullWidth
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                select
                label="Vai trò (Role)"
                fullWidth
                value={editRoleId}
                onChange={(e) => setEditRoleId(Number(e.target.value))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                {roles?.map(r => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleName} - {r.description || 'Không có mô tả'}
                  </option>
                ))}
              </TextField>

              <div className="ml-1 mt-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#00927c' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#00927c' },
                      }}
                    />
                  }
                  label={
                    <div>
                      <span className="text-gray-800 font-medium">Kích hoạt hoạt động</span>
                      <p className="text-xs text-gray-500 m-0">Nếu tắt, tài khoản này sẽ bị khóa và không thể đăng nhập</p>
                    </div>
                  }
                />
              </div>
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
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Lưu lại'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
            Thêm người dùng mới
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Họ và tên"
                fullWidth
                required
                value={addFullName}
                onChange={(e) => setAddFullName(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Địa chỉ Email"
                type="email"
                fullWidth
                required
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="vd: user@domain.com"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Mật khẩu khởi tạo"
                type="password"
                fullWidth
                required
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Số điện thoại"
                fullWidth
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                select
                label="Vai trò gán (Role)"
                fullWidth
                value={addRoleId}
                onChange={(e) => setAddRoleId(Number(e.target.value))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                {roles?.map(r => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleName} - {r.description || 'Không có mô tả'}
                  </option>
                ))}
              </TextField>
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
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
