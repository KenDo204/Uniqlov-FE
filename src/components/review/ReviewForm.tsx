import React, { useState } from 'react';
import { Star, Upload, X } from '@/components/ui/icons';
import { toast } from 'react-toastify';
import { reviewService } from '@/services/reviewService';
import { uploadService } from '@/services/uploadService';
import { useUpload } from '@/hooks/useUpload';
import { createReviewSchema } from '@/schemas';

interface ReviewFormProps {
  productId: number;
  orderId?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function ReviewForm({ productId, orderId, onSuccess, onClose }: ReviewFormProps) {
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { isUploading, uploadFile } = useUpload(uploadService.uploadReviewImage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(file => file.size <= 1024 * 1024 && file.type.startsWith('image/'));
      
      if (validFiles.length < filesArray.length) {
        toast.error('Một số ảnh không hợp lệ hoặc vượt quá 1MB.');
      }
      
      setNewImages((prev) => [...prev, ...validFiles].slice(0, 5)); // max 5 images
    }
  };

  const removeImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      productId,
      orderId: orderId || null,
      rating: newRating,
      comment: newComment,
      imageUrls: [],
    };

    const validationResult = createReviewSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error(validationResult.error.issues[0].message);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of newImages) {
        const url = await uploadFile(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      await reviewService.createReview({
        ...payload,
        comment: newComment.trim(),
        imageUrls: uploadedUrls,
      });

      toast.success('Đã gửi đánh giá của bạn. Đang chờ duyệt!');
      onSuccess();
    } catch (err: any) {
      toast.error(err || 'Gửi đánh giá thất bại.');
    } finally {
      setIsSubmittingReview(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-[500px] shadow-xl animate-fade-in text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-bold m-0 text-black">Viết đánh giá sản phẩm</h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[20px] font-light cursor-pointer text-gray-400 hover:text-black"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {/* Chọn số sao */}
          <div>
            <label className="block text-[13px] font-semibold mb-2 text-gray-700">Đánh giá sao *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="bg-transparent border-none cursor-pointer p-0 hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={star <= newRating ? "fill-[var(--color-theme)] text-[var(--color-theme)]" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Nhận xét */}
          <div>
            <label className="block text-[13px] font-semibold mb-1 text-gray-700 font-sans">Nhận xét của bạn *</label>
            <textarea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full border border-gray-300 rounded p-2 text-[14px] focus:outline-none focus:border-[var(--color-theme)] font-sans"
              required
            />
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block text-[13px] font-semibold mb-1 text-gray-700">Hình ảnh đính kèm (tối đa 5 ảnh)</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {newImages.map((file, index) => (
                <div key={index} className="relative w-20 h-20 rounded border border-gray-200 overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full border-none cursor-pointer hover:bg-black"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newImages.length < 5 && (
                <label className="w-20 h-20 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:text-[var(--color-theme)] hover:border-[var(--color-theme)] cursor-pointer transition-colors bg-gray-50">
                  <Upload size={20} />
                  <span className="text-[10px] mt-1 font-medium">Tải ảnh</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-full text-[13px] font-bold bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview || isUploading}
              className="px-6 py-2 rounded-full text-[13px] font-bold bg-theme hover:bg-theme-hover text-white cursor-pointer border-none disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {(isSubmittingReview || isUploading) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {(isSubmittingReview || isUploading) ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
