export interface RiskRuleResponse {
  ruleCode: string;
  ruleName: string;
  riskLevel: string;
  thresholdValue: number;
  timeWindowMinutes?: number;
  isActive: boolean;
  updatedAt: string;
}

import { RiskAlertStatus } from './enums';

export interface RiskAlertResponse {
  alertId: number;
  userId?: number;
  userEmail?: string;
  orderId?: number;
  orderCode?: string;
  ruleCode: string;
  description: string;
  status: RiskAlertStatus; // 'PENDING', 'RESOLVED', 'FALSE_POSITIVE'
  createdAt: string;
}
