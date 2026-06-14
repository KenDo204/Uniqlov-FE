/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { adminRoutes } from './AdminRoutes';
import { ownerRoutes } from './OwnerRoutes';
import { customerRoutes } from './CustomerRoutes';

// Lazy load auth pages
const LoginPage = lazy(() => import('../pages/auth').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth').then((m) => ({ default: m.RegisterPage })));

export const router = createBrowserRouter([
  // Customer routes
  customerRoutes,

  // Admin routes
  adminRoutes,

  // Owner routes
  ownerRoutes,

  // Auth routes
  {
    path: 'auth',
    element: (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <LoadingSpinner />
          </div>
        }
      >
        <AuthLayout />
      </Suspense>
    ),
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text m-0">404</h2>
        <p className="mt-2 text-sm text-gray-500 m-0">Trang bạn tìm kiếm không tồn tại.</p>
        <a href="/" className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-sm shadow-md transition-all decoration-none">
          Quay lại trang chủ
        </a>
      </div>
    ),
  },
]);
