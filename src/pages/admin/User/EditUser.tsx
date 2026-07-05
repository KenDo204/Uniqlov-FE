import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel
} from '@mui/material';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/useUser';
import type { UserDetailResponse } from '@/types/user';
import type { RoleResponse } from '@/types/role';

interface EditUserProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserDetailResponse | null;
  roles: RoleResponse[] | undefined;
}

const EditUser: React.FC<EditUserProps> = ({ open, onClose, onSuccess, user, roles }) => {
  const { updateUser, isSubmitting: actionLoading } = useUser();

  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRoleId, setEditRoleId] = useState<number>(0);
  const [editIsActive, setEditIsActive] = useState(true);

  useEffect(() => {
    if (open && user) {
      setEditFullName(user.fullName);
      setEditPhone(user.phone || '');
      setEditRoleId(user.roleId);
      setEditIsActive(user.isActive);
    }
  }, [open, user]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!editFullName.trim()) {
      toast.error('Vui lòng nhập tên người dùng');
      return;
    }

    try {
      await updateUser(user.userId, {
        fullName: editFullName.trim(),
        phone: editPhone.trim() || undefined,
        roleId: editRoleId,
        isActive: editIsActive
      });
      toast.success('Cập nhật người dùng thành công!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Cập nhật thất bại');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { if (!actionLoading) onClose(); }}
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
                      '& .MuiSwitch-switchBase.Mui-checked': { color: 'theme' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'theme' },
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
            onClick={onClose}
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
              bgcolor: 'theme', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Lưu lại'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUser;
