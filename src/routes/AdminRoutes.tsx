import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { AdminDashboard, AdminBanners, AdminBrands, AdminCategories, AdminUsers } from '../pages/admin';
import { RoleGuard } from './RoleGuard';

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <RoleGuard allowedRoles={['ADMIN']} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'banners', element: <AdminBanners /> },
        { path: 'brands', element: <AdminBrands /> },
        { path: 'categories', element: <AdminCategories /> },
        { path: 'users', element: <AdminUsers /> },
      ],
    },
  ],
};
