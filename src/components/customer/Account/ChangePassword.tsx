import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { EyeOff, Eye, Lock } from '@/components/ui/icons';

const resetSchema = z.object({
  otp: z.string().min(6, 'Mã OTP phải đủ 6 ký tự').max(6, 'Mã OTP không quá 6 ký tự'),
  newPassword: z.string().min(8, 'Mật khẩu phải từ 8 ký tự trở lên'),
  confirmPassword: z.string().min(8, 'Vui lòng xác nhận mật khẩu mới'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export function ChangePassword() {
  const { user, forgotPassword, resetPassword } = useAuth();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' }
  });

  const handleSendOtp = async () => {
    if (!user?.email) {
      toast.error('Không tìm thấy email của bạn.');
      return;
    }
    
    setIsSendingOtp(true);
    try {
      await forgotPassword({ email: user.email });
      toast.success(`Mã OTP đã được gửi đến email ${user.email}`, { position: 'top-right' });
      setStep(2);
    } catch (err: any) {
      toast.error(err || 'Gửi yêu cầu thất bại.', { position: 'top-right' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: ResetFormValues) => {
    if (!user?.email) return;

    setIsSubmitting(true);
    try {
      await resetPassword({
        email: user.email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!', { position: 'top-right' });
      reset();
      setStep(1); // Quay lại bước gửi OTP hoặc để yên tùy nghiệp vụ
    } catch (err: any) {
      toast.error(err || 'Đổi mật khẩu thất bại.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in text-left max-w-2xl">
      <h2 className="text-[24px] font-medium m-0 mb-6">Thay đổi mật khẩu</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {step === 1 ? (
        <div className="space-y-6">
          <p className="text-[14px] text-gray-700">
            Để bảo mật tài khoản, chúng tôi sẽ gửi một mã xác thực (OTP) đến email đăng ký của bạn.
            Vui lòng nhấn nút bên dưới để nhận mã.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <span className="text-gray-600 text-sm">Email nhận mã: </span>
            <span className="font-semibold text-gray-900">{user?.email || 'Đang tải...'}</span>
          </div>

          <button 
            type="button" 
            onClick={handleSendOtp}
            disabled={isSendingOtp || !user?.email}
            className="px-8 py-3 bg-black text-white text-[14px] uppercase border-none cursor-pointer hover:bg-gray-800 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSendingOtp ? 'ĐANG GỬI MÃ...' : 'GỬI MÃ XÁC THỰC'}
          </button>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-[18px] font-medium m-0">Xác thực và Đổi mật khẩu</h3>
            <span className="text-[13px] text-theme">Bắt buộc <span className="text-theme">*</span></span>
          </div>

          <div className="bg-green-50 text-green-700 p-3 rounded text-sm mb-4">
            Mã OTP đã được gửi đến <b>{user?.email}</b>. Vui lòng kiểm tra hộp thư của bạn.
          </div>

          {/* OTP */}
          <div>
            <label className="block text-[14px] text-gray-700 mb-2">
              Mã OTP <span className="text-theme">*</span>
            </label>
            <input
              type="text"
              {...register('otp')}
              maxLength={6}
              placeholder="Nhập mã OTP 6 số"
              className={`w-full px-4 py-3 border text-[14px] focus:outline-none transition-colors ${errors.otp ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
            />
            {errors.otp && <span className="text-red-500 text-[12px] mt-1 block">{errors.otp.message}</span>}
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label className="block text-[14px] text-gray-700 mb-2">
              Mật khẩu mới <span className="text-theme">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                {...register('newPassword')}
                placeholder="Vui lòng nhập mật khẩu mới."
                className={`w-full px-4 py-3 border text-[14px] focus:outline-none pr-10 transition-colors ${errors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.newPassword && <span className="text-red-500 text-[12px] mt-1 block">{errors.newPassword.message}</span>}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label className="block text-[14px] text-gray-700 mb-2">
              Xác nhận mật khẩu mới <span className="text-theme">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                placeholder="Xác nhận lại mật khẩu mới."
                className={`w-full px-4 py-3 border text-[14px] focus:outline-none pr-10 transition-colors ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-red-500 text-[12px] mt-1 block">{errors.confirmPassword.message}</span>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-black text-white text-[14px] uppercase border-none cursor-pointer hover:bg-gray-800 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'ĐANG LƯU...' : 'LƯU MẬT KHẨU MỚI'}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-white text-black text-[14px] uppercase border border-black cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              HỦY VÀ TRỞ LẠI
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 flex items-start gap-2 text-[12px] text-gray-600">
        <Lock size={14} className="mt-0.5 shrink-0" />
        <p className="m-0">
          Chúng tôi mã hóa tất cả thông tin cá nhân của bạn bằng công nghệ mã hóa TLS (Bảo mật lớp truyền tải).
        </p>
      </div>
    </div>
  );
}