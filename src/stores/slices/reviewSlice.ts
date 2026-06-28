import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService } from '@/services/reviewService';
import type { PageResponse } from '@/types/common/apiResponse';
import type { CreateReviewRequest, UpdateReviewStatusRequest } from '@/types/review/requests';
import type { ReviewResponse, ReviewSummaryResponse } from '@/types/review/responses';

interface ReviewState {
  myReviews: PageResponse<ReviewResponse> | null;
  productReviews: PageResponse<ReviewResponse> | null;
  productSummary: ReviewSummaryResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  myReviews: null,
  productReviews: null,
  productSummary: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const createReviewThunk = createAsyncThunk(
  'review/createReview',
  async (payload: CreateReviewRequest, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Gửi đánh giá thất bại');
    }
  }
);

export const fetchMyReviewsThunk = createAsyncThunk(
  'review/fetchMyReviews',
  async (params: { page?: number; size?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await reviewService.getMyReviews(params?.page, params?.size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách đánh giá');
    }
  }
);

export const deleteReviewThunk = createAsyncThunk(
  'review/deleteReview',
  async (id: number, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa đánh giá thất bại');
    }
  }
);

export const fetchProductReviewsThunk = createAsyncThunk(
  'review/fetchProductReviews',
  async ({ productId, page, size }: { productId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await reviewService.getProductReviews(productId, page, size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải đánh giá sản phẩm');
    }
  }
);

export const fetchProductReviewSummaryThunk = createAsyncThunk(
  'review/fetchProductReviewSummary',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.getProductReviewSummary(productId);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải tóm tắt đánh giá');
    }
  }
);

export const updateReviewStatusThunk = createAsyncThunk(
  'review/updateReviewStatus',
  async ({ id, data }: { id: number; data: UpdateReviewStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReviewStatus(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cập nhật trạng thái đánh giá thất bại');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearProductReviews: (state) => {
      state.productReviews = null;
      state.productSummary = null;
    },
  },
  extraReducers: (builder) => {
    // --- Tạo mới đánh giá ---
    builder
      .addCase(createReviewThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createReviewThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createReviewThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Lấy danh sách đánh giá cá nhân ---
    builder
      .addCase(fetchMyReviewsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchMyReviewsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.myReviews = action.payload;
      })
      .addCase(fetchMyReviewsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Xóa đánh giá ---
    builder
      .addCase(deleteReviewThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.myReviews && action.payload) {
          state.myReviews.content = state.myReviews.content.filter(
            (r) => r.reviewId !== action.payload
          );
          state.myReviews.totalElements = Math.max(0, state.myReviews.totalElements - 1);
        }
        if (state.productReviews && action.payload) {
          state.productReviews.content = state.productReviews.content.filter(
            (r) => r.reviewId !== action.payload
          );
          state.productReviews.totalElements = Math.max(0, state.productReviews.totalElements - 1);
        }
      })
      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Lấy đánh giá của sản phẩm ---
    builder
      .addCase(fetchProductReviewsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchProductReviewsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.productReviews = action.payload;
      })
      .addCase(fetchProductReviewsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Lấy tóm tắt đánh giá của sản phẩm ---
    builder
      .addCase(fetchProductReviewSummaryThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchProductReviewSummaryThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.productSummary = action.payload;
      })
      .addCase(fetchProductReviewSummaryThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Cập nhật trạng thái đánh giá (Admin) ---
    builder
      .addCase(updateReviewStatusThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateReviewStatusThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.productReviews && action.payload) {
          const idx = state.productReviews.content.findIndex(
            (r) => r.reviewId === action.payload?.reviewId
          );
          if (idx !== -1) {
            state.productReviews.content[idx] = action.payload;
          }
        }
      })
      .addCase(updateReviewStatusThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviewError, clearProductReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
