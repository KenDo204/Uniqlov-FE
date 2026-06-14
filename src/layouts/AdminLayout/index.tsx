import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, Settings, Users, FolderTree, LogOut, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';
import { paths } from '../../config/paths';

export default function AdminLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const menuItems = [
    { label: 'Tổng quan', path: paths.admin.dashboard, icon: LayoutDashboard },
    { label: 'Quản lý Banners', path: paths.admin.banners, icon: Image },
    { label: 'Quản lý Thương hiệu', path: paths.admin.brands, icon: Settings },
    { label: 'Quản lý Danh mục', path: paths.admin.categories, icon: FolderTree },
    { label: 'Quản lý Người dùng', path: paths.admin.users, icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 w-full text-left">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Yami Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-950 dark:hover:text-gray-50'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
            title="Đổi giao diện"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer">
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 m-0">
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
