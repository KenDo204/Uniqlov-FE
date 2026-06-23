import { useNavigate } from 'react-router-dom';

export function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header có đường viền gạch dưới */}
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Đặt lại mật khẩu của bạn
        </h1>

        {/* Khung chứa nội dung chính */}
        <div className="max-w-[600px]">
          
          <h2 className="text-[20px] font-medium m-0 mb-4">
            Nhập địa chỉ email đã đăng ký của bạn
          </h2>
          
          <p className="text-[14px] text-gray-800 mb-4">
            Vui lòng nhập địa chỉ email đã đăng ký của bạn.
          </p>

          {/* Link theo đúng yêu cầu: text-theme, cursor-pointer, không gạch chân */}
          <div className="mb-10">
            <span 
              onClick={() => navigate('/settings')} // Thay đổi đường dẫn cho phù hợp với routing của bạn
              className="text-[14px] text-theme cursor-pointer transition-colors"
            >
              Về cài đặt nhận thư
            </span>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Chữ Bắt buộc nằm bên phải */}
            <div className="flex justify-end mb-2">
              <span className="text-[13px] text-gray-800">
                Bắt buộc <span className="text-theme">*</span>
              </span>
            </div>

            {/* Khung nhập Email */}
            <div className="-mt-4">
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                Địa chỉ email <span className="text-theme">*</span>
              </label>
              <input 
                type="email" 
                placeholder="example@email.com"
                className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors"
              />
            </div>

            {/* Các nút bấm */}
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer"
              >
                GỬI
              </button>
              <button 
                type="button"
                onClick={() => navigate('/')} // Nút TRANG CHỦ quay về trang gốc
                className="flex-1 h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors cursor-pointer"
              >
                TRANG CHỦ
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}