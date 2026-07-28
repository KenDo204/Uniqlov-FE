import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { Save, Language } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useUpload } from '@/hooks/useUpload';
import { uploadService } from '@/services/uploadService';
import { sliderCreateSchema } from '@/schemas';
import type { SliderCreateRequest } from '@/types/slider';

import { SliderFormCard } from './components/SliderFormCard';
import { SliderImageUploader } from './components/SliderImageUploader';
import { SliderPreview } from './components/SliderPreview';
import { SliderDisplaySettings } from './components/SliderDisplaySettings';

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
  const [displayOrder, setDisplayOrder] = useState<string>('0');

  const { isUploading, uploadFile } = useUpload(uploadService.uploadSliderImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setImageUrl(initialData.imageUrl);
      setTargetUrl(initialData.targetUrl || '');
      setIsActive(initialData.isActive);
      setDisplayOrder(String(initialData.displayOrder));
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

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedDisplayOrder = Number(displayOrder) || 0;

    const payload = {
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim() || undefined,
      isActive,
      displayOrder: parsedDisplayOrder,
    };

    const validationResult = sliderCreateSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    await onSubmit(payload);
  };


  const isFormDisabled = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-5 md:p-8 rounded-3xl min-h-[calc(100vh-140px)]">
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        disabled={isFormDisabled}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1400px] mx-auto relative">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:space-y-8">
          
          <SliderFormCard 
            title="Ảnh Slider" 
            subtitle="Hỗ trợ các định dạng JPG, PNG, WEBP. Dung lượng tối đa 1MB."
          >
            <SliderImageUploader 
              isUploading={isUploading} 
              onFileChange={handleFileChange} 
            />
          </SliderFormCard>

          <SliderFormCard 
            title="Thông tin Slider"
            subtitle="Đường link điều hướng khi người dùng nhấp vào ảnh"
          >
            <Box>
              <Typography variant="body2" className="text-gray-700 font-medium mb-2.5 text-[14px]">Target URL (Không bắt buộc)</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="/products"
                disabled={isFormDisabled}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Language className="text-gray-400" fontSize="small" />
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-theme)',
                      borderWidth: '2px'
                    },
                  }
                }}
              />
              <Typography variant="caption" className="text-gray-500 mt-2 block text-[13px]">
                Nếu để trống, khách hàng nhấn vào Slider sẽ không điều hướng đi đâu.
              </Typography>
            </Box>
          </SliderFormCard>

          <SliderFormCard 
            title="Cấu hình hiển thị"
            subtitle="Quản lý thứ tự và trạng thái xuất hiện trên website"
          >
            <SliderDisplaySettings 
              displayOrder={displayOrder}
              setDisplayOrder={setDisplayOrder}
              isActive={isActive}
              setIsActive={setIsActive}
              disabled={isFormDisabled}
            />
          </SliderFormCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-8 space-y-6 lg:space-y-8">
            
            <SliderFormCard 
              title="Xem trước Slider" 
              subtitle="Ảnh sẽ hiển thị theo tỷ lệ 21:9"
            >
              <SliderPreview 
                imageUrl={imageUrl} 
                onClear={() => setImageUrl('')}
                onChangeClick={handleTriggerUpload}
              />
            </SliderFormCard>

            <SliderFormCard title="Hành động">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isFormDisabled}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                className="h-[52px] text-[16px]"
                sx={{
                  backgroundColor: 'var(--color-theme)',
                  textTransform: 'none',
                  fontWeight: '600',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px 0 rgba(0, 146, 124, 0.2)',
                  '&:hover': {
                    backgroundColor: 'var(--color-theme-hover)',
                    boxShadow: '0 6px 20px rgba(0, 146, 124, 0.3)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease',
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                {isSubmitting ? 'Đang lưu hệ thống...' : 'Lưu Slider'}
              </Button>
            </SliderFormCard>

          </div>
        </div>

      </div>
    </form>
  );
};

export default SliderForm;
