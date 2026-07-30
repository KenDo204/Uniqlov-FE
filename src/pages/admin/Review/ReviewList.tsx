import { useState } from 'react';
import { useAllReviews, useUpdateReviewStatus } from '@/hooks/useReview';
import { ReviewStatus } from '@/types/enums/reviewStatus';
import type { ReviewResponse } from '@/types/review/responses';
import { Star, Search, CheckCircle2, X, ChevronLeft, ChevronRight, Eye } from '@/components/ui/icons';
import { toast } from 'react-toastify';
import { formatDate } from '@/utils/formatters';
import { ReviewDetailModal } from './ReviewDetailModal';

export default function ReviewList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);
  const [selectedDetailReview, setSelectedDetailReview] = useState<ReviewResponse | null>(null);

  const { data: reviewPage, isLoading, isError, refetch } = useAllReviews({
    page,
    size,
    sort: 'createdAt,desc',
    keyword: activeSearch,
  });

  const updateStatusMutation = useUpdateReviewStatus();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setActiveSearch(searchTerm);
  };

  const handleUpdateStatus = async (reviewId: number, newStatus: ReviewStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: reviewId,
        data: { status: newStatus },
      });
      toast.success(`Cập nhật trạng thái đánh giá #${reviewId} thành công!`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái đánh giá.');
    }
  };

  const reviews = reviewPage?.content || [];
  const totalPages = reviewPage?.totalPages || 0;
  const totalElements = reviewPage?.totalElements || 0;

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Quản lý Đánh giá sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1 m-0">
            Xem, duyệt và quản lý các đánh giá sản phẩm từ người dùng
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Tìm kiếm theo sản phẩm, nội dung hoặc tên người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme focus:border-transparent"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="inline-block w-8 h-8 border-4 border-theme border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm">Đang tải danh sách đánh giá...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-red-500">
            <p className="text-sm">Có lỗi xảy ra khi tải danh sách đánh giá.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 px-4 py-1.5 text-xs bg-theme text-white rounded-lg cursor-pointer hover:bg-theme/90"
            >
              Thử lại
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <p className="text-base font-medium">Không tìm thấy đánh giá nào.</p>
            <p className="text-xs text-gray-400 mt-1">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <>
            {/* MOBILE CARD VIEW (< 768px) */}
            <div className="block md:hidden space-y-4 p-4">
              {reviews.map((review, index) => {
                const stt = page * size + index + 1;
                return (
                  <div key={review.reviewId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                    {/* Card Header: User & Status */}
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-theme/10 text-theme font-bold text-xs flex items-center justify-center shrink-0">
                          {(review.userFullName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-gray-900 leading-tight">
                            {review.userFullName || `User #${review.userId}`}
                          </div>
                          <div className="text-[11px] text-gray-400">STT: {stt} • User ID: {review.userId}</div>
                        </div>
                      </div>
                      <div>
                        {review.reviewStatus === ReviewStatus.APPROVED && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã duyệt
                          </span>
                        )}
                        {review.reviewStatus === ReviewStatus.PENDING && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Chờ duyệt
                          </span>
                        )}
                        {review.reviewStatus === ReviewStatus.HIDDEN && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <X className="w-3 h-3" />
                            Đã ẩn
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Name & Rating */}
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium mb-0.5">Sản phẩm:</div>
                      <div className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{review.productName}</div>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{review.rating}/5</span>
                      </div>
                    </div>

                    {/* Comment & Attachments */}
                    <div className="bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-800 m-0 leading-relaxed">{review.comment || '(Không có nội dung)'}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img) => (
                            <img
                              key={img.reviewImageId}
                              src={img.imageUrl}
                              alt="Review attachment"
                              className="w-10 h-10 rounded object-cover cursor-pointer hover:opacity-80 border border-gray-200"
                              onClick={() => setSelectedReviewImage(img.imageUrl)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Date & Action Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">{formatDate(review.createdAt)}</span>

                      <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedDetailReview(review)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer border border-gray-200 active:scale-95"
                        title="Xem chi tiết đánh giá"
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                        Chi tiết
                      </button>
                      {review.reviewStatus !== ReviewStatus.APPROVED && (
                          <button
                            onClick={() => handleUpdateStatus(review.reviewId, ReviewStatus.APPROVED)}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer border border-green-200 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Duyệt
                          </button>
                        )}
                        {review.reviewStatus !== ReviewStatus.HIDDEN && (
                          <button
                            onClick={() => handleUpdateStatus(review.reviewId, ReviewStatus.HIDDEN)}
                            disabled={updateStatusMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer border border-red-200 active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                            Ẩn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 border-collapse">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 w-16">STT</th>
                    <th className="py-3 px-4">Người đánh giá</th>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4 w-28">Đánh giá</th>
                    <th className="py-3 px-4">Nội dung</th>
                    <th className="py-3 px-4 w-32">Trạng thái</th>
                    <th className="py-3 px-4 w-32">Ngày tạo</th>
                    <th className="py-3 px-4 w-32 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review, index) => {
                    const stt = page * size + index + 1;
                    return (
                      <tr key={review.reviewId} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-gray-900">
                          {stt}
                        </td>

                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        <div>{review.userFullName || `User #${review.userId}`}</div>
                        <div className="text-xs text-gray-400 font-normal">ID: {review.userId}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-gray-900 max-w-xs truncate" title={review.productName}>
                        {review.productName}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{review.rating}/5</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-xs text-gray-800 m-0 line-clamp-2">{review.comment || '(Không có nội dung)'}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-1.5 mt-2">
                            {review.images.map((img) => (
                              <img
                                key={img.reviewImageId}
                                src={img.imageUrl}
                                alt="Review attachment"
                                className="w-8 h-8 rounded object-cover cursor-pointer hover:opacity-80 border border-gray-200"
                                onClick={() => setSelectedReviewImage(img.imageUrl)}
                              />
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {review.reviewStatus === ReviewStatus.APPROVED && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đã duyệt
                          </span>
                        )}
                        {review.reviewStatus === ReviewStatus.PENDING && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Chờ duyệt
                          </span>
                        )}
                        {review.reviewStatus === ReviewStatus.HIDDEN && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <X className="w-3.5 h-3.5" />
                            Đã ẩn
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(review.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDetailReview(review)}
                            className="p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-blue-200"
                            title="Xem chi tiết đánh giá"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {review.reviewStatus !== ReviewStatus.APPROVED && (
                            <button
                              onClick={() => handleUpdateStatus(review.reviewId, ReviewStatus.APPROVED)}
                              disabled={updateStatusMutation.isPending}
                              className="p-1.5 text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer border border-green-200"
                              title="Duyệt đánh giá"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          {review.reviewStatus !== ReviewStatus.HIDDEN && (
                            <button
                              onClick={() => handleUpdateStatus(review.reviewId, ReviewStatus.HIDDEN)}
                              disabled={updateStatusMutation.isPending}
                              className="p-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-red-200"
                              title="Ẩn đánh giá"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 text-xs">
            <span className="text-gray-500">
              Hiển thị trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong> (Tổng <strong>{totalElements}</strong> đánh giá)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 border border-gray-300 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={Boolean(selectedDetailReview)}
        review={selectedDetailReview}
        onClose={() => setSelectedDetailReview(null)}
        onSelectImage={(img) => setSelectedReviewImage(img)}
      />

      {/* Preview Modal image */}
      {selectedReviewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white p-2 rounded-xl overflow-hidden shadow-2xl">
            <img src={selectedReviewImage} alt="Review attachment large" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-1.5 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
