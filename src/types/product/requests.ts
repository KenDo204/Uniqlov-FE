export interface ProductImageRequest {
  /**
   * Đường dẫn ảnh
   * @maxLength 500
   */
  imageUrl: string;
  isThumbnail?: boolean;
  
  /** @minimum 0 */
  displayOrder?: number;
}

export interface ProductVariantRequest {
  /**
   * Giá bán
   * @minimum 0.01 (Bắt buộc > 0)
   */
  price: number;

  /**
   * Giá vốn
   * @minimum 0.01 (Bắt buộc > 0)
   */
  costPrice: number;

  /**
   * Tổ hợp thuộc tính biến thể.
   * Ví dụ: { "color": "NVY", "size": "M" }
   * Frontend truyền lên dạng Object, Backend tự convert sang JSON string.
   */
  variantAttributes: Record<string, string>;

  /** Mã SKU. Nếu bỏ trống, hệ thống BE (SkuGenerator) sẽ tự sinh */
  skuCode?: string;

  /** @maxLength 500 */
  variantImage?: string;

  /** @minimum 0 */
  stockQuantity?: number;
}

export interface ProductCreateRequest {
  /** @maxLength 150 */
  productName: string;

  /** @maxLength 2000 */
  productDescription?: string;

  inPopular?: boolean;

  /**
   * Giới tính mục tiêu: 0=Nữ, 1=Nam, 2=Unisex
   * @minimum 0
   * @maximum 2
   */
  targetGender?: number;

  /** @minimum 0 */
  maxOrderQuantity?: number;

  /**
   * Cấu hình tùy chọn (Frontend cần stringify object thành JSON string trước khi gửi)
   */
  optionsConfig?: string;

  /** Danh sách các tag. Ví dụ: ["vintage", "oversize"] */
  productTags?: string[];

  categoryId?: number;

  /** @minimum 0.01 */
  weightKg?: number;

  /** @minimum 0.01 */
  lengthM?: number;

  /** @minimum 0.01 */
  widthM?: number;

  /** @minimum 0.01 */
  heightM?: number;

  /** Danh sách biến thể (Bắt buộc phải có ít nhất 1) */
  variants: ProductVariantRequest[];

  /** Danh sách hình ảnh */
  images?: ProductImageRequest[];
}

export interface ProductUpdateRequest {
  /** @maxLength 150 */
  productName?: string;

  /** @maxLength 2000 */
  productDescription?: string;

  inPopular?: boolean;
  inStock?: boolean;

  /** @minimum 0 | @maximum 2 */
  targetGender?: number;

  /** @minimum 0 */
  maxOrderQuantity?: number;

  /** JSON string tự do */
  optionsConfig?: string;

  productTags?: string[];
  categoryId?: number;

  /** @minimum 0.01 */
  weightKg?: number;
  /** @minimum 0.01 */
  lengthM?: number;
  /** @minimum 0.01 */
  widthM?: number;
  /** @minimum 0.01 */
  heightM?: number;

  variants?: ProductVariantRequest[];
  
  images?: ProductImageRequest[];
}