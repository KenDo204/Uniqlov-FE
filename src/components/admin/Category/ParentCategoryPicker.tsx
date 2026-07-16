import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, IconButton, List, ListItemButton, ListItemText 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { CategoryResponse } from "@/types/category";

const THEME_PRIMARY = "var(--color-theme)";

interface ParentCategoryPickerProps {
  open: boolean;
  onClose: () => void;
  categoryTree: CategoryResponse[];
  onConfirm: (selectedId: number | null, pathText: string) => void;
}

const ParentCategoryPicker: React.FC<ParentCategoryPickerProps> = ({ open, onClose, categoryTree, onConfirm }) => {
  // activeL1, activeL2 dùng để render cột con tương ứng
  const [activeL1, setActiveL1] = useState<CategoryResponse | null>(null);
  const [activeL2, setActiveL2] = useState<CategoryResponse | null>(null);
  
  // selectedParent là danh mục thực sự được chọn làm cha
  const [selectedParent, setSelectedParent] = useState<CategoryResponse | null>(null);
  const [isRootSelected, setIsRootSelected] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      // Reset khi mở lại
      setActiveL1(null); setActiveL2(null);
      setSelectedParent(null); setIsRootSelected(true);
    }
  }, [open]);

  const handleSelectRoot = () => {
    setIsRootSelected(true);
    setSelectedParent(null);
    setActiveL1(null);
    setActiveL2(null);
  };

  const handleSelectL1 = (cat: CategoryResponse) => {
    setActiveL1(cat);
    setActiveL2(null); // Reset cột 3
    setSelectedParent(cat);
    setIsRootSelected(false);
  };

  const handleSelectL2 = (cat: CategoryResponse) => {
    setActiveL2(cat);
    setSelectedParent(cat);
    setIsRootSelected(false);
  };

  const handleConfirmClick = () => {
    if (isRootSelected) {
      onConfirm(null, "Không có (Làm danh mục gốc)");
    } else if (selectedParent) {
      // Tạo chuỗi hiển thị
      let path = "";
      if (activeL1) path += activeL1.categoryName;
      if (activeL2 && selectedParent.categoryId === activeL2.categoryId) path += ` > ${activeL2.categoryName}`;
      onConfirm(selectedParent.categoryId, path);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 2, height: '80vh', maxHeight: 600 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #f3f4f6' }}>
        <div>
          <Typography variant="h6" color="#374151" sx={{ fontWeight: 'bold' }}>Chọn danh mục cha</Typography>
          <Typography variant="body2" color="textSecondary">Chọn vị trí mà danh mục mới sẽ nằm dưới</Typography>
        </div>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '24px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        {/* Nút chọn làm danh mục gốc */}
        <Button 
          variant={isRootSelected ? "contained" : "outlined"}
          onClick={handleSelectRoot}
          sx={{ 
            py: 1.5, 
            justifyContent: 'flex-start', 
            textTransform: 'none', 
            fontSize: '15px', 
            borderRadius: 2,
            boxShadow: 'none',
            
            // Tách riêng Style dựa trên trạng thái Select
            ...(isRootSelected 
              ? {
                  // --- KHI ĐƯỢC CHỌN ---
                  bgcolor: 'var(--color-theme)', // Hoặc THEME_PRIMARY (#00927c)
                  color: '#ffffff', // Đổi thành màu trắng để nổi bật trên nền xanh đậm
                  borderColor: 'var(--color-theme)',
                  '&:hover': { 
                    bgcolor: 'var(--color-theme-hover)', // Màu hover đậm hơn (#007a68)
                    borderColor: 'var(--color-theme-hover)',
                    boxShadow: 'none',
                  }
                }
              : {
                  // --- KHI CHƯA ĐƯỢC CHỌN ---
                  bgcolor: 'transparent',
                  color: '#6b7280', // Xám
                  borderColor: '#e5e7eb', // Xám nhạt
                  '&:hover': { 
                    bgcolor: 'var(--color-theme-light)', // Nền xanh nhạt (#ccfbf1)
                    color: 'var(--color-theme)', // Chữ đổi sang xanh khi hover (tùy chọn)
                    borderColor: 'var(--color-theme)', // Viền đổi sang xanh
                    boxShadow: 'none',
                  }
                }
            )
          }}
        >
          {isRootSelected ? "✓ Đang chọn: Không có cha (Làm danh mục gốc)" : "⚪ Bấm vào đây để làm Danh mục gốc"}
        </Button>

        {/* Khung 3 cột danh mục */}
        <Box sx={{ display: 'flex', flexGrow: 1, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden', height: 350 }}>
          
          {/* CỘT 1: Danh mục cấp 1 */}
          <List sx={{ width: '50%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0 }}>
            {categoryTree.map(cat => {
              const isSelected = selectedParent?.categoryId === cat.categoryId;
              const isActive = activeL1?.categoryId === cat.categoryId;

              return (
                <ListItemButton 
                  key={cat.categoryId} 
                  onClick={() => handleSelectL1(cat)}
                  sx={{ 
                    py: 1.2, px: 2, 
                    // Thay rgba bằng var(--color-theme-light)
                    bgcolor: isSelected ? 'var(--color-theme-light)' : (isActive ? '#f9fafb' : 'transparent'),
                    borderLeft: '3px solid',
                    borderColor: isSelected ? THEME_PRIMARY : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      // Giữ nguyên nền sáng nếu đã chọn, nếu chưa thì hiển thị xám nhạt
                      bgcolor: isSelected ? 'var(--color-theme-light)' : '#f3f4f6',
                      '& .MuiTypography-root, & .MuiSvgIcon-root': {
                        color: 'var(--color-theme-hover)' // Hover vào chữ/icon sẽ đậm hơn
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ 
                        fontSize: '14px', 
                        color: isActive || isSelected ? THEME_PRIMARY : '#374151', 
                        fontWeight: isActive || isSelected ? 600 : 400,
                        transition: 'color 0.2s'
                      }}>
                        {cat.categoryName}
                      </Typography>
                    } 
                  />
                  {(cat.children && cat.children.length > 0) && (
                    <ChevronRightIcon sx={{ 
                      fontSize: 20, 
                      color: isActive || isSelected ? THEME_PRIMARY : '#9ca3af',
                      transition: 'color 0.2s'
                    }} />
                  )}
                </ListItemButton>
              );
            })}
          </List>

          {/* CỘT 2: Danh mục cấp 2 */}
          <List sx={{ width: '50%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0, bgcolor: '#fafafa' }}>
            {activeL1?.children?.map((cat: CategoryResponse) => {
              const isSelected = selectedParent?.categoryId === cat.categoryId;
              const isActive = activeL2?.categoryId === cat.categoryId;

              return (
                <ListItemButton 
                  key={cat.categoryId} 
                  onClick={() => handleSelectL2(cat)}
                  sx={{ 
                    py: 1.2, px: 2,
                    bgcolor: isSelected ? 'var(--color-theme-light)' : 'transparent',
                    borderLeft: '3px solid',
                    borderColor: isSelected ? THEME_PRIMARY : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: isSelected ? 'var(--color-theme-light)' : '#f3f4f6',
                      '& .MuiTypography-root, & .MuiSvgIcon-root': {
                        color: 'var(--color-theme-hover)'
                      }
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography sx={{ 
                        fontSize: '14px', 
                        color: isActive || isSelected ? THEME_PRIMARY : '#374151', 
                        fontWeight: isActive || isSelected ? 600 : 400,
                        transition: 'color 0.2s' 
                      }}>
                        {cat.categoryName}
                      </Typography>
                    } 
                  />
                  {(cat.children && cat.children.length > 0) && (
                    <ChevronRightIcon sx={{ 
                      fontSize: 20, 
                      color: isActive || isSelected ? THEME_PRIMARY : '#9ca3af',
                      transition: 'color 0.2s' 
                    }} />
                  )}
                </ListItemButton>
              );
            })}
          </List>

          {/* CỘT 3: Danh mục cấp 3 (HIỂN THỊ NHƯNG KHÔNG ĐƯỢC CHỌN LÀM CHA) */}
          {/* <List sx={{ width: '33.33%', overflowY: 'auto', p: 0, bgcolor: '#f3f4f6' }}>
            {activeL2?.children?.map(cat => (
              <ListItemButton key={cat.categoryId} disabled sx={{ py: 1.2, px: 2, opacity: 0.6 }}>
                <ListItemText 
                  primary={cat.name} 
                  secondary="Đạt giới hạn cấp, không thể làm cha"
                  primaryTypographyProps={{ fontSize: '14px', color: '#6b7280' }} 
                  secondaryTypographyProps={{ fontSize: '11px', color: '#ef4444' }}
                />
              </ListItemButton>
            ))}
          </List> */}

        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Đang chọn: <span className="font-bold text-theme">{isRootSelected ? "Không có (Làm danh mục gốc)" : selectedParent?.categoryName}</span>
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
            sx={{ 
              bgcolor: THEME_PRIMARY, textTransform: 'none',
              fontWeight: 'bold', fontSize: '14px',
              px: 4, '&:hover': { bgcolor: 'var(--color-theme-hover)' } 
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ParentCategoryPicker;