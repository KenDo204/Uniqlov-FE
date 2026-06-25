import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { AppProvider } from './providers/AppProvider';
import { router } from './routes';
import { useAuth } from './hooks/useAuth';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { resetAuth, fetchProfile, introspectToken } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const verifySession = async () => {

      const token = localStorage.getItem('accessToken'); 
      
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {

        const isValid = await introspectToken(token);

        if (isValid) {
          await fetchProfile();
        } else {
          resetAuth();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        console.error("Lỗi khi kiểm định token:", error);
        resetAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, [fetchProfile, resetAuth, introspectToken]);

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