import { axiosClient } from '@/services/axiosClient';
import { type ApiResponse, type PageResponse } from '@/types/common/apiResponse';
import type { RiskRuleResponse, RiskRuleUpdateRequest, RiskAlertResponse, RiskAlertResolveRequest } from '@/types/risk';

const API_URL = '/admin/risk';

export const riskService = {
  getAllRules: async (): Promise<ApiResponse<RiskRuleResponse[]>> => {
    const response = await axiosClient.get<ApiResponse<RiskRuleResponse[]>>(`${API_URL}/rules`);
    return response.data;
  },

  updateRule: async (ruleCode: string, data: RiskRuleUpdateRequest): Promise<ApiResponse<RiskRuleResponse>> => {
    const response = await axiosClient.put<ApiResponse<RiskRuleResponse>>(`${API_URL}/rules/${ruleCode}`, data);
    return response.data;
  },

  getAlerts: async (page: number = 0, size: number = 20, status?: string): Promise<ApiResponse<PageResponse<RiskAlertResponse>>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) {
      params.append('status', status);
    }
    const response = await axiosClient.get<ApiResponse<PageResponse<RiskAlertResponse>>>(`${API_URL}/alerts`, { params });
    return response.data;
  },

  resolveAlert: async (alertId: number, data: RiskAlertResolveRequest): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>(`${API_URL}/alerts/${alertId}/resolve`, data);
    return response.data;
  },
};
