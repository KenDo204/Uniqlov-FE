import { useState } from 'react';
import { toast } from 'react-toastify';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { UploadImageResponse } from '@/types/image/responses';

type UploadFunction = (file: File) => Promise<ApiResponse<UploadImageResponse>>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const validateUploadFile = (file: File): boolean => {
  if (!file) {
    toast.error('File không tồn tại.');
    return false;
  }
  
  if (!file.type.startsWith('image/')) {
    toast.error('Vui lòng chọn file hình ảnh hợp lệ.');
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error('Dung lượng hình ảnh không được vượt quá 2 MB.');
    return false;
  }

  return true;
};

export const useUpload = (uploadFn: UploadFunction) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!validateUploadFile(file)) {
      return null;
    }

    setIsUploading(true);
    try {
      const response = await uploadFn(file);
      if (response.result?.url) {
        return response.result.url;
      }
      return null;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Lỗi khi upload ảnh');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadFile };
};
