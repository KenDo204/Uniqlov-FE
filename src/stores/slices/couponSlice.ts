import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponService } from '@/services/couponService';
import type { CouponResponse, CouponApplyResponse } from '@/types/coupon/responses';
import type { CouponCreateRequest, CouponUpdateRequest, CouponApplyRequest } from '@/types/coupon/requests';
import type { PageResponse } from '@/types/common/apiResponse';

interface CouponState {
  couponsList: PageResponse<CouponResponse> | null;
  currentCoupon: CouponResponse | null;
  previewResult: CouponApplyResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CouponState = {
  couponsList: null,
  currentCoupon: null,
  previewResult: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchAllCouponsThunk = createAsyncThunk(
  'coupon/fetchAll',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await couponService.getAllCoupons(page, size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách mã giảm giá');
    }
  }
);

export const fetchCouponByIdThunk = createAsyncThunk(
  'coupon/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await couponService.getCoupon(id);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy thông tin chi tiết coupon');
    }
  }
);

export const createCouponThunk = createAsyncThunk(
  'coupon/create',
  async (payload: CouponCreateRequest, { rejectWithValue }) => {
    try {
      const response = await couponService.createCoupon(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo mã giảm giá');
    }
  }
);

export const updateCouponThunk = createAsyncThunk(
  'coupon/update',
  async ({ id, data }: { id: number; data: CouponUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await couponService.updateCoupon(id, data);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
    }
  }
);

export const deactivateCouponThunk = createAsyncThunk(
  'coupon/deactivate',
  async (id: number, { rejectWithValue }) => {
    try {
      await couponService.deactivateCoupon(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể vô hiệu hóa mã giảm giá');
    }
  }
);

export const previewApplyCouponThunk = createAsyncThunk(
  'coupon/previewApply',
  async (payload: CouponApplyRequest, { rejectWithValue }) => {
    try {
      const response = await couponService.previewApply(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Mã giảm giá không áp dụng được cho đơn hàng này');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearCouponError: (state) => {
      state.error = null;
    },
    clearPreviewResult: (state) => {
      state.previewResult = null;
    }
  },
  extraReducers: (builder) => {
    // fetchAllCouponsThunk
    builder
      .addCase(fetchAllCouponsThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllCouponsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.couponsList = action.payload || null;
      })
      .addCase(fetchAllCouponsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // fetchCouponByIdThunk
    builder
      .addCase(fetchCouponByIdThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchCouponByIdThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentCoupon = action.payload || null;
      })
      .addCase(fetchCouponByIdThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // createCouponThunk
    builder
      .addCase(createCouponThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createCouponThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createCouponThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // updateCouponThunk
    builder
      .addCase(updateCouponThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateCouponThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(updateCouponThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // deactivateCouponThunk
    builder
      .addCase(deactivateCouponThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deactivateCouponThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const deactivatedId = action.payload;
        if (state.couponsList) {
          state.couponsList.content = state.couponsList.content.map(c => 
            c.couponId === deactivatedId ? { ...c, isActive: false } : c
          );
        }
      })
      .addCase(deactivateCouponThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // previewApplyCouponThunk
    builder
      .addCase(previewApplyCouponThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(previewApplyCouponThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.previewResult = action.payload || null;
      })
      .addCase(previewApplyCouponThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCouponError, clearPreviewResult } = couponSlice.actions;
export default couponSlice.reducer;
