import { EyeOff, Lock } from '@/components/ui/icons';

export function ChangePassword() {
  return (
    <div className="animate-fade-in text-left max-w-2xl">
      <h2 className="text-[24px] font-medium m-0 mb-6">Thay đổi mật khẩu</h2>
      <hr className="border-t border-gray-200 mb-8" />

      <div className="flex justify-between items-end mb-4">
        <h3 className="text-[18px] font-medium m-0">Mật khẩu</h3>
        <span className="text-[13px] text-blue-600">Bắt buộc <span className="text-red-500">*</span></span>
      </div>

      <form className="space-y-6">
        {/* Mật khẩu hiện tại */}
        <div>
          <label className="block text-[14px] text-gray-700 mb-2">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu hiện tại của bạn."
              className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-black pr-10"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer">
              <EyeOff size={18} />
            </button>
          </div>
          <button type="button" className="text-[13px] text-blue-600 bg-transparent border-none p-0 mt-2  cursor-pointer">
            Quên mật khẩu của bạn?
          </button>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-[14px] text-gray-700 mb-2">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu mới."
              className="w-full px-4 py-3 border border-gray-300 text-[14px] focus:outline-none focus:border-black pr-10"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer">
              <EyeOff size={18} />
            </button>
          </div>
        </div>

        {/* Điều kiện mật khẩu */}
        <div className="space-y-2 text-[13px] text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" disabled className="w-4 h-4" />
            <span>Từ 8 - 20 kí tự</span>
          </label>
          {/* <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" disabled className="w-4 h-4" />
            <span>Mật khẩu phải bao gồm cả chữ số và chữ cái</span>
          </label>
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="radio" disabled className="w-4 h-4 mt-0.5" />
            <span>
              Có thể dùng kí tự đặc biệt:<br/>
              !"#$%&'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~
            </span>
          </label> */}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button type="button" className="px-8 py-3 bg-black text-white text-[14px] uppercase border-none cursor-pointer hover:bg-gray-800 transition-colors w-full sm:w-auto">
            THAY ĐỔI MẬT KHẨU CỦA TÔI
          </button>
          <button type="button" className="px-8 py-3 bg-white text-black text-[14px] uppercase border border-black cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto">
            TRỞ LẠI TRANG THÀNH VIÊN
          </button>
        </div>
      </form>

      <div className="mt-8 flex items-start gap-2 text-[12px] text-gray-600">
        <Lock size={14} className="mt-0.5 shrink-0" />
        <p className="m-0">
          Chúng tôi mã hóa tất cả thông tin cá nhân của bạn bằng công nghệ mã hóa TLS (Bảo mật lớp truyền tải).
          [<a href="#" className="text-blue-600 ">TLS (Bảo mật kết nối)</a>]
        </p>
      </div>
    </div>
  );
}