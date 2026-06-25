import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { AdminDashboard, AdminBrands } from '../pages/admin';
import CategoryList from '../pages/admin/Category/CategoryList';
import AddCategory from '../pages/admin/Category/AddCategory';
import EditCategory from '../pages/admin/Category/EditCategory';
import UserList from '../pages/admin/User/UserList';
import RoleList from '../pages/admin/Role/RoleList';
import PermissionList from '../pages/admin/Permission/PermissionList';
import AdminProductList from '../pages/admin/Product/AdminProductList';
import AdminSliderManager from '../pages/admin/Slider/AdminSliderManager';
import { RoleGuard } from './RoleGuard';
import { ROLES } from '@/constants/roles';

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'banners', element: <AdminSliderManager /> },
        { path: 'brands', element: <AdminBrands /> },
        {
          path: 'categories',
          children: [
            { path: '', element: <CategoryList /> },
            { path: 'add', element: <AddCategory /> },
            { path: 'edit/:categoryId', element: <EditCategory /> },
          ],
        },
        { path: 'users', element: <UserList /> },
        { path: 'roles', element: <RoleList /> },
        { path: 'permissions', element: <PermissionList /> },
        { path: 'products', element: <AdminProductList /> },
      ],
    },
  ],
};
