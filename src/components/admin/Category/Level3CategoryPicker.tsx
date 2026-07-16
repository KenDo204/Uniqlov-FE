import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, IconButton, List, ListItemButton, ListItemText 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { CategoryResponse } from "@/types/category";

const THEME_PRIMARY = "var(--color-theme)";

interface Level3CategoryPickerProps {
  open: boolean;
  onClose: () => void;
  categoryTree: CategoryResponse[];
  // Trả về id và chuỗi đường dẫn (VD: Điện thoại > Apple > iPhone 15)
  onConfirm: (selectedId: number, pathText: string) => void; 
}

const Level3CategoryPicker: React.FC<Level3CategoryPickerProps> = ({ open, onClose, categoryTree, onConfirm }) => {
  // Trạng thái mở rộng (expand) của cột 1 và cột 2
  const [activeL1, setActiveL1] = useState<CategoryResponse | null>(null);
  const [activeL2, setActiveL2] = useState<CategoryResponse | null>(null);
  
  // Trạng thái lưu danh mục cấp 3 được chọn
  const [selectedL3, setSelectedL3] = useState<CategoryResponse | null>(null);

  useEffect(() => {
    if (open) {
      // Reset state mỗi khi mở popup
      setActiveL1(null); 
      setActiveL2(null);
      setSelectedL3(null);
    }
  }, [open]);

  // Handle click Cấp 1: Mở cột 2, đóng cột 3, xóa lựa chọn cũ
  const handleExpandL1 = (cat: CategoryResponse) => {
    setActiveL1(cat);
    setActiveL2(null);
    setSelectedL3(null); 
  };

  // Handle click Cấp 2: Mở cột 3, xóa lựa chọn cũ
  const handleExpandL2 = (cat: CategoryResponse) => {
    setActiveL2(cat);
    setSelectedL3(null);
  };

  // Handle click Cấp 3: Ghi nhận lựa chọn
  const handleSelectL3 = (cat: CategoryResponse) => {
    setSelectedL3(cat);
  };

  const handleConfirmClick = () => {
    if (activeL1 && activeL2 && selectedL3) {
      const pathText = `${activeL1.categoryName} > ${activeL2.categoryName} > ${selectedL3.categoryName}`;
      onConfirm(selectedL3.categoryId, pathText);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, height: '80vh', maxHeight: 600 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <Typography variant="h6" color="#374151" sx={{ fontWeight: 'bold' }}>Chọn danh mục sản phẩm</Typography>
          <Typography variant="body2" color="textSecondary">Vui lòng chọn chi tiết đến danh mục cấp 3</Typography>
        </div>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column' }}>
        
        {/* Khung 3 cột danh mục */}
        <Box sx={{ display: 'flex', flexGrow: 1, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden', minHeight: 400 }}>
          
          {/* ================= CỘT 1: Danh mục cấp 1 ================= */}
          <List sx={{ width: '33.33%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0 }}>
            {categoryTree.map(cat => {
              const isActive = activeL1?.categoryId === cat.categoryId;

              return (
                <ListItemButton 
                  key={cat.categoryId} 
                  onClick={() => handleExpandL1(cat)}
                  sx={{ 
                    py: 1.2, px: 2, 
                    bgcolor: isActive ? '#f9fafb' : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: '#f3f4f6',
                      '& .MuiTypography-root, & .MuiSvgIcon-root': { color: 'var(--color-theme-hover)' }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ 
                        fontSize: '14px', 
                        color: isActive ? THEME_PRIMARY : '#374151', 
                        fontWeight: isActive ? 600 : 400,
                        transition: 'color 0.2s'
                      }}>
                        {cat.categoryName}
                      </Typography>
                    } 
                  />
                  {(cat.children && cat.children.length > 0) && (
                    <ChevronRightIcon sx={{ fontSize: 20, color: isActive ? THEME_PRIMARY : '#9ca3af', transition: 'color 0.2s' }} />
                  )}
                </ListItemButton>
              );
            })}
          </List>

          {/* ================= CỘT 2: Danh mục cấp 2 ================= */}
          <List sx={{ width: '33.33%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0, bgcolor: '#fafafa' }}>
            {activeL1 ? (
              activeL1.children?.map((cat: CategoryResponse) => {
                const isActive = activeL2?.categoryId === cat.categoryId;

                return (
                  <ListItemButton 
                    key={cat.categoryId} 
                    onClick={() => handleExpandL2(cat)}
                    sx={{ 
                      py: 1.2, px: 2,
                      bgcolor: isActive ? '#f3f4f6' : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: '#e5e7eb',
                        '& .MuiTypography-root, & .MuiSvgIcon-root': { color: 'var(--color-theme-hover)' }
                      }
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Typography sx={{ 
                          fontSize: '14px', 
                          color: isActive ? THEME_PRIMARY : '#374151', 
                          fontWeight: isActive ? 600 : 400,
                          transition: 'color 0.2s' 
                        }}>
                          {cat.categoryName}
                        </Typography>
                      } 
                    />
                    {(cat.children && cat.children.length > 0) && (
                      <ChevronRightIcon sx={{ fontSize: 20, color: isActive ? THEME_PRIMARY : '#9ca3af', transition: 'color 0.2s' }} />
                    )}
                  </ListItemButton>
                );
              })
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Chọn danh mục cấp 1 để xem tiếp</Typography>
              </Box>
            )}
          </List>

          {/* ================= CỘT 3: Danh mục cấp 3 ================= */}
          <List sx={{ width: '33.34%', overflowY: 'auto', p: 0, bgcolor: '#f3f4f6' }}>
            {activeL2 ? (
              activeL2.children?.map(cat => {
                const isSelected = selectedL3?.categoryId === cat.categoryId;

                return (
                  <ListItemButton 
                    key={cat.categoryId} 
                    onClick={() => handleSelectL3(cat)}
                    sx={{ 
                      py: 1.2, px: 2, 
                      bgcolor: isSelected ? 'var(--color-theme-light)' : 'transparent',
                      borderLeft: '3px solid',
                      borderColor: isSelected ? THEME_PRIMARY : 'transparent',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: isSelected ? 'var(--color-theme-light)' : '#e5e7eb',
                        '& .MuiTypography-root': { color: 'var(--color-theme-hover)' }
                      }
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Typography sx={{ 
                          fontSize: '14px', 
                          color: isSelected ? THEME_PRIMARY : '#374151', 
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'color 0.2s'
                        }}>
                          {cat.categoryName}
                        </Typography>
                      } 
                    />
                  </ListItemButton>
                );
              })
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Chọn danh mục cấp 2 để xem tiếp</Typography>
              </Box>
            )}
          </List>

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Đang chọn: <span className="font-bold text-theme">
            {selectedL3 ? `${activeL1?.categoryName} > ${activeL2?.categoryName} > ${selectedL3.categoryName}` : 'Chưa chọn'}
          </span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ 
                color: '#FFFFFF', 
                borderColor: '#d1d5db', textTransform: 'none', px: 3,
                backgroundColor: 'var(--color-cancel)',
                fontWeight: 'bold', fontSize: '14px',
                '&:hover': { backgroundColor: 'var(--color-cancel-hover)' }
            }}
          >
            Hủy
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmClick}
            disabled={!selectedL3} // Vô hiệu hóa nếu chưa chọn Cấp 3
            sx={{ 
              bgcolor: THEME_PRIMARY, textTransform: 'none',
              fontWeight: 'bold', fontSize: '14px',
              px: 4, 
              '&:hover': { bgcolor: 'var(--color-theme-hover)' },
              '&.Mui-disabled': { bgcolor: '#e5e7eb', color: '#9ca3af' }
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default Level3CategoryPicker;