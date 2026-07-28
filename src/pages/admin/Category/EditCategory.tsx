import React, { useEffect, useState } from 'react';
import {
  TextField, Button, CircularProgress, Box, FormControlLabel, Switch
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, KeyboardArrowRight, Save } from '@mui/icons-material';
import { useCategory } from '@/hooks/useCategory';
import { categoryUpdateSchema } from '@/schemas';
import { toast } from 'react-toastify';

import type { CategoryResponse } from '@/types/category';
import { useUpload } from '@/hooks/useUpload';
import { uploadService } from '@/services/uploadService';

const EditCategory: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories, isSubmitting, isFetching, fetchAdminCategories, updateCategory } = useCategory();

  const [categoryName, setCategoryName] = useState('');
  const [parentPathText, setParentPathText] = useState<string>('Đang tải...');

  const [iconUrl, setIconUrl] = useState('');
  const { isUploading, uploadFile } = useUpload(uploadService.uploadCategoryIcon);

  const [displayOrder, setDisplayOrder] = useState<string>('');
  const [categoryStatus, setCategoryStatus] = useState<number>(1);

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchAdminCategories().catch(err => {
        console.error('Error fetching categories:', err);
      });
    }
  }, [categories, fetchAdminCategories]);

  useEffect(() => {
    if (categories && categories.length > 0 && categoryId) {
      let found = false;

      const findParentPath = (nodes: CategoryResponse[], targetId: number, currentPath = ""): string | null => {
        for (const node of nodes) {
          if (node.categoryId === targetId) {
            return currentPath ? `${currentPath} > ${node.categoryName}` : node.categoryName;
          }
          if (node.children && node.children.length > 0) {
            const foundChild = findParentPath(node.children, targetId, currentPath ? `${currentPath} > ${node.categoryName}` : node.categoryName);
            if (foundChild) return foundChild;
          }
        }
        return null;
      };

      const findCategoryData = (nodes: CategoryResponse[], currentParentId: number | null = null) => {
        for (const node of nodes) {
          if (node.categoryId.toString() === categoryId) {
            setCategoryName(node.categoryName);

            if (currentParentId) {
              const pathString = findParentPath(categories, currentParentId);
              setParentPathText(pathString || 'Không xác định');
            } else {
              setParentPathText('Không có (Làm danh mục gốc)');
            }

            setIconUrl(node.iconUrl || '');
            setDisplayOrder(String(node.displayOrder || 0));
            setCategoryStatus(node.categoryStatus);
            found = true;
            return;
          }
          if (node.children && node.children.length > 0) {
            findCategoryData(node.children, node.categoryId);
            if (found) return;
          }
        }
      };

      findCategoryData(categories);

      if (!found) {
        toast.error("Không tìm thấy danh mục này!");
        navigate('/admin/categories');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [categories, categoryId, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file);
    if (url) {
      setIconUrl(url);
      toast.success('Tải ảnh lên thành công!');
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      categoryName: categoryName.trim(),
      categoryStatus,
      iconUrl: iconUrl ? iconUrl.trim() : undefined,
      displayOrder: displayOrder ? Number(displayOrder) : undefined,
    };

    const validationResult = categoryUpdateSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    try {
      await updateCategory(Number(categoryId), {
        categoryName: categoryName.trim(),
        categoryStatus: categoryStatus,
        iconUrl: iconUrl.trim() || undefined,
        displayOrder: Number(displayOrder) || undefined,
      });

      toast.success('Cập nhật danh mục thành công!');
      fetchAdminCategories();
      navigate('/admin/categories');
    } catch (error: any) {
      toast.error(error || 'Cập nhật danh mục thất bại');
    }
  };


  if (isPageLoading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <CircularProgress sx={{ color: 'var(--color-theme)' }} />
        <p className="mt-2 text-gray-500 font-medium">Đang tải thông tin danh mục...</p>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-800 m-0">Chỉnh sửa danh mục</h1>
            <p className="text-sm text-gray-500 mt-1 m-0">Cập nhật thông tin chi tiết cho danh mục</p>
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

            <Box className="opacity-70">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Danh mục cha (Không thể thay đổi vị trí tại đây)</label>
              <div className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed box-border">
                <span className="text-gray-600 font-medium">
                  {parentPathText}
                </span>
                <KeyboardArrowRight className="text-gray-400" />
              </div>
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
                        flex : 1,
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

            <Box className="ml-1">
              <FormControlLabel
                control={
                  <Switch
                    checked={categoryStatus === 1}
                    onChange={(e) => setCategoryStatus(e.target.checked ? 1 : 0)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--color-theme)' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--color-theme)' },
                    }}
                  />
                }
                label={
                  <div>
                    <span className="text-gray-800 font-medium">Hoạt động</span>
                    <p className="text-xs text-gray-500 m-0">Kích hoạt danh mục này hiển thị công khai trên giao diện cửa hàng</p>
                  </div>
                }
              />
            </Box>

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
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;