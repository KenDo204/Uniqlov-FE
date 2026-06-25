import { useState } from 'react';
import { Eye, EyeOff } from '@/components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form'; // Đã thêm Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Import OTPField (Đảm bảo đường dẫn này khớp với cấu trúc thư mục của bạn)
import OTPField from '@/components/customer/OtpField/OTPField';

const resetSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Định dạng email không hợp lệ'),
  otp: z.string().length(6, 'Mã OTP phải bao gồm 6 ký tự'),
  password: z.string().min(8, 'Mật khẩu phải từ 8 - 20 kí tự').max(20, 'Mật khẩu tối đa 20 kí tự'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không trùng khớp",
  path: ["confirmPassword"], 
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPassword() {
  const navigate = useNavigate();
  // Khai báo thêm resendOtp từ hook
  const { resetPassword, resendOtp, loading, resetAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lấy control và getValues từ useForm để bọc OTPField
  const { register, handleSubmit, control, getValues, formState: { errors } } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '', otp: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data: ResetFormValues) => {
    resetAuth(); 
    try {
      await resetPassword({ email: data.email, otp: data.otp, newPassword: data.password } as any);
      toast.success('🎉 Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.', { position: "top-right" });
      navigate('/login');
    } catch (err: any) {
      toast.error(err || 'Mã OTP không hợp lệ hoặc đã hết hạn.', { position: "top-right" });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Tạo mật khẩu mới
        </h1>

        <div className="max-w-[600px]">
          <h2 className="text-[20px] font-medium m-0 mb-4">Thiết lập lại bảo mật tài khoản</h2>
          <p className="text-[14px] text-gray-800 mb-8">
            Mã xác nhận (OTP) đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư mục Spam.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="flex justify-end mb-2 -mt-4">
              <span className="text-[13px] text-theme">
                Bắt buộc <span className="text-theme">*</span>
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Địa chỉ email <span className="text-theme">*</span></label>
              <input 
                type="email" 
                {...register('email')}
                placeholder="example@email.com"
                className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
              />
              {errors.email && <span className="text-red-500 text-[12px] mt-1 block">{errors.email.message}</span>}
            </div>

            {/* Mã OTP (Sử dụng Controller bọc OTPField) */}
            <Controller
              name="otp"
              control={control}
              render={({ field, fieldState }) => (
                <OTPField
                  id="reset-pw-otp"
                  name={field.name}
                  label="Mã xác nhận (OTP) *"
                  value={field.value}
                  onChange={field.onChange}
                  onResend={async () => {
                     // Lấy email hiện tại đang gõ trên form để gửi lại mã
                     const currentEmail = getValues('email');
                     if (!currentEmail || errors.email) {
                        toast.error('Vui lòng nhập Email hợp lệ trước khi gửi lại mã.', { position: 'top-right' });
                        throw new Error("Missing email"); // Quăng lỗi để OTPField không tự reset timer
                     }
                     
                     try {
                        await resendOtp({ email: currentEmail, type: 'FORGOT_PASSWORD' });
                        toast.success('Đã gửi lại mã OTP!', { position: 'top-right' });
                     } catch (err: any) {
                        toast.error(err || 'Không thể gửi lại mã lúc này', { position: 'top-right' });
                        throw err; // Quăng lỗi để OTPField chặn timer
                     }
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  timer={30}
                />
              )}
            />

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Mật khẩu mới <span className="text-theme">*</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  {...register('password')}
                  placeholder="Từ 8 - 20 kí tự"
                  className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors pr-12 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                >
                  {showPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-[12px] mt-1 block">{errors.password.message}</span>}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-[13px] font-medium text-gray-800 mb-2">Xác nhận mật khẩu mới <span className="text-theme">*</span></label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register('confirmPassword')}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors pr-12 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-[12px] mt-1 block">{errors.confirmPassword.message}</span>}
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN MẬT KHẨU MỚI'}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <span 
                onClick={() => navigate('/login')}
                className="text-[13px] text-gray-500 hover:text-theme cursor-pointer underline underline-offset-2"
              >
                Quay lại trang Đăng nhập
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}