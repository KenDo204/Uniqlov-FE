export interface OrderStatsDto {
  totalPendingOrders: number;
  totalSuccessOrders: number;
  totalFailedOrders: number;
  totalRevenue: number;
}

export interface DashboardStatResponse {
  orderStats: OrderStatsDto;
  totalProducts: number;
  totalCategories: number;
  totalSliders: number;
  totalPermissions: number;
  totalRoles: number;
  totalReviews: number;
  totalRiskAccounts: number;
  totalUsers: number;
  totalCoupons: number;
}
