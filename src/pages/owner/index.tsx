export function OwnerDashboard() {
  return (
    <div className="space-y-6 w-full text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Doanh thu tháng</h4>
          <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400 m-0">45.200.000đ</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Đơn hàng mới</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">12</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h4 className="text-sm text-gray-500 font-medium m-0">Sản phẩm đăng bán</h4>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50 m-0">38</p>
        </div>
      </div>
    </div>
  );
}

export function OwnerOrders() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Đơn hàng</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Theo dõi, duyệt và xử lý giao nhận hàng cho khách.</p>
    </div>
  );
}

export function OwnerProducts() {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 w-full text-left">
      <h3 className="text-lg font-bold m-0">Quản lý Sản phẩm Shop</h3>
      <p className="text-sm text-gray-500 mt-1 m-0">Cập nhật kho hàng, điều chỉnh giá bán và hình ảnh sản phẩm.</p>
    </div>
  );
}
