import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchRulesThunk,
  updateRuleThunk,
  fetchAlertsThunk,
  resolveAlertThunk,
  clearRiskError,
} from '@/stores/slices/riskSlice';
import type { RiskRuleUpdateRequest, RiskAlertResolveRequest } from '@/types/risk';

export const useRisk = () => {
  const dispatch = useAppDispatch();
  const { rules, alerts, isFetchingRules, isFetchingAlerts, isSubmitting, error } = useAppSelector(
    (state) => state.risk
  );

  const fetchRules = useCallback(() => {
    dispatch(fetchRulesThunk());
  }, [dispatch]);

  const updateRule = useCallback(
    (ruleCode: string, data: RiskRuleUpdateRequest) => {
      return dispatch(updateRuleThunk({ ruleCode, data })).unwrap();
    },
    [dispatch]
  );

  const fetchAlerts = useCallback(
    (params: { page?: number; size?: number; status?: string }) => {
      dispatch(fetchAlertsThunk(params));
    },
    [dispatch]
  );

  const resolveAlert = useCallback(
    (alertId: number, data: RiskAlertResolveRequest) => {
      return dispatch(resolveAlertThunk({ alertId, data })).unwrap();
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearRiskError());
  }, [dispatch]);

  return {
    rules,
    alerts,
    isFetchingRules,
    isFetchingAlerts,
    isSubmitting,
    error,
    fetchRules,
    updateRule,
    fetchAlerts,
    resolveAlert,
    clearError,
  };
};
