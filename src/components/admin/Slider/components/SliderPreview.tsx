import React from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { DeleteOutlined, SwapHoriz, Image as ImageIcon } from '@mui/icons-material';

interface SliderPreviewProps {
  imageUrl: string;
  onClear: () => void;
  onChangeClick: () => void;
}

export const SliderPreview: React.FC<SliderPreviewProps> = ({ imageUrl, onClear, onChangeClick }) => {
  if (!imageUrl) {
    return (
      <Box className="w-full aspect-[21/9] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400">
        <ImageIcon sx={{ fontSize: 48, color: '#e5e7eb', mb: 2 }} />
        <Typography variant="body2" className="font-medium text-gray-500 text-[14px]">Chưa có ảnh</Typography>
        <Typography variant="caption" className="text-gray-400 mt-1">Vui lòng tải ảnh lên để xem trước</Typography>
      </Box>
    );
  }

  return (
    <Box className="relative w-full aspect-[21/9] rounded-xl overflow-hidden shadow-sm group border border-gray-200 bg-gray-100">
      <img
        src={imageUrl}
        alt="Slider Preview"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
        <Tooltip title="Đổi ảnh khác" placement="top">
          <IconButton 
            onClick={onChangeClick}
            className="bg-white/95 hover:bg-white text-gray-800 shadow-lg transform transition-all duration-300 hover:scale-110"
            size="large"
            sx={{ width: 48, height: 48 }}
          >
            <SwapHoriz />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa ảnh" placement="top">
          <IconButton 
            onClick={onClear}
            className="bg-red-500/95 hover:bg-red-600 text-white shadow-lg transform transition-all duration-300 hover:scale-110"
            size="large"
            sx={{ width: 48, height: 48 }}
          >
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </div>
    </Box>
  );
};
