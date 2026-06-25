import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Users, FolderTree, LogOut, Checkroom, ShieldCheck, Lock, ShoppingBag, Ticket} from '@/components/ui/icons';
import { paths } from '@/config/paths';
import { BRAND } from '@/constants/brand';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import EasyMall_Logo from '@/assets/icons/EasyMall_Logo.png';
import AvatarNav from '@/components/admin/Navbar/AvatarNav';
import MobileNav from '@/components/admin/Navbar/MobileNav';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Tổng quan', path: paths.admin.dashboard, icon: LayoutDashboard },
    // { label: 'Quản lý Banners', path: paths.admin.banners, icon: Image },
    // { label: 'Quản lý Thương hiệu', path: paths.admin.brands, icon: Settings },
    { label: 'Quản lý Danh mục', path: paths.admin.categories, icon: FolderTree },
    { label: 'Quản lý Sản phẩm', path: paths.admin.products, icon: Checkroom },
    { label: 'Quản lý Đơn hàng', path: paths.admin.orders, icon: ShoppingBag },
    { label: 'Quản lý Mã giảm giá', path: paths.admin.coupons, icon: Ticket },
    { label: 'Quản lý Người dùng', path: paths.admin.users, icon: Users },
    { label: 'Quản lý Vai trò', path: paths.admin.roles, icon: ShieldCheck },
    { label: 'Quản lý Quyền', path: paths.admin.permissions, icon: Lock },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất thành công!', { position: 'top-right' });
      navigate('/login');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất.', { position: 'top-right' });
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 w-full text-left">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-gray-200 bg-white flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-theme transition-opacity decoration-none">
            <img
              src={EasyMall_Logo}
              alt={`${BRAND.NAME} Logo`}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <span>Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== paths.admin.dashboard && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-theme text-white shadow-md shadow-[#00927c]/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-theme dark:hover:text-theme'
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
            onClick={handleLogout} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer">
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 bg-transparent cursor-pointer flex items-center justify-center text-gray-600"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 m-0">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {user && <AvatarNav admin={user} />}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </div>
  );
}
