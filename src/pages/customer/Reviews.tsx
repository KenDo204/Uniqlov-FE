import { Star } from 'lucide-react';

// Mock data nội bộ
const mockReviews = [
  {
    id: 'R01',
    product_name: 'Áo Thun Cổ Tròn Ngắn Tay',
    rating: 5,
    date: '10/05/2026',
    content: 'Chất vải mát, giao hàng nhanh. Form áo lên rất chuẩn. Sẽ tiếp tục ủng hộ shop!',
    variant: 'Trắng, Size L',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80'
  },
  {
    id: 'R02',
    product_name: 'Quần Chinos Ống Đứng',
    rating: 4,
    date: '02/04/2026',
    content: 'Quần đẹp nhưng phần eo hơi rộng so với size chart một chút. Nhìn chung vẫn rất ưng ý với tầm giá này.',
    variant: 'Beige, Size M',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&q=80'
  }
];

export function Reviews() {
  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Đánh giá đã đăng</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {mockReviews.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa viết đánh giá nào.</p>
      ) : (
        <div className="space-y-8">
          {mockReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 p-6 flex flex-col sm:flex-row gap-6">
              
              {/* Cột thông tin sản phẩm (Trái) */}
              <div className="flex gap-4 sm:w-1/3 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-6">
                <div className="w-[60px] h-[80px] bg-gray-100 shrink-0">
                  <img 
                    src={review.image} 
                    alt={review.product_name} 
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
                <div className="text-[13px]">
                  <p className="font-medium text-black m-0 mb-1 line-clamp-2">{review.product_name}</p>
                  <p className="text-gray-500 m-0">{review.variant}</p>
                </div>
              </div>

              {/* Cột nội dung đánh giá (Phải) */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className={star <= review.rating ? "fill-black text-black" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-[12px] text-gray-500">{review.date}</span>
                </div>
                <p className="text-[14px] text-gray-800 leading-relaxed m-0">
                  {review.content}
                </p>
                
                <div className="mt-4 flex gap-3">
                  <button className="text-[12px] font-medium text-blue-600 bg-transparent border-none p-0 cursor-pointer hover:underline">
                    Chỉnh sửa
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-[12px] font-medium text-red-500 bg-transparent border-none p-0 cursor-pointer hover:underline">
                    Xóa
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