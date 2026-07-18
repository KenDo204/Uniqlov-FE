export interface RiskRuleResponse {
  ruleCode: string;
  ruleName: string;
  riskLevel: string;
  thresholdValue: number;
  timeWindowMinutes?: number;
  isActive: boolean;
  updatedAt: string;
}

export interface RiskAlertResponse {
  alertId: number;
  userId?: number;
  userEmail?: string;
  orderId?: number;
  orderCode?: string;
  ruleCode: string;
  description: string;
  status: string; // 'PENDING', 'REVIEWING', 'RESOLVED', 'FALSE_POSITIVE'
  createdAt: string;
}
