import { useState, useCallback } from 'react';
import { Eye, EyeOff, ArrowLeft } from '@/components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import OTPField from '@/components/customer/OtpField/OTPField';
import { Container } from '@/components/shared/Container';
import { registerSchema, sendOtpSchema, otpSchema, type RegisterFormValues, type SendOtpFormValues, type OtpFormValues } from '@/schemas';

export function Register() {
  const navigate = useNavigate();
  const { register: registerApi, sendOtp, verifyOtp, resendOtp, loading, resetAuth } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [registeredEmail, setRegisteredEmail] = useState<string>(() => {
    return sessionStorage.getItem('register_flow_email') || '';
  });

  const [registrationToken, setRegistrationToken] = useState<string>(() => {
    return sessionStorage.getItem('register_flow_token') || '';
  });

  const [step, setStep] = useState<1 | 2 | 3>(() => {
    const savedStep = sessionStorage.getItem('register_flow_step');
    const savedEmail = sessionStorage.getItem('register_flow_email');
    const savedToken = sessionStorage.getItem('register_flow_token');
    
    if (savedStep === '3' && savedToken) return 3;
    if (savedStep === '2' && savedEmail) return 2;
    return 1;
  });

  const clearRegistrationSession = useCallback((emailToClear?: string) => {
    const targetEmail = (emailToClear || registeredEmail || '').trim().toLowerCase();
    sessionStorage.removeItem('register_flow_step');
    sessionStorage.removeItem('register_flow_email');
    sessionStorage.removeItem('register_flow_token');
    if (targetEmail) {
      localStorage.removeItem(`otp_exp_ACTIVATION_${targetEmail}`);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: `otp_exp_ACTIVATION_${targetEmail}`,
          newValue: null,
        })
      );
    }
  }, [registeredEmail]);

  // Hook Form cho Bước 1 (Gửi OTP)
  const formStep1 = useForm<SendOtpFormValues>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: registeredEmail || '',
    }
  });

  // Hook Form cho Bước 2 (Mã OTP)
  const formStep2 = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  // Hook Form cho Bước 3 (Thông tin hồ sơ)
  const formStep3 = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      registrationToken: registrationToken || '',
      fullName: '',
      phone: '',
      password: '',
    }
  });

  // Xử lý Submit Bước 1: Nhập Email -> Gửi OTP
  const onSubmitStep1 = async (data: SendOtpFormValues) => {
    resetAuth();
    try {
      await sendOtp({ email: data.email });

      const emailTrimmed = data.email.trim().toLowerCase();
      setRegisteredEmail(emailTrimmed);
      setStep(2); 
      
      sessionStorage.setItem('register_flow_step', '2');
      sessionStorage.setItem('register_flow_email', emailTrimmed);
      
      const expTime = Date.now() + 30 * 1000;
      const expKey = `otp_exp_ACTIVATION_${emailTrimmed}`;
      localStorage.setItem(expKey, expTime.toString());
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: expKey,
          newValue: expTime.toString(),
        })
      );

      toast.success('Đã gửi mã xác nhận đến email của bạn!');
    } catch (err: any) {
      toast.error(err || 'Gửi OTP thất bại. Email có thể đã tồn tại.');
    }
  };

  // Xử lý Submit Bước 2: Nhập OTP -> Xác thực
  const onSubmitStep2 = async (data: OtpFormValues) => {
    resetAuth();
    try {
      const res = await verifyOtp({ email: registeredEmail, otp: data.otp });
      
      if (res && res.result?.registrationToken) {
        setRegistrationToken(res.result.registrationToken);
        formStep3.setValue('registrationToken', res.result.registrationToken);
        setStep(3);
        
        sessionStorage.setItem('register_flow_step', '3');
        sessionStorage.setItem('register_flow_token', res.result.registrationToken);
        
        toast.success('Xác thực Email thành công. Vui lòng điền thông tin cá nhân.');
      } else {
        toast.error('Có lỗi xảy ra, không nhận được token đăng ký.');
      }
    } catch (err: any) {
      toast.error(err || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    }
  };

  // Xử lý Submit Bước 3: Đăng ký
  const onSubmitStep3 = async (data: RegisterFormValues) => {
    resetAuth();
    try {
      await registerApi({
        registrationToken: data.registrationToken,
        fullName: data.fullName,
        password: data.password,
        phone: data.phone || undefined,
      });

      toast.success('🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập.', { position: 'top-right', autoClose: 3000 });
      
      clearRegistrationSession(registeredEmail);
      
      navigate('/login');
    } catch (err: any) {
      toast.error(err || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  const handleBackToStep1 = () => {
    clearRegistrationSession(registeredEmail);
    formStep2.reset();
    formStep3.reset();
    setStep(1);
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: registeredEmail, type: 'ACTIVATION' });
      toast.success('Đã gửi lại mã OTP!');
    } catch (err: any) {
      toast.error(err || 'Chưa thể gửi lại mã lúc này.');
      throw err;
    }
  };

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <Container className="py-10 md:py-16">
        
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Tạo một tài khoản
        </h1>

        <div className="max-w-[600px]">
          
          {/* ---------------- BƯỚC 1: NHẬP EMAIL ---------------- */}
          {step === 1 && (
            <>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[20px] font-medium m-0">Xác thực Email</h2>
                <span className="text-[13px] text-theme">Bắt buộc *</span>
              </div>

              <form className="space-y-6" onSubmit={formStep1.handleSubmit(onSubmitStep1)}>
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

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'ĐANG GỬI OTP...' : 'TIẾP TỤC'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ---------------- BƯỚC 2: NHẬP OTP ---------------- */}
          {step === 2 && (
            <div className="animate-fade-in">
              <button
                type="button"
                onClick={handleBackToStep1}
                className="inline-flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-theme mb-6 bg-transparent border-none cursor-pointer p-0 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại nhập Email khác</span>
              </button>

              <h2 className="text-[20px] font-medium m-0 mb-4">Nhập mã OTP</h2>
              <p className="text-[14px] text-gray-800 mb-8 leading-relaxed">
                Chúng tôi đã gửi một mã xác nhận gồm 6 chữ số đến email <span className="font-bold text-theme">{registeredEmail}</span>. 
                Vui lòng nhập mã vào bên dưới để tiếp tục.
              </p>

              <form className="space-y-6" onSubmit={formStep2.handleSubmit(onSubmitStep2)}>
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
                      timerKey="register_otp"
                      email={registeredEmail}
                      otpType="ACTIVATION"
                    />
                  )}
                />

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN OTP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ---------------- BƯỚC 3: THÔNG TIN HỒ SƠ ---------------- */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-[20px] font-medium m-0">Thông tin cá nhân</h2>
                <span className="text-[13px] text-theme">Bắt buộc *</span>
              </div>

              <form className="space-y-6" onSubmit={formStep3.handleSubmit(onSubmitStep3)}>
                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Họ và tên <span className="text-theme">*</span></label>
                  <input 
                    type="text" 
                    {...formStep3.register('fullName')}
                    placeholder="Nhập họ và tên của bạn"
                    className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${formStep3.formState.errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                  />
                  {formStep3.formState.errors.fullName && <span className="text-red-500 text-[12px] mt-1 block">{formStep3.formState.errors.fullName.message}</span>}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Số điện thoại</label>
                  <input 
                    type="text" 
                    {...formStep3.register('phone')}
                    placeholder="0912 345 678"
                    maxLength={10}
                    className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${formStep3.formState.errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                  />
                  {formStep3.formState.errors.phone && <span className="text-red-500 text-[12px] mt-1 block">{formStep3.formState.errors.phone.message}</span>}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-800 mb-2">Mật khẩu <span className="text-theme">*</span></label>
                  <div className="relative mb-2">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      {...formStep3.register('password')}
                      placeholder="Vui lòng nhập mật khẩu."
                      className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors pr-12 ${formStep3.formState.errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer p-0"
                    >
                      {showPassword ? <Eye className="w-5 h-5" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5" strokeWidth={1.5} />}
                    </button>
                  </div>
                  {formStep3.formState.errors.password ? (
                    <span className="text-red-500 text-[12px] block">{formStep3.formState.errors.password.message}</span>
                  ) : (
                    <span className="text-[13px] text-gray-700">Từ 8 - 64 kí tự</span>
                  )}
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 flex items-center justify-center"
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'HOÀN TẤT ĐĂNG KÝ'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </Container>
    </div>
  );
}