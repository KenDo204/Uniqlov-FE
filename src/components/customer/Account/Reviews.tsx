import { useEffect } from 'react';
import { Star } from '@/components/ui/icons';
import { useReview } from '@/hooks/useReview';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { ReviewStatus } from '@/types/enums/reviewStatus';

export function Reviews() {
  const { myReviews, isFetching, fetchMyReviews, deleteReview } = useReview();

  useEffect(() => {
    fetchMyReviews(0, 10).catch((err) => {
      console.error('Error fetching my reviews:', err);
    });
  }, [fetchMyReviews]);

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;
    try {
      await deleteReview(reviewId);
      toast.success('Xóa đánh giá thành công');
    } catch (err: any) {
      toast.error(err || 'Không thể xóa đánh giá');
    }
  };

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case ReviewStatus.PENDING:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            Chờ duyệt
          </span>
        );
      case ReviewStatus.APPROVED:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Đã duyệt
          </span>
        );
      case ReviewStatus.HIDDEN:
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            Đã ẩn
          </span>
        );
      default:
        return null;
    }
  };

  if (isFetching && !myReviews) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircularProgress sx={{ color: '#00927c' }} />
      </div>
    );
  }

  const items = myReviews?.content || [];

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Đánh giá đã đăng</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {items.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa viết đánh giá nào.</p>
      ) : (
        <div className="space-y-8">
          {items.map((review) => (
            <div key={review.reviewId} className="border border-gray-200 p-6 flex flex-col sm:flex-row gap-6">
              
              {/* Cột thông tin sản phẩm (Trái) */}
              <div className="flex gap-4 sm:w-1/3 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-6">
                <div className="w-[60px] h-[80px] bg-gray-100 shrink-0 overflow-hidden">
                  <img
                    src={review.images?.[0]?.imageUrl || 'https://via.placeholder.com/60x80'}
                    alt={review.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[13px] flex-1">
                  <p className="font-medium text-black m-0 mb-1 line-clamp-2">{review.productName}</p>
                  {review.orderId && <p className="text-gray-400 text-[11px] m-0">Đơn hàng: #{review.orderId}</p>}
                  <div className="mt-2">{getStatusBadge(review.reviewStatus)}</div>
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
                  <span className="text-[12px] text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-[14px] text-gray-800 leading-relaxed m-0">
                  {review.comment}
                </p>

                {/* Danh sách ảnh đính kèm trong đánh giá */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {review.images.map((img) => (
                      <a 
                        key={img.reviewImageId} 
                        href={img.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 border border-gray-200 overflow-hidden block"
                      >
                        <img 
                          src={img.imageUrl} 
                          alt="Review attachment" 
                          className="w-full h-full object-cover hover:opacity-80 transition-opacity" 
                        />
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => handleDelete(review.reviewId)}
                    className="text-[12px] font-medium text-red-500 bg-transparent border-none p-0 cursor-pointer hover:underline"
                  >
                    Xóa đánh giá
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