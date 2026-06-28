import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from '@/components/ui/icons';
import { formatVND } from '@/utils/formatters';
import { useWishlist } from '@/hooks/useWishlist';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

export function Wishlists() {
  const navigate = useNavigate();
  const { wishlist, isFetching, fetchMyWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchMyWishlist(0, 20).catch((err) => {
      console.error('Error fetching wishlist:', err);
    });
  }, [fetchMyWishlist]);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (err: any) {
      toast.error(err || 'Không thể xóa sản phẩm khỏi danh sách yêu thích');
    }
  };

  if (isFetching && !wishlist) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircularProgress sx={{ color: '#00927c' }} />
      </div>
    );
  }

  const items = wishlist?.content || [];

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Yêu thích</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {items.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.wishlistId} className="relative group border border-transparent hover:border-gray-200 p-2 transition-all">
              {/* Nút xóa khỏi yêu thích */}
              <button 
                onClick={() => handleRemove(item.productId)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 rounded-full text-gray-500 hover:text-black hover:bg-white cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border-none"
                title="Xóa khỏi yêu thích"
              >
                <X size={16} />
              </button>

              {/* Ảnh sản phẩm */}
              <div 
                onClick={() => navigate(`/product/${item.productSlug}`)}
                className="w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden cursor-pointer"
              >
                <img 
                  src={item.thumbnailUrl || 'https://via.placeholder.com/300x400'} 
                  alt={item.productName} 
                  className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thông tin */}
              <div className="space-y-1 text-[14px]">
                <h3 
                  onClick={() => navigate(`/product/${item.productSlug}`)}
                  className="font-medium text-black m-0 line-clamp-1 cursor-pointer hover:text-theme"
                >
                  {item.productName}
                </h3>
                <p className="text-gray-400 text-[12px] m-0">Trạng thái: {item.inStock ? 'Còn hàng' : 'Hết hàng'}</p>
                <p className="font-bold text-[15px] m-0 mt-2">{formatVND(item.minPrice)}</p>
              </div>

              {/* Nút xem chi tiết */}
              <button 
                onClick={() => navigate(`/product/${item.productSlug}`)}
                className="w-full mt-4 py-2.5 border border-black text-[12px] font-bold uppercase tracking-wide bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}