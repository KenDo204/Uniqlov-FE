export interface RiskRuleUpdateRequest {
  thresholdValue: number;
  timeWindowMinutes?: number;
  isActive: boolean;
}

import { RiskAlertStatus } from './enums';

export interface RiskAlertResolveRequest {
  status: RiskAlertStatus; // 'RESOLVED' or 'FALSE_POSITIVE'
}
