import { useTracking } from '@/hooks/useTracking';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  // Hook useTracking sẽ tự động thiết lập sessionId lúc mount.
  useTracking();

  return <>{children}</>;
}
