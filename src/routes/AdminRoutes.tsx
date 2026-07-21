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
import SliderList from '../pages/admin/Slider/SliderList';
import AddSlider from '../pages/admin/Slider/AddSlider';
import EditSlider from '../pages/admin/Slider/EditSlider';
import ContactManagement from '../pages/admin/Contact/ContactManagement';
import CouponList from '../pages/admin/Coupon/CouponList';
import OrderList from '../pages/admin/Order/OrderList';
import RiskManagement from '../pages/admin/RiskManagement/RiskManagement';
import { RoleGuard } from './RoleGuard';
import { PermissionRouteGuard } from './PermissionRouteGuard';
import { ROLES } from '@/constants/roles';

export const adminRoutes: RouteObject = {
  path: 'admin',
  element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        {
          element: <PermissionRouteGuard permission="dashboard:view" />,
          children: [
            { path: '', element: <AdminDashboard /> },
            { path: 'dashboard', element: <AdminDashboard /> },
          ]
        },
        {
          path: 'sliders',
          element: <PermissionRouteGuard permission="slider:read" />,
          children: [
            { path: '', element: <SliderList /> },
            { path: 'add', element: <PermissionRouteGuard permission="slider:create" />, children: [{ path: '', element: <AddSlider /> }] },
            { path: 'edit/:sliderId', element: <PermissionRouteGuard permission="slider:update" />, children: [{ path: '', element: <EditSlider /> }] },
          ],
        },
        { 
          path: 'brands', 
          element: <PermissionRouteGuard permission="brand:read" />,
          children: [{ path: '', element: <AdminBrands /> }]
        },
        {
          path: 'categories',
          element: <PermissionRouteGuard permission="category:read" />,
          children: [
            { path: '', element: <CategoryList /> },
            { path: 'add', element: <PermissionRouteGuard permission="category:create" />, children: [{ path: '', element: <AddCategory /> }] },
            { path: 'edit/:categoryId', element: <PermissionRouteGuard permission="category:update" />, children: [{ path: '', element: <EditCategory /> }] },
          ],
        },
        { 
          path: 'users', 
          element: <PermissionRouteGuard permission="user:read" />,
          children: [{ path: '', element: <UserList /> }]
        },
        { 
          path: 'roles', 
          element: <PermissionRouteGuard permission="role:read" />,
          children: [{ path: '', element: <RoleList /> }]
        },
        { 
          path: 'permissions', 
          element: <PermissionRouteGuard permission="permission:read" />,
          children: [{ path: '', element: <PermissionList /> }]
        },
        {
          path: 'products',
          element: <PermissionRouteGuard permission="product:read" />,
          children: [
            { path: '', element: <AdminProductList /> },
            { path: 'add', element: <PermissionRouteGuard permission="product:create" />, children: [{ path: '', element: <AddProduct /> }] },
            { path: 'edit/:productId', element: <PermissionRouteGuard permission="product:update" />, children: [{ path: '', element: <EditProduct /> }] },
          ],
        },
        { 
          path: 'contacts', 
          element: <PermissionRouteGuard permission="contact:read" />,
          children: [{ path: '', element: <ContactManagement /> }]
        },
        { 
          path: 'orders', 
          element: <PermissionRouteGuard permission="order:read" />,
          children: [{ path: '', element: <OrderList /> }]
        },
        { 
          path: 'coupons', 
          element: <PermissionRouteGuard permission="coupon:read" />,
          children: [{ path: '', element: <CouponList /> }]
        },
        { 
          path: 'risk', 
          element: <PermissionRouteGuard permission="risk_rule:manage" />,
          children: [{ path: '', element: <RiskManagement /> }]
        },
      ],
    },
  ],
};
