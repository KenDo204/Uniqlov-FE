export const RiskAlertStatus = {
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    FALSE_POSITIVE: 'FALSE_POSITIVE'
} as const;

export type RiskAlertStatus = typeof RiskAlertStatus[keyof typeof RiskAlertStatus];
