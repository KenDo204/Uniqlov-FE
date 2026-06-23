export interface CreateRoleRequest {
  /**
   * Tên vai trò (VD: 'ADMIN', 'MANAGER')
   * - Ánh xạ: @NotBlank
   */
  roleName: string;

  description?: string;

  /**
   * Danh sách ID các quyền (Permissions) được gán cho vai trò này
   * - Ánh xạ từ Java `Set<Long>` sang TS `number[]`
   * - Ánh xạ: @NotNull
   */
  permissionIds: number[];
}

export interface UpdateRoleRequest {
  /** Mô tả chi tiết vai trò */
  description?: string;

  /**
   * Danh sách ID các quyền (Permissions) được cập nhật lại
   * - Ánh xạ: @NotNull
   */
  permissionIds: number[];
}