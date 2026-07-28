import React, { useEffect, useState } from 'react';
import {
  TextField, Button, CircularProgress, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, KeyboardArrowRight, Save } from '@mui/icons-material';
import { useCategory } from '@/hooks/useCategory';
import { categoryCreateSchema } from '@/schemas';
import { toast } from 'react-toastify';
import ParentCategoryPicker from '@/components/admin/Category/ParentCategoryPicker';
import { useUpload } from '@/hooks/useUpload';
import { uploadService } from '@/services/uploadService';


const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isSubmitting, fetchAdminCategories, createCategory } = useCategory();

  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentPathText, setParentPathText] = useState<string>('Không có (Làm danh mục gốc)');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [iconUrl, setIconUrl] = useState('');
  const { isUploading, uploadFile } = useUpload(uploadService.uploadCategoryIcon);

  const [displayOrder] = useState<string>('');

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchAdminCategories().catch(err => {
        console.error('Error fetching categories:', err);
      });
    }
  }, [categories, fetchAdminCategories]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file);
    if (url) {
      setIconUrl(url);
      toast.success('Tải ảnh lên thành công!');
    }
    // Reset file input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleConfirmParent = (selectedId: number | null, pathText: string) => {
    setParentId(selectedId);
    setParentPathText(pathText);
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const payload = {
      categoryName,
      parentId: parentId ?? undefined,
      iconUrl: iconUrl ? iconUrl.trim() : undefined,
      displayOrder: displayOrder ? Number(displayOrder) : undefined,
    };

    const validationResult = categoryCreateSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    try {
      await createCategory({
        categoryName: categoryName.trim(),
        parentId: parentId ?? undefined,
        iconUrl: iconUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || undefined,
      });

      toast.success('Thêm danh mục mới thành công!');
      fetchAdminCategories();
      navigate('/admin/categories');
    } catch (error: any) {
      toast.error(error || 'Thêm danh mục thất bại');
    }
  };


  return (
    <div className="w-full text-left flex flex-col gap-6">
      <div className="w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/categories')}
            className="p-2.5 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <ArrowBack fontSize="small" className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">Thêm danh mục mới</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Tạo một danh mục để phân loại sản phẩm của hệ thống</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Box>
              <TextField
                fullWidth
                label="Tên danh mục"
                variant="outlined"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="VD: Thời trang Nam, Áo sơ mi, Nhạc cụ..."
                required
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '0.75rem',
                    transition: 'all 0.3s ease',
                    '&:hover fieldset': { borderColor: 'var(--color-theme)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-theme)', borderWidth: '2px' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-theme)' },
                }}
              />
            </Box>

            <Box>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Danh mục cha</label>
              <div
                onClick={() => setIsPickerOpen(true)}
                className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-theme)] transition-colors bg-white box-border"
              >
                <span className={parentId === null ? 'text-gray-800 font-medium' : 'text-[var(--color-theme)] font-medium'}>
                  {parentPathText}
                </span>
                <KeyboardArrowRight className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Nhấp vào khung trên để mở bảng chọn danh mục cha.</p>
            </Box>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <Box>
                <TextField
                  fullWidth
                  label="Thứ tự hiển thị"
                  type="number"
                  variant="outlined"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="VD: 1, 2, 3..."
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': { borderColor: 'var(--color-theme)' },
                      '&.Mui-focused fieldset': { borderColor: 'var(--color-theme)', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-theme)' },
                  }}
                />
              </Box> */}

              <Box>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Icon Danh mục</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                    {isUploading ? (
                      <CircularProgress size={24} sx={{ color: 'var(--color-theme)' }} />
                    ) : iconUrl ? (
                      <img src={iconUrl} alt="Icon preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center">Trống</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      placeholder="Nhập URL hoặc tải ảnh lên"
                      size="small"
                      sx={{
                        backgroundColor: 'white',
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '0.5rem',
                          '&:hover fieldset': { borderColor: 'var(--color-theme)' },
                          '&.Mui-focused fieldset': { borderColor: 'var(--color-theme)', borderWidth: '1px' },
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={isUploading}
                      size="small"
                      sx={{
                        color: 'var(--color-theme)',
                        borderColor: 'var(--color-theme)',
                        textTransform: 'none',
                        borderRadius: '0.5rem',
                        '&:hover': { borderColor: 'var(--color-theme)', backgroundColor: '#f0fdfa' }
                      }}
                    >
                      {isUploading ? 'Đang tải...' : 'Chọn ảnh tải lên'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                </div>
              </Box>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/categories')}
                sx={{
                  color: '#374151',
                  borderColor: '#d1d5db',
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  '&:hover': { borderColor: '#9ca3af', backgroundColor: '#f9fafb' }
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                sx={{
                  bgcolor: 'var(--color-theme)',
                  borderRadius: '0.75rem',
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  boxShadow: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  '&:hover': { bgcolor: '#007a68', boxShadow: 'none' }
                }}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ParentCategoryPicker
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        categoryTree={categories || []}
        onConfirm={handleConfirmParent}
      />
    </div>
  );
};

export default AddCategory;