import { mockDataAccount } from '@/constants/mock-data-account';

const getGenderLabel = (gender: number) => {
  if (gender === 0) return 'Nữ';
  if (gender === 1) return 'Nam';
  return 'Khác';
};

export function ProfileDetails() {
  const { userProfile, userAddresses } = mockDataAccount.data || { userProfile: null, userAddresses: [] };
  const defaultAddress = userAddresses.find(addr => addr.is_default);

  if (!userProfile) return null;

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Hồ sơ</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {/* Section: Email */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-medium m-0">Địa chỉ email thành viên</h3>
        <button className="px-4 py-1.5 border border-gray-300 rounded-full bg-white text-[11px] font-bold text-gray-600 uppercase tracking-wide hover:bg-gray-50 transition-colors cursor-pointer">
          Thay đổi địa chỉ email
        </button>
      </div>
      
      <div className="mb-10 text-[14px]">
        <p className="text-gray-500 mb-2">Địa chỉ email</p>
        <p className="text-gray-900 m-0">{userProfile.email}</p>
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      {/* Section: Hồ sơ chi tiết */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[18px] font-medium m-0">Hồ sơ</h3>
        <button className="px-5 py-1.5 border border-gray-300 rounded-full bg-white text-[11px] font-bold text-gray-600 uppercase tracking-wide hover:bg-gray-50 transition-colors cursor-pointer">
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Các trường thông tin */}
      <div className="space-y-8 text-[14px]">
        <div>
          <p className="text-gray-500 mb-2">Tên</p>
          <p className="text-gray-900 m-0">{userProfile.full_name}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Địa chỉ</p>
          <p className="text-gray-900 m-0 max-w-lg">
            {defaultAddress ? defaultAddress.full_address : 'Chưa đăng ký'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Điện thoại</p>
          <p className="text-gray-900 m-0">{userProfile.phone || 'Chưa đăng ký'}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Sinh nhật</p>
          <p className="text-gray-900 m-0">{userProfile.dob || 'Chưa đăng ký'}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Giới tính</p>
          <p className="text-gray-900 m-0">{getGenderLabel(userProfile.gender)}</p>
        </div>
      </div>
    </div>
  );
}