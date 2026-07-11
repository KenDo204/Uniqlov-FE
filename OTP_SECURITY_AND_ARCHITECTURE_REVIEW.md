# Đánh giá Kiến trúc và Bảo mật Hệ thống OTP (OTP Security & Architecture Review)

**Ngày đánh giá:** Tháng 7/2026
**Vai trò:** Senior Frontend Architect, Security Engineer
**Dự án:** E-commerce Web App (React 19, TypeScript, Redux Toolkit, Java Spring Boot)

---

## 1. Review kiến trúc hiện tại

### Đánh giá các thành phần hiện có:

**1. `timerSlice.ts`**
*   **Vi phạm Redux Best Practices (Side-effects trong Reducer):** Các Reducer (như `setOtpTimer`, `setIsOtpTimerActive`, `decrementTimer`) đang trực tiếp gọi `localStorage.setItem` và `localStorage.removeItem`. Reducer bắt buộc phải là những hàm tinh khiết (pure functions). Việc đặt side-effects trong reducer gây khó khăn cho việc testing, debug bằng Redux DevTools (time-travel debugging) và không đúng chuẩn Redux Toolkit.
*   **Performance Bottleneck (Dispatch liên tục):** Việc gọi action `decrementTimer` mỗi giây sẽ khiến toàn bộ hệ thống Redux Store cập nhật liên tục (60 lần/phút cho 1 phút đếm ngược). Bất kỳ component nào subscribe vào store (dù không liên quan đến OTP) có cấu trúc selector không tối ưu đều có nguy cơ bị re-render vô ích.
*   **Vi phạm Single Responsibility Principle (SRP):** Store đang vừa đóng vai trò lưu trạng thái toàn cục, vừa làm nhiệm vụ đếm thời gian thực (real-time tick).

**2. `useOtpTimer.ts`**
*   Custom hook này xử lý interval và dispatch action đếm ngược. Tuy nhiên việc đưa vòng lặp `setInterval` vào để đẩy action lên Global Store chỉ để hiển thị UI ở một vài component là hiện tượng **Over-engineering** và lạm dụng Redux.

**3. `OTPInput.tsx` & `OTPField.tsx`**
*   `OTPInput` đang tự quản lý state `localTimer` và thao tác với `localStorage` qua key `otp_timestamp_${id}`.
*   **Xung đột logic:** Hệ thống đang tồn tại song song 2 cơ chế timer (một trong Redux `timerSlice` và một trong nội bộ component `OTPInput`). Điều này dẫn đến sự rời rạc, khó đồng bộ và lỗi tiềm ẩn (Race conditions).

### Phân tích các câu hỏi cốt lõi:

*   **Có vi phạm SRP không?** Có. Component `OTPInput` vừa xử lý logic nhập liệu, xử lý bàn phím (UI), vừa tự quản lý Local Storage và đếm thời gian (Business Logic). Reducer thì vừa tính toán state vừa tương tác Storage.
*   **Có nên thao tác localStorage trong reducer không?** **Tuyệt đối KHÔNG.** Local storage nên được xử lý ở Middleware (như `listenerMiddleware` của RTK, Redux Thunk/Saga) hoặc trực tiếp tại Custom Hooks.
*   **Có nên lưu timestamp hay số giây còn lại?** State/UI có thể giữ "số giây" để hiển thị, nhưng Persistent Storage (LocalStorage/SessionStorage) bắt buộc phải lưu **Timestamp (thời điểm hết hạn)**. Nếu lưu số giây vào localStorage, khi người dùng reload trang, thời gian sẽ không chính xác (bị reset lại từ đầu hoặc bị khựng).
*   **Có nên dùng Redux hay Context cho Timer?** **KHÔNG nên dùng cả hai** cho việc đếm ngược từng giây. Redux/Context chỉ nên dùng để lưu trạng thái "Có đang trong thời gian cooldown hay không?" (boolean) hoặc "Timestamp hết hạn" (number), còn việc đếm lùi từng giây (`--`) nên đưa về **Local State** của component hoặc **Custom Hook** để cô lập phạm vi Re-render.
*   **Có nên đồng bộ nhiều tab?** Nên, đặc biệt với các trang web thương mại điện tử. Nếu user bấm gửi mã ở Tab A, Tab B cũng phải hiển thị cooldown, tránh user spam gửi OTP bằng cách mở nhiều tab. Việc này có thể làm thông qua Event Listener của `storage`.
*   **Có nên xử lý Timer ở `App.tsx`?** Không. Việc nhồi nhét logic dọn dẹp Storage rác vào root component làm tăng độ phức tạp của `App.tsx`.

---

## 2. Phân tích phạm vi ảnh hưởng (Impact Analysis)

Nếu refactor toàn bộ kiến trúc OTP theo chuẩn mới, mức độ ảnh hưởng sẽ như sau:

*   **File cần sửa đổi mạnh:**
    *   `src/components/customer/OtpField/OTPInput.tsx` (Bỏ logic tự đếm ngược, chuyển sang dùng props hoặc custom hook chuẩn).
    *   `src/components/customer/OtpField/OTPField.tsx`
    *   `timerSlice.ts` (Xóa bỏ hoặc refactor hoàn toàn).
    *   `useOtpTimer.ts` (Viết lại logic chỉ dùng React State).
    *   `App.tsx` (Xóa bỏ logic check local storage cũ).
*   **Tác động đến các Module (Cần cập nhật import/cách sử dụng):**
    *   Trang Login / Register / Forgot Password / Change Password.
*   **API bị ảnh hưởng:** Không. Đây hoàn toàn là kiến trúc Frontend.
*   **Redux Store:** Bị ảnh hưởng (Tích cực). Store sẽ nhẹ hơn, giảm thiểu action spam, Performance UI tăng lên.
*   **Routing:** Không bị ảnh hưởng.
*   **Nguy cơ re-render:** Kiến trúc mới sẽ **GIẢM** nguy cơ re-render. Hiện tại toàn bộ app có thể bị re-render mỗi giây nếu cấu trúc selector lỏng lẻo.

---

## 3. Thiết kế kiến trúc OTP tối ưu

Với React 19 + Redux Toolkit, kiến trúc OTP tối ưu nhất là sử dụng **Custom Hook kết hợp Local Storage**, và **loại bỏ đếm ngược ra khỏi Redux**.

### Đề xuất Kiến trúc:
1.  **Xóa bỏ Redux cho Timer từng giây:** Hủy bỏ `decrementTimer` trong Redux.
2.  **Lưu trữ bằng Timestamp (Expiration Time):** Chỉ lưu `expiration_time` (thời điểm hết thời gian chờ) vào `localStorage`. Điều này đảm bảo dù user F5 hay tắt máy tính, thời gian vẫn trừ chuẩn xác dựa trên đồng hồ thời gian thực.
3.  **Sử dụng Custom Hook `useOtpTimer(key)`:**
    *   Nhận vào 1 `key` duy nhất (vd: `otp_register`, `otp_login`).
    *   Bên trong sử dụng `useState` để lưu số giây còn lại cho component.
    *   Dùng `useEffect` kết hợp `setInterval` để giảm `localState` dựa trên khoảng cách giữa `Date.now()` và `expiration_time`.
    *   Lắng nghe sự kiện `window.addEventListener('storage', ...)` để đồng bộ nếu tab khác thay đổi localStorage.
4.  **Tách bạch UI Component:** `OTPInput` chỉ nhận `value`, `onChange`, và UI để nhập mã. Phần hiển thị Countdown Timer nên được tách thành một component con bên ngoài hoặc nhận trực tiếp từ cha.

### Lý do lựa chọn:
*   **Hiệu năng:** Khắc phục triệt để vấn đề dispatch liên tục lên Global Store. Re-render được khoanh vùng ở đúng component sử dụng Hook.
*   **Bảo trì:** Tuân thủ Single Responsibility, dễ dàng test Hook riêng biệt mà không cần mock Redux Store.
*   **Mở rộng:** Muốn thêm OTP cho chức năng mới chỉ cần gọi `useOtpTimer('new_feature_key')`.

---

## 4. Phân tích bảo mật OTP

Các nguy cơ bảo mật có thể đối mặt khi triển khai OTP trong E-Commerce:

### Nguy cơ phía Client:
1.  **Bypass Cooldown UI:** Xóa LocalStorage/SessionStorage bằng DevTools (F12) để vượt qua thời gian chờ và ấn nút "Gửi lại" liên tục.
2.  **Spam Request:** Mở nhiều cửa sổ ẩn danh (Incognito), nhiều trình duyệt để bỏ qua LocalStorage.
3.  **Thao túng thời gian:** Chỉnh lùi đồng hồ hệ thống của OS để làm rối timer của Frontend.
4.  **Phát tán Token:** Lấy OTP (hoặc JWT gắn kèm luồng quên mật khẩu) chia sẻ qua các tab/phiên khác nhau.
5.  **Race Condition UI:** Double-click nhanh vào nút Gửi OTP trước khi button kịp disabled.

### Nguy cơ phía Backend & Network:
1.  **Spam API (SMS/Email Bombing):** Dùng Tool (Postman, cURL) gọi thẳng API `/api/v1/auth/send-otp` hàng loạt, bỏ qua hoàn toàn Frontend, gây cạn kiệt tài nguyên hoặc tốn chi phí gửi SMS.
2.  **Brute Force OTP:** Dò mã 6 số (1 triệu trường hợp). Có thể dò ra ngay nếu Backend không rate limit.
3.  **OTP Replay:** Chặn bắt (Intercept) request xác thực và gửi lại nhiều lần (Replay Attack).
4.  **Race Condition Verify:** Gửi đồng thời 100 requests chứa cùng 1 mã OTP vừa nhận được để cố gắng nhân bản logic (ví dụ: cộng tiền, tạo nhiều account).
5.  **Tái sử dụng OTP (Reuse):** OTP chưa được huỷ (invalidate) ngay sau khi sử dụng thành công lần đầu.

---

## 5. Phân tích từng lỗi (Chi tiết)

### 5.1. Xóa LocalStorage để Spam OTP (Client Bypass)
*   **Nguyên nhân:** Lập trình viên phó mặc hoàn toàn việc block (cooldown) ở Frontend dựa trên LocalStorage.
*   **Mức độ ảnh hưởng:** Trung bình - Nghiêm trọng (Gây thiệt hại kinh tế nếu dùng SMS OTP).
*   **Hậu quả:** Kẻ tấn công liên tục gửi mã OTP về điện thoại/email nạn nhân.
*   **Khả năng xảy ra:** Rất cao.
*   **Giải pháp Frontend:** Disable button và dùng LocalStorage (chỉ là lớp phòng thủ UI 1).
*   **Giải pháp Backend:** Lưu timestamp gửi OTP cuối cùng của User (hoặc IP/Email/Phone) trong Redis/Database. Nếu gửi lại trong vòng 60s, Backend từ chối và trả về lỗi 429 Too Many Requests.
*   **Xử lý trong luận văn?:** **Bắt buộc**. Frontend phải validate, Backend phải có Redis/DB check thời gian cooldown.

### 5.2. Brute Force OTP (Dò mã)
*   **Nguyên nhân:** Mã OTP ngắn (4-6 số), không có khóa chặn sau N lần sai.
*   **Mức độ ảnh hưởng:** Cực kỳ nghiêm trọng (Tài khoản bị chiếm đoạt).
*   **Hậu quả:** Lộ dữ liệu, đổi mật khẩu trái phép.
*   **Khả năng xảy ra:** Cao (bằng script python/cURL).
*   **Giải pháp Frontend:** Không thể ngăn chặn triệt để. Có thể kết hợp Turnstile/ReCaptcha lúc submit.
*   **Giải pháp Backend:** Giới hạn số lần nhập sai (Ví dụ: 5 lần/15 phút). Khóa tạm thời account/phiên nếu quá số lần. Đảm bảo OTP có thời hạn (TTL) rất ngắn (3-5 phút).
*   **Xử lý trong luận văn?:** **Bắt buộc**. Backend phải đếm số lần sai.

### 5.3. Double Click / Duplicate Request
*   **Nguyên nhân:** Nút bấm không bị disable ngay khoảnh khắc user click, user mạng chậm bấm liên tục nhiều lần.
*   **Mức độ ảnh hưởng:** Thấp.
*   **Hậu quả:** Backend nhận cùng lúc nhiều request tạo OTP, có thể gửi 2-3 email.
*   **Khả năng xảy ra:** Rất cao.
*   **Giải pháp Frontend:** Disable button lập tức bằng state `isSubmitting`, sử dụng `debounce` hoặc `throttle` cho hàm onClick.
*   **Giải pháp Backend:** Lock theo key (Redis setNX) hoặc kiểm tra khoảng cách thời gian.
*   **Xử lý trong luận văn?:** **Nên làm**.

---

## 6. Đánh giá giải pháp cũ (Check Storage trong `App.tsx`)

**Cơ chế:** Đọc `time_login_otp`, `time_register_otp`, `time_forget_otp` lúc khởi động App, nếu hết hạn thì `removeItem`.

*   **Ưu điểm:** Gom về 1 chỗ, dọn dẹp rác khi user quay lại app sau thời gian dài.
*   **Nhược điểm:**
    *   Chỉ dọn rác ở thì khởi tạo trang (F5). Nếu SPA chạy suốt không F5 thì storage không bao giờ được clear tự động.
    *   Để code trong `App.tsx` gây nhiễu, vi phạm nguyên lý tách biệt Component. `App.tsx` không nên biết về chi tiết nghiệp vụ của OTP.
*   **Khuyến nghị:** **BỎ**. Thay vì dọn rác ở root, hàm khởi tạo của `useOtpTimer` sẽ tự động phát hiện mã đã hết hạn và clear chính cái key đó khi component cần thiết được mount. Không cần dọn dẹp sớm nếu nó không ảnh hưởng gì, vì dung lượng localStorage vài byte là không đáng kể.

---

## 7. Đề xuất giải pháp chống spam (Tối ưu cho Luận văn & Thực tế)

Để đạt điểm tối đa cho kiến trúc bảo mật trong luận văn, hệ thống cần áp dụng:

1.  **Bảo vệ 2 lớp (Cooldown / Throttling):**
    *   **Frontend:** Timer 60s khóa nút ấn (dùng LocalStorage để chống F5).
    *   **Backend (Bắt buộc):** Lưu `last_sent_time` vào Redis (key: `otp_cooldown_{email}`). Trả về lỗi 429 nếu `< 60s`.
2.  **Đồng bộ đa tab (Cross-tab Synchronization):**
    *   Lắng nghe sự kiện `storage`. Nếu mở Tab 2 ấn gửi mã, Tab 1 lập tức chuyển sang chế độ đếm ngược (Thể hiện sự tinh tế của Frontend Senior).
3.  **Rate Limiting (Chống API Bombing):**
    *   Mỗi IP chỉ được gọi API gửi mã tối đa 10 lần / giờ. Tránh spam làm cạn kiệt tài nguyên hệ thống (Triển khai Backend bằng Spring Boot `Bucket4j` hoặc Redis Rate Limiter).
4.  **Max Invalid Attempts (Giới hạn sai sót):**
    *   Nhập sai quá 5 lần -> Hủy bỏ OTP hiện tại, yêu cầu đợi 15 phút để lấy mã mới.
5.  **Phù hợp với luận văn:** Các biện pháp trên hoàn toàn khả thi, độ khó trung bình-khá nhưng là **"Selling point" (điểm ăn tiền)** lớn trước hội đồng phản biện. (Captcha có thể cân nhắc bỏ qua vì cồng kềnh, ưu tiên xử lý Backend).

---

## 8. Kiểm tra khả năng mở rộng

Kiến trúc dùng **Custom Hook kết hợp Key linh hoạt** đảm bảo tái sử dụng 100% cho mọi ngữ cảnh.

Ví dụ cách gọi trong tương lai:
```tsx
// Đăng ký
const { timeLeft, startTimer } = useOtpTimer({ key: 'otp_register', duration: 60 });
// Quên mật khẩu
const { timeLeft, startTimer } = useOtpTimer({ key: 'otp_forgot_pwd', duration: 120 });
// Đổi mật khẩu
const { timeLeft, startTimer } = useOtpTimer({ key: 'otp_change_pwd', duration: 60 });
```
Không cần viết thêm bất kỳ logic nào ở Redux hay File cấu hình. State được đóng gói hoàn toàn, kiến trúc sạch sẽ và module hóa cao độ.

---

## 9. Kế hoạch Implement

### **Phase 1: Tạo Core Logic (Utilities & Hooks)**
1.  Xóa bỏ file `timerSlice.ts` và gỡ cấu hình khỏi root reducer.
2.  Tạo file `src/hooks/useOtpTimer.ts` chứa logic Custom Hook mới (Xử lý Interval, LocalStorage Timestamp, và Window Storage Event).

### **Phase 2: Refactor UI Components**
1.  Chỉnh sửa `OTPInput.tsx`: Xóa sạch logic `useEffect`, `localStorage` bên trong nó. Biến nó thành Pure UI Component (Chỉ nhận hiển thị ô nhập và số đếm lùi, nút bấm gửi lại).
2.  Chỉnh sửa `OTPField.tsx`: Gọi hook `useOtpTimer` (hoặc nhận từ component cha) và truyền dữ liệu đếm ngược xuống cho `OTPInput`.

### **Phase 3: Tích hợp vào Pages & Clean up**
1.  Áp dụng `useOtpTimer` vào các trang: `Register`, `ResetPassword`, `ChangePassword`, v.v.
2.  Mở `App.tsx` và xóa toàn bộ block `useEffect` check storage cũ.
3.  Test các luồng:
    *   Bấm Gửi -> F5 xem có chạy tiếp không?
    *   Bấm Gửi -> Mở Tab mới xem Tab mới có block không?
    *   Chờ hết giờ -> Xem UI có phục hồi nút "Gửi lại" không?

---

## 10. Kết luận

**1. Kiến trúc khuyến nghị:** Chuyển sang mô hình **Custom Hook kết hợp Persistent Storage (Timestamp)**, loại bỏ hoàn toàn việc lưu trữ Timer từng giây trong Redux.

**2. Thay đổi bắt buộc:**
*   Dời logic ra khỏi `timerSlice.ts` (Vi phạm Redux Purity).
*   Loại bỏ logic Storage rải rác ở `App.tsx` và `OTPInput`.

**3. Đánh giá rủi ro trước - sau:**
*   **Trước:** App chậm dần nếu store phình to và timer chạy liên tục. Nguy cơ Spam API cao nếu Backend chưa chặn. Logic UI và Storage dính chặt vào nhau ở nhiều nơi, dễ sinh bug khi maintain.
*   **Sau:** Kiến trúc SẠCH, Chuẩn SOLID. Performance tối ưu. Bảo mật Frontend ở mức cao nhất, thể hiện trình độ xử lý State và Storage của Senior Engineer. Đáp ứng dư dả yêu cầu khắt khe của hệ thống Thương mại điện tử lớn.
