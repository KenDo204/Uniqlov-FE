import { ReviewStatus } from '@/types/enums/reviewStatus';

export interface ReviewImageResponse {
  reviewImageId: number;
  imageUrl: string;
}

export interface ReviewResponse {
  reviewId: number;
  orderId: number | null;
  userId: number;
  userFullName: string | null;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  reviewStatus: ReviewStatus;
  images: ReviewImageResponse[] | null;
  variantImage: string | null;
  variantAttributes: Record<string, string> | null;
  createdAt: string;
}

export interface ReviewSummaryResponse {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
}
