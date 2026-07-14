import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import SliderForm from '@/components/admin/Slider/SliderForm';
import { useSlider } from '@/hooks/useSlider';
import { toast } from 'react-toastify';
import { CircularProgress, Box } from '@mui/material';
import type { SliderCreateRequest, SliderResponse } from '@/types/slider';

const EditSlider: React.FC = () => {
  const { sliderId } = useParams<{ sliderId: string }>();
  const navigate = useNavigate();
  const { sliders, loadAdminSliders, editSlider, isSubmitting } = useSlider();
  const [initialData, setInitialData] = useState<SliderResponse | null>(null);

  useEffect(() => {
    if (!sliders?.content) {
      // If no data, fetch page 0
      loadAdminSliders({ page: 0, size: 50 }).catch(console.error);
    }
  }, [sliders, loadAdminSliders]);

  useEffect(() => {
    if (sliders?.content && sliderId) {
      const found = sliders.content.find(s => s.sliderId === parseInt(sliderId));
      if (found) {
        setInitialData(found);
      } else {
        toast.error('Không tìm thấy thông tin Slider!');
        navigate('/admin/sliders');
      }
    }
  }, [sliders, sliderId, navigate]);

  const handleSubmit = async (data: SliderCreateRequest) => {
    if (!sliderId) return;
    try {
      await editSlider(parseInt(sliderId), data);
      toast.success('Cập nhật Slider thành công!');
      navigate('/admin/sliders');
    } catch (error: any) {
      toast.error(error || 'Có lỗi xảy ra khi cập nhật Slider');
    }
  };

  if (!initialData) {
    return (
      <Box className="flex justify-center items-center h-screen bg-gray-50">
        <CircularProgress sx={{ color: 'var(--color-theme)' }} />
      </Box>
    );
  }

  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/sliders')}
            className="p-2.5 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <ArrowBack fontSize="small" className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Cập nhật Slider</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Chỉnh sửa thông tin banner trang chủ</p>
          </div>
        </div>
          <SliderForm 
            initialData={{
              imageUrl: initialData.imageUrl,
              targetUrl: initialData.targetUrl,
              isActive: initialData.isActive,
              displayOrder: initialData.displayOrder
            }}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
      </div>
    </div>
  );
};

export default EditSlider;
