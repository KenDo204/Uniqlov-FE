import React from 'react';
import type { ReviewResponse } from '@/types/review/responses';
import { ReviewStatus } from '@/types/enums/reviewStatus';
import { Star, X, CheckCircle2, User, ShoppingBag, Checkroom, Clock } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatters';

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewResponse | null;
  onSelectImage?: (imageUrl: string) => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  isOpen,
  onClose,
  review,
  onSelectImage,
}) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 className="text-lg font-bold text-gray-900 m-0">
              Chi tiết đánh giá #{review.reviewId}
            </h3>
            <p className="text-xs text-gray-500 m-0 mt-0.5">
              Đăng ngày {formatDate(review.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-gray-100">

          {/* Section 1: Người đánh giá & Đơn hàng */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 m-0">
              <User className="w-4 h-4 text-theme" /> Thông tin người dùng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block">Họ và tên:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {review.userFullName || `Tài khoản #${review.userId}`}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Mã người dùng (User ID):</span>
                <span className="text-sm font-mono font-medium text-gray-700">#{review.userId}</span>
              </div>
              {review.orderId && (
                <div>
                  <span className="text-xs text-gray-500 block">Mã đơn hàng mua (Order ID):</span>
                  <span className="text-sm font-mono font-medium text-theme">#{review.orderId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Sản phẩm được đánh giá */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 m-0">
              <Checkroom className="w-4 h-4 text-theme" /> Thông tin sản phẩm
            </h4>
            <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-gray-500 block">Tên sản phẩm:</span>
                  <span className="text-sm font-bold text-gray-900 leading-snug">{review.productName}</span>
                </div>
                <span className="text-xs font-mono bg-gray-200/60 px-2 py-0.5 rounded text-gray-700">
                  Product ID: #{review.productId}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Nội dung đánh giá & Rating */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 m-0">
              <ShoppingBag className="w-4 h-4 text-theme" /> Nội dung đánh giá
            </h4>

            {/* Rating Stars */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                {review.rating} / 5 Sao
              </span>
            </div>

            {/* Comment Text */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap m-0">
                {review.comment || '(Người dùng không để lại bình luận chữ)'}
              </p>
            </div>

            {/* Attached Images */}
            {review.images && review.images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-gray-500 block font-medium">
                  Hình ảnh đính kèm ({review.images.length}):
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {review.images.map((img) => (
                    <img
                      key={img.reviewImageId}
                      src={img.imageUrl}
                      alt="Review attachment"
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity border-2 border-gray-200 hover:border-theme shadow-xs"
                      onClick={() => onSelectImage?.(img.imageUrl)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Trạng thái hệ thống & Thời gian */}
          <div className="pt-5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 m-0">
              <Clock className="w-4 h-4 text-theme" /> Thông tin hệ thống
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Trạng thái hiện tại:</span>
                {review.reviewStatus === ReviewStatus.APPROVED && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã duyệt (APPROVED)
                  </span>
                )}
                {review.reviewStatus === ReviewStatus.PENDING && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Chờ duyệt (PENDING)
                  </span>
                )}
                {review.reviewStatus === ReviewStatus.HIDDEN && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 border border-gray-300">
                    <X className="w-3.5 h-3.5" />
                    Đã ẩn (HIDDEN)
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Thời gian tạo:</span>
                <span className="text-xs font-mono text-gray-700">{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
