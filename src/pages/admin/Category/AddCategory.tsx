import React, { useEffect, useState } from 'react';
import {
  TextField, Button, CircularProgress, Box, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, KeyboardArrowRight, Save } from '@mui/icons-material';
import { useCategory } from '@/hooks/useCategory';
import { toast } from 'react-toastify';
import ParentCategoryPicker from '@/components/admin/Category/ParentCategoryPicker';

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const { categories, isSubmitting, fetchAdminCategories, createCategory } = useCategory();

  const [categoryName, setCategoryName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentPathText, setParentPathText] = useState<string>('Không có (Làm danh mục gốc)');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  const [iconUrl, setIconUrl] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [targetDemographic, setTargetDemographic] = useState<number>(0);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchAdminCategories().catch(err => {
        console.error('Error fetching categories:', err);
      });
    }
  }, [categories, fetchAdminCategories]);

  const handleConfirmParent = (selectedId: number | null, pathText: string) => {
    setParentId(selectedId);
    setParentPathText(pathText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      await createCategory({
        categoryName: categoryName.trim(),
        parentId: parentId ?? undefined,
        iconUrl: iconUrl.trim() || undefined,
        targetDemographic: targetDemographic || undefined,
        categoryType: categoryType.trim() || undefined,
        displayOrder: displayOrder || undefined,
      });

      toast.success('Thêm danh mục mới thành công!');
      fetchAdminCategories();
      navigate('/admin/categories');
    } catch (error: any) {
      toast.error(error || 'Thêm danh mục thất bại');
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-left">
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
                    '&:hover fieldset': { borderColor: '#00927c' },
                    '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
                }}
              />
            </Box>

            <Box>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Danh mục cha</label>
              <div
                onClick={() => setIsPickerOpen(true)}
                className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl cursor-pointer hover:border-[#00927c] transition-colors bg-white box-border"
              >
                <span className={parentId === null ? 'text-gray-800 font-medium' : 'text-[#00927c] font-medium'}>
                  {parentPathText}
                </span>
                <KeyboardArrowRight className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Nhấp vào khung trên để mở bảng chọn danh mục cha.</p>
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box>
                <TextField
                  fullWidth
                  label="Loại danh mục (Type)"
                  variant="outlined"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  placeholder="VD: PHYSICAL, DIGITAL..."
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': { borderColor: '#00927c' },
                      '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  select
                  label="Nhóm khách hàng (Demographic)"
                  value={targetDemographic}
                  onChange={(e) => setTargetDemographic(Number(e.target.value))}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': { borderColor: '#00927c' },
                      '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
                  }}
                >
                  <MenuItem value={0}>Tất cả</MenuItem>
                  <MenuItem value={1}>Nam</MenuItem>
                  <MenuItem value={2}>Nữ</MenuItem>
                  <MenuItem value={3}>Trẻ em</MenuItem>
                </TextField>
              </Box>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Box>
                <TextField
                  fullWidth
                  label="Thứ tự hiển thị"
                  type="number"
                  variant="outlined"
                  value={displayOrder || ''}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  placeholder="VD: 1, 2, 3..."
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': { borderColor: '#00927c' },
                      '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
                  }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Đường dẫn Icon (URL)"
                  variant="outlined"
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  placeholder="VD: https://example.com/icon.png"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '0.75rem',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      transition: 'all 0.3s ease',
                      '&:hover fieldset': { borderColor: '#00927c' },
                      '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
                  }}
                />
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
                  bgcolor: '#00927c',
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