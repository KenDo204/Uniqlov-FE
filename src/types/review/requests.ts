import { ReviewStatus } from '@/types/enums/reviewStatus';

export interface CreateReviewRequest {
  productId: number;
  orderId: number | null;
  rating: number;
  comment: string;
  imageUrls: string[];
}

export interface UpdateReviewStatusRequest {
  status: ReviewStatus;
}
