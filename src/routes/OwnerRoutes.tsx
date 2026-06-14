import type { RouteObject } from 'react-router-dom';
import OwnerLayout from '../layouts/OwnerLayout';
import { OwnerDashboard, OwnerOrders, OwnerProducts } from '../pages/owner';
import { RoleGuard } from './RoleGuard';

export const ownerRoutes: RouteObject = {
  path: 'owner',
  element: <RoleGuard allowedRoles={['OWNER']} />,
  children: [
    {
      element: <OwnerLayout />,
      children: [
        { path: '', element: <OwnerDashboard /> },
        { path: 'dashboard', element: <OwnerDashboard /> },
        { path: 'orders', element: <OwnerOrders /> },
        { path: 'products', element: <OwnerProducts /> },
      ],
    },
  ],
};
