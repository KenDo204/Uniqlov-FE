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
import AddProduct from '../pages/admin/Product/AddProduct';
import EditProduct from '../pages/admin/Product/EditProduct';
import AdminSliderManager from '../pages/admin/Slider/AdminSliderManager';
import CouponList from '../pages/admin/Coupon/CouponList';
import OrderList from '../pages/admin/Order/OrderList';
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
        {
          path: 'products',
          children: [
            { path: '', element: <AdminProductList /> },
            { path: 'add', element: <AddProduct /> },
            { path: 'edit/:productId', element: <EditProduct /> },
          ],
        },
        { path: 'orders', element: <OrderList /> },
        { path: 'coupons', element: <CouponList /> },
      ],
    },
  ],
};
