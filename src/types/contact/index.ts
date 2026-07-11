export interface ContactMessageRequest {
  guestName?: string;
  guestEmail?: string;
  subject: string;
  content: string;
}

export interface ContactMessageStatusRequest {
  status: 'RESOLVED' | 'REJECTED';
}

export interface ContactMessageResponse {
  messageId: number;
  userId?: number;
  guestName?: string;
  guestEmail?: string;
  subject: string;
  content: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}
