import { useEffect } from 'react';
import { useReview } from '@/hooks/useReview';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { Review } from '@/features/review/Review';

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
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Không thể xóa đánh giá';
      toast.error(errorMessage);
    }
  };

  if (isFetching && !myReviews) {
    return (
      <div className="flex justify-center items-center py-20">
        <CircularProgress sx={{ color: 'theme' }} />
      </div>
    );
  }

  const items = myReviews?.content || [];

  return (
    <div className="animate-fade-in text-left">
      <h2 className="text-[24px] font-medium m-0 mb-6">Đánh giá</h2>
      <hr className="border-t border-gray-200 mb-8" />

      {items.length === 0 ? (
        <p className="text-[14px] text-gray-500">Bạn chưa viết đánh giá nào.</p>
      ) : (
        <div className="space-y-6">
          {items.map((reviewItem) => (
            <Review key={reviewItem.reviewId} review={reviewItem} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}