import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

const forgotSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Định dạng email không hợp lệ'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, loading, resetAuth } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (data: ForgotFormValues) => {
    resetAuth();
    try {
      await forgotPassword({ email: data.email });
      toast.success('Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn!', { position: 'top-right' });
      reset(); // Xóa form sau khi gửi thành công
      // Chuyển sang form nhập OTP luôn
      navigate('/reset-password'); 
    } catch (err: any) {
      toast.error(err || 'Gửi yêu cầu thất bại.', { position: 'top-right' });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen text-gray-900 font-sans pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <h1 className="text-[28px] md:text-[32px] font-medium m-0 mb-8 border-b border-gray-200 pb-4">
          Đặt lại mật khẩu của bạn
        </h1>

        <div className="max-w-[600px]">
          <h2 className="text-[20px] font-medium m-0 mb-4">
            Nhập địa chỉ email đã đăng ký của bạn
          </h2>
          <p className="text-[14px] text-gray-800 mb-4">
            Vui lòng nhập địa chỉ email đã đăng ký của bạn.
          </p>

          {/* <div className="mb-10">
            <span 
              onClick={() => navigate('/settings')} 
              className="text-[14px] text-theme cursor-pointer transition-colors"
            >
              Về cài đặt nhận thư
            </span>
          </div> */}

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="flex justify-end mb-2">
              <span className="text-[13px] text-theme">
                Bắt buộc <span className="text-theme">*</span>
              </span>
            </div>

            <div className="-mt-4">
              <label className="block text-[13px] font-medium text-gray-800 mb-2">
                Địa chỉ email <span className="text-theme">*</span>
              </label>
              <input 
                type="email" 
                {...register('email')}
                placeholder="example@email.com"
                className={`w-full border rounded-none px-4 py-3 outline-none text-[14px] transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-black'}`}
              />
               {errors.email && <span className="text-red-500 text-[12px] mt-1 block">{errors.email.message}</span>}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'ĐANG GỬI...' : 'GỬI'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 h-12 bg-theme hover:bg-theme-hover text-white font-bold text-[14px] rounded-full transition-colors border-none cursor-pointer"
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