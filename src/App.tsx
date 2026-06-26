import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { AppProvider } from './providers/AppProvider';
import { router } from './routes';
import { useAuth } from './hooks/useAuth';

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
        <CircularProgress sx={{ color: '#00927c' }} />
      </Box>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <AppProvider>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </AppProvider>
  );
}

export default App;