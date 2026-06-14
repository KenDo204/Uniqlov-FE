export function AdminDashboard() {
  return (
    <div className="space-y-6 w-full text-left">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Thành viên</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">1,245</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Cửa hàng (Owner)</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">84</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Danh mục</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">16</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Banners hoạt động</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">5</p>
        </div>
      </div>
    </div>
  );
}

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
