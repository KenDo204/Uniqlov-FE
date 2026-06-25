import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export function Account() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đã đăng xuất thành công!', { position: 'top-right' });
      navigate('/login'); // Chuyển hướng người dùng về trang đăng nhập
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất.', { position: 'top-right' });
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `bg-transparent border-none p-0 cursor-pointer text-left w-full block ${isActive ? 'font-bold text-theme' : 'text-gray-600'
    }`;

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Layout 2 cột: Sidebar trái & Nội dung phải */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start">

          {/* ========================================== */}
          {/* SIDEBAR NAVIGATION */}
          {/* ========================================== */}
          <div className="w-full md:w-64 shrink-0 space-y-10">

            {/* Nhóm 1: Tư cách thành viên */}
            <div>
              <h3 className="text-[16px] font-medium mb-4">Tư cách thành viên</h3>
              <ul className="list-none p-0 m-0 space-y-4 text-[14px]">
                <li>
                  <NavLink to="/account/orders" className={navLinkClass}>
                    Lịch sử mua hàng
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/account/wishlists" className={navLinkClass}>
                    Yêu thích
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/account/reviews" className={navLinkClass}>
                    Đánh giá đã đăng
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Nhóm 2: Cài đặt hồ sơ */}
            <div>
              <h3 className="text-[16px] font-medium mb-4">Cài đặt hồ sơ</h3>
              <ul className="list-none p-0 m-0 space-y-4 text-[14px]">
                <li>
                  <NavLink to="/account/profile" className={navLinkClass}>
                    Hồ sơ
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/account/addresses" className={navLinkClass}>
                    Sổ địa chỉ
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to="/account/password" className={navLinkClass}>
                    Thay đổi mật khẩu
                  </NavLink>
                </li> */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent border-none p-0 cursor-pointer text-left w-full text-gray-600 block mt-4"
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================== */}
          {/* MAIN CONTENT (Các component con sẽ render ở đây) */}
          {/* ========================================== */}
          <div className="flex-1 w-full">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}