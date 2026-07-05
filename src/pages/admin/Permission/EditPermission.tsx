import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import { usePermission } from '@/hooks/usePermission';
import type { PermissionResponse } from '@/types/permission';

interface EditPermissionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permission: PermissionResponse | null;
}

const EditPermission: React.FC<EditPermissionProps> = ({ open, onClose, onSuccess, permission }) => {
  const { updatePermission, isSubmitting: actionLoading } = usePermission();

  const [editDescription, setEditDescription] = useState('');

  // Set initial data when modal opens
  useEffect(() => {
    if (open && permission) {
      setEditDescription(permission.description || '');
    }
  }, [open, permission]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permission) return;

    try {
      await updatePermission(permission.permissionId, {
        description: editDescription.trim() || undefined
      });
      toast.success('Cập nhật mô tả quyền hạn thành công!');
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
          Chỉnh sửa quyền: {permission?.permissionName}
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
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPermission;
