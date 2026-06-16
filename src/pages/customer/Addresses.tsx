import { mockDataAccount } from '@/constants/mock-data-account';

export function Addresses() {
  const { userAddresses } = mockDataAccount.data || { userAddresses: [] };

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-4">Sổ địa chỉ</h2>
      <p className="text-[14px] text-gray-700 mb-6">Có thể lưu tối đa 10 địa chỉ.</p>
      
      <hr className="border-t border-gray-200 mb-8" />

      <h3 className="text-[18px] font-medium mb-6">Địa chỉ thành viên</h3>
      
      {/* Ví dụ render địa chỉ nếu có, nếu không thì hiển thị trống dựa theo ảnh */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-[14px] mb-2">
          <button className="text-blue-600 bg-transparent border-none p-0 hover:underline cursor-pointer">
            Chỉnh sửa hồ sơ
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-red-500 font-bold">✓</span>
          <span>Địa chỉ hiện tại</span>
        </div>
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      <h3 className="text-[18px] uppercase font-medium mb-4">ĐỊA CHỈ GIAO HÀNG</h3>
      
      {userAddresses.length === 0 ? (
        <p className="text-[14px] text-gray-700 mb-8">Hiện bạn chưa có địa chỉ nào được lưu</p>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {userAddresses.map((addr) => (
             <div key={addr.address_id} className="bg-white border border-gray-200 p-5 rounded-2xl relative shadow-sm text-xs">
              {addr.is_default && (
                <span className="absolute top-4 right-4 text-[9px] uppercase font-bold text-red-500">Mặc định</span>
              )}
              <div className="space-y-1.5 font-light pt-2">
                <p className="font-bold text-sm m-0 text-black">{addr.recipient_name}</p>
                <p className="m-0 text-gray-700 font-medium">{addr.phone}</p>
                <p className="m-0 text-gray-500">{addr.full_address}</p>
              </div>
            </div>
          ))}
         </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button className="px-8 py-3 bg-black text-white text-[14px] uppercase border-none cursor-pointer hover:bg-gray-800 transition-colors w-full sm:w-auto">
          ĐĂNG KÝ ĐỊA CHỈ MỚI
        </button>
        <button className="px-8 py-3 bg-white text-black text-[14px] uppercase border border-black cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto">
          TRỞ LẠI TRANG THÀNH VIÊN
        </button>
      </div>
    </div>
  );
}