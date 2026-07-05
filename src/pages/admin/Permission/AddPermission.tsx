import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import { toast } from 'react-toastify';
import { usePermission } from '@/hooks/usePermission';

interface AddPermissionProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPermission: React.FC<AddPermissionProps> = ({ open, onClose, onSuccess }) => {
  const { createPermission, isSubmitting: actionLoading } = usePermission();

  const [addPermissionName, setAddPermissionName] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setAddPermissionName('');
      setAddDescription('');
    }
  }, [open]);

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
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Thêm quyền hạn thất bại');
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
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Tạo quyền'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPermission;
