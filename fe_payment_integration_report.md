# BÁO CÁO BÀAN GIAO TÍCH HỢP THANH TOÁN VNPAY (DÀNH CHO TEAM FRONTEND)

## 1. Trạng thái hiện tại (Backend đã hoàn tất)
Luồng thanh toán VNPAY từ phía Backend đã được cấu hình và hoạt động hoàn chỉnh 100%. Cụ thể:
- Backend đã nhận callback từ VNPAY thành công.
- Thuật toán mã hóa chữ ký (Hash Signature) đã được nâng cấp, chống lỗi bảo mật và đảm bảo tính nguyên vẹn dữ liệu.
- Trạng thái đơn hàng trong Database đã được tự động cập nhật từ `PENDING_PAYMENT` sang `AWAITING_SHIPMENT` khi thanh toán thành công.
- **Cuối luồng, Backend tự động redirect trình duyệt của user về Frontend** với định dạng URL như sau:
  
  `http://localhost:5173/payment-status?trackingNumber={Mã_Đơn_Hàng}&success={true/false}`

  *(Ví dụ thực tế: `http://localhost:5173/payment-status?trackingNumber=26734944&success=true`)*

---

## 2. Vấn đề của Frontend hiện tại
Khi trình duyệt bị đẩy về link trên, giao diện Frontend đang hiện trang **"404 - Page Not Found"**. 
**Nguyên nhân:** React Router của hệ thống chưa có route nào định nghĩa để "hứng" đường dẫn `/payment-status`.

---

## 3. Yêu cầu triển khai dành cho Frontend (Action Items)

Để hoàn thiện trải nghiệm khách hàng (End-to-end), team Frontend cần thực hiện các task sau:

### Task 3.1: Khai báo Route mới
Vào file cấu hình routing (ví dụ: `App.jsx`, `main.jsx` hoặc `routes.ts`) và khai báo một Route mới:
```jsx
<Route path="/payment-status" element={<PaymentStatusPage />} />
```

### Task 3.2: Xây dựng Component `PaymentStatusPage`
Tạo một UI Component mới chuyên dùng để hiển thị kết quả thanh toán. Component này cần lấy thông số từ URL Query (sử dụng hook như `useSearchParams` hoặc `useLocation`).

**Logic xử lý:**
- Lấy 2 biến từ URL: `trackingNumber` (String) và `success` (String boolean: `"true"` hoặc `"false"`).

**Giao diện cần có:**
1. **Trường hợp `success === 'true'`:**
   - Hiển thị UI Chúc mừng / Thanh toán thành công (Icon check xanh lá).
   - Hiển thị mã đơn hàng: `trackingNumber`.
   - Nút bấm: "Về trang chủ" và "Xem chi tiết đơn hàng".
   - *Lưu ý quan trọng:* Nếu luồng trước đó chưa xóa giỏ hàng (Cart) trong Redux/Zustand/LocalStorage, Frontend cần dispatch action để **Xóa giỏ hàng** ngay tại bước này.

2. **Trường hợp `success === 'false'`:**
   - Hiển thị UI Lỗi / Hủy thanh toán (Icon cảnh báo đỏ).
   - Câu thông báo: "Giao dịch bị hủy hoặc thanh toán không thành công".
   - Nút bấm: "Thử thanh toán lại" (Chuyển user về lại trang Checkout/Giỏ hàng).

### Task 3.3 (Optional nhưng khuyến nghị): Bảo mật chống Fake URL
Vì user có thể tự gõ `?success=true` lên thanh URL để giả mạo giao diện thành công, Frontend nên:
- Thêm trạng thái *Loading...* chớp nhoáng khi vừa vào trang.
- Gọi một API `GET` về Backend (ví dụ: `/api/v1/orders/tracking/{trackingNumber}`) để check lại `orderStatus`.
- Chỉ hiển thị màn hình Thành Công nếu API trả về đúng trạng thái `AWAITING_SHIPMENT`.

---

**Tài liệu này đánh dấu Backend đã xong luồng Payment. Chờ Frontend update để ghép nối hoàn thiện.**
