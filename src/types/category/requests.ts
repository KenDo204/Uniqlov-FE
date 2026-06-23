export interface CategoryCreateRequest {
  /**
   * Tên danh mục
   * - Ánh xạ: @NotBlank, @Size(max = 200)
   * @maxLength 200
   */
  categoryName: string;

  /** ID của danh mục cha. Để trống nếu là danh mục gốc (Root) */
  parentId?: number;

  /**
   * Đường dẫn icon của danh mục
   * - Ánh xạ: @Size(max = 500)
   * @maxLength 500
   */
  iconUrl?: string;

  /** Đối tượng khách hàng mục tiêu (VD: 1: Nam, 2: Nữ, 3: Trẻ em...) */
  targetDemographic?: number;

  /**
   * Phân loại danh mục
   * - Ánh xạ: @Size(max = 30)
   * @maxLength 30
   */
  categoryType?: string;

  /** Thứ tự hiển thị trên UI */
  displayOrder?: number;
}

export interface CategoryUpdateRequest {
  /**
   * Tên danh mục
   * @maxLength 200
   */
  categoryName: string;

  /**
   * Trạng thái danh mục
   * - Ánh xạ: @NotNull (Bắt buộc phải có khi update)
   */
  categoryStatus: number;

  /**
   * Đường dẫn icon
   * @maxLength 500
   */
  iconUrl?: string;

  /** Đối tượng khách hàng mục tiêu */
  targetDemographic?: number;

  /**
   * Phân loại danh mục
   * @maxLength 30
   */
  categoryType?: string;

  /** Thứ tự hiển thị trên UI */
  displayOrder?: number;
}