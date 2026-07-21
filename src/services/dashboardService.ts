import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/common/apiResponse';
import type { DashboardStatResponse } from '@/types/dashboard/response';

const API_URL = '/admin/dashboard';

export const dashboardService = {
  getOverview: async (): Promise<ApiResponse<DashboardStatResponse>> => {
    const response = await axiosClient.get<ApiResponse<DashboardStatResponse>>(`${API_URL}/overview`);
    return response.data;
  },

  getRevenue: async (): Promise<ApiResponse<number>> => {
    const response = await axiosClient.get<ApiResponse<number>>(`${API_URL}/revenue`);
    return response.data;
  },
};
