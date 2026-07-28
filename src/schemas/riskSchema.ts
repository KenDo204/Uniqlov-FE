import { z } from 'zod';
import { RiskAlertStatus } from '@/types/risk/enums';

export const riskRuleUpdateSchema = z.object({
  thresholdValue: z.number().positive('Ngưỡng rủi ro phải là số dương').max(10000, 'Ngưỡng rủi ro không vượt quá 10000'),
  timeWindowMinutes: z.number().int().positive('Thời gian theo phút phải là số dương').max(1440).optional(),
  isActive: z.boolean(),
});
export type RiskRuleUpdateFormValues = z.infer<typeof riskRuleUpdateSchema>;

export const riskAlertResolveSchema = z.object({
  status: z.nativeEnum(RiskAlertStatus, {
    message: 'Trạng thái xử lý cảnh báo không hợp lệ',
  }),
});
export type RiskAlertResolveFormValues = z.infer<typeof riskAlertResolveSchema>;
