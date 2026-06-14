import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ROLES, type RoleType } from '../constants/roles';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface RoleGuardProps {
  allowedRoles: RoleType[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // Get user role from Clerk publicMetadata or default to CUSTOMER
  const userRole = (user?.publicMetadata?.role as RoleType) || ROLES.CUSTOMER;

  if (!allowedRoles.includes(userRole)) {
    // If user's role is not authorized, redirect them to customer home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
