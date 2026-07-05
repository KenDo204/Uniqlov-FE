import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import { useUser } from '@/hooks/useUser';
import type { RoleResponse } from '@/types/role';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roles: RoleResponse[] | undefined;
}

const AddUser: React.FC<AddUserProps> = ({ open, onClose, onSuccess, roles }) => {
  const { createUser, isSubmitting: actionLoading } = useUser();

  const [addFullName, setAddFullName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRoleId, setAddRoleId] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setAddFullName('');
      setAddEmail('');
      setAddPassword('');
      setAddPhone('');
      if (roles && roles.length > 0) {
        const customerRole = roles.find(r => r.roleName === 'CUSTOMER');
        setAddRoleId(customerRole ? customerRole.roleId : roles[0].roleId);
      }
    }
  }, [open, roles]);

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
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Thêm thành viên thất bại');
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
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUser;
