import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import SliderForm from '@/components/admin/Slider/SliderForm';
import { useSlider } from '@/hooks/useSlider';
import { toast } from 'react-toastify';
import type { SliderCreateRequest } from '@/types/slider';

const AddSlider: React.FC = () => {
  const navigate = useNavigate();
  const { createNewSlider, isSubmitting } = useSlider();

  const handleSubmit = async (data: SliderCreateRequest) => {
    try {
      await createNewSlider(data);
      toast.success('Thêm Slider thành công!');
      navigate('/admin/sliders');
    } catch (error: any) {
      toast.error(error || 'Có lỗi xảy ra khi thêm Slider');
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-800 m-0">Thêm Slider mới</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Tải lên hình ảnh banner để hiển thị trên trang chủ</p>
          </div>
        </div>
        <SliderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddSlider;
