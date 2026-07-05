import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { type RoleType } from '@/constants/roles';
import { Box, CircularProgress } from '@mui/material';

interface RoleGuardProps {
  allowedRoles: RoleType[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { user, accessToken, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress sx={{ color: 'theme' }} />
      </Box>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.roleName;

  const hasRequiredRole = userRole && allowedRoles.includes(userRole as RoleType);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}