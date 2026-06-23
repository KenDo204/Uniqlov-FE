export interface CreatePermissionRequest {
  /**
   * Tên định danh của quyền (VD: 'USER_CREATE', 'PRODUCT_UPDATE')
   * - Ánh xạ: @NotBlank
   */
  permissionName: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  description?: string;
}