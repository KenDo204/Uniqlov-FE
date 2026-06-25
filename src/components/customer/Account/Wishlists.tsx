import {  X  } from '@/components/ui/icons';
import { formatVND } from '@/utils/formatters';

const mockWishlists = [
  {
    id: 'W01',
    product_name: 'Áo Polo Vải Pique Ngắn Tay',
    price: 399000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    color: 'Trắng',
  },
  {
    id: 'W02',
    product_name: 'Quần Jeans Dáng Suông Ống Rộng',
    price: 799000,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
    color: 'Xanh nhạt',
  }
];

export function Wishlists() {
  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Yêu thích</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {mockWishlists.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWishlists.map((item) => (
            <div key={item.id} className="relative group border border-transparent hover:border-gray-200 p-2 transition-all">
              {/* Nút xóa khỏi yêu thích */}
              <button 
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-gray-500 hover:text-black hover:bg-white cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xóa khỏi yêu thích"
              >
                <X size={16} />
              </button>

              {/* Ảnh sản phẩm */}
              <div className="w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.product_name} 
                  className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thông tin */}
              <div className="space-y-1 text-[14px]">
                <h3 className="font-medium text-black m-0 line-clamp-1">{item.product_name}</h3>
                <p className="text-gray-500 m-0">Màu: {item.color}</p>
                <p className="font-bold text-[15px] m-0 mt-2">{formatVND(item.price)}</p>
              </div>

              {/* Nút thêm vào giỏ */}
              <button className="w-full mt-4 py-2.5 border border-black text-[12px] font-bold uppercase tracking-wide bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}