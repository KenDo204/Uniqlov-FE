import { useState } from 'react';
import { Eye, EyeOff } from '@/components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form'; // Bổ sung Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Import component OTPField của bạn
import OTPField from '@/components/customer/OtpField/OTPField'; 

// Schema Bước 1: Đăng ký
const registerSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Định dạng email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải từ 8 - 20 kí tự').max(20, 'Mật khẩu tối đa 20 kí tự'),
  phone: z.union([
    z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ (VD: 0912345678)'),
    z.literal('')
  ]).optional(),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

// Schema Bước 2: Kích hoạt OTP
const otpSchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải bao gồm 6 chữ số'),
});
type OtpFormValues = z.infer<typeof otpSchema>;

export function Register() {
  const navigate = useNavigate();
  const { register: registerApi, activateAccount, resendOtp, loading, resetAuth } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  
  // Quản lý trạng thái luồng đăng ký
  const [step, setStep] = useState<1 | 2>(1);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Hook Form cho Bước 1
  const formStep1 = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', phone: '', email: '', password: '' }
  });

  // Hook Form cho Bước 2
  const formStep2 = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  // Xử lý Submit Bước 1: Gửi thông tin đăng ký
  const onSubmitStep1 = async (data: RegisterFormValues) => {
    resetAuth();
    try {
      await registerApi({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      } as any); 

      setRegisteredEmail(data.email);
      setStep(2); // Chuyển sang bước OTP
      toast.success('Đã gửi mã xác nhận đến email của bạn!', { position: 'top-right' });
    } catch (err: any) {
      toast.error(err || 'Đăng ký thất bại. Email có thể đã tồn tại.', { position: 'top-right' });
    }
  };

  // Xử lý Submit Bước 2: Kích hoạt tài khoản
  const onSubmitStep2 = async (data: OtpFormValues) => {
    resetAuth();
    try {
      await activateAccount({ email: registeredEmail, otp: data.otp });
      toast.success('🎉 Kích hoạt tài khoản thành công! Vui lòng đăng nhập.', { position: 'top-right', autoClose: 3000 });
      navigate('/login');
    } catch (err: any) {
      toast.error(err || 'Mã OTP không hợp lệ hoặc đã hết hạn.', { position: 'top-right' });
    }
  };

  // Xử lý Gửi lại OTP (Không cần quản lý timer ở đây nữa vì OTPInput đã tự lo)
  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: registeredEmail, type: 'ACTIVATION' });
      toast.success('Đã gửi lại mã OTP!', { position: 'top-right' });
    } catch (err: any) {
      toast.error(err || 'Chưa thể gửi lại mã lúc này.', { position: 'top-right' });
      throw err; // Bắn lỗi ra để OTPInput không reset timer nếu API lỗi
    }
  };

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Tạo một tài khoản
        </h1>

        <div className="max-w-[600px]">
          
          {/* ---------------- BƯỚC 1: FORM ĐĂNG KÝ ---------------- */}
          {step === 1 && (
            <>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[20px] font-medium m-0">Thông tin hồ sơ chi tiết</h2>
                <span className="text-[13px] text-theme">Bắt buộc *</span>
              </div>

              <form className="space-y-6" onSubmit={formStep1.handleSubmit(onSubmitStep1)}>
                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Họ và tên <span className="text-theme">*</span></label>
                  <input 
                    type="text" 
                    {...formStep1.register('fullName')}
                    placeholder="Nhập họ và tên của bạn"
                    className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${formStep1.formState.errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                  />
                  {formStep1.formState.errors.fullName && <span className="text-red-500 text-[12px] mt-1 block">{formStep1.formState.errors.fullName.message}</span>}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Số điện thoại</label>
                  <input 
                    type="text" 
                    {...formStep1.register('phone')}
                    placeholder="0912 345 678"
                    maxLength={10}
                    className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${formStep1.formState.errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                  />
                  {formStep1.formState.errors.phone && <span className="text-red-500 text-[12px] mt-1 block">{formStep1.formState.errors.phone.message}</span>}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Địa chỉ email <span className="text-theme">*</span></label>
                  <input 
                    type="email" 
                    {...formStep1.register('email')}
                    placeholder="example@email.com"
                    className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${formStep1.formState.errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                  />
                  {formStep1.formState.errors.email && <span className="text-red-500 text-[12px] mt-1 block">{formStep1.formState.errors.email.message}</span>}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Mật khẩu <span className="text-theme">*</span></label>
                  <div className="relative mb-2">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      {...formStep1.register('password')}
                      placeholder="Vui lòng nhập mật khẩu."
                      className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors pr-12 ${formStep1.formState.errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                    </button>
                  </div>
                  {formStep1.formState.errors.password ? (
                    <span className="text-red-500 text-[12px] block">{formStep1.formState.errors.password.message}</span>
                  ) : (
                    <span className="text-[13px] text-gray-700">Từ 8 - 20 kí tự</span>
                  )}
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'TIẾP TỤC'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ---------------- BƯỚC 2: NHẬP OTP ---------------- */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-[20px] font-medium m-0 mb-4">Xác thực Email</h2>
              <p className="text-[14px] text-gray-800 mb-8 leading-relaxed">
                Chúng tôi đã gửi một mã xác nhận gồm 6 chữ số đến email <span className="font-bold text-theme">{registeredEmail}</span>. 
                Vui lòng nhập mã vào bên dưới để kích hoạt tài khoản.
              </p>

              <form className="space-y-6" onSubmit={formStep2.handleSubmit(onSubmitStep2)}>
                
                {/* Dùng Controller kết hợp với OTPField */}
                <Controller
                  name="otp"
                  control={formStep2.control}
                  render={({ field, fieldState }) => (
                    <OTPField
                      id="register-otp"
                      name={field.name}
                      label="Mã xác nhận (OTP) *"
                      value={field.value}
                      onChange={field.onChange}
                      onResend={handleResendOtp}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      timer={30}
                    />
                  )}
                />

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN VÀ KÍCH HOẠT'}
                  </button>
                </div>
                {/* Chú ý: Đã xóa phần "Chưa nhận được mã" trùng lặp ở đây vì OTPField đã lo việc đó! */}
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}