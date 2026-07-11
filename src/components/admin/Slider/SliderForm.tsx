import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel,
  Typography
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useUpload } from '@/hooks/useUpload';
import { uploadService } from '@/services/uploadService';
import type { SliderCreateRequest } from '@/types/slider';

interface SliderFormProps {
  initialData?: {
    imageUrl: string;
    targetUrl: string | null;
    isActive: boolean;
    displayOrder: number;
  };
  onSubmit: (data: SliderCreateRequest) => Promise<void>;
  isSubmitting: boolean;
}

const SliderForm: React.FC<SliderFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const { isUploading, uploadFile } = useUpload(uploadService.uploadSliderImage);

  useEffect(() => {
    if (initialData) {
      setImageUrl(initialData.imageUrl);
      setTargetUrl(initialData.targetUrl || '');
      setIsActive(initialData.isActive);
      setDisplayOrder(initialData.displayOrder);
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file);
    if (url) {
      setImageUrl(url);
      toast.success('Tải ảnh lên thành công!');
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      toast.error('Vui lòng tải lên ảnh cho Slider');
      return;
    }

    if (displayOrder < 0) {
      toast.error('Thứ tự hiển thị phải lớn hơn hoặc bằng 0');
      return;
    }

    if (targetUrl.trim() && !/^https?:\/\/.+/.test(targetUrl.trim())) {
      toast.error('URL đích không hợp lệ (phải bắt đầu bằng http:// hoặc https://)');
      return;
    }

    await onSubmit({
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim() || undefined,
      isActive,
      displayOrder
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Box className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Slider <span className="text-red-500">*</span></label>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {isUploading ? (
                  <div className="py-4">
                    <CircularProgress size={30} sx={{ color: 'var(--color-theme)' }} />
                    <p className="text-sm text-gray-500 mt-2">Đang tải ảnh lên...</p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="slider-upload"
                    />
                    <label
                      htmlFor="slider-upload"
                      className="cursor-pointer inline-block px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Chọn ảnh tải lên
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Định dạng hỗ trợ: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            </div>
            {imageUrl && (
              <div className="w-64">
                <p className="text-sm font-medium text-gray-700 mb-2">Xem trước:</p>
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center p-2 relative aspect-[21/9]">
                  <img
                    src={imageUrl}
                    alt="Slider Preview"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <TextField
          fullWidth
          label="URL đích (Không bắt buộc)"
          variant="outlined"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com/promotion"
          helperText="Đường link người dùng sẽ được chuyển tới khi click vào slider"
        />

        <TextField
          fullWidth
          type="number"
          label="Thứ tự hiển thị"
          variant="outlined"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
          slotProps={{ htmlInput: { min: 0 } }}
          helperText="Slider có thứ tự nhỏ hơn sẽ được hiển thị trước (Vd: 0, 1, 2)"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'var(--color-theme)',
                  '&:hover': { backgroundColor: 'var(--color-theme-hover)' },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'var(--color-theme)',
                },
              }}
            />
          }
          label={<Typography className="text-gray-700 font-medium">Kích hoạt hiển thị</Typography>}
        />

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || isUploading}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{
              backgroundColor: 'var(--color-theme)',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'var(--color-theme-hover)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu Slider'}
          </Button>
        </div>
      </Box>
    </form>
  );
};

export default SliderForm;
