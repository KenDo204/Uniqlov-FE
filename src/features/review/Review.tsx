import React from 'react';
import type { ReviewResponse } from '@/features/review/types/response';
import { ReviewStatus } from '@/types/enums/reviewStatus';
import { Star } from '@/components/ui/icons';

export interface ReviewProps {
  review: ReviewResponse;
  onDelete?: (reviewId: number) => void;
  onSelectImage?: (imageUrl: string) => void;
}

export const Review: React.FC<ReviewProps> = ({ review, onDelete, onSelectImage }) => {
  const {
    reviewId,
    orderId,
    userFullName,
    productName,
    rating,
    comment,
    reviewStatus,
    images,
    variantImage,
    variantAttributes,
    createdAt,
  } = review;

  const displayName = userFullName && userFullName.trim().length > 0 ? userFullName : 'Anonymous User';
  const displayProductName = productName && productName.trim().length > 0 ? productName : 'N/A';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : 'N/A';

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

  const attributeEntries = variantAttributes ? Object.entries(variantAttributes) : [];
  const hasVariantAttributes = attributeEntries.length > 0;

  return (
    <div className="border border-gray-200 p-6 rounded-xl flex flex-col sm:flex-row gap-6 bg-white shadow-xs text-left">
      {/* Product & Variant Section */}
      <div className="flex gap-4 sm:w-1/3 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 pb-4 sm:pb-0 sm:pr-6">
        <div className="w-[70px] h-[90px] bg-gray-100 shrink-0 overflow-hidden rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          {variantImage ? (
            <img
              src={variantImage}
              alt={displayProductName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>N/A</span>
          )}
        </div>

        <div className="text-[13px] flex-1 min-w-0">
          <p className="font-semibold text-gray-900 m-0 mb-1 line-clamp-2" title={displayProductName}>
            {displayProductName}
          </p>

          {/* Dynamic Variant Attributes */}
          {hasVariantAttributes && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 space-y-0.5 mt-2">
              {attributeEntries.map(([key, value]) => (
                <div key={key} className="capitalize">
                  <span className="font-medium text-gray-700">{key}:</span> {value || 'N/A'}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2.5">{getStatusBadge(reviewStatus)}</div>
        </div>
      </div>

      {/* Review Content Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-[12px] text-gray-400">{formattedDate}</span>
          </div>

          <p className="text-[14px] text-gray-800 leading-relaxed m-0 whitespace-pre-wrap">
            {comment || '(Không có nội dung)'}
          </p>

          {/* Attached Image Gallery */}
          {images && images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((img) => (
                <div
                  key={img.reviewImageId}
                  className="w-14 h-14 border border-gray-200 rounded-lg overflow-hidden block cursor-pointer group"
                  onClick={() => onSelectImage?.(img.imageUrl)}
                >
                  <img
                    src={img.imageUrl}
                    alt="Review attachment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {onDelete && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => onDelete(reviewId)}
              className="text-[12px] font-medium text-red-600 bg-transparent border-none p-0 cursor-pointer hover:underline"
            >
              Xóa đánh giá
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
