import React, { useState, useEffect } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, IconButton, List, ListItemButton, ListItemText 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { CategoryResponse } from "@/types/category";

const THEME_PRIMARY = "#00927c";

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
            py: 1.5, justifyContent: 'flex-start', textTransform: 'none', fontSize: '15px', borderRadius: 2,
            bgcolor: isRootSelected ? 'rgba(0, 146, 124, 0.1)' : 'transparent',
            color: isRootSelected ? THEME_PRIMARY : '#6b7280',
            borderColor: isRootSelected ? THEME_PRIMARY : '#e5e7eb',
            boxShadow: 'none', '&:hover': { boxShadow: 'none', bgcolor: 'rgba(0, 146, 124, 0.05)', borderColor: THEME_PRIMARY }
          }}
        >
          {isRootSelected ? "✓ Đang chọn: Không có cha (Làm danh mục gốc)" : "⚪ Bấm vào đây để làm Danh mục gốc"}
        </Button>

        {/* Khung 3 cột danh mục */}
        <Box sx={{ display: 'flex', flexGrow: 1, border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden', height: 350 }}>
          
          {/* CỘT 1: Danh mục cấp 1 */}
          <List sx={{ width: '50%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0 }}>
            {categoryTree.map(cat => (
              <ListItemButton 
                key={cat.categoryId} onClick={() => handleSelectL1(cat)}
                sx={{ 
                  py: 1.2, px: 2, 
                  bgcolor: selectedParent?.categoryId === cat.categoryId ? 'rgba(0, 146, 124, 0.1)' : (activeL1?.categoryId === cat.categoryId ? '#f9fafb' : 'transparent'),
                  borderLeft: selectedParent?.categoryId === cat.categoryId ? `3px solid ${THEME_PRIMARY}` : '3px solid transparent'
                }}
              >
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: '14px', color: activeL1?.categoryId === cat.categoryId ? THEME_PRIMARY : '#374151', fontWeight: activeL1?.categoryId === cat.categoryId ? 'bold' : 'normal' }}>
                      {cat.categoryName}
                    </Typography>
                  } 
                />
                {(cat.children && cat.children.length > 0) && <ChevronRightIcon sx={{ fontSize: 20, color: activeL1?.categoryId === cat.categoryId ? THEME_PRIMARY : '#9ca3af' }} />}
              </ListItemButton>
            ))}
          </List>

          {/* CỘT 2: Danh mục cấp 2 */}
          <List sx={{ width: '50%', borderRight: '1px solid #e5e7eb', overflowY: 'auto', p: 0, bgcolor: '#fafafa' }}>
            {activeL1?.children?.map((cat: CategoryResponse) => (
              <ListItemButton 
                key={cat.categoryId} onClick={() => handleSelectL2(cat)}
                sx={{ 
                  py: 1.2, px: 2,
                  bgcolor: selectedParent?.categoryId === cat.categoryId ? 'rgba(0, 146, 124, 0.1)' : 'transparent',
                  borderLeft: selectedParent?.categoryId === cat.categoryId ? `3px solid ${THEME_PRIMARY}` : '3px solid transparent'
                }}
              >
                <ListItemText 
                  primary={
                    <Typography sx={{ fontSize: '14px', color: activeL2?.categoryId === cat.categoryId ? THEME_PRIMARY : '#374151', fontWeight: activeL2?.categoryId === cat.categoryId ? 'bold' : 'normal' }}>
                      {cat.categoryName}
                    </Typography>
                  } 
                />
                {(cat.children && cat.children.length > 0) && <ChevronRightIcon sx={{ fontSize: 20, color: '#9ca3af' }} />}
              </ListItemButton>
            ))}
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
          Đang chọn: <span className="font-bold text-[#00927c]">{isRootSelected ? "Không có (Làm danh mục gốc)" : selectedParent?.categoryName}</span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={onClose} 
            sx={{ 
                color: '#FFFFFF', 
                borderColor: '#d1d5db', textTransform: 'none', px: 3,
                backgroundColor: '#ef4444',
                fontWeight: 'bold', fontSize: '14px',
                '&:hover': { backgroundColor: '#dc2626' }
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
              px: 4, '&:hover': { bgcolor: '#007a68' } 
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