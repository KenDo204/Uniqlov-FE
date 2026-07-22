import React, { useState } from 'react';
import {
  Button, IconButton, CircularProgress, Typography, Dialog, DialogContent, Tooltip
} from '@mui/material';
import { CloudUpload, Delete, Visibility, Edit, Close } from '@mui/icons-material';
import { useUpload } from '@/hooks/useUpload';
import { uploadService } from '@/services/uploadService';

interface VariantColorImageCardProps {
  color: string;
  imageUrl: string;
  sizes?: string[];
  onUpdate: (url: string) => void;
}

export const VariantColorImageCard: React.FC<VariantColorImageCardProps> = ({
  color,
  imageUrl,
  sizes = [],
  onUpdate,
}) => {
  const { isUploading, uploadFile } = useUpload(uploadService.uploadProductImage);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    if (url) {
      onUpdate(url);
    }
    e.target.value = '';
  };

  const handleDelete = () => {
    onUpdate('');
  };

  return (
    <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-3 flex flex-col items-center text-center relative shadow-sm hover:shadow-md transition-shadow">
      {/* Title */}
      <Typography variant="subtitle2" className="font-bold text-gray-800">
        Màu {color}
      </Typography>

      {/* Image Container / Upload Button */}
      {imageUrl ? (
        /* State 1: Image already exists - Hide Upload button, show Image & Toolbar */
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="relative w-24 h-24 border border-gray-200 rounded-xl overflow-hidden shadow-sm group bg-gray-50 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={`Màu ${color}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            />

            {/* Upload Overlay while changing image */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 z-10">
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span className="text-[10px] text-white font-medium">Đang tải...</span>
              </div>
            )}

            {/* Quick Preview Hover Overlay */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                <div className="text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded text-[10px] font-medium">
                  <Visibility fontSize="small" /> Xem
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar for uploaded image */}
          <div className="flex items-center gap-1.5">
            {/* View Button */}
            <Tooltip title="Xem ảnh phóng to">
              <IconButton
                size="small"
                onClick={() => setIsPreviewOpen(true)}
                disabled={isUploading}
                sx={{
                  p: '6px',
                  border: 'var(--color-blue)',
                  borderRadius: '6px',
                  color: 'var(--color-blue)',
                  '&:hover': { bgcolor: '#f3f4f6', borderColor: 'var(--color-blue-hover)', color:'var(--color-blue)' }
                }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Change Image Button */}
            <Tooltip title="Thay đổi ảnh">
              <Button
                component="label"
                variant="outlined"
                size="small"
                disabled={isUploading}
                startIcon={<Edit fontSize="small" />}
                sx={{
                  minWidth: 0,
                  px: '8px',
                  py: '4px',
                  fontSize: '11px',
                  borderColor: 'var(--color-theme)',
                  color: 'var(--color-theme)',
                  textTransform: 'none',
                  '&:hover': { borderColor: 'var(--color-theme-hover)', color: 'var(--color-theme-hover)', bgcolor: '#f0fdfa' }
                }}
              >
                Thay đổi
                <input type="file" hidden accept="image/*" onChange={handleUpload} />
              </Button>
            </Tooltip>

            {/* Delete Image Button */}
            <Tooltip title="Xóa ảnh màu này">
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                disabled={isUploading}
                sx={{
                  p: '6px',
                  border: '1px solid #fee2e2',
                  borderRadius: '6px',
                  '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5' }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        /* State 2: No image uploaded yet - Show single Upload button */
        <div className="w-full flex flex-col items-center py-2">
          <Button
            component="label"
            variant="outlined"
            size="small"
            disabled={isUploading}
            sx={{
              width: '100%',
              py: '12px',
              borderStyle: 'dashed',
              borderWidth: '1.5px',
              borderColor: '#cbd5e1',
              color: '#64748b',
              flexDirection: 'column',
              gap: '4px',
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: 'var(--color-theme)',
                color: 'var(--color-theme)',
                bgcolor: 'rgba(0,146,124,0.04)'
              }
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-1">
                <CircularProgress size={20} sx={{ color: 'var(--color-theme)' }} />
                <span className="text-xs">Đang tải lên...</span>
              </div>
            ) : (
              <>
                <CloudUpload fontSize="medium" />
                <span className="text-xs font-medium">Tải ảnh lên</span>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </Button>
        </div>
      )}

      {/* Applied Sizes Badge */}
      {sizes.length > 0 && (
        <div className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1.5 rounded-lg w-full border border-gray-100">
          <span className="block font-semibold mb-1 text-gray-600">Áp dụng cho:</span>
          <div className="flex flex-wrap gap-1 justify-center">
            {sizes.map(s => (
              <span key={s} className="bg-white border border-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', overflow: 'hidden' }
          }
        }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-150 bg-gray-50">
          <Typography variant="subtitle1" className="font-bold text-gray-800">
            Ảnh màu: {color}
          </Typography>
          <IconButton size="small" onClick={() => setIsPreviewOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </div>
        <DialogContent className="p-4 flex items-center justify-center bg-gray-900/5">
          <img
            src={imageUrl}
            alt={`Màu ${color}`}
            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantColorImageCard;
