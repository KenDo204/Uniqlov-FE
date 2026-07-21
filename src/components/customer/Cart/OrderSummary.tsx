import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';
import { toast } from 'react-toastify';

interface OrderSummaryProps {
  itemCount: number;
  rawSubtotal: number;
  total: number;
  selectedItemIds?: string[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemCount,
  rawSubtotal,
  total,
  selectedItemIds = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
      {/* Khung xám */}
      <div className="bg-[#f4f4f4] p-6">
        <div className="flex justify-between font-bold text-[16px] mb-5">
          <span>Tổng đơn hàng</span>
          <span>{itemCount} Sản phẩm</span>
        </div>

        <div className="space-y-4 text-[14px] mb-6">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatVND(rawSubtotal)}</span>
          </div>
        </div>

        <div className="border-t-2 border-gray-300 pt-4 mb-2 flex justify-between font-bold text-[16px]">
          <span>Tổng đơn đặt hàng</span>
          <span className="text-theme">{formatVND(total)}</span>
        </div>
      </div>

      {/* Nút thanh toán bo tròn hình viên thuốc đặc trưng */}
      <button
        onClick={() => {
          if (selectedItemIds.length === 0) {
            toast.warn('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.');
            return;
          }
          navigate(paths.customer.checkout, { state: { selectedItemIds } });
        }}
        className="w-full bg-theme text-white py-4 rounded-full font-bold text-[14px] tracking-wide hover:bg-theme-hover transition-colors border-none cursor-pointer mt-6"
      >
        THANH TOÁN
      </button>
    </div>
  );
};
