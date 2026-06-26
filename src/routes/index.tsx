import { createBrowserRouter } from 'react-router-dom';
import { adminRoutes } from './AdminRoutes';
import { ownerRoutes } from './OwnerRoutes';
import { customerRoutes } from './CustomerRoutes';
import BackHome from '../components/general/BackHomeButton';

export const router = createBrowserRouter([
  // Customer routes
  customerRoutes,

  // Admin routes
  adminRoutes,

  // Owner routes
  ownerRoutes,

  // Fallback 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
        <h2 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text m-0">404</h2>
        <p className="mt-2 text-sm text-gray-500 m-0">Trang bạn tìm kiếm không tồn tại.</p>
        <div className="mt-4">
          <BackHome />
        </div>
      </div>
    ),
  },
]);
