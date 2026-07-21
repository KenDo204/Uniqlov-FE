export { default as AdminDashboard } from './Dashboard/Dashboard';

export function AdminBanners() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Banners</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Kéo thả để sắp xếp thứ tự hiển thị banner trang chủ.</p>
    </div>
  );
}

export function AdminBrands() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Thương hiệu</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Danh sách và thông tin các thương hiệu nhạc cụ.</p>
    </div>
  );
}

export function AdminCategories() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Danh mục</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Quản lý phân loại, cấp bậc danh mục nhạc cụ.</p>
    </div>
  );
}

export function AdminUsers() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Người dùng</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Cấp quyền ADMIN, OWNER, CUSTOMER và theo dõi trạng thái tài khoản.</p>
    </div>
  );
}
