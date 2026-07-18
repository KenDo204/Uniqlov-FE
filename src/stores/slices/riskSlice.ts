import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { riskService } from '@/services/riskService';
import type { RiskRuleResponse, RiskRuleUpdateRequest, RiskAlertResponse, RiskAlertResolveRequest } from '@/types/risk';
import { type PageResponse } from '@/types/common/apiResponse';
import axios from 'axios';

interface RiskState {
  rules: RiskRuleResponse[];
  alerts: PageResponse<RiskAlertResponse> | null;
  isFetchingRules: boolean;
  isFetchingAlerts: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: RiskState = {
  rules: [],
  alerts: null,
  isFetchingRules: false,
  isFetchingAlerts: false,
  isSubmitting: false,
  error: null,
};

export const fetchRulesThunk = createAsyncThunk(
  'risk/fetchRules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await riskService.getAllRules();
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách quy tắc rủi ro';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateRuleThunk = createAsyncThunk(
  'risk/updateRule',
  async ({ ruleCode, data }: { ruleCode: string; data: RiskRuleUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await riskService.updateRule(ruleCode, data);
      return response.result;
    } catch (error) {
      let message = 'Cập nhật quy tắc thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchAlertsThunk = createAsyncThunk(
  'risk/fetchAlerts',
  async ({ page = 0, size = 20, status }: { page?: number; size?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await riskService.getAlerts(page, size, status);
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách cảnh báo';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const resolveAlertThunk = createAsyncThunk(
  'risk/resolveAlert',
  async ({ alertId, data }: { alertId: number; data: RiskAlertResolveRequest }, { rejectWithValue }) => {
    try {
      await riskService.resolveAlert(alertId, data);
      return { alertId, status: data.status };
    } catch (error) {
      let message = 'Xử lý cảnh báo thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

const riskSlice = createSlice({
  name: 'risk',
  initialState,
  reducers: {
    clearRiskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rules
      .addCase(fetchRulesThunk.pending, (state) => {
        state.isFetchingRules = true;
        state.error = null;
      })
      .addCase(fetchRulesThunk.fulfilled, (state, action) => {
        state.isFetchingRules = false;
        if (action.payload) {
          state.rules = action.payload;
        }
      })
      .addCase(fetchRulesThunk.rejected, (state, action) => {
        state.isFetchingRules = false;
        state.error = action.payload as string;
      })
      // Update Rule
      .addCase(updateRuleThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateRuleThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          const updatedRule = action.payload;
          const index = state.rules.findIndex(r => r.ruleCode === updatedRule.ruleCode);
          if (index !== -1) {
            state.rules[index] = updatedRule;
          }
        }
      })
      .addCase(updateRuleThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Fetch Alerts
      .addCase(fetchAlertsThunk.pending, (state) => {
        state.isFetchingAlerts = true;
        state.error = null;
      })
      .addCase(fetchAlertsThunk.fulfilled, (state, action) => {
        state.isFetchingAlerts = false;
        if (action.payload) {
          state.alerts = action.payload;
        }
      })
      .addCase(fetchAlertsThunk.rejected, (state, action) => {
        state.isFetchingAlerts = false;
        state.error = action.payload as string;
      })
      // Resolve Alert
      .addCase(resolveAlertThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(resolveAlertThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.alerts && state.alerts.content) {
          const index = state.alerts.content.findIndex(a => a.alertId === action.payload.alertId);
          if (index !== -1) {
            state.alerts.content[index].status = action.payload.status;
          }
        }
      })
      .addCase(resolveAlertThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRiskError } = riskSlice.actions;
export default riskSlice.reducer;
