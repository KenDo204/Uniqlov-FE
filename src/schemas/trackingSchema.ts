import { z } from 'zod';
import { Source } from '@/types/tracking/requests';

export const trackingEventSchema = z.object({
  userId: z.number().int().positive().nullable().optional(),
  sessionId: z.string().trim().min(1, 'Session ID không được trống').max(100),
  productId: z.number().int().positive().optional(),
  categoryId: z.number().int().positive().optional(),
  actionType: z.enum(['VIEW_ITEM', 'SEARCH', 'ADD_TO_CART', 'ADD_WISHLIST', 'PURCHASE', 'CLICK_REC']),
  keyword: z.string().trim().max(100).optional(),
  contextData: z.string().trim().max(1000).optional(),
  variantId: z.number().int().positive().optional(),
  durationSeconds: z.number().int().min(0).max(86400).optional(),
  source: z.nativeEnum(Source).optional(),
});
export type TrackingEventFormValues = z.infer<typeof trackingEventSchema>;
