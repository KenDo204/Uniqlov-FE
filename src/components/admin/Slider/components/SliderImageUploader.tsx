import React, { useState, useRef } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';

interface SliderImageUploaderProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SliderImageUploader: React.FC<SliderImageUploaderProps> = ({ isUploading, onFileChange }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Mock event to pass to original handler
      const mockEvent = {
        target: { files: files, value: '' }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(mockEvent);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!isUploading ? handleClick : undefined}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${isUploading ? 'opacity-70 cursor-not-allowed bg-gray-50 border-gray-300' : 'cursor-pointer'}
        ${isDragActive 
          ? 'border-[#00927c] bg-[#00927c]/5 scale-[1.02]' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#00927c]/50'}
      `}
    >
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={onFileChange}
        className="hidden"
        ref={inputRef}
        disabled={isUploading}
      />
      
      {isUploading ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <CircularProgress size={42} sx={{ color: 'var(--color-theme)' }} />
          <Typography className="text-gray-600 mt-5 font-medium">Đang tải ảnh lên hệ thống...</Typography>
        </div>
      ) : (
        <div className="py-4 flex flex-col items-center justify-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors duration-300
            ${isDragActive ? 'bg-[#00927c] text-white' : 'bg-white text-gray-400 shadow-sm border border-gray-100'}
          `}>
            <CloudUpload fontSize="large" />
          </div>
          <Typography variant="h6" className={`font-semibold mb-2 text-[17px] ${isDragActive ? 'text-[#00927c]' : 'text-gray-800'}`}>
            Kéo thả ảnh vào đây
          </Typography>
          <Typography variant="body2" className="text-gray-500 mb-6 text-[14px]">
            Hoặc click để chọn file từ máy tính
          </Typography>
          <div className="flex items-center gap-3 text-[13px] text-gray-500 font-medium bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-100">
            <span className="flex items-center gap-1.5"><ImageIcon fontSize="small" className="text-gray-400" /> JPG, PNG, WEBP</span>
            <span className="text-gray-300">•</span>
            <span>Tối đa 1MB</span>
          </div>
        </div>
      )}
    </div>
  );
};
