import { mockOrders } from '@/constants/mock-orders';
import { formatVND } from '@/utils/formatters';

const getOrderStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Chờ thanh toán',
    'PAID': 'Đã thanh toán',
    'SHIPPING': 'Đang giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy'
  };
  return statusMap[status] || status;
};

export function Orders() {
  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Lịch sử mua hàng</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {(!mockOrders || mockOrders.length === 0) ? (
        <p className="text-[14px] text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-12">
          {mockOrders.map((ord) => (
            <div key={ord.order_id} className="border border-gray-200 p-0">
              {/* Header của Đơn hàng */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="text-[14px] text-gray-600 space-x-3">
                  <span className="font-bold text-black">Đơn hàng #{ord.order_id}</span>
                  <span>|</span>
                  <span>Ngày đặt: {ord.order_date}</span>
                </div>
                <div className="text-[13px] font-bold uppercase tracking-wider text-black">
                  Trạng thái: <span className={ord.order_status === 'SHIPPING' ? 'text-blue-600' : 'text-green-600'}>
                    {getOrderStatusLabel(ord.order_status)}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="p-6 space-y-6">
                {ord.order_details.map((detail) => (
                  <div key={detail.order_detail_id} className="flex gap-6">
                    {/* Cột Ảnh */}
                    <div className="w-[90px] h-[110px] bg-gray-100 shrink-0">
                      <img 
                        src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80" 
                        alt={detail.product_name} 
                        className="w-full h-full object-cover mix-blend-multiply" 
                      />
                    </div>
                    
                    {/* Cột Thông tin */}
                    <div className="flex-1 text-[14px]">
                      <h4 className="font-medium text-[15px] m-0 mb-1">{detail.product_name}</h4>
                      <div className="text-gray-500 space-y-0.5 mt-2 text-[13px]">
                        <p className="m-0">Màu sắc: {detail.variant_attributes.colorName}</p>
                        <p className="m-0">Kích cỡ: {detail.variant_attributes.size}</p>
                        <p className="m-0">Số lượng: {detail.num_of_product}</p>
                      </div>
                    </div>
                    
                    {/* Cột Giá */}
                    <div className="text-[14px] font-bold text-right shrink-0">
                      {formatVND(detail.order_detail_price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer của Đơn hàng (Tổng tiền & Vận đơn) */}
              <div className="px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
                <div className="text-[13px] text-gray-500">
                  {ord.tracking_number && (
                    <p className="m-0">Mã vận đơn: <span className="font-medium text-black">{ord.tracking_number}</span> (GHN)</p>
                  )}
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-[14px]">
                    Tổng tiền: <span className="text-[18px] font-bold ml-2">{formatVND(ord.final_payment_money)}</span>
                  </div>
                  <button className="px-6 py-2 bg-black text-white text-[12px] font-bold uppercase tracking-wide border-none cursor-pointer hover:bg-gray-800 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}