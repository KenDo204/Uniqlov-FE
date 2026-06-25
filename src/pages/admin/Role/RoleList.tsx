import React, { useState, useEffect } from 'react';
import { 
  CircularProgress, Tooltip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TextField, IconButton, Chip, Checkbox, FormControlLabel, Typography
} from '@mui/material';
import { 
  Edit, Delete, Add, Shield, WarningAmber 
} from '@mui/icons-material';
import { useRole } from '@/hooks/useRole';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'react-toastify';
import type { RoleResponse } from '@/types/role';

const RoleList: React.FC = () => {
  const { 
    roles, 
    isFetching: loading, 
    isSubmitting: actionLoading, 
    fetchAllRoles, 
    createRole, 
    updateRole, 
    deleteRole 
  } = useRole();

  const { permissions, fetchAllPermissions } = usePermission();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);

  // Add Form state
  const [addRoleName, setAddRoleName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addSelectedPermissions, setAddSelectedPermissions] = useState<number[]>([]);

  // Edit Form state
  const [editDescription, setEditDescription] = useState('');
  const [editSelectedPermissions, setEditSelectedPermissions] = useState<number[]>([]);

  // Delete state
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

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
    setAddRoleName('');
    setAddDescription('');
    setAddSelectedPermissions([]);
    setIsAddModalOpen(true);
  };

  const handleToggleAddPermission = (id: number) => {
    setAddSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addRoleName.trim()) {
      toast.error('Vui lòng nhập tên vai trò');
      return;
    }

    try {
      await createRole({
        roleName: addRoleName.trim().toUpperCase(),
        description: addDescription.trim() || undefined,
        permissionIds: addSelectedPermissions
      });
      toast.success('Thêm mới vai trò thành công!');
      setIsAddModalOpen(false);
      fetchAllRoles();
    } catch (error: any) {
      toast.error(error || 'Thêm vai trò thất bại');
    }
  };

  // Handle Edit Role
  const handleOpenEdit = (role: RoleResponse) => {
    setSelectedRole(role);
    setEditDescription(role.description || '');
    setEditSelectedPermissions(role.permissions?.map(p => p.permissionId) || []);
    setIsEditModalOpen(true);
  };

  const handleToggleEditPermission = (id: number) => {
    setEditSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      await updateRole(selectedRole.roleId, {
        description: editDescription.trim() || undefined,
        permissionIds: editSelectedPermissions
      });
      toast.success('Cập nhật vai trò thành công!');
      setIsEditModalOpen(false);
      fetchAllRoles();
    } catch (error: any) {
      toast.error(error || 'Cập nhật vai trò thất bại');
    }
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
            <h1 className="text-2xl font-bold text-gray-800 m-0">Quản lý vai trò (Roles)</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Cấp nhóm quyền, mô tả vai trò và cấu trúc phân quyền hệ thống</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#00927c] hover:bg-[#007a68] text-white px-5 py-2.5 rounded-xl font-medium border-none cursor-pointer transition-colors shadow-sm"
          >
            <Add fontSize="small" />
            Thêm vai trò mới
          </button>
        </div>

        {/* ROLE LIST (CARDS) */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <CircularProgress size={40} sx={{ color: '#00927c' }} />
            <p className="mt-3 text-gray-500 font-medium m-0">Đang tải danh sách vai trò...</p>
          </div>
        ) : roles && roles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map(role => (
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
                          sx={{ color: '#00927c', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}
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
      <Dialog 
        open={isAddModalOpen} 
        onClose={() => { if (!actionLoading) setIsAddModalOpen(false); }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveAdd}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Định nghĩa vai trò mới
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Tên vai trò"
                placeholder="VD: MANAGER, SUPPORT..."
                fullWidth
                required
                value={addRoleName}
                onChange={(e) => setAddRoleName(e.target.value.toUpperCase())}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <TextField
                label="Mô tả vai trò"
                placeholder="Mô tả tóm tắt trách nhiệm quyền hạn..."
                fullWidth
                multiline
                rows={2}
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <div className="mt-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tích chọn quyền gán (Permissions)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 p-4 rounded-xl max-h-60 overflow-y-auto bg-gray-50">
                  {permissions && permissions.length > 0 ? (
                    permissions.map(p => (
                      <FormControlLabel
                        key={p.permissionId}
                        control={
                          <Checkbox
                            checked={addSelectedPermissions.includes(p.permissionId)}
                            onChange={() => handleToggleAddPermission(p.permissionId)}
                            sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#00927c' } }}
                          />
                        }
                        label={
                          <div>
                            <span className="text-sm font-medium text-gray-700">{p.permissionName}</span>
                            {p.description && <p className="text-[10px] text-gray-400 m-0 leading-tight">{p.description}</p>}
                          </div>
                        }
                      />
                    ))
                  ) : (
                    <span className="col-span-full text-sm text-gray-400 italic">Không tìm thấy quyền nào trong hệ thống.</span>
                  )}
                </div>
              </div>
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
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo vai trò'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog 
        open={isEditModalOpen} 
        onClose={() => { if (!actionLoading) setIsEditModalOpen(false); }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: '20px', p: 1 } } }}
      >
        <form onSubmit={handleSaveEdit}>
          <DialogTitle className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 pt-4 px-6 m-0">
            Chỉnh sửa vai trò: {selectedRole?.roleName}
          </DialogTitle>
          
          <DialogContent className="pt-6 pb-6 px-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-5 mt-2">
              <TextField
                label="Mô tả vai trò"
                placeholder="Mô tả vai trò trách nhiệm..."
                fullWidth
                multiline
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />

              <div className="mt-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cập nhật quyền gán (Permissions)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 p-4 rounded-xl max-h-60 overflow-y-auto bg-gray-50">
                  {permissions && permissions.length > 0 ? (
                    permissions.map(p => (
                      <FormControlLabel
                        key={p.permissionId}
                        control={
                          <Checkbox
                            checked={editSelectedPermissions.includes(p.permissionId)}
                            onChange={() => handleToggleEditPermission(p.permissionId)}
                            sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#00927c' } }}
                          />
                        }
                        label={
                          <div>
                            <span className="text-sm font-medium text-gray-700">{p.permissionName}</span>
                            {p.description && <p className="text-[10px] text-gray-400 m-0 leading-tight">{p.description}</p>}
                          </div>
                        }
                      />
                    ))
                  ) : (
                    <span className="col-span-full text-sm text-gray-400 italic">Không tìm thấy quyền nào.</span>
                  )}
                </div>
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

      {/* CONFIRM DELETE MODAL */}
      <Dialog 
        open={isDeleteConfirmOpen} 
        onClose={() => { if (!actionLoading) setIsDeleteConfirmOpen(false); }} 
        fullWidth 
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pb: 1 }}>
          <WarningAmber sx={{ fontSize: 48, color: '#ef4444' }} />
          <Typography variant="h6" color="text.primary" className="m-0" sx={{ fontWeight: 'bold' }}>
            Xác nhận xóa vai trò
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Bạn có chắc chắn muốn xóa vai trò này không? Mọi người dùng thuộc vai trò này có thể bị ảnh hưởng. Hành động không thể khôi phục.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
          <Button 
            onClick={() => setIsDeleteConfirmOpen(false)} 
            variant="outlined"
            disabled={actionLoading}
            sx={{ 
              color: '#374151', borderColor: '#d1d5db', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
              '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleExecuteDelete} 
            variant="contained" 
            disabled={actionLoading}
            sx={{ 
              backgroundColor: '#ef4444', textTransform: 'none', px: 3,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px',
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : "Xóa ngay"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoleList;
