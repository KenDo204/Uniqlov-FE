import React, { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header có icon info góc phải */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-10">
          <h1 className="text-[28px] md:text-[32px] font-medium m-0">Đăng nhập</h1>
          <Info className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
          <div className="w-full max-w-[500px]">
            {/* Box cảnh báo */}
            <div className="border border-gray-300 bg-[#f8f8f8] p-5 mb-8 text-[13px] text-gray-800 leading-relaxed">
              <p className="m-0 mb-3 flex gap-2">
                <span className="font-bold">⚠</span>
                <span>
                  Không đăng nhập được? Gần đây chúng tôi đã thực hiện một số cập nhật cho trang web, để tiếp tục sử dụng tài khoản của bạn, vui lòng sử dụng đường link "<Link to="/forgot-password" className="text-blue-700 cursor-pointer">Quên mật khẩu của bạn?</Link>" để thiết lập lại mật khẩu.
                </span>
              </p>
              <p className="m-0 pl-5">
                Vui lòng không sử dụng lại mật khẩu đã được sử dụng cho dịch vụ khách hoặc mật khẩu dễ đoán.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-2">Địa chỉ email</label>
                <input 
                  type="email" 
                  placeholder="example@email.com"
                  className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-800 mb-2">Mật khẩu</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Vui lòng nhập mật khẩu."
                    className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                  >
                    {showPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/forgot-password" className="text-blue-700 cursor-pointer text-[13px]">
                  Quên mật khẩu của bạn?
                </Link>
              </div>

              <button 
                type="submit"
                className="w-[200px] h-12 bg-black text-white font-bold text-[14px] rounded-full hover:bg-gray-800 transition-colors border-none cursor-pointer mt-4"
              >
                ĐĂNG NHẬP
              </button>
            </form>
          </div>

          {/* CỘT PHẢI: TẠO TÀI KHOẢN MỚI */}
          <div className="w-full max-w-[500px]">
            <button 
              onClick={() => navigate('/register')}
              className="w-[240px] h-12 bg-white text-black font-bold text-[14px] rounded-full border border-black hover:bg-gray-50 transition-colors cursor-pointer mb-6"
            >
              TẠO TÀI KHOẢN
            </button>
            <p className="text-[14px] text-gray-800 leading-relaxed m-0">
              Nếu bạn tạo tài khoản, bạn có thể nhận được các dịch vụ cá nhân hóa như kiểm tra lịch sử mua hàng và nhận phiếu giảm giá khi đăng ký thành viên mới. Đăng ký miễn phí ngay hôm nay! Tạo tài khoản và nhận phiếu giảm giá chào mừng thành viên mới.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}