import { useState } from 'react';
import {  Eye, EyeOff  } from '@/components/ui/icons';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState('other');

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Tiêu đề */}
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Tạo một tài khoản
        </h1>

        {/* Khung Form (giới hạn chiều rộng để giống hình) */}
        <div className="max-w-[600px]">
          
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-[20px] font-medium m-0">Thông tin hồ sơ chi tiết</h2>
            <span className="text-[13px] text-theme">Bắt buộc *</span>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                Địa chỉ email <span className="text-theme">*</span>
              </label>
              <input 
                type="email" 
                placeholder="example@email.com"
                className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                Mật khẩu <span className="text-theme">*</span>
              </label>
              <div className="relative mb-4">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Vui lòng nhập mật khẩu."
                  className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                >
                  {showPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>

              {/* Check list điều kiện mật khẩu */}
              <span>Từ 8 - 20 kí tự</span>
              {/* <ul className="list-none p-0 m-0 space-y-2.5 text-[13px] text-gray-700">
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                  <span>Từ 8 - 20 kí tự</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                  <span>Mật khẩu phải bao gồm cả chữ số và chữ cái</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Có thể dùng kí tự đặc biệt:<br/>!"#$%&'()*+,-./:;&lt;=&gt;?@[\]^_`{'{|}'}~</span>
                </li>
              </ul> */}
            </div>

            {/* Sinh nhật */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Sinh nhật</label>
              <input 
                type="text" 
                placeholder="DD/MM/YYYY"
                className="w-full border border-gray-400 rounded-none px-4 py-3 outline-none focus:border-black text-[14px] transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Nhập ngày sinh của bạn và chúng tôi sẽ gửi cho bạn một món quà sinh nhật bất ngờ! Bạn không thể chỉnh sửa ngày sinh sau khi đăng ký.
              </p>
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-4">Giới tính</label>
              <div className="space-y-4">
                {['Nữ', 'Nam', 'Khác'].map((g) => {
                  const isChecked = gender === (g === 'Khác' ? 'other' : g === 'Nam' ? 'male' : 'female');
                  return (
                    <label key={g} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'border-black' : 'border-gray-400 group-hover:border-black'}`}>
                        {isChecked && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                      </div>
                      <span className="text-[14px] text-gray-800 select-none">{g}</span>
                      <input 
                        type="radio" 
                        name="gender" 
                        className="hidden"
                        onChange={() => setGender(g === 'Khác' ? 'other' : g === 'Nam' ? 'male' : 'female')}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Nút Submit (Tùy chọn thêm vào để hoàn thiện trang) */}
            <div className="pt-8">
              <button 
                type="submit"
                className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer"
              >
                ĐĂNG KÝ
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}