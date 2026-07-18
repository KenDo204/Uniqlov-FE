export interface RiskRuleUpdateRequest {
  thresholdValue: number;
  timeWindowMinutes?: number;
  isActive: boolean;
}

export interface RiskAlertResolveRequest {
  status: string; // 'RESOLVED' or 'FALSE_POSITIVE'
}
