import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchDashboardOverviewThunk,
  fetchTotalRevenueThunk,
  clearDashboardError,
} from '@/stores/slices/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { overview, totalRevenue, isFetchingOverview, isFetchingRevenue, error } = useAppSelector(
    (state) => state.dashboard
  );

  const fetchOverview = useCallback(async () => {
    return await dispatch(fetchDashboardOverviewThunk()).unwrap();
  }, [dispatch]);

  const fetchRevenue = useCallback(async () => {
    return await dispatch(fetchTotalRevenueThunk()).unwrap();
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  return useMemo(
    () => ({
      overview,
      totalRevenue,
      isFetchingOverview,
      isFetchingRevenue,
      error,
      fetchOverview,
      fetchRevenue,
      clearError,
    }),
    [
      overview,
      totalRevenue,
      isFetchingOverview,
      isFetchingRevenue,
      error,
      fetchOverview,
      fetchRevenue,
      clearError,
    ]
  );
};
