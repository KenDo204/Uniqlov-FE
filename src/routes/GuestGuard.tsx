import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

export function GuestGuard() {
  const { isAuthenticated, loading } = useAuth();

  // Hiển thị loading nếu đang check trạng thái auth
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress sx={{ color: 'theme' }} />
      </Box>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> Chặn không cho vào /login, đẩy về trang chủ
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // NẾU CHƯA ĐĂNG NHẬP -> Cho phép truy cập route con (Login, Register)
  return <Outlet />;
}