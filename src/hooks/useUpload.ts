import { useState } from 'react';
import { toast } from 'react-toastify';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { UploadImageResponse } from '@/types/image/responses';

type UploadFunction = (file: File) => Promise<ApiResponse<UploadImageResponse>>;

export const useUpload = (uploadFn: UploadFunction) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
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
