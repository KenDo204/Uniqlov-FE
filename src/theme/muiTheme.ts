import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#00927c', // Màu xanh chủ đạo của EasyMall
    },
    error: {
      main: '#dc2626', // Màu đỏ chung cho lỗi/xóa
    },
  },
  typography: {
    fontFamily: 'Geist Variable, sans-serif', // Ép MUI dùng chung font với Tailwind
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Tắt tự động viết hoa chữ của nút MUI
          borderRadius: '8px',
        },
      },
    },
  },
});