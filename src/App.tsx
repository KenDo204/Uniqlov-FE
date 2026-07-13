import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { AppProvider } from './providers/AppProvider';
import { router } from './routes';
import { useAuth } from './hooks/useAuth';
import { useWishlist } from './hooks/useWishlist';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { fetchProfile } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        // Thay vì kiểm định accessToken tĩnh qua introspect (gây logout ngay khi access token hết hạn),
        // ta trực tiếp gọi fetchProfile(). Nếu accessToken hết hạn, Axios Interceptor sẽ tự động
        // gọi /auth/refresh để lấy token mới và retry request thành công.
        await fetchProfile();
      } catch (error) {
        console.error("Lỗi khi nạp thông tin phiên đăng nhập:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, [fetchProfile]);

  if (isInitializing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress sx={{ color: 'theme' }} />
      </Box>
    );
  }

  return <>{children}</>;
}

function GlobalDataInitializer() {
  const { isAuthenticated } = useAuth();
  const { fetchMyWishlist, clearData: clearWishlist } = useWishlist();

  useEffect(() => {
    if (isAuthenticated) {
      // Tự động fetch Wishlist ngay khi vào app hoặc sau khi login
      fetchMyWishlist().catch(console.error);
    } else {
      // Tự động xóa dữ liệu khỏi Redux khi Guest hoặc khi Logout
      clearWishlist();
    }
  }, [isAuthenticated, fetchMyWishlist, clearWishlist]);

  return null;
}

function App() {
  return (
    <AppProvider>
      <AuthInitializer>
        <GlobalDataInitializer />
        <RouterProvider router={router} />
      </AuthInitializer>
    </AppProvider>
  );
}

export default App;