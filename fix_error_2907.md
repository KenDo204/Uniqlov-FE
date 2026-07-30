# Session Report: EasyMall Backend Updates

Báo cáo này tổng hợp các tính năng và bản vá lỗi (bug fixes) đã được thực hiện trong phiên làm việc.

## 1. Vá lỗi CORS OAuth2 bằng 401 Unauthorized

> [!IMPORTANT]
> **Đây là cập nhật quan trọng nhất về bảo mật và giao tiếp giữa Backend và Frontend.**

**Vấn đề trước đó:**
Khi chưa đăng nhập, các request gọi vào REST API bị Spring Security chuyển hướng (302 Redirect) tới trang đăng nhập Google (`/oauth2/authorization/google`). Do Frontend gọi qua `fetch` / `XMLHttpRequest`, việc chuyển hướng đến một URL không nằm trong whitelist của CORS Configuration đã gây ra lỗi `No 'Access-Control-Allow-Origin' header` trên console của trình duyệt. 

**Giải pháp:**
- Cấu hình lại `SecurityConfig` sử dụng `HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)` để bao trọn luồng API.
- **Kết quả**: Các API RESTful (`/api/**`) khi không được xác thực sẽ trả về trực tiếp mã lỗi **HTTP 401 Unauthorized** thay vì cố gắng redirect trình duyệt về Google Login (Luồng redirect chỉ còn áp dụng cho các request browser truyền thống).
- **Tác động đến Frontend**: Lỗi CORS phiền toái đã hoàn toàn biến mất trên console. Frontend (FE) hiện có thể bắt (catch) lỗi 401 thông qua các Interceptor (ví dụ: trong Axios) để chủ động xử lý UI:
  - Ẩn các nút hành động (như bình luận, mua hàng) khi người dùng chưa đăng nhập.
  - Tự động hiển thị Modal/Popup yêu cầu đăng nhập một cách mượt mà không làm gián đoạn trải nghiệm người dùng.

## 2. Tự động tính toán số liệu thống kê (Product Stats)

> [!TIP]
> **Đã tích hợp bằng Code Java (Service Layer) thay vì dựa vào Database Triggers, giúp dễ kiểm soát logic nghiệp vụ hơn.**

- **Lượt bán (`sold_count`)**: Cập nhật tại `OrderServiceImpl`. Khi Admin cập nhật trạng thái đơn hàng sang `COMPLETED`, hệ thống sẽ tự động lặp qua OrderDetails và gọi Native Query để cộng dồn số lượng sản phẩm bán ra.
- **Đánh giá (`rating_avg` & `rating_count`)**: Cập nhật tại `ReviewServiceImpl`. Mỗi khi một đánh giá được Admin duyệt (`APPROVED`) hoặc một đánh giá đã duyệt bị xóa, hệ thống gọi `recalculateRatingStats` để tái chạy lệnh `AVG` và `COUNT` lại từ bảng reviews.
- Việc Hibernate cache ghi đè đã được ngăn chặn triệt để bằng `@Column(insertable = false, updatable = false)` trên `ProductEntity`.

## 3. Quản lý Đánh giá (Review Module) cho Admin

- Mở rộng chức năng cho `ReviewService` để cung cấp API cho phép Admin lấy toàn bộ đánh giá của hệ thống (`getAllReviews`).
- Thêm Endpoint tại `ReviewController` và phân quyền bảo mật chặt chẽ (`@PreAuthorize`) để Admin có thể kiểm duyệt và dễ dàng quyết định duyệt/từ chối đánh giá.

## 4. Tinh chỉnh Recommendation Service
- **Refactor kiến trúc**: Thay đổi logic từ việc nhận `userId` thông qua tham số (dễ bị giả mạo và bất tiện) sang việc trích xuất trực tiếp `UserEntity` đang đăng nhập thông qua `SecurityContextHolder`.
- **Nâng cao UX**: Nếu người dùng truy cập là Guest (chưa đăng nhập), API không ném lỗi 401 Unauthorized như trước mà sẽ nhẹ nhàng trả về kết quả rỗng (hoặc theo thuật toán mặc định), không làm vỡ giao diện phía người dùng.

## 5. Bổ sung dữ liệu cho Order Response DTO
- Cập nhật Data Transfer Object (DTO) của Đơn hàng để trả về thêm các trường định danh quan trọng: `productId`, `productSlug`, và `categoryId`. Việc này giúp Frontend linh hoạt hơn khi cần hiển thị link điều hướng cho tiết sản phẩm bên trong màn hình lịch sử đơn hàng.
