import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Gender } from '@/types/enums/genderType';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
  phone: z.union([
    z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
    z.literal('')
  ]).optional(),
  dob: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const getGenderLabel = (gender?: string) => {
  if (gender === Gender.FEMALE) return 'Nữ';
  if (gender === Gender.MALE) return 'Nam';
  return 'Khác';
};

export function ProfileDetails() {
  const { user, fetchProfile } = useAuth();
  const { updateUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      dob: '',
      gender: Gender.OTHER,
    }
  });

  // Nạp dữ liệu hiện tại vào form mỗi khi mở chế độ chỉnh sửa
  useEffect(() => {
    if (user && isEditing) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender ?? Gender.OTHER,
      });
    }
  }, [user, isEditing, reset]);

  // 3. Xử lý Submit API
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      // Chỉ gửi lên các trường dành cho khách hàng, KHÔNG có roleId và isActive
      await updateUser(user.userId, {
        fullName: data.fullName,
        phone: data.phone || undefined,
        dob: data.dob || undefined,
        gender: data.gender,
      });

      toast.success('Cập nhật hồ sơ thành công!', { position: 'top-right' });
      setIsEditing(false); // Tắt chế độ chỉnh sửa
      
      // Quan trọng: Gọi lại fetchProfile để nạp dữ liệu mới nhất vào Redux State
      if (fetchProfile) {
        await fetchProfile();
      }
    } catch (err: any) {
      toast.error(err || 'Không thể cập nhật hồ sơ lúc này.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="p-4 text-gray-500">Đang tải thông tin...</div>;

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Hồ sơ</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {/* Section: Email (Không cho phép đổi ở đây) */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-medium m-0">Địa chỉ email thành viên</h3>
      </div>
      
      <div className="mb-10 text-[14px]">
        <p className="text-gray-500 mb-2">Địa chỉ email</p>
        <p className="text-gray-900 m-0 font-medium">{user.email}</p>
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      {/* Section: Hồ sơ chi tiết */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[18px] font-medium m-0">Hồ sơ</h3>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-5 py-1.5 border border-gray-300 rounded-full bg-theme text-[11px] font-bold text-white uppercase tracking-wide hover:bg-theme-hover transition-colors cursor-pointer"
          >
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      {/* Tùy biến hiển thị: Form Chỉnh Sửa hoặc Chế Độ Xem */}
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
          <div>
            <label className="block text-[13px] font-medium text-gray-800 mb-2">Tên <span className="text-theme">*</span></label>
            <input 
              type="text" 
              {...register('fullName')}
              className={`w-full border rounded-none px-4 py-2.5 outline-none text-[14px] transition-colors ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
            />
            {errors.fullName && <span className="text-red-500 text-[12px] mt-1 block">{errors.fullName.message}</span>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-800 mb-2">Điện thoại</label>
            <input 
              type="text" 
              {...register('phone')}
              placeholder="0912 345 678"
              maxLength={10}
              className={`w-full border rounded-none px-4 py-2.5 outline-none text-[14px] transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-black'}`}
            />
            {errors.phone && <span className="text-red-500 text-[12px] mt-1 block">{errors.phone.message}</span>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-800 mb-2">Sinh nhật</label>
            <input 
              type="date" 
              {...register('dob')}
              className="w-full border border-gray-300 rounded-none px-4 py-2.5 outline-none text-[14px] transition-colors focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-800 mb-2">Giới tính</label>
            <select 
              {...register('gender')}
              className="w-full border border-gray-300 rounded-none px-4 py-2.5 outline-none text-[14px] transition-colors focus:border-black bg-white"
            >
              <option value={Gender.MALE}>Nam</option>
              <option value={Gender.FEMALE}>Nữ</option>
              <option value={Gender.OTHER}>Khác</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-theme hover:bg-theme-hover text-white font-bold text-[13px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
            </button>
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[13px] rounded-full transition-colors border-none cursor-pointer disabled:opacity-70"
            >
              HỦY
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8 text-[14px]">
          <div>
            <p className="text-gray-500 mb-2">Tên</p>
            <p className="text-gray-900 m-0 font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-2">Điện thoại</p>
            <p className="text-gray-900 m-0 font-medium">{user.phone || 'Chưa đăng ký'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-2">Sinh nhật</p>
            <p className="text-gray-900 m-0 font-medium">{user.dob || 'Chưa đăng ký'}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-2">Giới tính</p>
            <p className="text-gray-900 m-0 font-medium">{getGenderLabel(user.gender)}</p>
          </div>
        </div>
      )}
    </div>
  );
}