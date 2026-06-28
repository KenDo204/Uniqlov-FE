import { Gender } from '@/types/enums/genderType';

export interface ProductImageResponse {
  imageId: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface ProductVariantResponse {
  variantId: number;
  price: number;
  costPrice: number;

  /**
   * BE đã parse JSON string thành Map.
   * FE nhận dạng Object Key-Value (vd: { color: "red", size: "XL" })
   */
  variantAttributes: Record<string, string>;

  skuCode: string;
  variantImage: string;
  stockQuantity: number;
  isActive: boolean;
  lockedStock: number;
}

export interface ProductResponse {
  productId: number;
  productSlug: string;
  productName: string;
  productDescription: string;
  inPopular: boolean;
  inStock: boolean;

  /** Giới tính mục tiêu */
  targetGender: Gender;
  maxOrderQuantity: number;

  /**
   * Cấu hình mở rộng trả về dưới dạng Object linh hoạt (Flexible Rendering)
   */
  optionsConfig: Record<string, any>;

  /** Danh sách tag trực tiếp, không cần parse JSON */
  productTags: string[];

  categoryId: number;
  weightKg: number;
  lengthM: number;
  widthM: number;
  heightM: number;
  
  /** Trả về chuẩn ISO 8601 string (VD: '2026-06-23T11:00:00') */
  createdAt: string;

  variants: ProductVariantResponse[];
  images: ProductImageResponse[];
}