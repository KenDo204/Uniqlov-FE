import React, { useEffect } from 'react';
import { Typography, Skeleton, Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/admin/Dashboard/StatCard';
import { OrderBarChart } from '@/components/admin/Dashboard/OrderBarChart';
import { OrderPieChart } from '@/components/admin/Dashboard/OrderPieChart';
import { RevenueCard } from '@/components/admin/Dashboard/RevenueCard';

export const Dashboard: React.FC = () => {
  const {
    overview,
    totalRevenue,
    isFetchingOverview,
    isFetchingRevenue,
    error,
    fetchOverview,
    fetchRevenue,
  } = useDashboard();

  useEffect(() => {
    fetchOverview().catch((err) => console.error('Error fetching dashboard overview:', err));
    fetchRevenue().catch((err) => console.error('Error fetching dashboard revenue:', err));
  }, [fetchOverview, fetchRevenue]);

  const handleRefresh = () => {
    fetchOverview().catch(console.error);
    fetchRevenue().catch(console.error);
  };

  const isLoading = isFetchingOverview || isFetchingRevenue;

  return (
    <div className="w-full max-w-full 2xl:max-w-[1600px] 2xl:mx-auto text-left flex flex-col gap-6 sm:gap-8 overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 m-0">
            Bảng điều khiển (Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 m-0">
            Tổng quan chỉ số kinh doanh và thống kê dữ liệu hệ thống EasyMall
          </p>
        </div>

        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={isLoading}
          startIcon={<RefreshIcon />}
          className="w-full sm:w-auto"
          sx={{
            color: '#374151',
            borderColor: '#d1d5db',
            textTransform: 'none',
            px: 2.5,
            py: 1,
            fontWeight: 700,
            borderRadius: '12px',
            '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
          }}
        >
          Làm mới dữ liệu
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Top Revenue & Key Financial Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
          <div className="col-span-1 xl:col-span-5 flex flex-col min-w-0">
            {isLoading && !overview ? (
              <Skeleton 
                variant="rounded" 
                className="w-full h-full min-h-[320px] !rounded-2xl" 
              />
            ) : (
              <div className="h-full min-w-0">
                <RevenueCard 
                  apiRevenue={totalRevenue} 
                  orderStatsRevenue={overview?.orderStats?.totalRevenue} 
                />
              </div>
            )}
          </div>

          {/* Thẻ Biểu đồ Order: Chiếm 7/12 cột còn lại */}
          <div className="col-span-1 xl:col-span-7 flex flex-col min-w-0">
            {isLoading && !overview ? (
              <Skeleton 
                variant="rounded" 
                className="w-full h-full min-h-[320px] !rounded-2xl" 
              />
            ) : (
              <div className="h-full min-w-0">
                <OrderBarChart orderStats={overview?.orderStats} />
              </div>
            )}
          </div>
        </div>

      {/* Order Ratio Pie Chart & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div className="md:col-span-6">
          {isLoading && !overview ? (
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: '16px' }} />
          ) : (
            <OrderPieChart orderStats={overview?.orderStats} />
          )}
        </div>
        <div className="md:col-span-6">
          {/* Detailed Summary Card */}
          <div className="p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 bg-white h-full flex flex-col justify-between">
            <Typography variant="h6" className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Thống kê tổng đơn hàng
            </Typography>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-4 bg-amber-50 rounded-xl border border-amber-200/60 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-amber-800">
                  Đơn hàng chờ xử lý (Pending)
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-amber-600">
                  {overview?.orderStats?.totalPendingOrders?.toLocaleString('vi-VN') || 0}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-4 bg-emerald-50 rounded-xl border border-emerald-200/60 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                  Đơn hàng thành công (Success)
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-600">
                  {overview?.orderStats?.totalSuccessOrders?.toLocaleString('vi-VN') || 0}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-4 bg-rose-50 rounded-xl border border-rose-200/60 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-rose-800">
                  Đơn hàng thất bại (Failed)
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-rose-600">
                  {overview?.orderStats?.totalFailedOrders?.toLocaleString('vi-VN') || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Section Title */}
      <div className="mt-2">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 m-0">
          Chỉ số tài nguyên hệ thống (System KPIs)
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 m-0">
          Tổng số lượng thực thể được ghi nhận trong cơ sở dữ liệu
        </p>
      </div>

      {/* Grid of 10 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {isLoading && !overview ? (
          Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} variant="rounded" height={140} sx={{ borderRadius: '16px' }} />
          ))
        ) : (
          <>
            <StatCard
              title="Tổng người dùng"
              value={overview?.totalUsers || 0}
              icon={<PeopleIcon />}
              subtitle="Users"
            />
            <StatCard
              title="Tổng sản phẩm"
              value={overview?.totalProducts || 0}
              icon={<InventoryIcon />}
              subtitle="Products"
            />
            <StatCard
              title="Tổng danh mục"
              value={overview?.totalCategories || 0}
              icon={<CategoryIcon />}
              subtitle="Categories"
            />
            <StatCard
              title="Tổng mã giảm giá"
              value={overview?.totalCoupons || 0}
              icon={<LocalOfferIcon />}
              subtitle="Coupons"
            />
            <StatCard
              title="Tổng Sliders"
              value={overview?.totalSliders || 0}
              icon={<SlideshowIcon />}
              subtitle="Sliders"
            />
            <StatCard
              title="Tổng vai trò"
              value={overview?.totalRoles || 0}
              icon={<AdminPanelSettingsIcon />}
              subtitle="Roles"
            />
            <StatCard
              title="Tổng quyền hạn"
              value={overview?.totalPermissions || 0}
              icon={<VpnKeyIcon />}
              subtitle="Permissions"
            />
            <StatCard
              title="Tổng đánh giá"
              value={overview?.totalReviews || 0}
              icon={<StarIcon />}
              subtitle="Reviews"
            />
            <StatCard
              title="Tài khoản rủi ro"
              value={overview?.totalRiskAccounts || 0}
              icon={<WarningIcon />}
              subtitle="Risk Alert"
              iconBgColor="rgba(239, 68, 68, 0.1)"
              iconColor="#ef4444"
            />
            <StatCard
              title="Doanh thu đơn"
              value={overview?.orderStats?.totalRevenue || 0}
              icon={<AttachMoneyIcon />}
              subtitle="Revenue"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
