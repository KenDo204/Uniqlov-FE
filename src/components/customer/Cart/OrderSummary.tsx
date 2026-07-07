import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ChevronRight } from '@/components/ui/icons';
import { formatVND } from '@/utils/formatters';
import { paths } from '@/config/paths';

interface OrderSummaryProps {
  itemCount: number;
  rawSubtotal: number;
  discountAmount: number;
  total: number;
  isCouponOpen: boolean;
  setIsCouponOpen: (open: boolean) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: (e: React.FormEvent) => void;
  couponSuccess: boolean;
  couponDescription: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemCount,
  rawSubtotal,
  discountAmount,
  total,
  isCouponOpen,
  setIsCouponOpen,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  couponSuccess,
  couponDescription,
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
          {discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Giảm giá</span>
              <span>-{formatVND(discountAmount)}</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-gray-300 pt-4 mb-2 flex justify-between font-bold text-[16px]">
          <span>Tổng đơn đặt hàng</span>
          <span className="text-theme">{formatVND(total)}</span>
        </div>
        <div className="text-[12px] text-gray-600">Đã bao gồm thuế giá trị gia tăng</div>
      </div>

      {/* Accordions */}
      <div className="mt-4 border-t border-gray-200">
        <button
          onClick={() => setIsCouponOpen(!isCouponOpen)}
          className="w-full py-4 flex justify-between items-center text-[14px] font-medium border-b border-gray-200 bg-transparent cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5 text-gray-500" strokeWidth={1.5} /> Phiếu giảm giá
          </div>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform ${isCouponOpen ? 'rotate-90' : ''}`}
            strokeWidth={1.5}
          />
        </button>

        {/* Form nhập mã (ẩn/hiện) */}
        {isCouponOpen && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-none text-sm focus:outline-none focus:border-black uppercase"
              />
              <button
                type="submit"
                className="px-6 bg-black text-white font-bold text-[13px] uppercase rounded-none hover:bg-gray-800 cursor-pointer border-none"
              >
                Áp dụng
              </button>
            </form>
            {couponSuccess && (
              <p className="text-green-600 text-[12px] mt-2 mb-0 font-medium">{couponDescription}</p>
            )}
          </div>
        )}
      </div>

      {/* Nút thanh toán bo tròn hình viên thuốc đặc trưng */}
      <button
        onClick={() => navigate(paths.customer.checkout)}
        className="w-full bg-theme text-white py-4 rounded-full font-bold text-[14px] tracking-wide hover:bg-theme-hover transition-colors border-none cursor-pointer mt-6"
      >
        THANH TOÁN
      </button>
    </div>
  );
};
