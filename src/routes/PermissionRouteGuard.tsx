import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

interface PermissionRouteGuardProps {
  permission: string;
}

export function PermissionRouteGuard({ permission }: PermissionRouteGuardProps) {
  const { hasPermission, loading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!loading) {
      const isAllowed = hasPermission(permission);
      setAllowed(isAllowed);
      setChecked(true);
      if (!isAllowed) {
        toast.error('Bạn không có quyền truy cập chức năng này.', { toastId: 'forbidden' });
      }
    }
  }, [loading, hasPermission, permission]);

  if (loading || !checked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress sx={{ color: 'theme' }} />
      </Box>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
