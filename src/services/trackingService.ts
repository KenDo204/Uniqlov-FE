import { axiosClient } from './axiosClient';
import type { TrackingEventRequest } from '@/types/tracking';

const API_URL = '/tracking';

export const trackingService = {
  trackEvent: async (payload: TrackingEventRequest): Promise<void> => {
    // Fire and forget
    axiosClient.post(`${API_URL}/events`, payload).catch((err) => {
      console.warn('Tracking event failed:', err);
    });
  }
};
