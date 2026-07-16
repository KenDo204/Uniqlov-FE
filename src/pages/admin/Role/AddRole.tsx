import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox
} from '@mui/material';
import { toast } from 'react-toastify';
import { useRole } from '@/hooks/useRole';
import type { PermissionResponse } from '@/types/permission';

interface AddRoleProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permissions: PermissionResponse[] | undefined;
}

const AddRole: React.FC<AddRoleProps> = ({ open, onClose, onSuccess, permissions }) => {
  const { createRole, isSubmitting: actionLoading } = useRole();

  const [addRoleName, setAddRoleName] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addSelectedPermissions, setAddSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      setAddRoleName('');
      setAddDescription('');
      setAddSelectedPermissions([]);
    }
  }, [open]);

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
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Thêm vai trò thất bại');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { if (!actionLoading) onClose(); }}
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
                          sx={{ color: '#d1d5db', '&.Mui-checked': { color: 'var(--color-theme)' } }}
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
              bgcolor: 'var(--color-theme)', textTransform: 'none', px: 4,
              fontWeight: 'bold', fontSize: '13px', borderRadius: '12px', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--color-theme-hover)', boxShadow: 'none' }
            }}
          >
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo vai trò'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddRole;
