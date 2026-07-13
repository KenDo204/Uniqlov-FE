import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationService } from '@/services/recommendationService';
import type { ProductResponse } from '@/types/product';


interface RecommendationState {
  recommendedForYou: ProductResponse[];
  similarProducts: ProductResponse[];
  boughtTogether: ProductResponse[];
  isFetching: boolean;
  error: string | null;
}

const initialState: RecommendationState = {
  recommendedForYou: [],
  similarProducts: [],
  boughtTogether: [],
  isFetching: false,
  error: null,
};

export const fetchRecommendedForYouThunk = createAsyncThunk(
  'recommendation/forYou',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getRecommendedForYou(limit);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải gợi ý');
    }
  }
);

export const fetchSimilarProductsThunk = createAsyncThunk(
  'recommendation/similar',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getSimilarProducts(productId);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sản phẩm tương tự');
    }
  }
);

export const fetchBoughtTogetherThunk = createAsyncThunk(
  'recommendation/boughtTogether',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await recommendationService.getBoughtTogether(productId);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sản phẩm thường mua cùng');
    }
  }
);

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Helper function
    const extractArray = (payload: any): ProductResponse[] => {
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.content)) return payload.content;
      return [];
    };

    builder
      .addCase(fetchRecommendedForYouThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchRecommendedForYouThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.recommendedForYou = extractArray(action.payload);
      })
      .addCase(fetchRecommendedForYouThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchSimilarProductsThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchSimilarProductsThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.similarProducts = extractArray(action.payload);
      })
      .addCase(fetchSimilarProductsThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchBoughtTogetherThunk.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchBoughtTogetherThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.boughtTogether = extractArray(action.payload);
      })
      .addCase(fetchBoughtTogetherThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });
  }
});

export const recommendationReducer = recommendationSlice.reducer;
