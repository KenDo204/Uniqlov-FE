export interface ApiResponse<T = any> {
    code: number;
    message?: string;
    result?: T;
}

export interface PageResponse<T> {
  content: T[];          // Danh sách dữ liệu thực tế
  pageable: any;         // Thông tin phân trang
  last: boolean;         // Có phải trang cuối không?
  totalPages: number;    // Tổng số trang
  totalElements: number; // Tổng số phần tử
  size: number;          // Kích thước trang
  number: number;        // Trang hiện tại (Bắt đầu từ 0)
  first: boolean;        // Có phải trang đầu không?
  numberOfElements: number;
  empty: boolean;
}