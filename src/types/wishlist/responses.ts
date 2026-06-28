export interface WishlistResponse {

  wishlistId: number;
  productId: number;
  productName: string;
  productSlug: string;

  thumbnailUrl: string;

  minPrice: number;

  inStock: boolean;
  addedAt: string;
}
