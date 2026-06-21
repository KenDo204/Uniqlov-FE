export interface NotificationItem {
    id: number;
    title: string;
    content: string;
    type: 'ORDER' | 'PROMOTION' | 'SYSTEM' | 'ANNOUNCEMENT' | string;
    is_read: boolean;
    created_at: string;
}
