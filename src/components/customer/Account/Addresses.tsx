import { useState, useEffect } from 'react';
import { useAddress } from '@/hooks/useAddress';
import CreateAddressModal from './createAdressModal';
import UpdateAddressModal from './updateAddressModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { AddressResponse } from '@/types/address';
import AddressCard from './AddressCard';

export function Addresses() {
  const { 
    addresses, 
    isFetching, 
    fetchAddresses, 
    deleteAddress, 
    setDefaultAddress 
  } = useAddress();

  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        await deleteAddress(id);
        toast.success("Xóa địa chỉ thành công!");
      } catch (err: any) {
        toast.error(err || "Lỗi khi xóa địa chỉ");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      toast.success("Đặt địa chỉ mặc định thành công!");
    } catch (err: any) {
      toast.error(err || "Lỗi khi đặt địa chỉ mặc định");
    }
  };

  const handleOpenUpdate = (addr: AddressResponse) => {
    setSelectedAddress(addr);
    setUpdateOpen(true);
  };

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-4">Sổ địa chỉ</h2>
      <p className="text-[14px] text-gray-700 mb-6 font-light">Có thể lưu tối đa 10 địa chỉ.</p>

      <hr className="border-t border-gray-200 mb-8" />

      <h3 className="text-[18px] uppercase font-medium mb-4">ĐỊA CHỈ GIAO HÀNG</h3>

      {isFetching ? (
        <p className="text-[14px] text-gray-500 mb-8">Đang tải danh sách địa chỉ...</p>
      ) : addresses.length === 0 ? (
        <p className="text-[14px] text-gray-700 mb-8">Hiện bạn chưa có địa chỉ nào được lưu</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.addressId}
              address={addr}
              onEdit={handleOpenUpdate}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={() => setCreateOpen(true)}
          className="px-8 py-3 bg-[var(--color-theme)] text-white text-[14px] uppercase border-none cursor-pointer hover:bg-[var(--color-theme-hover)] transition-colors w-full sm:w-auto font-medium"
        >
          ĐĂNG KÝ ĐỊA CHỈ MỚI
        </button>
        <button 
          onClick={() => navigate('/account/profile')}
          className="px-8 py-3 bg-white text-black text-[14px] uppercase border border-black cursor-pointer hover:bg-gray-50 transition-colors w-full sm:w-auto font-medium"
        >
          TRỞ LẠI TRANG THÀNH VIÊN
        </button>
      </div>

      <CreateAddressModal open={createOpen} setOpen={setCreateOpen} />
      <UpdateAddressModal open={updateOpen} setOpen={setUpdateOpen} address={selectedAddress} />
    </div>
  );
}