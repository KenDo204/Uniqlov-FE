import React, { useEffect } from 'react';
import { Box, Typography, Skeleton, Alert, Button } from '@mui/material';
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
    <Box sx={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', m: 0 }}>
            Bảng điều khiển (Dashboard)
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
            Tổng quan chỉ số kinh doanh và thống kê dữ liệu hệ thống EasyMall
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={isLoading}
          startIcon={<RefreshIcon />}
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
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Top Revenue & Key Financial Section */}
      <Box className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Box className="md:col-span-5 lg:col-span-4">
          {isLoading && !overview ? (
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px' }} />
          ) : (
            <RevenueCard apiRevenue={totalRevenue} orderStatsRevenue={overview?.orderStats?.totalRevenue} />
          )}
        </Box>
        <Box className="md:col-span-7 lg:col-span-8">
          {isLoading && !overview ? (
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: '16px' }} />
          ) : (
            <OrderBarChart orderStats={overview?.orderStats} />
          )}
        </Box>
      </Box>

      {/* Order Ratio Pie Chart & Summary */}
      <Box className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Box className="md:col-span-6">
          {isLoading && !overview ? (
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: '16px' }} />
          ) : (
            <OrderPieChart orderStats={overview?.orderStats} />
          )}
        </Box>
        <Box className="md:col-span-6">
          {/* Detailed Summary Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #f3f4f6',
              bgcolor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justify: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
              Thống kê tổng đơn hàng
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#b45309' }}>
                  Đơn hàng chờ xử lý (Pending)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#d97706' }}>
                  {overview?.orderStats?.totalPendingOrders || 0}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#ecfdf5', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#047857' }}>
                  Đơn hàng thành công (Success)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669' }}>
                  {overview?.orderStats?.totalSuccessOrders || 0}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#b91c1c' }}>
                  Đơn hàng thất bại (Failed)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#dc2626' }}>
                  {overview?.orderStats?.totalFailedOrders || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* KPI Cards Section Title */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
          Chỉ số tài nguyên hệ thống (System KPIs)
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Tổng số lượng thực thể được ghi nhận trong cơ sở dữ liệu
        </Typography>
      </Box>

      {/* Grid of 10 KPI Cards */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
      </Box>
    </Box>
  );
};

export default Dashboard;
