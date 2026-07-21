import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStatResponse } from '@/types/dashboard/response';
import axios from 'axios';

interface DashboardState {
  overview: DashboardStatResponse | null;
  totalRevenue: number | null;
  isFetchingOverview: boolean;
  isFetchingRevenue: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  overview: null,
  totalRevenue: null,
  isFetchingOverview: false,
  isFetchingRevenue: false,
  error: null,
};

export const fetchDashboardOverviewThunk = createAsyncThunk(
  'dashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getOverview();
      return response.result;
    } catch (error) {
      let message = 'Lỗi nạp dữ liệu tổng quan Dashboard';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchTotalRevenueThunk = createAsyncThunk(
  'dashboard/fetchTotalRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getRevenue();
      return response.result;
    } catch (error) {
      let message = 'Lỗi nạp doanh thu tổng';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchDashboardOverviewThunk.pending, (state) => {
        state.isFetchingOverview = true;
        state.error = null;
      })
      .addCase(fetchDashboardOverviewThunk.fulfilled, (state, action) => {
        state.isFetchingOverview = false;
        if (action.payload) {
          state.overview = action.payload;
        }
      })
      .addCase(fetchDashboardOverviewThunk.rejected, (state, action) => {
        state.isFetchingOverview = false;
        state.error = action.payload as string;
      })
      // Revenue
      .addCase(fetchTotalRevenueThunk.pending, (state) => {
        state.isFetchingRevenue = true;
      })
      .addCase(fetchTotalRevenueThunk.fulfilled, (state, action) => {
        state.isFetchingRevenue = false;
        if (action.payload !== undefined && action.payload !== null) {
          state.totalRevenue = action.payload;
        }
      })
      .addCase(fetchTotalRevenueThunk.rejected, (state, action) => {
        state.isFetchingRevenue = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
