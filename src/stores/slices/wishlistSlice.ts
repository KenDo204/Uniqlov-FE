import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '@/services/wishlistService';
import type { PageResponse } from '@/types/common/apiResponse';
import type { WishlistResponse } from '@/types/wishlist/responses';

interface WishlistState {
  wishlist: PageResponse<WishlistResponse> | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchMyWishlistThunk = createAsyncThunk(
  'wishlist/fetchMyWishlist',
  async (params: { page?: number; size?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getMyWishlist(params?.page, params?.size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách yêu thích');
    }
  }
);

export const toggleWishlistThunk = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await wishlistService.toggle(productId);
      return { productId, inWishlist: response.result?.inWishlist };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Thao tác yêu thích thất bại');
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: number, { rejectWithValue }) => {
    try {
      await wishlistService.remove(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Xóa khỏi danh sách yêu thích thất bại');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlistData: (state) => {
      state.wishlist = null;
    },
  },
  extraReducers: (builder) => {
    // --- Lấy danh sách yêu thích ---
    builder
      .addCase(fetchMyWishlistThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchMyWishlistThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) state.wishlist = action.payload;
      })
      .addCase(fetchMyWishlistThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // --- Bật/Tắt yêu thích ---
    builder
      .addCase(toggleWishlistThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(toggleWishlistThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.wishlist && action.payload && action.payload.inWishlist === false) {
          state.wishlist.content = state.wishlist.content.filter(
            (item) => item.productId !== action.payload.productId
          );
          state.wishlist.totalElements = Math.max(0, state.wishlist.totalElements - 1);
        }
      })
      .addCase(toggleWishlistThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // --- Xóa khỏi danh sách yêu thích ---
    builder
      .addCase(removeFromWishlistThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (state.wishlist && action.payload) {
          state.wishlist.content = state.wishlist.content.filter(
            (item) => item.productId !== action.payload
          );
          state.wishlist.totalElements = Math.max(0, state.wishlist.totalElements - 1);
        }
      })
      .addCase(removeFromWishlistThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistError, clearWishlistData } = wishlistSlice.actions;
export default wishlistSlice.reducer;
