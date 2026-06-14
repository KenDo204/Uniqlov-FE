export {};

declare global {
  interface UserMetadata {
    role?: 'ADMIN' | 'OWNER' | 'CUSTOMER';
  }

  interface Window {
    // Custom window additions (e.g. tracking scripts)
    behaviorTrackerInitialized?: boolean;
  }
}
