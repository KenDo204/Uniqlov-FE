export interface CategoryResponse {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  
  /** Trạng thái danh mục (VD: 1: Active, 0: Inactive) */
  categoryStatus: number;
  
  /** Cấp độ của danh mục trong cây (VD: 1, 2, 3) */
  level: number;
  
  /** ID của danh mục cha. Sẽ là null/undefined nếu đây là danh mục gốc */
  parentId?: number;
  
  iconUrl?: string;
  targetDemographic?: number;
  categoryType?: string;
  displayOrder?: number;

  children: CategoryResponse[];
}